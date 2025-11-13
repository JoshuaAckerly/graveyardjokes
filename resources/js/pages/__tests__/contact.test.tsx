import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPricing from '../contact';

// Mock Inertia
jest.mock('@inertiajs/react', () => ({
    Head: ({ children }: any) => <>{children}</>,
    router: {
        post: jest.fn(),
    },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
}));

// Mock MainLayout
jest.mock('@/Layouts/MainLayout', () => {
    return function MainLayout({ children }: any) {
        return <div data-testid="main-layout">{children}</div>;
    };
});

// Mock import.meta.env
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
    });

    it('renders pricing plans', () => {
        render(<ContactPricing />);

        expect(screen.getByText('Starter')).toBeInTheDocument();
        expect(screen.getByText('Professional')).toBeInTheDocument();
        expect(screen.getByText('Enterprise')).toBeInTheDocument();
    });

    it('renders contact form with all fields', () => {
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

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        await user.click(submitButton);

        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('A valid email is required')).toBeInTheDocument();
        expect(screen.getByText('Message is required')).toBeInTheDocument();
    });

    it('validates email format', async () => {
        const user = userEvent.setup();
        render(<ContactPricing />);

        await user.type(screen.getByLabelText('First Name'), 'John');
        await user.type(screen.getByLabelText('Last Name'), 'Doe');
        await user.type(screen.getByLabelText('Email'), 'invalid-email');
        await user.type(screen.getByLabelText('Message'), 'Test message');

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('A valid email is required')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
        const mockPost = jest.fn();
        const { router } = require('@inertiajs/react');
        router.post = mockPost;

        const user = userEvent.setup();
        render(<ContactPricing />);

        await user.type(screen.getByLabelText('First Name'), 'John');
        await user.type(screen.getByLabelText('Last Name'), 'Doe');
        await user.type(screen.getByLabelText('Email'), 'john@example.com');
        await user.type(screen.getByLabelText('Message'), 'Test message');

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(mockPost).toHaveBeenCalledWith(
            '/contact',
            {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                message: 'Test message',
            },
            expect.any(Object),
        );
    });

    it('renders social media links', () => {
        render(<ContactPricing />);

        const socialLinks = screen.getAllByRole('link').filter((link) => link.getAttribute('target') === '_blank');

        expect(socialLinks.length).toBeGreaterThan(0);
    });

    it('opens snapchat popup', async () => {
        const user = userEvent.setup();
        render(<ContactPricing />);

        const snapchatButton = screen.getByAltText('Snapchat').closest('button');
        await user.click(snapchatButton!);

        expect(screen.getByAltText('Snapchat Code')).toBeInTheDocument();
    });

    it('closes snapchat popup', async () => {
        const user = userEvent.setup();
        render(<ContactPricing />);

        // Open popup
        const snapchatButton = screen.getByAltText('Snapchat').closest('button');
        await user.click(snapchatButton!);

        // Close popup
        const closeButton = screen.getByText('✖');
        await user.click(closeButton);

        expect(screen.queryByAltText('Snapchat Code')).not.toBeInTheDocument();
    });
});
