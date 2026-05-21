<?php

namespace Tests\Unit;

use App\Contracts\VisitorServiceInterface;
use Illuminate\Http\Request;
use Tests\TestCase;

class VisitorServiceTest extends TestCase
{
    public function test_localhost_returns_local_development_location(): void
    {
        $service = $this->app->make(VisitorServiceInterface::class);

        $request = Request::create('/track-visit', 'POST');
        // Simulate localhost IP
        $request->server->set('REMOTE_ADDR', '127.0.0.1');

        $result = $service->track($request);

        $this->assertNotEmpty($result);
        $this->assertEquals('Local Development', $result['country']);
        $this->assertEquals('Localhost', $result['city']);
    }
}
