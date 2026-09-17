<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tiktok_videos', function (Blueprint $table) {
            $table->id();
            $table->string('tiktok_video_id')->unique();
            // Folded from add_post_type_to_tiktok_videos_table
            $table->string('post_type')->default('video');
            $table->string('title');
            $table->text('description')->nullable();
            // Folded from change_thumbnail_url_to_text_in_tiktok_videos: use text() up front
            $table->text('thumbnail_url')->nullable();
            $table->date('posted_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tiktok_videos');
    }
};
