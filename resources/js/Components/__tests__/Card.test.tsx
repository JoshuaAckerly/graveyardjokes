import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple Card component for testing
interface CardProps {
    title: string;
    description: string;
    imageUrl?: string;
    href?: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, href }) => {
    const content = (
        <div className="card" data-testid="card">
            {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
            </div>
        </div>
    );

    if (href) {
        return (
            <a href={href} className="card-link">
                {content}
            </a>
        );
    }

    return content;
};

describe('Card Component', () => {
    const defaultProps = {
        title: 'Test Card',
        description: 'This is a test card description',
    };

    it('renders card with title and description', () => {
        render(<Card {...defaultProps} />);

        expect(screen.getByText('Test Card')).toBeInTheDocument();
        expect(screen.getByText('This is a test card description')).toBeInTheDocument();
        expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('renders image when imageUrl is provided', () => {
        render(<Card {...defaultProps} imageUrl="/test-image.jpg" />);

        const image = screen.getByAltText('Test Card');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', '/test-image.jpg');
        expect(image).toHaveClass('card-image');
    });

    it('does not render image when imageUrl is not provided', () => {
        render(<Card {...defaultProps} />);

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('renders as link when href is provided', () => {
        render(<Card {...defaultProps} href="/test-link" />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/test-link');
        expect(link).toHaveClass('card-link');
    });

    it('does not render as link when href is not provided', () => {
        render(<Card {...defaultProps} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
        render(<Card {...defaultProps} />);

        expect(screen.getByTestId('card')).toHaveClass('card');
        expect(screen.getByText('Test Card')).toHaveClass('card-title');
        expect(screen.getByText('This is a test card description')).toHaveClass('card-description');
    });
});
