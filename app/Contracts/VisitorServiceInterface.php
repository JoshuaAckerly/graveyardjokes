<?php

namespace App\Contracts;

use Illuminate\Http\Request;

interface VisitorServiceInterface
{
    /**
     * Track a visitor event payload and return stored info.
     *
     * @param Request $request
     * @return array<string,mixed>
     */
    public function track(Request $request): array;
}
