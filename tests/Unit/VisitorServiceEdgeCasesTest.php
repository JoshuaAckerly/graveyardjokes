<?php

namespace Tests\Unit;

use App\Modules\Visitor\Services\VisitorService;
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\Utils;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class VisitorServiceEdgeCasesTest extends TestCase
{
    public function test_non_array_json_response_returns_unknown_location(): void
    {
        // ipinfo returns a plain string (non-array) — exercises the defensive fallback
        $mock = new MockHandler([
            new Response(200, ['Content-Type' => 'application/json'], Utils::streamFor('"unexpected string"')),
        ]);
        $client = new GuzzleClient(['handler' => HandlerStack::create($mock)]);
        $service = new VisitorService($client);

        $result = $service->getLocationFromIP('8.8.8.8');

        $this->assertSame('Unknown', $result['city']);
        $this->assertSame('Unknown', $result['country']);
    }

    public function test_malformed_json_response_returns_unknown_location(): void
    {
        // ipinfo returns non-JSON body
        $mock = new MockHandler([
            new Response(200, ['Content-Type' => 'text/html'], Utils::streamFor('<html>Error</html>')),
        ]);
        $client = new GuzzleClient(['handler' => HandlerStack::create($mock)]);
        $service = new VisitorService($client);

        $result = $service->getLocationFromIP('8.8.4.4');

        $this->assertSame('Unknown', $result['city']);
        $this->assertSame('Unknown', $result['country']);
    }

    public function test_api_exception_returns_unknown_location(): void
    {
        // Guzzle throws — exercises the catch branch in getLocationFromIP
        $mock = new MockHandler([
            new \GuzzleHttp\Exception\ConnectException(
                'Connection refused',
                new \GuzzleHttp\Psr7\Request('GET', 'http://ipinfo.io/1.2.3.4/json')
            ),
        ]);
        $client = new GuzzleClient(['handler' => HandlerStack::create($mock)]);
        $service = new VisitorService($client);

        $result = $service->getLocationFromIP('1.2.3.4');

        $this->assertSame('Unknown', $result['city']);
        $this->assertSame('Unknown', $result['country']);
    }

    public function test_result_is_cached_and_api_not_called_twice(): void
    {
        // Only one response queued — if the service calls the API twice, the test will throw
        $body = json_encode(['ip' => '5.5.5.5', 'city' => 'Berlin', 'country' => 'DE']);
        $mock = new MockHandler([
            new Response(200, ['Content-Type' => 'application/json'], Utils::streamFor($body)),
        ]);
        $client = new GuzzleClient(['handler' => HandlerStack::create($mock)]);
        $service = new VisitorService($client);

        // Ensure cache is empty for this IP
        Cache::forget('geo_location_5.5.5.5');

        $first = $service->getLocationFromIP('5.5.5.5');
        $second = $service->getLocationFromIP('5.5.5.5');

        $this->assertSame('Berlin', $first['city']);
        $this->assertSame('Berlin', $second['city']);
    }

    public function test_null_ip_returns_local_development(): void
    {
        $service = new VisitorService();

        $result = $service->getLocationFromIP(null);

        $this->assertSame('Local Development', $result['country']);
        $this->assertSame('Localhost', $result['city']);
    }

    public function test_ipv6_loopback_returns_local_development(): void
    {
        $service = new VisitorService();

        $result = $service->getLocationFromIP('::1');

        $this->assertSame('Local Development', $result['country']);
        $this->assertSame('Localhost', $result['city']);
    }
}
