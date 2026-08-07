<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class WebsiteIntakeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    #[Test]
    public function it_loads_the_intake_page(): void
    {
        $response = $this->get('/services/intake?package=starter');

        $response->assertStatus(200);
    }

    #[Test]
    public function it_requires_core_fields_for_submission(): void
    {
        $response = $this->post('/services/intake', []);

        $response->assertSessionHasErrors([
            'selected_packages',
            'full_name',
            'email',
            'project_summary',
            'top_goals',
            'target_audience',
            'primary_call_to_action',
            'required_pages',
            'content_status',
            'asset_status',
            'domain_status',
            'hosting_status',
            'approval_commitment',
            'assets_commitment',
            'feedback_commitment',
            'scope_acknowledged',
            'timeline_acknowledged',
            'accuracy_confirmed',
        ]);
    }

    #[Test]
    public function it_stores_submission_and_unlocks_checkout_session(): void
    {
        $payload = [
            'selected_packages' => ['professional'],
            'full_name' => 'Jane Client',
            'business_name' => 'Client Co',
            'email' => 'jane@example.com',
            'phone' => '555-111-2222',
            'preferred_contact_method' => 'email',
            'project_summary' => 'We need a conversion-focused website for lead generation.',
            'top_goals' => ['lead_generation', 'build_credibility'],
            'target_audience' => 'Homeowners in Western New York looking for renovation services.',
            'primary_call_to_action' => 'Request a quote',
            'required_pages' => ['home', 'services', 'contact'],
            'must_have_features' => ['contact_form', 'analytics'],
            'design_references' => 'Clean modern layout with strong testimonials section.',
            'brand_personality' => ['modern', 'corporate'],
            'has_logo' => true,
            'content_status' => 'partial',
            'asset_status' => 'partial',
            'needs_copywriting' => true,
            'legal_pages_needed' => ['privacy', 'terms'],
            'domain_status' => 'owned',
            'hosting_status' => 'need_help',
            'needs_email_setup' => true,
            'integrations' => 'Mailchimp and HubSpot form sync',
            'needs_seo' => true,
            'launch_date' => now()->addWeeks(4)->toDateString(),
            'hard_deadline' => false,
            'phased_rollout_ok' => true,
            'approval_commitment' => true,
            'assets_commitment' => true,
            'feedback_commitment' => true,
            'scope_acknowledged' => true,
            'timeline_acknowledged' => true,
            'accuracy_confirmed' => true,
            'additional_notes' => 'Need bilingual support in phase two.',
        ];

        $response = $this->post('/services/intake', $payload);

        $response->assertRedirect('/services');

        $this->assertDatabaseHas('website_intake_submissions', [
            'email' => 'jane@example.com',
            'selected_package' => 'professional',
            'full_name' => 'Jane Client',
        ]);

        $response->assertSessionHas('website_intake.completed', true);
        $response->assertSessionHas('website_intake.selected_packages', ['professional']);
    }
}
