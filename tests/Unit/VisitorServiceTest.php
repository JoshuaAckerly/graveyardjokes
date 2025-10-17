<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Http\Request;

class VisitorServiceTest extends TestCase
{
    public function test_localhost_returns_local_development_location()
    {
        $service = $this->app->make(\App\Contracts\VisitorServiceInterface::class);

        $request = Request::create('/track-visit', 'POST');
        // Simulate localhost IP
        $request->server->set('REMOTE_ADDR', '127.0.0.1');

        $result = $service->track($request);

        $this->assertIsArray($result);
        $this->assertEquals('Local Development', $result['country']);
        $this->assertEquals('Localhost', $result['city']);
    }
}
