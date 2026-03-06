<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('website_intake_submissions', function (Blueprint $table) {
            $table->id();
            $table->uuid('reference')->unique();
            $table->string('selected_package', 32);
            $table->string('full_name', 120);
            $table->string('business_name', 160)->nullable();
            $table->string('email', 255);
            $table->string('phone', 40)->nullable();
            $table->string('preferred_contact_method', 20)->nullable();
            $table->text('project_summary');
            $table->json('top_goals');
            $table->text('target_audience');
            $table->string('primary_call_to_action', 255);
            $table->json('required_pages');
            $table->json('must_have_features')->nullable();
            $table->text('design_references')->nullable();
            $table->json('brand_personality')->nullable();
            $table->boolean('has_logo')->default(false);
            $table->string('content_status', 32);
            $table->string('asset_status', 32);
            $table->boolean('needs_copywriting')->default(false);
            $table->json('legal_pages_needed')->nullable();
            $table->string('domain_status', 32);
            $table->string('hosting_status', 32);
            $table->boolean('needs_email_setup')->default(false);
            $table->text('integrations')->nullable();
            $table->boolean('needs_seo')->default(false);
            $table->date('launch_date')->nullable();
            $table->string('budget_range', 32);
            $table->boolean('hard_deadline')->default(false);
            $table->boolean('phased_rollout_ok')->default(false);
            $table->boolean('approval_commitment')->default(false);
            $table->boolean('assets_commitment')->default(false);
            $table->boolean('feedback_commitment')->default(false);
            $table->boolean('scope_acknowledged')->default(false);
            $table->boolean('timeline_acknowledged')->default(false);
            $table->boolean('accuracy_confirmed')->default(false);
            $table->text('additional_notes')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 1024)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_intake_submissions');
    }
};
