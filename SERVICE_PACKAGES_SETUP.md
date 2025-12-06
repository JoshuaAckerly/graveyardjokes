# Service Packages Setup

Your services page is now live at `/services` with PayPal integration for each package.

## Current Setup

✅ **Services page created** - Shows three service packages with PayPal buttons
✅ **Navigation updated** - Services link added to desktop and mobile menus
✅ **Route configured** - `/services` now renders the services page
✅ **PayPal SDK integrated** - Hosted buttons render for each package

## Adding More Packages or Updating Existing Ones

### Step 1: Create Hosted Buttons in PayPal

For each package you want to offer:

1. Log into your PayPal Business account
2. Go to: https://www.paypal.com/merchantapps/appcenter/acceptpayments/pay-now
3. Click "Create new button"
4. Choose button type: **"Buy Now"** or **"Subscribe"** (for recurring)
5. Fill in:
   - Button name (e.g., "Professional Package")
   - Price
   - Currency (USD)
   - Add item details
6. Click "Create Button"
7. Copy the `hosted_button_id` from the generated code

**Example code PayPal gives you:**
```html
<div id="paypal-container-ABC123XYZ"></div>
<script>
  paypal.HostedButtons({
    hostedButtonId: "ABC123XYZ",  ← Copy this ID
  }).render("#paypal-container-ABC123XYZ")
</script>
```

### Step 2: Update the Services Page

Edit: `resources/js/pages/services.tsx`

Find the `packages` array (around line 8) and update the `hostedButtonId` values:

```typescript
const packages = [
    {
        title: 'Starter Package',
        price: '$500',
        description: 'Perfect for artists and musicians starting their online presence',
        features: [
            'Single-page responsive website',
            'Contact form integration',
            // ... more features
        ],
        hostedButtonId: 'YOUR_BUTTON_ID_HERE', // ← Replace with your actual button ID
        popular: false,
    },
    // ... more packages
];
```

### Step 3: Add New Packages

To add a new package, add another object to the array:

```typescript
{
    title: 'New Package Name',
    price: '$1,000',
    description: 'Short description of what this includes',
    features: [
        'Feature 1',
        'Feature 2',
        'Feature 3',
        'And more...',
    ],
    hostedButtonId: 'YOUR_NEW_BUTTON_ID',
    popular: false, // Set to true to add "Most Popular" badge
},
```

### Step 4: Customize Appearance

**Change colors or styling:**
Edit `resources/js/Components/ServicePackageCard.tsx`

**Change layout:**
- The grid is in `resources/js/pages/services.tsx` 
- Currently: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- For 4 items: Change to `lg:grid-cols-4`
- For 2 items: Change to `lg:grid-cols-2`

## Testing

1. Create a test button in PayPal with a $0.01 or $1.00 price
2. Add the button ID to your services page
3. Visit: `https://graveyardjokes.test/services`
4. Click the PayPal button
5. Complete a test purchase (you can refund it later)

## Current Button ID

Your current hosted button ID from PayPal is: **3C9XAYVTPYJM6**

This is currently used for all three packages. You should create separate buttons for each package with their respective prices.

## Pricing Structure Reference

Current packages configured:
- **Starter**: $500
- **Professional**: $1,200 (marked as popular)
- **Premium**: $2,500+

## Button Types

### One-Time Payment
Use "Buy Now" button type in PayPal for one-time project payments.

### Recurring Payments
For monthly retainer or hosting packages, use "Subscribe" button type with recurring billing.

### Donations
The donation button on the About page uses a different setup (simple donation flow).

## Important Notes

- Each package should have its own unique `hostedButtonId`
- All buttons must be created in the same PayPal account: `admin@graveyardjokes.com`
- The PayPal SDK is already loaded globally (no need to add it again)
- Test all buttons before going live
- PayPal handles all payment processing - no sensitive data in your app

## Troubleshooting

**Button not showing:**
- Check browser console for errors
- Verify the `hostedButtonId` is correct
- Ensure PayPal SDK loaded (check Network tab)

**Wrong price showing:**
- Each button must be created in PayPal with the correct price
- You can't override the price from your code (security feature)

**Button rendering in wrong place:**
- Each button needs a unique container ID
- The component handles this automatically

## Next Steps

1. Create individual hosted buttons for each package in PayPal
2. Replace the placeholder `hostedButtonId` values in `services.tsx`
3. Test each button
4. Deploy to production
