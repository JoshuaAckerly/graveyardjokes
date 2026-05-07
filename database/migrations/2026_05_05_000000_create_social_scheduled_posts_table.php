<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_scheduled_posts', function (Blueprint $table) {
            $table->id();
            $table->string('platform'); // discord, twitter, facebook, instagram
            $table->text('content');
            $table->string('media_url')->nullable(); // public URL — required for Instagram
            $table->json('extra')->nullable();        // platform-specific extras
            $table->timestamp('scheduled_at');
            $table->timestamp('posted_at')->nullable();
            $table->string('status')->default('pending'); // pending, posted, failed
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index(['status', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_scheduled_posts');
    }
};
