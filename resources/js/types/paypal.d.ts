// PayPal SDK Type Declarations
interface PayPalOrderActions {
    order: {
        create: (data: object) => Promise<string>;
        capture: () => Promise<unknown>;
    };
}

interface PayPalButtonsComponentOptions {
    createOrder?: (data: Record<string, unknown>, actions: PayPalOrderActions) => Promise<string> | string;
    onApprove?: (data: Record<string, unknown>, actions: PayPalOrderActions) => void | Promise<void>;
    onError?: (err: unknown) => void;
    // ...other PayPal button options as needed
}

interface PayPalButtonsComponent {
    render: (container: HTMLElement) => void;
}

interface PayPalSDK {
    Buttons: (options: PayPalButtonsComponentOptions) => PayPalButtonsComponent;
    Donate: (options: { env: string }) => { render: (container: HTMLElement) => void };
    HostedButtons: (options: { hostedButtonId: string }) => { render: (container: HTMLElement) => void };
}

interface Window {
    paypal?: PayPalSDK;
}
