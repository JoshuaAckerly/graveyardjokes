<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // site_visits lives on the shared auth database (same as the User model /
        // SiteVisit model). The former auth-system app already created it there,
        // so only create it where missing — preserving existing analytics data.
        if (Schema::connection('auth')->hasTable('site_visits')) {
            return;
        }

        Schema::connection('auth')->create('site_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->string('host')->nullable();
            $table->string('ip_address')->nullable()->index();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('country')->nullable();
            $table->string('org')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('path')->nullable();
            $table->text('referer')->nullable();
            $table->boolean('is_bot')->default(false)->index();
            $table->timestamp('created_at')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::connection('auth')->dropIfExists('site_visits');
    }
};
