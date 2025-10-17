<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RandomJokeTest extends TestCase
{
    public function test_random_joke_endpoint_returns_json(): void
    {
        $response = $this->getJson('/api/random-joke');

        $response->assertStatus(200);
        $response->assertJsonStructure(['id', 'body', 'author']);
    }
}
