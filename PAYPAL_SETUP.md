# PayPal Donation Button Setup

A PayPal donation button with SDK integration has been added to your site in two locations:
1. **About Page** - Full donation card with PayPal SDK button and description
2. **Footer** - Compact "Support Us" button on every page

## ✅ Already Configured

The PayPal SDK is already integrated with your client ID:
- SDK script added to `resources/views/app.blade.php`
- Client ID: `BAAEThXfkghKIa87QQOlnsIur64eOCnBLuAxJeYWYDW5o366RczxK2o9F8DtrXnte6SY65yJRFso_mMA2o`
- Venmo funding enabled
- Currency: USD

## How It Works

### Default Variant (About Page)
- Uses the official PayPal SDK to render a native PayPal donation button
- Provides a seamless, secure donation experience
- Includes a fallback button if the SDK fails to load
- Supports multiple payment methods including Venmo

### Compact/Footer Variants
- Custom styled buttons that open PayPal in a new window
- Uses your PayPal email: `admin@graveyardjokes.com`
- Maintains brand consistency with your theme

## Optional: Create a Hosted Button

For more customization, you can create a custom hosted button:

1. Log into your PayPal account
2. Go to: https://www.paypal.com/donate/buttons
3. Create a new donation button with custom amounts, descriptions, etc.
4. Copy the `hosted_button_id` from the generated code

Then use it in your component:
```tsx
<PayPalDonateButton hostedButtonId="YOUR_BUTTON_ID" />
```

## Configuration Options

### Update PayPal Email

Edit `resources/js/Components/PayPalDonateButton.tsx` line 40:
```typescript
const paypalUrl = 'https://www.paypal.com/donate/?business=admin@graveyardjokes.com&currency_code=USD';
```

### SDK Configuration

The SDK is loaded in `resources/views/app.blade.php`:
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&components=hosted-buttons&enable-funding=venmo&currency=USD"></script>
```

Options you can modify:
- `enable-funding`: Add payment methods (venmo, paylater, etc.)
- `disable-funding`: Remove payment methods (credit, card, etc.)
- `currency`: Change currency code (USD, EUR, GBP, etc.)
- `locale`: Change language/region (en_US, en_GB, etc.)

## Testing

1. Run development server: `npm run dev`
2. Visit: `http://localhost/about`
3. You should see:
   - PayPal's official button rendered on the About page
   - A "Support Us" button in the footer
4. Click to verify it opens the donation flow correctly

## Button Variants

The component supports three variants:

- **`default`** - Full card with heading and description (used on About page)
- **`compact`** - Medium-sized button with heart icon
- **`footer`** - Small button for footer (currently used)

To use different variants, import and use:
```tsx
<PayPalDonateButton variant="default" />
<PayPalDonateButton variant="compact" />
<PayPalDonateButton variant="footer" />
```

## Customization

You can customize the button appearance by:
- Editing the classes in `PayPalDonateButton.tsx`
- Changing the text/messaging
- Adding your own icons or styling
- Modifying the animation effects

The button uses:
- Framer Motion for animations
- Lucide React for the heart icon
- Tailwind CSS for styling
- Your existing CSS custom properties for theme colors

## Security Note

The button opens PayPal in a new window with `noopener,noreferrer` for security. No sensitive data is stored in your application.
