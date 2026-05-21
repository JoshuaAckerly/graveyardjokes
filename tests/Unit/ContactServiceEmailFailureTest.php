<?php

namespace Tests\Unit;

use App\Contracts\ContactServiceInterface;
use App\Modules\Contact\Mail\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactServiceEmailFailureTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_record_created_even_when_email_throws(): void
    {
        // Mail::to()->send() will throw, but the exception is caught inside ContactService
        Mail::shouldReceive('to')
            ->once()
            ->with('dev@graveyardjokes.com')
            ->andThrow(new \Exception('SMTP connection refused'));

        $service = $this->app->make(ContactServiceInterface::class);

        $request = Request::create('/contact', 'POST', [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@example.com',
            'message' => 'Hello from a test',
        ]);

        $result = $service->store($request);

        // Contact must exist in DB despite the mail failure
        $this->assertDatabaseHas('contacts', [
            'email' => 'jane@example.com',
            'first_name' => 'Jane',
        ]);

        $this->assertSame('jane@example.com', $result['email']);
    }

    public function test_message_at_maximum_length_passes_validation(): void
    {
        Mail::fake();

        $service = $this->app->make(ContactServiceInterface::class);

        $request = Request::create('/contact', 'POST', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'message' => str_repeat('a', 5000),
        ]);

        $result = $service->store($request);

        $this->assertDatabaseHas('contacts', ['email' => 'john@example.com']);
        Mail::assertSent(ContactMessage::class);
    }

    public function test_names_at_maximum_length_pass_validation(): void
    {
        Mail::fake();

        $service = $this->app->make(ContactServiceInterface::class);

        $request = Request::create('/contact', 'POST', [
            'first_name' => str_repeat('a', 255),
            'last_name' => str_repeat('b', 255),
            'email' => 'long@example.com',
            'message' => 'Test message',
        ]);

        $result = $service->store($request);

        $this->assertDatabaseHas('contacts', ['email' => 'long@example.com']);
    }
}
