<?php

namespace Tests\Unit;

use App\Services\SocialPoster\TwitterService;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Response;
use Tests\TestCase;

class TwitterServiceTest extends TestCase
{
    private function twitterConfig(): array
    {
        return [
            'social.twitter.api_key' => 'api_key',
            'social.twitter.api_secret' => 'api_secret',
            'social.twitter.access_token' => 'access_token',
            'social.twitter.access_secret' => 'access_secret',
        ];
    }

    public function test_throws_when_api_key_not_configured(): void
    {
        config(array_merge($this->twitterConfig(), ['social.twitter.api_key' => '']));
        $service = new TwitterService(new Client);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Twitter API credentials are not fully configured.');

        $service->post('Hello Twitter!');
    }

    public function test_throws_when_api_secret_not_configured(): void
    {
        config(array_merge($this->twitterConfig(), ['social.twitter.api_secret' => '']));
        $service = new TwitterService(new Client);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Twitter API credentials are not fully configured.');

        $service->post('Hello Twitter!');
    }

    public function test_throws_when_access_token_not_configured(): void
    {
        config(array_merge($this->twitterConfig(), ['social.twitter.access_token' => '']));
        $service = new TwitterService(new Client);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Twitter API credentials are not fully configured.');

        $service->post('Hello Twitter!');
    }

    public function test_throws_when_access_secret_not_configured(): void
    {
        config(array_merge($this->twitterConfig(), ['social.twitter.access_secret' => '']));
        $service = new TwitterService(new Client);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Twitter API credentials are not fully configured.');

        $service->post('Hello Twitter!');
    }

    public function test_posts_to_twitter_v2_api(): void
    {
        config($this->twitterConfig());

        $container = [];
        $mock = new MockHandler([new Response(201, [], '{"data":{"id":"tweet_1"}}')]);
        $stack = HandlerStack::create($mock);
        $stack->push(Middleware::history($container));
        $client = new Client(['handler' => $stack]);

        (new TwitterService($client))->post('Hello Twitter!');

        $this->assertCount(1, $container);
        $request = $container[0]['request'];
        $this->assertSame('POST', $request->getMethod());
        $this->assertSame('https://api.twitter.com/2/tweets', (string) $request->getUri());
        $body = json_decode((string) $request->getBody(), true);
        $this->assertSame('Hello Twitter!', $body['text']);
    }

    public function test_request_includes_oauth_authorization_header(): void
    {
        config($this->twitterConfig());

        $container = [];
        $mock = new MockHandler([new Response(201, [], '{"data":{"id":"tweet_1"}}')]);
        $stack = HandlerStack::create($mock);
        $stack->push(Middleware::history($container));
        $client = new Client(['handler' => $stack]);

        (new TwitterService($client))->post('Auth header test');

        $authHeader = $container[0]['request']->getHeaderLine('Authorization');
        $this->assertStringStartsWith('OAuth ', $authHeader);
        $this->assertStringContainsString('oauth_consumer_key="api_key"', $authHeader);
        $this->assertStringContainsString('oauth_token="access_token"', $authHeader);
        $this->assertStringContainsString('oauth_signature_method="HMAC-SHA1"', $authHeader);
        $this->assertStringContainsString('oauth_version="1.0"', $authHeader);
    }

    public function test_request_content_type_is_json(): void
    {
        config($this->twitterConfig());

        $container = [];
        $mock = new MockHandler([new Response(201, [], '{"data":{"id":"tweet_1"}}')]);
        $stack = HandlerStack::create($mock);
        $stack->push(Middleware::history($container));
        $client = new Client(['handler' => $stack]);

        (new TwitterService($client))->post('Content type test');

        $this->assertSame(
            'application/json',
            $container[0]['request']->getHeaderLine('Content-Type')
        );
    }
}
