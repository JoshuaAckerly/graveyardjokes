<?php
namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class GoogleAnalyticsServiceTest extends TestCase
{
    /** @test */
    public function it_has_get_real_time_visitors_method(): void
    {
        $this->assertTrue(method_exists('\App\Services\GoogleAnalyticsService', 'getRealTimeVisitors'));
    }
}
