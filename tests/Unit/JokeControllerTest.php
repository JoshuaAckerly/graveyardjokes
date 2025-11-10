<?php

namespace Tests\Unit;

use App\Http\Controllers\JokeController;
use Illuminate\Http\Request;
use Tests\TestCase;
use Illuminate\Http\JsonResponse;

class JokeControllerTest extends TestCase
{
    private JokeController $controller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->controller = new JokeController();
    }

    public function test_random_method_exists()
    {
        $this->assertTrue(method_exists($this->controller, 'random'));
    }

    public function test_random_returns_json_response()
    {
        $request = new Request();
        $response = $this->controller->random($request);
        
        $this->assertInstanceOf(JsonResponse::class, $response);
    }
}