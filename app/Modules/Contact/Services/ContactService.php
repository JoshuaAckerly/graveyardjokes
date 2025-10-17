<?php

namespace App\Modules\Contact\Services;

use App\Contracts\ContactServiceInterface;
use App\Models\Contact;
use App\Modules\Contact\Mail\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactService implements ContactServiceInterface
{
    /**
     * Store the contact and return its array representation.
     *
     * @param Request $request
     * @return array<string,mixed>
     */
    public function store(Request $request): array
    {
        /** @var array<string,mixed> $validatedData */
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|max:255',
            'message'    => 'required|string|max:5000',
        ]);

        $contact = Contact::create($validatedData);

        try {
            Mail::to('admin@graveyardjokes.com')->send(
                new ContactMessage(
                    (string) ($validatedData['first_name'] ?? ''),
                    (string) ($validatedData['last_name'] ?? ''),
                    (string) ($validatedData['email'] ?? ''),
                    (string) ($validatedData['message'] ?? '')
                )
            );
        } catch (\Exception $e) {
            Log::error('Contact email failed: ' . $e->getMessage());
        }

        return $contact->toArray();
    }
}
