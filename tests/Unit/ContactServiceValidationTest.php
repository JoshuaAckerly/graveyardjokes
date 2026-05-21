<?php

namespace Tests\Unit;

use App\Contracts\ContactServiceInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ContactServiceValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_throws_validation_exception_on_invalid_input(): void
    {
        $this->expectException(ValidationException::class);

        $service = $this->app->make(ContactServiceInterface::class);

        // Missing required fields
        $request = Request::create('/contact', 'POST', []);

        $service->store($request);
    }
}
