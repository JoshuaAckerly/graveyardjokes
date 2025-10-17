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
    public function store(Request $request): array
    {
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
                    $validatedData['first_name'],
                    $validatedData['last_name'],
                    $validatedData['email'],
                    $validatedData['message']
                )
            );
        } catch (\Exception $e) {
            Log::error('Contact email failed: ' . $e->getMessage());
        }

        return $contact->toArray();
    }
}
