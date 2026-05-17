<?php

namespace Tests\Unit;

use App\Services\SocialPoster\DiscordService;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Response;
use Tests\TestCase;

class DiscordServiceTest extends TestCase
{
    public function test_throws_when_webhook_url_not_configured(): void
    {
        config(['social.discord.webhook_url' => null]);
        $service = new DiscordService(new Client);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('DISCORD_WEBHOOK_URL is not configured.');

        $service->post('Hello world');
    }

    public function test_throws_when_webhook_url_is_empty_string(): void
    {
        config(['social.discord.webhook_url' => '']);
        $service = new DiscordService(new Client);

        $this->expectException(\RuntimeException::class);

        $service->post('Hello world');
    }

    public function test_posts_content_to_webhook(): void
    {
        config(['social.discord.webhook_url' => 'https://discord.com/api/webhooks/test/token']);

        $container = [];
        $mock = new MockHandler([new Response(204)]);
        $stack = HandlerStack::create($mock);
        $stack->push(Middleware::history($container));
        $client = new Client(['handler' => $stack]);

        (new DiscordService($client))->post('Hello world');

        $this->assertCount(1, $container);
        $request = $container[0]['request'];
        $this->assertSame('POST', $request->getMethod());
        $this->assertSame(
            'https://discord.com/api/webhooks/test/token',
            (string) $request->getUri()
        );
        $body = json_decode((string) $request->getBody(), true);
        $this->assertSame('Hello world', $body['content']);
    }

    public function test_appends_media_url_to_content(): void
    {
        config(['social.discord.webhook_url' => 'https://discord.com/api/webhooks/test/token']);

        $container = [];
        $mock = new MockHandler([new Response(204)]);
        $stack = HandlerStack::create($mock);
        $stack->push(Middleware::history($container));
        $client = new Client(['handler' => $stack]);

        (new DiscordService($client))->post('Check this out', 'https://example.com/image.jpg');

        $body = json_decode((string) $container[0]['request']->getBody(), true);
        $this->assertSame("Check this out\nhttps://example.com/image.jpg", $body['content']);
    }

    public function test_posts_content_only_when_no_media_url(): void
    {
        config(['social.discord.webhook_url' => 'https://discord.com/api/webhooks/test/token']);

        $container = [];
        $mock = new MockHandler([new Response(204)]);
        $stack = HandlerStack::create($mock);
        $stack->push(Middleware::history($container));
        $client = new Client(['handler' => $stack]);

        (new DiscordService($client))->post('Text only post');

        $body = json_decode((string) $container[0]['request']->getBody(), true);
        $this->assertSame('Text only post', $body['content']);
        $this->assertStringNotContainsString("\n", $body['content']);
    }
}
