<?php

namespace Tests\Unit;

use App\Contracts\AnalyticsInterface;
use App\Services\GoogleAnalyticsService;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class GoogleAnalyticsServiceTest extends TestCase
{
    private GoogleAnalyticsService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new GoogleAnalyticsService;
    }

    #[Test]
    public function it_implements_analytics_interface(): void
    {
        $this->assertInstanceOf(AnalyticsInterface::class, $this->service);
    }

    #[Test]
    public function it_returns_array_from_get_real_time_visitors(): void
    {
        $result = $this->service->getRealTimeVisitors();

        $this->assertCount(0, $result);
    }

    #[Test]
    public function it_returns_empty_array_by_default(): void
    {
        $result = $this->service->getRealTimeVisitors();

        $this->assertEmpty($result);
    }
}
