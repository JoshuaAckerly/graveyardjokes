# Contributing to Graveyard Jokes

Thank you for your interest in contributing to Graveyard Jokes! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or inflammatory comments
- Personal or political attacks
- Publishing others' private information without permission
- Any conduct that could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

1. A GitHub account
2. Git installed locally
3. PHP 8.3+ and Composer
4. Node.js 18+ and npm
5. A local development environment set up (see [DEVELOPMENT.md](./DEVELOPMENT.md))

### Finding Issues to Work On

- Check the [Issues](https://github.com/JoshuaAckerly/graveyardjokes/issues) page
- Look for issues labeled `good first issue` for beginner-friendly tasks
- Issues labeled `help wanted` are open for contributions
- Comment on an issue to express interest before starting work

### Reporting Bugs

When reporting bugs, include:

1. **Clear title**: Summarize the issue in one line
2. **Description**: Detailed explanation of the problem
3. **Steps to reproduce**: Step-by-step instructions
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happens
6. **Environment**: PHP version, OS, browser (if applicable)
7. **Screenshots**: If relevant

**Bug Report Template:**

```markdown
## Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- PHP Version: 8.4
- OS: Windows 11
- Browser: Chrome 120
- Node Version: 22.x

## Additional Context
[Any other relevant information]
```

### Suggesting Features

When suggesting features:

1. **Check existing issues**: Ensure it hasn't been suggested
2. **Describe the problem**: What problem does this solve?
3. **Propose a solution**: How would this work?
4. **Consider alternatives**: What other solutions exist?
5. **Additional context**: Mockups, examples, or references

## 🔄 Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR-USERNAME/graveyardjokes.git
cd graveyardjokes

# Add upstream remote
git remote add upstream https://github.com/JoshuaAckerly/graveyardjokes.git
```

### 2. Create a Branch

Use descriptive branch names following this convention:

```bash
# Feature branches
git checkout -b feat/add-joke-categories

# Bug fixes
git checkout -b fix/contact-form-validation

# Documentation
git checkout -b docs/update-api-guide

# Refactoring
git checkout -b refactor/optimize-joke-service

# Tests
git checkout -b test/add-visitor-controller-tests
```

**Branch Naming Convention:**
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks
- `perf/` - Performance improvements

### 3. Make Changes

```bash
# Install dependencies
composer install
npm ci

# Set up environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Start development servers
composer dev
```

### 4. Keep Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on upstream main
git rebase upstream/main
```

### 5. Test Your Changes

```bash
# Run PHP tests
./vendor/bin/phpunit

# Run static analysis
./vendor/bin/phpstan analyse -c phpstan.neon --memory-limit=2G

# Run linters
vendor/bin/pint
npm run lint

# Type check
npm run types
```

## 📝 Coding Standards

### PHP Standards

#### Style Guide

We follow **PSR-12** coding standards with Laravel conventions.

```php
<?php

namespace App\Services;

use App\Models\Joke;
use Illuminate\Support\Facades\Cache;

class JokeService
{
    /**
     * Get a random joke from the collection.
     *
     * @return Joke|null
     */
    public function getRandomJoke(): ?Joke
    {
        $jokes = Cache::remember('jokes_data', 3600, function () {
            return Joke::all();
        });

        return $jokes->random();
    }
}
```

**Key Points:**
- Use type hints for parameters and return types
- Add docblocks for public methods
- Use meaningful variable and method names
- Keep methods focused and single-purpose
- Prefer dependency injection over facades (except in simple cases)

#### Laravel Conventions

```php
// Controllers: Singular, suffixed with Controller
class JokeController extends Controller

// Models: Singular
class Joke extends Model

// Services: Singular, suffixed with Service
class ContactService

// Requests: Descriptive, suffixed with Request
class StoreContactRequest extends FormRequest

// Mail: Descriptive, no suffix
class ContactMessage extends Mailable
```

#### PHPStan Compliance

- Maintain **Level 8** compliance
- Add to baseline only when absolutely necessary
- Document any baseline additions in PR

```bash
# Check for new errors
./vendor/bin/phpstan analyse -c phpstan.neon --memory-limit=2G

# Generate baseline (only if needed)
./vendor/bin/phpstan analyse -c phpstan.neon --generate-baseline
```

### TypeScript/React Standards

#### Component Structure

```typescript
import { useState } from 'react';
import { router } from '@inertiajs/react';
import type { Joke } from '@/types';

interface JokeCardProps {
    joke: Joke;
    onShare?: (joke: Joke) => void;
}

export function JokeCard({ joke, onShare }: JokeCardProps) {
    const [isRevealed, setIsRevealed] = useState(false);

    const handleReveal = () => {
        setIsRevealed(true);
    };

    return (
        <div className="joke-card">
            <p className="setup">{joke.setup}</p>
            {isRevealed && (
                <p className="punchline">{joke.punchline}</p>
            )}
            <button onClick={handleReveal}>Reveal</button>
        </div>
    );
}
```

**Key Points:**
- Use functional components with hooks
- Define prop types with TypeScript interfaces
- Export named components, not default exports
- Use descriptive variable names
- Keep components small and focused

#### File Organization

```
resources/js/
├── Components/
│   ├── ui/              # Reusable UI components
│   ├── JokeCard.tsx
│   └── ContactForm.tsx
├── Layouts/
│   └── AppLayout.tsx
├── Pages/
│   ├── Home.tsx
│   └── Contact.tsx
├── types/
│   └── index.d.ts
└── app.tsx
```

#### Naming Conventions

- **Components**: PascalCase (e.g., `JokeCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useJokes.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `type Joke = {...}`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### CSS/Tailwind Standards

```tsx
// ✅ Good: Use Tailwind utility classes
<div className="flex items-center gap-4 rounded-lg bg-gray-100 p-4">
    <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        Click me
    </button>
</div>

// ✅ Good: Extract repeated patterns to components
function Button({ children, variant = 'primary' }) {
    const baseClasses = "rounded px-4 py-2 font-medium";
    const variantClasses = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
    };
    
    return (
        <button className={`${baseClasses} ${variantClasses[variant]}`}>
            {children}
        </button>
    );
}

// ❌ Avoid: Custom CSS for things Tailwind can handle
<style>
.custom-button {
    background-color: blue;
    padding: 8px 16px;
}
</style>
```

## 💬 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(jokes): add joke category filtering"

# Bug fix
git commit -m "fix(contact): resolve email validation issue"

# Documentation
git commit -m "docs(api): update endpoint documentation"

# Multiple changes
git commit -m "feat(analytics): add visitor geolocation tracking

- Integrate IPInfo.io API
- Add location data to visitor model
- Cache geolocation results for 1 hour
- Update visitor controller tests

Closes #123"
```

### Commit Message Rules

1. **Subject line**:
   - Use imperative mood ("add" not "added" or "adds")
   - Don't capitalize first letter
   - No period at the end
   - Maximum 72 characters

2. **Body** (optional):
   - Separate from subject with blank line
   - Explain what and why, not how
   - Wrap at 72 characters

3. **Footer** (optional):
   - Reference issues: `Closes #123`, `Fixes #456`
   - Note breaking changes: `BREAKING CHANGE: ...`

## 🔍 Pull Request Process

### Before Submitting

1. ✅ Ensure all tests pass
2. ✅ Run static analysis (PHPStan)
3. ✅ Format code (Pint for PHP, Prettier for JS/TS)
4. ✅ Lint code (ESLint)
5. ✅ Update documentation if needed
6. ✅ Add tests for new features
7. ✅ Keep changes focused and small

### PR Checklist

```markdown
## Description
[Clear description of changes]

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] All tests pass (`./vendor/bin/phpunit`)
- [ ] PHPStan passes (`./vendor/bin/phpstan analyse`)
- [ ] Lint checks pass (`npm run lint`, `vendor/bin/pint`)
- [ ] New tests added for new functionality

## Documentation
- [ ] README updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] Inline code comments added
- [ ] CHANGELOG updated

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Closes #123
```

### PR Title Format

Follow the same convention as commit messages:

```
feat(jokes): add joke category filtering
fix(contact): resolve email validation issue
docs(api): update endpoint documentation
```

### Review Process

1. **Automated checks**: All CI checks must pass
2. **Code review**: At least one maintainer approval required
3. **Testing**: Verify functionality works as expected
4. **Documentation**: Ensure docs are updated
5. **Merge**: Squash and merge (maintainers only)

### Merge Strategy

- **Small PRs**: Prefer multiple small PRs over one large PR
- **Focus**: Each PR should address one concern
- **Order**: Consider dependencies between PRs
- **Rebase**: Rebase on main before merging

## 🧪 Testing Requirements

### Test Coverage

- All new features must include tests
- Bug fixes should include regression tests
- Aim for meaningful coverage, not just high percentages

### Writing Tests

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class JokeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_random_joke_endpoint_returns_joke(): void
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
        // Empty jokes table
        $response = $this->get('/api/random-joke');

        $response->assertStatus(503)
            ->assertJson(['error' => 'No jokes available']);
    }
}
```

### Running Tests Locally

```bash
# All tests
./vendor/bin/phpunit

# Specific test file
./vendor/bin/phpunit tests/Feature/JokeControllerTest.php

# Specific test method
./vendor/bin/phpunit --filter test_random_joke_endpoint_returns_joke

# With coverage
./vendor/bin/phpunit --coverage-html coverage
```

## 📖 Documentation

### Code Documentation

```php
/**
 * Fetch and cache the Open Graph image from a URL.
 *
 * This method validates the URL, checks rate limits, fetches the target page,
 * extracts the OG image URL, downloads the image, and stores it locally.
 *
 * @param string $url The URL to fetch the OG image from
 * @return array{url: string} The local URL of the cached image
 * 
 * @throws \Illuminate\Validation\ValidationException If URL is invalid
 * @throws \Symfony\Component\HttpKernel\Exception\HttpException If fetch fails
 */
public function fetchOgImage(string $url): array
{
    // Implementation
}
```

### README Updates

Update relevant documentation files when:
- Adding new features
- Changing APIs
- Modifying configuration
- Updating dependencies

### API Documentation

Keep `API_DOCUMENTATION.md` updated with:
- New endpoints
- Changed request/response formats
- New parameters
- Error codes

## ❓ Questions?

If you have questions:

1. Check existing documentation
2. Search [closed issues](https://github.com/JoshuaAckerly/graveyardjokes/issues?q=is%3Aissue+is%3Aclosed)
3. Open a new issue with the `question` label
4. Reach out to maintainers

## 🙏 Thank You

Thank you for contributing to Graveyard Jokes! Your contributions help make this project better for everyone.

---

**Happy Coding! 🚀**
