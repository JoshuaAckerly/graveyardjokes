<?php

namespace Tests\Unit;

use App\Contracts\ContactServiceInterface;
use App\Modules\Contact\Controllers\ContactController;
use Illuminate\Http\Request;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;

class ModuleContactControllerTest extends TestCase
{
    private ContactController $controller;

    /** @var ContactServiceInterface&MockInterface */
    private $contactService;

    protected function setUp(): void
    {
        parent::setUp();
        /** @var ContactServiceInterface&MockInterface $mock */
        $mock = Mockery::mock(ContactServiceInterface::class);
        $this->contactService = $mock;
        $this->controller = new ContactController;
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_store_returns_success_when_contact_created(): void
    {
        $request = new Request;
        $contactData = ['id' => 1, 'email' => 'test@example.com'];

        /** @var \Mockery\Expectation $expect */
        $expect = $this->contactService->shouldReceive('store');
        $expect->with($request)
            ->once()
            ->andReturn($contactData);

        $response = $this->controller->store($request, $this->contactService);

        $this->assertEquals(302, $response->getStatusCode());
    }

    public function test_store_returns_error_when_contact_creation_fails(): void
    {
        $request = new Request;

        /** @var \Mockery\Expectation $expect */
        $expect = $this->contactService->shouldReceive('store');
        $expect->with($request)
            ->once()
            ->andReturn([]);

        $response = $this->controller->store($request, $this->contactService);

        $this->assertEquals(302, $response->getStatusCode());
    }
}
