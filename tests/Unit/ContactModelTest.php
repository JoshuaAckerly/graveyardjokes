<?php

namespace Tests\Unit;

use App\Models\Contact;
use PHPUnit\Framework\TestCase;

class ContactModelTest extends TestCase
{
    public function test_fillable_attributes()
    {
        $contact = new Contact();
        $expected = ['first_name', 'last_name', 'email', 'message'];
        
        $this->assertEquals($expected, $contact->getFillable());
    }

    public function test_can_create_contact_with_fillable_data()
    {
        $data = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'message' => 'Test message'
        ];

        $contact = new Contact($data);

        $this->assertEquals('John', $contact->first_name);
        $this->assertEquals('Doe', $contact->last_name);
        $this->assertEquals('john@example.com', $contact->email);
        $this->assertEquals('Test message', $contact->message);
    }
}