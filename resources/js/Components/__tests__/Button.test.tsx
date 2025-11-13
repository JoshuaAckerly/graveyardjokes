import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

// Simple Button component for testing
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled = false, variant = 'primary' }) => (
    <button onClick={onClick} disabled={disabled} className={`btn btn-${variant}`} data-testid="button">
        {children}
    </button>
);

describe('Button Component', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>);

        expect(screen.getByText('Click me')).toBeInTheDocument();
        expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByTestId('button'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled button</Button>);

        expect(screen.getByTestId('button')).toBeDisabled();
    });

    it('applies correct variant class', () => {
        render(<Button variant="secondary">Secondary button</Button>);

        expect(screen.getByTestId('button')).toHaveClass('btn-secondary');
    });

    it('applies primary variant by default', () => {
        render(<Button>Primary button</Button>);

        expect(screen.getByTestId('button')).toHaveClass('btn-primary');
    });
});
