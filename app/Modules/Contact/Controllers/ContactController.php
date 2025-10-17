<?php

namespace App\Modules\Contact\Controllers;

use Illuminate\Http\Request;
use App\Contracts\ContactServiceInterface;
use Illuminate\Routing\Controller as BaseController;

class ContactController extends BaseController
{
    public function store(Request $request, ContactServiceInterface $contactService): \Illuminate\Http\RedirectResponse
    {
        $contact = $contactService->store($request);

        // Defensive: if storing failed, redirect back with error
        if (! $contact) {
            return back()->with('error', 'There was a problem submitting your message.');
        }

        return back()->with('success', 'Thank you! Your message has been sent.');
    }
}
