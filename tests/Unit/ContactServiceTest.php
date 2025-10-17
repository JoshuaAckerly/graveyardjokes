<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Mail\ContactMessage;

class ContactServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_contact_and_sends_email()
    {
        Mail::fake();

        $service = $this->app->make(\App\Contracts\ContactServiceInterface::class);

        $data = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'message' => 'Hello there',
        ];

        $request = Request::create('/contact', 'POST', $data);

        $result = $service->store($request);

        $this->assertDatabaseHas('contacts', [
            'email' => 'john@example.com',
            'first_name' => 'John',
        ]);

        Mail::assertSent(ContactMessage::class);

        $this->assertEquals('john@example.com', $result['email']);
    }
}
