<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

use function Psy\debug;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate form input
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|max:255',
            'message'    => 'required|string|max:5000',
        ]);

        // 2. Save to the database
        $contact = Contact::create($validatedData);

        // 3. Send email using Herd Mail (won’t send real emails in local)
        Mail::to('admin@graveyardjokes.com')->send(
            new ContactMessage(
                $request->input('first_name'),
                $request->input('last_name'),
                $request->input('email'),
                $request->input('message')
            )
        );

        // 4. Redirect back with success
        return back()->with('success', 'Thank you! Your message has been sent.');
    }
}
