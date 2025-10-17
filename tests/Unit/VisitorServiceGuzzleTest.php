<?php

namespace Tests\Unit;

use Tests\TestCase;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Client as GuzzleClient;

class VisitorServiceGuzzleTest extends TestCase
{
    public function test_external_api_parsed_correctly(): void
    {
        // Mocked response from ipinfo
        $body = json_encode([
            'ip' => '1.2.3.4',
            'city' => 'TestCity',
            'country' => 'TC',
            'region' => 'TestRegion',
            'timezone' => 'UTC'
        ]);

        $mock = new MockHandler([
            new Response(200, ['Content-Type' => 'application/json'], $body)
        ]);

        $handlerStack = HandlerStack::create($mock);
        $client = new GuzzleClient(['handler' => $handlerStack]);

        $service = new \App\Modules\Visitor\Services\VisitorService($client);

        $result = $service->getLocationFromIP('1.2.3.4');

        $this->assertEquals('TestCity', $result['city']);
        $this->assertEquals('TC', $result['country']);
    }
}
