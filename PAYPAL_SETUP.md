# PayPal Setup Guide

## For Local Development (Sandbox)

The 403 `NOT_AUTHORIZED` error usually means your Checkout button is using the wrong client ID (for example a Hosted Buttons ID) or the wrong environment. For local testing, use PayPal sandbox credentials.

### Step 1: Create a PayPal Sandbox App

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal business account
3. Click "Apps & Credentials" in the left sidebar
4. Click "Create App" under "Sandbox"
5. Choose "Merchant" as the app type
6. Name your app (e.g., "Graveyard Jokes Local Development")
7. Click "Create App"

### Step 2: Get Your Sandbox Client ID

1. After creating the app, you'll see your **Client ID** in the "Sandbox API Credentials" section
2. Copy this Client ID (it will start with "AZ...")

### Step 3: Configure Environment Variables

Update your `.env` file with the sandbox credentials:

```env
# PayPal Configuration
VITE_PAYPAL_CLIENT_ID=YOUR_PAYPAL_LIVE_CLIENT_ID_HERE
VITE_PAYPAL_CHECKOUT_CLIENT_ID=YOUR_PAYPAL_CHECKOUT_LIVE_CLIENT_ID_HERE
VITE_PAYPAL_SANDBOX_CLIENT_ID=AZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_PAYPAL_ENVIRONMENT=sandbox
```

**Important:**
- `VITE_PAYPAL_CHECKOUT_CLIENT_ID` must be a REST app client ID from PayPal Developer Dashboard (`Apps & Credentials`) for `window.paypal.Buttons` checkout orders.
- Do not use a Hosted Buttons-specific ID for checkout orders.
- Use `VITE_PAYPAL_ENVIRONMENT=sandbox` for local development.

### Step 4: Test the Integration

1. Restart your development server: `npm run dev`
2. Visit your services page
3. Click a PayPal button
4. You should now be able to test payments using sandbox PayPal accounts

### Step 5: Switch Back to Production

When deploying to production, change the environment back:

```env
VITE_PAYPAL_ENVIRONMENT=production
```

## Current Production Setup

PayPal SDK configuration is loaded by `resources/js/lib/paypalSdk.ts` and uses:
- `VITE_PAYPAL_CHECKOUT_CLIENT_ID` (preferred for checkout buttons)
- fallback: `VITE_PAYPAL_CLIENT_ID`
- `VITE_PAYPAL_ENVIRONMENT`

## Troubleshooting

**Still getting 403 errors?**
- Make sure `VITE_PAYPAL_ENVIRONMENT=sandbox` in your `.env`
- Verify your sandbox client ID is correct
- Check that your PayPal developer account is active
- Confirm `VITE_PAYPAL_CHECKOUT_CLIENT_ID` is a REST app client ID from PayPal Developer Dashboard
- Share the PayPal Correlation ID (`Corr ID`) with PayPal support for account-level permission issues

**Buttons not showing?**
- Clear your browser cache
- Check browser console for JavaScript errors
- Ensure the PayPal SDK script is loading

**Payments not processing?**
- Sandbox payments use fake money
- Use test PayPal accounts from your developer dashboard
- Check the auth-system logs for payment confirmations

## How It Works

### Default Variant (About Page)
- Uses the official PayPal SDK to render a native PayPal donation button
- Provides a seamless, secure donation experience
- Includes a fallback button if the SDK fails to load
- Supports multiple payment methods including Venmo

### Compact/Footer Variants
- Custom styled buttons that open PayPal in a new window
- Uses your PayPal email: `dev@graveyardjokes.com`
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
const paypalUrl = 'https://www.paypal.com/donate/?business=dev@graveyardjokes.com&currency_code=USD';
```

### SDK Configuration

The SDK is loaded dynamically by `resources/js/lib/paypalSdk.ts`.

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
