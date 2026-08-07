<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteIntakeSubmission extends Model
{
    protected $fillable = [
        'reference',
        'selected_package',
        'selected_packages',
        'full_name',
        'business_name',
        'email',
        'phone',
        'preferred_contact_method',
        'project_summary',
        'top_goals',
        'target_audience',
        'primary_call_to_action',
        'required_pages',
        'must_have_features',
        'design_references',
        'brand_personality',
        'has_logo',
        'content_status',
        'asset_status',
        'needs_copywriting',
        'legal_pages_needed',
        'domain_status',
        'hosting_status',
        'needs_email_setup',
        'integrations',
        'needs_seo',
        'launch_date',
        'hard_deadline',
        'phased_rollout_ok',
        'approval_commitment',
        'assets_commitment',
        'feedback_commitment',
        'scope_acknowledged',
        'timeline_acknowledged',
        'accuracy_confirmed',
        'additional_notes',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'selected_packages' => 'array',
        'top_goals' => 'array',
        'required_pages' => 'array',
        'must_have_features' => 'array',
        'brand_personality' => 'array',
        'legal_pages_needed' => 'array',
        'has_logo' => 'boolean',
        'needs_copywriting' => 'boolean',
        'needs_email_setup' => 'boolean',
        'needs_seo' => 'boolean',
        'hard_deadline' => 'boolean',
        'phased_rollout_ok' => 'boolean',
        'approval_commitment' => 'boolean',
        'assets_commitment' => 'boolean',
        'feedback_commitment' => 'boolean',
        'scope_acknowledged' => 'boolean',
        'timeline_acknowledged' => 'boolean',
        'accuracy_confirmed' => 'boolean',
        'launch_date' => 'date',
    ];
}
