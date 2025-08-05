<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\TestCase;

class ExampleTest extends TestCase
{
    /** @test */
    public function it_loads_the_homepage()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }
}
