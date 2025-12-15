// PayPal SDK Type Declarations
interface Window {
    paypal?: {
        Donate: (options: { env: string }) => {
            render: (container: HTMLElement) => void;
        };
        HostedButtons: (options: { hostedButtonId: string }) => {
            render: (container: HTMLElement) => void;
        };
    };
}
