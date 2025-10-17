<?php

namespace App\Contracts;

interface AnalyticsInterface
{
    /**
     * Return an array of real-time visitor data grouped by location.
     *
     * @return array<int, array<string,mixed>>
     */
    public function getRealTimeVisitors(): array;
}
