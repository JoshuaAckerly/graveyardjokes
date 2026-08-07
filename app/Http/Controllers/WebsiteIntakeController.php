<?php

namespace App\Http\Controllers;

use App\Models\WebsiteIntakeSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteIntakeController extends Controller
{
    private const PACKAGE_OPTIONS = [
        'starter' => 'Starter Package - Website Development',
        'professional' => 'Professional Package - Website Development',
        'premium' => 'Premium Package - Website Development',
        'design-starter' => 'Starter Package - Website Design',
        'design-professional' => 'Professional Package - Website Design',
        'design-premium' => 'Premium Package - Website Design',
        'modernization-starter' => 'Starter Package - Website Modernization',
        'modernization-professional' => 'Professional Package - Website Modernization',
        'modernization-premium' => 'Premium Package - Website Modernization',
    ];

    private const GOAL_OPTIONS = [
        'lead_generation' => 'Get leads and inquiries',
        'book_appointments' => 'Book appointments or consultations',
        'sell_products' => 'Sell products or services online',
        'build_credibility' => 'Build credibility and trust',
        'showcase_portfolio' => 'Showcase portfolio or work',
        'grow_audience' => 'Grow an audience/newsletter',
        'other' => 'Other goal',
    ];

    private const PAGE_OPTIONS = [
        'home' => 'Home',
        'about' => 'About',
        'services' => 'Services',
        'pricing' => 'Pricing',
        'portfolio' => 'Portfolio',
        'shop' => 'Shop',
        'booking' => 'Booking',
        'faq' => 'FAQ',
        'contact' => 'Contact',
        'blog' => 'Blog/News',
        'terms' => 'Terms of Service',
        'privacy' => 'Privacy Policy',
        'other' => 'Other',
    ];

    private const FEATURE_OPTIONS = [
        'contact_form' => 'Contact form',
        'booking_calendar' => 'Booking/calendar',
        'checkout' => 'Online checkout',
        'newsletter' => 'Newsletter signup',
        'analytics' => 'Analytics setup',
        'social_feed' => 'Social media feed',
        'chat' => 'Live chat',
        'members_area' => 'Member/client area',
        'multi_language' => 'Multi-language support',
        'custom_integrations' => 'Custom integrations',
    ];

    private const PERSONALITY_OPTIONS = [
        'modern' => 'Modern',
        'minimal' => 'Minimal',
        'bold' => 'Bold',
        'luxury' => 'Luxury',
        'playful' => 'Playful',
        'corporate' => 'Corporate',
        'edgy' => 'Edgy',
    ];

    private const LEGAL_PAGE_OPTIONS = [
        'privacy' => 'Privacy Policy',
        'terms' => 'Terms of Service',
        'cookies' => 'Cookie Policy',
        'refunds' => 'Refund Policy',
    ];

    /**
     * Show the pre-payment intake form.
     */
    public function create(Request $request): Response
    {
        $requestedPackage = strtolower((string) $request->query('package', 'professional'));
        $prefillPackage = array_key_exists($requestedPackage, self::PACKAGE_OPTIONS) ? $requestedPackage : 'professional';

        return Inertia::render('services/intake', [
            'prefillPackage' => $prefillPackage,
            'packageOptions' => $this->formatOptions(self::PACKAGE_OPTIONS),
            'goalOptions' => $this->formatOptions(self::GOAL_OPTIONS),
            'pageOptions' => $this->formatOptions(self::PAGE_OPTIONS),
            'featureOptions' => $this->formatOptions(self::FEATURE_OPTIONS),
            'personalityOptions' => $this->formatOptions(self::PERSONALITY_OPTIONS),
            'legalPageOptions' => $this->formatOptions(self::LEGAL_PAGE_OPTIONS),
        ]);
    }

    /**
     * Store a form submission and unlock checkout in session.
     */
    public function store(Request $request): RedirectResponse
    {
        /** @var array{
         *   selected_package: string,
         *   full_name: string,
         *   business_name: string|null,
         *   email: string,
         *   phone: string|null,
         *   preferred_contact_method: string|null,
         *   project_summary: string,
         *   top_goals: array<int, string>,
         *   target_audience: string,
         *   primary_call_to_action: string,
         *   required_pages: array<int, string>,
         *   must_have_features: array<int, string>|null,
         *   design_references: string|null,
         *   brand_personality: array<int, string>|null,
         *   has_logo: bool,
         *   content_status: string,
         *   asset_status: string,
         *   needs_copywriting: bool,
         *   legal_pages_needed: array<int, string>|null,
         *   domain_status: string,
         *   hosting_status: string,
         *   needs_email_setup: bool,
         *   integrations: string|null,
         *   needs_seo: bool,
         *   launch_date: string|null,
         *   hard_deadline: bool,
         *   phased_rollout_ok: bool,
         *   approval_commitment: mixed,
         *   assets_commitment: mixed,
         *   feedback_commitment: mixed,
         *   scope_acknowledged: mixed,
         *   timeline_acknowledged: mixed,
         *   accuracy_confirmed: mixed,
         *   additional_notes: string|null,
         * } $validated */
        $validated = $request->validate([
            'selected_package' => ['required', 'string', Rule::in(array_keys(self::PACKAGE_OPTIONS))],
            'full_name' => ['required', 'string', 'max:120'],
            'business_name' => ['nullable', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'preferred_contact_method' => ['nullable', 'string', Rule::in(['email', 'phone', 'text'])],
            'project_summary' => ['required', 'string', 'max:5000'],
            'top_goals' => ['required', 'array', 'min:1', 'max:5'],
            'top_goals.*' => ['required', 'string', Rule::in(array_keys(self::GOAL_OPTIONS))],
            'target_audience' => ['required', 'string', 'max:2000'],
            'primary_call_to_action' => ['required', 'string', 'max:255'],
            'required_pages' => ['required', 'array', 'min:1', 'max:12'],
            'required_pages.*' => ['required', 'string', Rule::in(array_keys(self::PAGE_OPTIONS))],
            'must_have_features' => ['nullable', 'array', 'max:10'],
            'must_have_features.*' => ['required', 'string', Rule::in(array_keys(self::FEATURE_OPTIONS))],
            'design_references' => ['nullable', 'string', 'max:5000'],
            'brand_personality' => ['nullable', 'array', 'max:5'],
            'brand_personality.*' => ['required', 'string', Rule::in(array_keys(self::PERSONALITY_OPTIONS))],
            'has_logo' => ['required', 'boolean'],
            'content_status' => ['required', 'string', Rule::in(['ready', 'partial', 'need_help'])],
            'asset_status' => ['required', 'string', Rule::in(['ready', 'partial', 'need_help'])],
            'needs_copywriting' => ['required', 'boolean'],
            'legal_pages_needed' => ['nullable', 'array', 'max:4'],
            'legal_pages_needed.*' => ['required', 'string', Rule::in(array_keys(self::LEGAL_PAGE_OPTIONS))],
            'domain_status' => ['required', 'string', Rule::in(['owned', 'need_help'])],
            'hosting_status' => ['required', 'string', Rule::in(['owned', 'need_help'])],
            'needs_email_setup' => ['required', 'boolean'],
            'integrations' => ['nullable', 'string', 'max:5000'],
            'needs_seo' => ['required', 'boolean'],
            'launch_date' => ['nullable', 'date'],
            'hard_deadline' => ['required', 'boolean'],
            'phased_rollout_ok' => ['required', 'boolean'],
            'approval_commitment' => ['accepted'],
            'assets_commitment' => ['accepted'],
            'feedback_commitment' => ['accepted'],
            'scope_acknowledged' => ['accepted'],
            'timeline_acknowledged' => ['accepted'],
            'accuracy_confirmed' => ['accepted'],
            'additional_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $submission = WebsiteIntakeSubmission::create([
            'reference' => (string) Str::uuid(),
            'selected_package' => (string) $validated['selected_package'],
            'full_name' => (string) $validated['full_name'],
            'business_name' => isset($validated['business_name']) ? (string) $validated['business_name'] : null,
            'email' => (string) $validated['email'],
            'phone' => isset($validated['phone']) ? (string) $validated['phone'] : null,
            'preferred_contact_method' => isset($validated['preferred_contact_method']) ? (string) $validated['preferred_contact_method'] : null,
            'project_summary' => (string) $validated['project_summary'],
            'top_goals' => array_values((array) $validated['top_goals']),
            'target_audience' => (string) $validated['target_audience'],
            'primary_call_to_action' => (string) $validated['primary_call_to_action'],
            'required_pages' => array_values((array) $validated['required_pages']),
            'must_have_features' => isset($validated['must_have_features']) ? array_values((array) $validated['must_have_features']) : null,
            'design_references' => isset($validated['design_references']) ? (string) $validated['design_references'] : null,
            'brand_personality' => isset($validated['brand_personality']) ? array_values((array) $validated['brand_personality']) : null,
            'has_logo' => $request->boolean('has_logo'),
            'content_status' => (string) $validated['content_status'],
            'asset_status' => (string) $validated['asset_status'],
            'needs_copywriting' => $request->boolean('needs_copywriting'),
            'legal_pages_needed' => isset($validated['legal_pages_needed']) ? array_values((array) $validated['legal_pages_needed']) : null,
            'domain_status' => (string) $validated['domain_status'],
            'hosting_status' => (string) $validated['hosting_status'],
            'needs_email_setup' => $request->boolean('needs_email_setup'),
            'integrations' => isset($validated['integrations']) ? (string) $validated['integrations'] : null,
            'needs_seo' => $request->boolean('needs_seo'),
            'launch_date' => $validated['launch_date'] ?? null,
            'hard_deadline' => $request->boolean('hard_deadline'),
            'phased_rollout_ok' => $request->boolean('phased_rollout_ok'),
            'approval_commitment' => $request->boolean('approval_commitment'),
            'assets_commitment' => $request->boolean('assets_commitment'),
            'feedback_commitment' => $request->boolean('feedback_commitment'),
            'scope_acknowledged' => $request->boolean('scope_acknowledged'),
            'timeline_acknowledged' => $request->boolean('timeline_acknowledged'),
            'accuracy_confirmed' => $request->boolean('accuracy_confirmed'),
            'additional_notes' => isset($validated['additional_notes']) ? (string) $validated['additional_notes'] : null,
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 1024, ''),
        ]);

        $request->session()->put('website_intake', [
            'completed' => true,
            'submission_id' => $submission->id,
            'selected_package' => $submission->selected_package,
            'submitted_at' => now()->toIso8601String(),
        ]);

        return redirect('/services/'.$submission->selected_package);
    }

    /**
     * Convert an option map to value/label objects for the frontend.
     *
     * @param  array<string, string>  $options
     * @return array<int, array{value: string, label: string}>
     */
    private function formatOptions(array $options): array
    {
        $formatted = [];

        foreach ($options as $value => $label) {
            $formatted[] = [
                'value' => $value,
                'label' => $label,
            ];
        }

        return $formatted;
    }
}
