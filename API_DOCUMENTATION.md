# Graveyard Jokes API Documentation

## Overview

The Graveyard Jokes API provides endpoints for joke retrieval, contact form submissions, visitor tracking, and Open Graph image fetching. All endpoints return JSON responses unless otherwise specified.

**Base URL**: `https://graveyardjokes.com`

## Authentication

Currently, no authentication is required for public API endpoints.

## Rate Limiting

- **Open Graph Image Fetching**: 5-minute rate limit per URL
- **Visitor Tracking**: Throttled by IP and user agent combination

## API Endpoints

### 1. Random Joke

Retrieves a random joke from the jokes database.

**Endpoint**: `GET /api/random-joke`

**Response Format**:
```json
{
  "id": "string",
  "setup": "string", 
  "punchline": "string",
  "category": "string"
}
```

**Success Response** (200):
```json
{
  "id": "joke_001",
  "setup": "Why don't skeletons fight each other?",
  "punchline": "They don't have the guts!",
  "category": "graveyard"
}
```

**Error Responses**:
- `503 Service Unavailable`: No jokes available
- `500 Internal Server Error`: Invalid joke data

### 2. Open Graph Image Fetcher

Fetches and caches Open Graph images from external URLs.

**Endpoint**: `GET /api/fetch-og-image`

**Parameters**:
- `url` (required): The URL to fetch the Open Graph image from

**Example Request**:
```
GET /api/fetch-og-image?url=https://example.com
```

**Success Response** (200):
```json
{
  "url": "/storage/og-cache/abc123def456.jpg"
}
```

**Error Responses**:
- `422 Unprocessable Entity`: Invalid URL or private address
- `429 Too Many Requests`: Rate limited
- `502 Bad Gateway`: Failed to fetch target page or image
- `404 Not Found`: No image found on target page
- `500 Internal Server Error`: Server error

**Security Features**:
- SSRF protection against private/local addresses
- Rate limiting per URL
- Content type validation
- File size validation

### 3. Contact Form Submission

Submits a contact form message.

**Endpoint**: `POST /contact`

**Content-Type**: `application/x-www-form-urlencoded` or `application/json`

**Request Body**:
```json
{
  "first_name": "string (required, max: 255)",
  "last_name": "string (required, max: 255)", 
  "email": "string (required, valid email, max: 255)",
  "message": "string (required, max: 5000)"
}
```

**Success Response** (302):
Redirects back with success message: "Thank you! Your message has been sent."

**Error Response** (302):
Redirects back with error message: "There was a problem submitting your message."

**Validation Rules**:
- `first_name`: Required, string, maximum 255 characters
- `last_name`: Required, string, maximum 255 characters
- `email`: Required, valid email format, maximum 255 characters
- `message`: Required, string, maximum 5000 characters

### 4. Visitor Tracking

Tracks visitor information and location data.

**Endpoint**: `POST /track-visit` or `OPTIONS /track-visit`

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "referrer": "string (optional)",
  "subdomain": "string (optional)"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Visit tracked successfully",
  "data": {
    "ip": "192.168.1.1",
    "city": "New York",
    "country": "US",
    "region": "New York",
    "timezone": "America/New_York"
  }
}
```

**Error Response** (500):
```json
{
  "success": false,
  "message": "Tracking failed"
}
```

**CORS Support**:
- Handles OPTIONS preflight requests
- Returns appropriate CORS headers

**Location Data**:
- Uses IPInfo.io for geolocation
- Caches results for 1 hour
- Handles local development IPs gracefully

## Error Handling

All API endpoints follow consistent error response patterns:

### HTTP Status Codes
- `200 OK`: Successful request
- `302 Found`: Successful form submission (redirect)
- `404 Not Found`: Resource not found
- `410 Gone`: Resource permanently removed
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `502 Bad Gateway`: External service error
- `503 Service Unavailable`: Service temporarily unavailable

### Error Response Format
```json
{
  "error": "Error message description"
}
```

## Data Models

### Contact
```json
{
  "id": "integer",
  "first_name": "string",
  "last_name": "string", 
  "email": "string",
  "message": "text",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Location Data
```json
{
  "ip": "string",
  "city": "string",
  "country": "string", 
  "region": "string",
  "timezone": "string"
}
```

## Caching

### Jokes Data
- **Cache Key**: `jokes_data`
- **TTL**: 1 hour (3600 seconds)
- **Storage**: File-based cache

### Geolocation Data
- **Cache Key**: `geo_location_{ip}`
- **TTL**: 1 hour (3600 seconds)
- **Storage**: Laravel cache

### Open Graph Images
- **Cache Key**: `og_fetch_{md5(url)}`
- **TTL**: 5 minutes (300 seconds)
- **Storage**: Public disk under `og-cache/`

### Visitor Notifications
- **Cache Key**: `visitor_notification_sent_{hash}`
- **TTL**: 24 hours (configurable via `TRACK_VISITOR_EMAIL_TTL`)
- **Purpose**: Prevents duplicate email notifications

## Email Notifications

### Contact Form
- **Recipient**: admin@graveyardjokes.com
- **Template**: ContactMessage mailable
- **Trigger**: Every contact form submission

### Visitor Tracking
- **Recipient**: admin@graveyardjokes.com
- **Template**: NewVisitorNotification mailable
- **Trigger**: New unique visitors (throttled)
- **Throttling**: Based on IP + User Agent hash

## Security Considerations

### SSRF Protection
- Validates URLs to prevent access to private/local addresses
- Uses `filter_var()` with `FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE`

### Input Validation
- All form inputs are validated using Laravel validation rules
- Maximum length limits on all text fields
- Email format validation

### Rate Limiting
- Open Graph fetching: 5-minute cooldown per URL
- Visitor notifications: 24-hour cooldown per unique visitor

### Content Security
- Image content type validation
- File extension validation for cached images
- Timeout limits on external HTTP requests

## Configuration

### Environment Variables
```env
# Visitor tracking email throttling (seconds)
TRACK_VISITOR_EMAIL_TTL=86400

# Application URL for sitemap generation
APP_URL=https://graveyardjokes.com

# Mail configuration
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
```

### Storage Configuration
- **Public Disk**: Used for Open Graph image caching
- **Cache Driver**: Configured in `config/cache.php`
- **Session Driver**: Configured in `config/session.php`

## Testing

### Available Test Endpoints
- `GET /tracking-test`: Test page for visitor tracking functionality

### Test Data Location
- Jokes data: `storage/jokes.json`

## Quick Start

### Example: Fetching a Random Joke
```javascript
// Using fetch API
fetch('https://graveyardjokes.com/api/random-joke')
  .then(response => response.json())
  .then(joke => {
    console.log(`${joke.setup} - ${joke.punchline}`);
  })
  .catch(error => console.error('Error:', error));
```

```bash
# Using cURL
curl https://graveyardjokes.com/api/random-joke
```

### Example: Submitting Contact Form
```javascript
// Using fetch API
fetch('https://graveyardjokes.com/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  body: JSON.stringify({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    message: 'Hello, I would like to inquire about your services.'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Example: Tracking a Visit
```javascript
// Using fetch API
fetch('https://graveyardjokes.com/track-visit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    referrer: document.referrer,
    subdomain: window.location.hostname.split('.')[0]
  })
})
.then(response => response.json())
.then(data => console.log('Visit tracked:', data))
.catch(error => console.error('Error:', error));
```

## API Clients

### JavaScript/TypeScript
The API can be consumed using standard fetch API, axios, or any HTTP client.

### PHP
```php
use Illuminate\Support\Facades\Http;

// Fetch random joke
$response = Http::get('https://graveyardjokes.com/api/random-joke');
$joke = $response->json();
```

### Python
```python
import requests

# Fetch random joke
response = requests.get('https://graveyardjokes.com/api/random-joke')
joke = response.json()
print(f"{joke['setup']} - {joke['punchline']}")
```

## Best Practices

### Error Handling
Always implement proper error handling for API calls:
```javascript
async function fetchJoke() {
  try {
    const response = await fetch('/api/random-joke');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const joke = await response.json();
    return joke;
  } catch (error) {
    console.error('Failed to fetch joke:', error);
    // Implement fallback behavior
    return null;
  }
}
```

### Caching Responses
Consider caching API responses on the client side to reduce server load:
```javascript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedJoke() {
  const cached = localStorage.getItem('cached_joke');
  if (cached) {
    const { joke, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return joke;
    }
  }
  return null;
}

function cacheJoke(joke) {
  localStorage.setItem('cached_joke', JSON.stringify({
    joke,
    timestamp: Date.now()
  }));
}
```

### Rate Limit Handling
Implement exponential backoff for rate-limited requests:
```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

## Interactive Documentation

### Swagger UI
Access the interactive API documentation with try-it-out functionality:
- **URL**: [https://graveyardjokes.com/api/docs](https://graveyardjokes.com/api/docs)
- **OpenAPI Spec**: [https://graveyardjokes.com/openapi.yaml](https://graveyardjokes.com/openapi.yaml)

### Postman Collection
Import the OpenAPI specification into Postman for testing:
1. Open Postman
2. Click "Import"
3. Enter URL: `https://graveyardjokes.com/openapi.yaml`
4. Start testing endpoints

## Support

### Getting Help
- **GitHub Issues**: [https://github.com/JoshuaAckerly/graveyardjokes.com/issues](https://github.com/JoshuaAckerly/graveyardjokes.com/issues)
- **Email**: admin@graveyardjokes.com
- **Website**: [https://graveyardjokes.com/contact](https://graveyardjokes.com/contact)

### Reporting Bugs
When reporting bugs, please include:
- API endpoint being called
- Request parameters/body
- Expected vs actual response
- Error messages or status codes
- Browser/client information

## Changelog

### Version 1.0.0 (November 2025)
- Initial API implementation
- Random joke endpoint with JSON response
- Contact form submission with validation
- Visitor tracking with geolocation (IPInfo.io integration)
- Open Graph image fetching with SSRF protection
- CORS support for cross-origin requests
- Rate limiting on Open Graph fetching
- Email notifications for contacts and new visitors
- Swagger UI documentation
- OpenAPI 3.0 specification

---

*Last updated: November 22, 2025*