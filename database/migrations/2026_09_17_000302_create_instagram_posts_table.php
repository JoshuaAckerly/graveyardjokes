<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instagram_posts', function (Blueprint $table) {
            $table->id();
            $table->string('instagram_id')->unique();
            $table->string('media_type'); // IMAGE, VIDEO, CAROUSEL_ALBUM
            $table->text('media_url')->nullable();
            $table->text('thumbnail_url')->nullable();
            $table->text('caption')->nullable();
            $table->string('permalink')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('posted_at')->nullable();
            $table->timestamps();

            $table->index(['is_active', 'posted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instagram_posts');
    }
};
