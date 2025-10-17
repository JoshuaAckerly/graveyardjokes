<?php

namespace App\Modules\Contact\Controllers;

use Illuminate\Http\Request;
use App\Contracts\ContactServiceInterface;
use Illuminate\Routing\Controller as BaseController;

class ContactController extends BaseController
{
    public function store(Request $request, ContactServiceInterface $contactService)
    {
        $contact = $contactService->store($request);

        return back()->with('success', 'Thank you! Your message has been sent.');
    }
}
