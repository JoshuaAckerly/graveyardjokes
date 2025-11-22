# Testing Guide

Comprehensive guide to testing the Graveyard Jokes application, including unit tests, feature tests, and end-to-end testing strategies.

## 📋 Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [Continuous Integration](#continuous-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Testing Philosophy

Our testing approach follows these principles:

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **Arrange-Act-Assert (AAA)**: Structure tests with clear setup, execution, and verification
3. **Test Isolation**: Each test should be independent and not rely on others
4. **Meaningful Names**: Test names should describe what they're testing
5. **Fast Tests**: Keep tests fast to encourage frequent running
6. **Real-World Scenarios**: Test realistic use cases

## 🔬 Test Types

### 1. Unit Tests

Test individual classes and methods in isolation.

**Location**: `tests/Unit/`

**What to Test**:
- Service classes
- Model methods
- Utility functions
- Business logic

**Example**:
```php
<?php

namespace Tests\Unit;

use App\Services\JokeService;
use Tests\TestCase;

class JokeServiceTest extends TestCase
{
    public function test_get_random_joke_returns_joke(): void
    {
        $service = new JokeService();
        
        $joke = $service->getRandomJoke();
        
        $this->assertNotNull($joke);
        $this->assertObjectHasProperty('setup', $joke);
        $this->assertObjectHasProperty('punchline', $joke);
    }
}
```

### 2. Feature Tests

Test complete features and HTTP endpoints.

**Location**: `tests/Feature/`

**What to Test**:
- API endpoints
- Form submissions
- Authentication flows
- Page rendering

**Example**:
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class JokeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_random_joke_endpoint_returns_json(): void
    {
        $response = $this->get('/api/random-joke');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'setup',
                'punchline',
                'category'
            ]);
    }

    public function test_random_joke_endpoint_handles_empty_database(): void
    {
        // Database is empty due to RefreshDatabase
        $response = $this->get('/api/random-joke');

        $response->assertStatus(503)
            ->assertJson(['error' => 'No jokes available']);
    }
}
```

### 3. Integration Tests

Test how different parts of the system work together.

**Example**:
```php
<?php

namespace Tests\Feature;

use App\Mail\ContactMessage;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactFormIntegrationTest extends TestCase
{
    public function test_contact_form_sends_email(): void
    {
        Mail::fake();

        $response = $this->post('/contact', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'message' => 'Test message',
        ]);

        $response->assertRedirect();
        
        Mail::assertSent(ContactMessage::class, function ($mail) {
            return $mail->hasTo('admin@graveyardjokes.com');
        });
    }
}
```

### 4. Browser Tests (Playwright)

End-to-end tests that interact with the application through a real browser.

**Location**: `tests/browser/` or separate `e2e/` directory

**Example** (if using Playwright):
```javascript
// e2e/joke.spec.js
import { test, expect } from '@playwright/test';

test('can reveal joke punchline', async ({ page }) => {
  await page.goto('http://localhost:8000');
  
  // Click on a joke card
  await page.click('.joke-card');
  
  // Click reveal button
  await page.click('button:has-text("Reveal")');
  
  // Punchline should be visible
  await expect(page.locator('.punchline')).toBeVisible();
});
```

## 🏃 Running Tests

### PHPUnit (Backend Tests)

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit tests/Unit
./vendor/bin/phpunit tests/Feature

# Run specific test file
./vendor/bin/phpunit tests/Feature/JokeApiTest.php

# Run specific test method
./vendor/bin/phpunit --filter test_random_joke_endpoint_returns_json

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage

# Run with coverage (text output)
./vendor/bin/phpunit --coverage-text

# Stop on first failure
./vendor/bin/phpunit --stop-on-failure

# Run in parallel (if configured)
./vendor/bin/phpunit --parallel
```

### Jest (Frontend Tests)

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- JokeCard.test.tsx

# Update snapshots
npm test -- -u
```

### Via Composer

```bash
# Run all tests (shortcut)
composer test
```

## ✍️ Writing Tests

### Test Structure

Follow the **Arrange-Act-Assert (AAA)** pattern:

```php
public function test_example(): void
{
    // Arrange: Set up test data and conditions
    $user = User::factory()->create();
    $this->actingAs($user);
    
    // Act: Execute the code being tested
    $response = $this->get('/dashboard');
    
    // Assert: Verify the results
    $response->assertStatus(200);
    $this->assertDatabaseHas('users', ['id' => $user->id]);
}
```

### Naming Conventions

Use descriptive test names that explain:
- What is being tested
- Under what conditions
- What the expected outcome is

```php
// ✅ Good
public function test_user_can_submit_contact_form_with_valid_data(): void
public function test_api_returns_error_when_joke_not_found(): void
public function test_visitor_tracking_saves_geolocation_data(): void

// ❌ Bad
public function test_contact(): void
public function test_api(): void
public function test_visitor(): void
```

### Using Factories

Create test data using factories:

```php
<?php

namespace Database\Factories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory
{
    protected $model = Contact::class;

    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->safeEmail(),
            'message' => fake()->paragraph(),
        ];
    }
}
```

Usage in tests:

```php
// Create one contact
$contact = Contact::factory()->create();

// Create multiple contacts
$contacts = Contact::factory()->count(10)->create();

// Create with custom attributes
$contact = Contact::factory()->create([
    'email' => 'specific@example.com',
]);
```

### Database Testing

#### Using RefreshDatabase

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_operations(): void
    {
        // Database is fresh for each test
        $this->assertDatabaseCount('contacts', 0);
        
        Contact::factory()->create(['email' => 'test@example.com']);
        
        $this->assertDatabaseHas('contacts', [
            'email' => 'test@example.com',
        ]);
    }
}
```

#### Using Transactions

For faster tests that don't need a fresh database:

```php
use Illuminate\Foundation\Testing\DatabaseTransactions;

class FastDatabaseTest extends TestCase
{
    use DatabaseTransactions;

    public function test_with_transaction(): void
    {
        // Changes are rolled back after test
    }
}
```

### Testing API Endpoints

```php
public function test_api_endpoint(): void
{
    $response = $this->getJson('/api/random-joke');

    $response
        ->assertStatus(200)
        ->assertJsonStructure([
            'id',
            'setup',
            'punchline',
            'category',
        ])
        ->assertJsonPath('category', 'graveyard');
}

public function test_api_validation(): void
{
    $response = $this->postJson('/contact', [
        'first_name' => '',
        'email' => 'invalid-email',
    ]);

    $response
        ->assertStatus(422)
        ->assertJsonValidationErrors(['first_name', 'email']);
}
```

### Testing Mail

```php
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;

public function test_contact_form_sends_email(): void
{
    Mail::fake();

    $this->post('/contact', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'message' => 'Hello',
    ]);

    Mail::assertSent(ContactMessage::class, function ($mail) {
        return $mail->hasTo('admin@graveyardjokes.com') &&
               $mail->hasSubject('New Contact Form Submission');
    });
}
```

### Testing Cache

```php
use Illuminate\Support\Facades\Cache;

public function test_joke_caching(): void
{
    Cache::shouldReceive('remember')
        ->once()
        ->with('jokes_data', 3600, \Closure::class)
        ->andReturn(collect(['joke1', 'joke2']));

    $service = new JokeService();
    $jokes = $service->getAllJokes();

    $this->assertCount(2, $jokes);
}
```

### Testing Queue Jobs

```php
use Illuminate\Support\Facades\Queue;
use App\Jobs\ProcessVisitor;

public function test_visitor_processing_queued(): void
{
    Queue::fake();

    $this->post('/track-visit', [
        'referrer' => 'https://example.com',
    ]);

    Queue::assertPushed(ProcessVisitor::class);
}
```

### Frontend Testing (Jest + React Testing Library)

```typescript
// resources/js/Components/__tests__/JokeCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { JokeCard } from '../JokeCard';

describe('JokeCard', () => {
  const mockJoke = {
    id: '1',
    setup: 'Why did the skeleton go to the party?',
    punchline: 'To have a rattling good time!',
    category: 'skeleton',
  };

  it('renders joke setup', () => {
    render(<JokeCard joke={mockJoke} />);
    
    expect(screen.getByText(mockJoke.setup)).toBeInTheDocument();
  });

  it('reveals punchline when button clicked', () => {
    render(<JokeCard joke={mockJoke} />);
    
    // Punchline should not be visible initially
    expect(screen.queryByText(mockJoke.punchline)).not.toBeInTheDocument();
    
    // Click reveal button
    fireEvent.click(screen.getByRole('button', { name: /reveal/i }));
    
    // Punchline should now be visible
    expect(screen.getByText(mockJoke.punchline)).toBeInTheDocument();
  });
});
```

## 📊 Test Coverage

### Generating Coverage Reports

```bash
# HTML report
./vendor/bin/phpunit --coverage-html coverage

# Open report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

### Coverage Goals

- **Overall**: Aim for 80%+ coverage
- **Critical Features**: 100% coverage
  - Payment processing
  - Authentication
  - Data validation
- **Business Logic**: 90%+ coverage
  - Services
  - Controllers
  - Models
- **UI Components**: 70%+ coverage
  - React components
  - Form handling

### What to Prioritize

Focus coverage on:
1. Business-critical functionality
2. Complex logic
3. Edge cases and error handling
4. Security-sensitive code
5. Frequently-changed code

Don't obsess over:
- Trivial getters/setters
- Framework boilerplate
- Third-party libraries

## 🔄 Continuous Integration

### GitHub Actions Workflow

The project includes CI workflows in `.github/workflows/`:

#### ci.yml - Main CI Pipeline

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-22.04
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.4
          extensions: mbstring, xml, ctype, json, curl
          
      - name: Install Composer dependencies
        run: composer install --prefer-dist --no-interaction
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          
      - name: Install npm dependencies
        run: npm ci
        
      - name: Run tests
        run: ./vendor/bin/phpunit
        
      - name: Run PHPStan
        run: ./vendor/bin/phpstan analyse -c phpstan.neon --memory-limit=2G
        
      - name: Build assets
        run: npm run build
        
      - name: Run linters
        run: |
          npm run lint
          vendor/bin/pint --test
```

### Running CI Locally

Replicate CI environment locally:

```bash
# Install fresh dependencies
rm -rf vendor node_modules
composer install
npm ci

# Run all checks
./vendor/bin/phpunit
./vendor/bin/phpstan analyse -c phpstan.neon --memory-limit=2G
npm run build
npm run lint
vendor/bin/pint --test
npm run types
```

## 📚 Best Practices

### 1. Keep Tests Fast

```php
// ✅ Good: Use factories efficiently
public function test_example(): void
{
    $user = User::factory()->create();
    // Test logic
}

// ❌ Bad: Creating unnecessary data
public function test_example(): void
{
    User::factory()->count(100)->create();
    Post::factory()->count(500)->create();
    // Only testing one thing
}
```

### 2. Test One Thing at a Time

```php
// ✅ Good: Focused test
public function test_user_can_login_with_valid_credentials(): void
{
    $user = User::factory()->create(['password' => bcrypt('password')]);
    
    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);
    
    $response->assertRedirect('/dashboard');
    $this->assertAuthenticatedAs($user);
}

// ❌ Bad: Testing too much
public function test_authentication(): void
{
    // Tests login, logout, password reset, registration...
}
```

### 3. Use Descriptive Assertions

```php
// ✅ Good: Clear assertion
$this->assertDatabaseHas('contacts', [
    'email' => 'test@example.com',
    'status' => 'pending',
]);

// ✅ Good: Custom message
$this->assertTrue($result->isValid(), 'Expected validation to pass');

// ❌ Bad: Generic assertion
$this->assertTrue($result);
```

### 4. Don't Test Framework Code

```php
// ❌ Bad: Testing Laravel's validation
public function test_validation_rules(): void
{
    $rules = ['email' => 'required|email'];
    $validator = Validator::make(['email' => 'invalid'], $rules);
    $this->assertFalse($validator->passes());
}

// ✅ Good: Test your validation logic
public function test_contact_form_rejects_invalid_email(): void
{
    $response = $this->post('/contact', [
        'email' => 'invalid',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'message' => 'Hello',
    ]);
    
    $response->assertSessionHasErrors('email');
}
```

### 5. Clean Up After Tests

```php
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExampleTest extends TestCase
{
    use RefreshDatabase; // Automatically cleans database
    
    protected function tearDown(): void
    {
        // Additional cleanup if needed
        Cache::flush();
        Queue::purge();
        
        parent::tearDown();
    }
}
```

### 6. Use Test Helpers

```php
// tests/TestCase.php
abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function createAuthenticatedUser(): User
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        return $user;
    }

    protected function assertValidationError($response, string $field): void
    {
        $response->assertSessionHasErrors($field);
    }
}

// Usage in tests
public function test_protected_route(): void
{
    $user = $this->createAuthenticatedUser();
    // Test logic
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Tests Failing Locally but Passing in CI

```bash
# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Reinstall dependencies
rm -rf vendor node_modules
composer install
npm ci
```

#### 2. Database Connection Errors

```env
# .env.testing
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
```

#### 3. Slow Tests

```php
// Use in-memory SQLite for faster tests
// phpunit.xml
<php>
    <env name="DB_CONNECTION" value="sqlite"/>
    <env name="DB_DATABASE" value=":memory:"/>
</php>
```

#### 4. Flaky Tests

```php
// Add retry logic for flaky tests
public function test_flaky_feature(): void
{
    $this->retry(3, function () {
        // Test logic
    });
}
```

#### 5. Memory Issues

```bash
# Increase memory limit
./vendor/bin/phpunit --memory-limit=512M
```

### Debugging Tests

```php
// Dump data during test
dd($response->json());

// Dump and continue
dump($user->toArray());

// View response content
dump($response->getContent());

// Check database state
dump(DB::table('users')->get());
```

## 📝 Test Checklist

Before committing:

- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Bug fixes include regression tests
- [ ] PHPStan passes without new errors
- [ ] Code formatted with Pint
- [ ] Frontend linting passes
- [ ] TypeScript compiles without errors
- [ ] Coverage maintained or improved

## 🎓 Additional Resources

- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [Laravel Testing Guide](https://laravel.com/docs/testing)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev)

---

**Test Early, Test Often! ✅**
