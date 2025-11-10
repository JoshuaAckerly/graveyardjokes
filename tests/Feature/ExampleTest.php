<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ExampleTest extends TestCase
{
    #[Test]
    public function it_loads_the_homepage(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }
}
