<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ExampleTest extends TestCase
{
    #[Test]
    public function it_checks_basic_assertion(): void
    {        
        $this->assertEquals(1, 1);
    }
}
