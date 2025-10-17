<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

class ContactServiceValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_throws_validation_exception_on_invalid_input()
    {
        $this->expectException(ValidationException::class);

        $service = $this->app->make(\App\Contracts\ContactServiceInterface::class);

        // Missing required fields
        $request = Request::create('/contact', 'POST', []);

        $service->store($request);
    }
}
