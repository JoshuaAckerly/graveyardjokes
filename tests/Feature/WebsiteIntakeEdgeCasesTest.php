<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class WebsiteIntakeEdgeCasesTest extends TestCase
{
    use RefreshDatabase;

    /** Base payload with all required fields passing validation */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'selected_package' => 'starter',
            'full_name' => 'Test User',
            'email' => 'test@example.com',
            'project_summary' => 'Need a basic site.',
            'top_goals' => ['lead_generation'],
            'target_audience' => 'Small business owners.',
            'primary_call_to_action' => 'Get a quote',
            'required_pages' => ['home', 'contact'],
            'has_logo' => true,
            'content_status' => 'ready',
            'asset_status' => 'ready',
            'needs_copywriting' => false,
            'domain_status' => 'owned',
            'hosting_status' => 'owned',
            'needs_email_setup' => false,
            'needs_seo' => false,
            'hard_deadline' => false,
            'phased_rollout_ok' => true,
            'approval_commitment' => true,
            'assets_commitment' => true,
            'feedback_commitment' => true,
            'scope_acknowledged' => true,
            'timeline_acknowledged' => true,
            'accuracy_confirmed' => true,
        ], $overrides);
    }

    #[Test]
    public function invalid_package_value_is_rejected(): void
    {
        $response = $this->post('/services/intake', $this->validPayload([
            'selected_package' => 'deluxe_ultra_package',
        ]));

        $response->assertSessionHasErrors('selected_package');
    }

    #[Test]
    public function invalid_top_goal_value_is_rejected(): void
    {
        $response = $this->post('/services/intake', $this->validPayload([
            'top_goals' => ['world_domination'],
        ]));

        $response->assertSessionHasErrors('top_goals.0');
    }

    #[Test]
    public function invalid_content_status_is_rejected(): void
    {
        $response = $this->post('/services/intake', $this->validPayload([
            'content_status' => 'maybe_later',
        ]));

        $response->assertSessionHasErrors('content_status');
    }

    #[Test]
    public function all_valid_packages_are_accepted(): void
    {
        $validPackages = [
            'starter', 'professional', 'premium',
            'design-starter', 'design-professional', 'design-premium',
            'modernization-starter', 'modernization-professional', 'modernization-premium',
        ];

        foreach ($validPackages as $package) {
            $response = $this->post('/services/intake', $this->validPayload([
                'selected_package' => $package,
            ]));

            $response->assertRedirect('/services/'.$package);
        }
    }
}
