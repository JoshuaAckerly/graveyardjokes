<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The shared auth database may already have this table (created by the
        // former auth-system app). Only create it where it's missing so existing
        // analytics data is preserved.
        if (Schema::hasTable('site_visits')) {
            return;
        }

        Schema::create('site_visits', function (Blueprint $table) {
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
        Schema::dropIfExists('site_visits');
    }
};
