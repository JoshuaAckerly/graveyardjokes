<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RetiredServicesRoutesTest extends TestCase
{
    #[Test]
    public function retired_service_pages_and_submission_endpoint_return_gone(): void
    {
        $this->get('/services')->assertGone();
        $this->get('/services/intake?package=starter')->assertGone();
        $this->post('/services/intake', [])->assertGone();
    }
}
