<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        $contacts = [
            [
                'first_name' => 'Emily',
                'last_name' => 'Carter',
                'email' => 'emily@example.com',
                'message' => 'Love the dark humor content! Keep up the great work.',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            [
                'first_name' => 'Marcus',
                'last_name' => 'Johnson',
                'email' => 'marcus.j@gmail.com',
                'message' => 'Interested in collaborating on some spooky content for Halloween.',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Mitchell',
                'email' => 'sarah.mitchell@email.com',
                'message' => 'Your latest comedy sketch was hilarious! Any plans for a new series?',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Rodriguez',
                'email' => 'david.rod@company.com',
                'message' => 'Would love to book you for our comedy event. Please contact me.',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'first_name' => 'Jessica',
                'last_name' => 'Wong',
                'email' => 'jessicaw@creative.net',
                'message' => 'Your graveyard jokes are perfect for our upcoming horror comedy project.',
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
            [
                'first_name' => 'Anonymous',
                'last_name' => 'Fan',
                'email' => 'fan@example.com',
                'message' => 'Keep making us laugh with those dark comedy gems!',
                'created_at' => now()->subHours(12),
                'updated_at' => now()->subHours(12),
            ],
        ];

        foreach ($contacts as $contactData) {
            Contact::create($contactData);
        }
    }
}
