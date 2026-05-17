<?php

namespace Tests\Unit;

use App\Services\SocialPoster\FacebookService;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Response;
use Tests\TestCase;

class FacebookServiceTest extends TestCase
{
    public function test_throws_when_page_id_not_configured(): void
    {
        config(['social.facebook.page_id' => null, 'social.facebook.access_token' => 'token']);
        $service = new FacebookService(new Client);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Facebook page credentials are not fully configured.');

        $service->post('Hello');
    }

    public function test_throws_when_access_token_not_configured(): void
    {
        config(['social.facebook.page_id' => 'page123', 'social.facebook.access_token' => null]);
        $service = new FacebookService(new Client);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Facebook page credentials are not fully configured.');

        $service->post('Hello');
    }

    public function test_posts_to_feed_endpoint_when_no_media(): void
    {
        config(['social.facebook.page_id' => 'page123', 'social.facebook.access_token' => 'tok456']);

        $container = [];
        $mock = new MockHandler([new Response(200, [], '{"id":"post_1"}')]);
        $stack = HandlerStack::create($mock);
        $stack->push(Middleware::history($container));
        $client = new Client(['handler' => $stack]);

        (new FacebookService($client))->post('Hello world');

        $request = $container[0]['request'];
        $this->assertSame('POST', $request->getMethod());
        $this->assertStringEndsWith('/page123/feed', (string) $request->getUri());
        parse_str((string) $request->getBody(), $params);
        $this->assertSame('Hello world', $params['message']);
        $this->assertSame('tok456', $params['access_token']);
    }

    public function test_posts_to_photos_endpoint_when_media_url_provided(): void
    {
        config(['social.facebook.page_id' => 'page123', 'social.facebook.access_token' => 'tok456']);

        $container = [];
        $mock = new MockHandler([new Response(200, [], '{"id":"photo_1"}')]);
        $stack = HandlerStack::create($mock);
        $stack->push(Middleware::history($container));
        $client = new Client(['handler' => $stack]);

        (new FacebookService($client))->post('Photo caption', 'https://example.com/photo.jpg');

        $request = $container[0]['request'];
        $this->assertStringEndsWith('/page123/photos', (string) $request->getUri());
        parse_str((string) $request->getBody(), $params);
        $this->assertSame('https://example.com/photo.jpg', $params['url']);
        $this->assertSame('Photo caption', $params['caption']);
    }

    public function test_only_one_request_made_per_post(): void
    {
        config(['social.facebook.page_id' => 'page123', 'social.facebook.access_token' => 'tok456']);

        $container = [];
        $mock = new MockHandler([new Response(200, [], '{"id":"post_1"}')]);
        $stack = HandlerStack::create($mock);
        $stack->push(Middleware::history($container));
        $client = new Client(['handler' => $stack]);

        (new FacebookService($client))->post('Just text');

        $this->assertCount(1, $container);
    }
}
