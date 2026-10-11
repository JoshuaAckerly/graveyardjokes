<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_registration_cannot_claim_the_configured_admin_email(): void
    {
        $email = config('app.admin_email');

        $this->post('/register', [
            'name' => 'Unverified Admin',
            'email' => $email,
            'password' => 'correct-horse-battery-staple',
            'password_confirmation' => 'correct-horse-battery-staple',
        ])->assertSessionHasErrors('email');

        $this->assertFalse(User::where('email', $email)->exists());
    }

    public function test_unverified_admin_email_cannot_access_admin_data(): void
    {
        $user = User::factory()->create([
            'email' => config('app.admin_email'),
            'email_verified_at' => null,
        ]);

        $this->actingAs($user)->get('/studio/admin/subscribers')->assertForbidden();
    }

    public function test_authenticated_non_admin_cannot_access_subscriber_emails(): void
    {
        $user = User::factory()->create(['email' => 'member@example.com']);

        $this->actingAs($user)->get('/studio/admin/subscribers')->assertForbidden();
    }
}
