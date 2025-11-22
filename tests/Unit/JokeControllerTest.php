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

    public function test_random_returns_json_response(): void
    {
        $request = new Request();
        $response = $this->controller->random($request);
        
        $this->assertInstanceOf(JsonResponse::class, $response);
    }
}