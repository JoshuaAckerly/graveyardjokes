<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\WithFaker;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Creates the application.
     */
    public function createApplication(): \Illuminate\Foundation\Application
    {
        /** @var \Illuminate\Foundation\Application $app */
        $app = require __DIR__.'/../bootstrap/app.php';

        /** @var \Illuminate\Contracts\Console\Kernel $kernel */
        $kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
        $kernel->bootstrap();

        return $app;
    }
}
