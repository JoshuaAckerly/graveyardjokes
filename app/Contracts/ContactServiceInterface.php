<?php

namespace App\Contracts;

use Illuminate\Http\Request;

interface ContactServiceInterface
{
    /**
     * Handle storing a contact message and any side effects (email, logging).
     *
     * @param Request $request
     * @return array Saved contact data
     */
    public function store(Request $request): array;
}
