import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

let ContactPricing: (typeof import('../contact'))['default'];

beforeAll(async () => {
    ContactPricing = (await import('../contact')).default;
});

Object.defineProperty(global, 'import', {
    value: {
        meta: {
            env: {
                VITE_ASSET_URL: 'https://cdn.example.com',
            },
        },
    },
});

describe('ContactPricing', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global as any).fetch = jest.fn().mockImplementation(() => Promise.resolve({ ok: true }));
    });

    it('renders contact heading and call-to-action text', () => {
        render(<ContactPricing />);

        expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
        expect(screen.getByText(/Ready to bring your vision to life/i)).toBeInTheDocument();
    });

    it('renders contact form with required fields', () => {
        render(<ContactPricing />);

        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(<ContactPricing />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('A valid email is required')).toBeInTheDocument();
        expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
});
