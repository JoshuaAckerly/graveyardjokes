<?php

namespace Tests\Unit;

use App\Services\SocialPoster\InstagramService;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Response;
use Tests\TestCase;

class InstagramServiceTest extends TestCase
{
    public function test_throws_when_user_id_not_configured(): void
    {
        config(['social.instagram.user_id' => null, 'social.instagram.access_token' => 'token']);
        $service = new InstagramService(new Client());

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Instagram credentials are not fully configured.');

        $service->post('Caption', 'https://example.com/image.jpg');
    }

    public function test_throws_when_access_token_not_configured(): void
    {
        config(['social.instagram.user_id' => 'user123', 'social.instagram.access_token' => null]);
        $service = new InstagramService(new Client());

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Instagram credentials are not fully configured.');

        $service->post('Caption', 'https://example.com/image.jpg');
    }

    public function test_creates_media_container_then_publishes(): void
    {
        config(['social.instagram.user_id' => 'user123', 'social.instagram.access_token' => 'tok456']);

        $container = [];
        $mock = new MockHandler([
            new Response(200, [], '{"id":"container789"}'), // create media container
            new Response(200, [], '{"id":"post_id"}'),      // publish
        ]);
        $stack = HandlerStack::create($mock);
        $stack->push(Middleware::history($container));
        $client = new Client(['handler' => $stack]);

        (new InstagramService($client))->post('Caption text', 'https://example.com/image.jpg');

        $this->assertCount(2, $container);

        // First request: create media container
        $createRequest = $container[0]['request'];
        $this->assertStringEndsWith('/user123/media', (string) $createRequest->getUri());
        parse_str((string) $createRequest->getBody(), $params);
        $this->assertSame('https://example.com/image.jpg', $params['image_url']);
        $this->assertSame('Caption text', $params['caption']);
        $this->assertSame('tok456', $params['access_token']);

        // Second request: publish container
        $publishRequest = $container[1]['request'];
        $this->assertStringEndsWith('/user123/media_publish', (string) $publishRequest->getUri());
        parse_str((string) $publishRequest->getBody(), $params);
        $this->assertSame('container789', $params['creation_id']);
    }

    public function test_throws_when_container_id_missing_from_response(): void
    {
        config(['social.instagram.user_id' => 'user123', 'social.instagram.access_token' => 'tok456']);

        $mock = new MockHandler([
            new Response(200, [], '{"error":"something went wrong"}'), // no 'id' key
        ]);
        $client = new Client(['handler' => HandlerStack::create($mock)]);

        $service = new InstagramService($client);
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Instagram media container creation returned no ID.');

        $service->post('Caption', 'https://example.com/image.jpg');
    }

    public function test_throws_when_container_response_is_empty_array(): void
    {
        config(['social.instagram.user_id' => 'user123', 'social.instagram.access_token' => 'tok456']);

        $mock = new MockHandler([
            new Response(200, [], '{}'),
        ]);
        $client = new Client(['handler' => HandlerStack::create($mock)]);

        $service = new InstagramService($client);
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Instagram media container creation returned no ID.');

        $service->post('Caption', 'https://example.com/image.jpg');
    }
}
