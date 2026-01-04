<?php

namespace App\Contracts;

use Illuminate\Http\Request;

interface ContactServiceInterface
{
    /**
     * Handle storing a contact message and any side effects (email, logging).
     *
     * @return array<string,mixed> Saved contact data
     */
    public function store(Request $request): array;
}
