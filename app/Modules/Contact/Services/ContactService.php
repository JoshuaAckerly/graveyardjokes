<?php

namespace App\Modules\Contact\Services;

use App\Contracts\ContactServiceInterface;
use App\Models\Contact;
use App\Modules\Contact\Mail\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactService implements ContactServiceInterface
{
    /**
     * Store the contact and return its array representation.
     *
     * @return array<string,mixed>
     */
    public function store(Request $request): array
    {
        /** @var array<string,mixed> $validatedData */
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $contact = Contact::create($validatedData);

        try {
            // Extract validated values into typed local variables so phpstan sees concrete types
            $firstName = (string) ($validatedData['first_name'] ?? '');
            $lastName = (string) ($validatedData['last_name'] ?? '');
            $email = (string) ($validatedData['email'] ?? '');
            $message = (string) ($validatedData['message'] ?? '');

            Log::info('Sending contact email', [
                'to' => 'dev@graveyardjokes.com',
                'from_name' => $firstName.' '.$lastName,
                'from_email' => $email,
            ]);

            Mail::to('dev@graveyardjokes.com')->send(
                new ContactMessage($firstName, $lastName, $email, $message)
            );

            Log::info('Contact email sent successfully');
        } catch (\Exception $e) {
            Log::error('Contact email failed', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }

        return $contact->toArray();
    }
}
