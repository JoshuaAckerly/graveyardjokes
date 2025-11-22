<?php

namespace Tests\Unit;

use App\Modules\Contact\Controllers\ContactController;
use App\Contracts\ContactServiceInterface;
use Illuminate\Http\Request;
use Tests\TestCase;
use Mockery;
use Mockery\MockInterface;
class ModuleContactControllerTest extends TestCase
{
    private ContactController $controller;
    /** @var ContactServiceInterface&MockInterface */
    private $contactService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->contactService = Mockery::mock(ContactServiceInterface::class);
        $this->controller = new ContactController();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_store_returns_success_when_contact_created(): void
    {
        $request = new Request();
        $contactData = ['id' => 1, 'email' => 'test@example.com'];
        
        $this->contactService
            ->shouldReceive('store')
            ->with($request)
            ->once()
            ->andReturn($contactData);

        $response = $this->controller->store($request, $this->contactService);
        
        $this->assertEquals(302, $response->getStatusCode());
    }

    public function test_store_returns_error_when_contact_creation_fails(): void
    {
        $request = new Request();
        
        $this->contactService
            ->shouldReceive('store')
            ->with($request)
            ->once()
            ->andReturn([]);

        $response = $this->controller->store($request, $this->contactService);
        
        $this->assertEquals(302, $response->getStatusCode());
    }
}