<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Folded from studio migrations:
     *   - create_facebook_gallery_posts_table
     *   - add_description_and_tags_to_facebook_gallery_posts_table
     *   - change_thumbnail_url_to_text_in_facebook_gallery_posts
     */
    public function up(): void
    {
        Schema::create('facebook_gallery_posts', function (Blueprint $table) {
            $table->id();
            $table->string('post_url')->unique();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->json('tags')->nullable();
            // thumbnail_url folded as text (was string, then changed to text)
            $table->text('thumbnail_url')->nullable();
            $table->date('posted_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facebook_gallery_posts');
    }
};
