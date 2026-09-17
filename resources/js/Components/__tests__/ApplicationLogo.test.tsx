import { render, screen } from '@testing-library/react';
import ApplicationLogo from '../applicationLogo';

describe('ApplicationLogo', () => {
    it('renders the wordmark logo', () => {
        render(<ApplicationLogo />);

        const logo = screen.getByRole('img', { name: 'Graveyard Jokes' });
        expect(logo).toBeInTheDocument();
        expect(logo.tagName.toLowerCase()).toBe('svg');
    });

    it('applies default logo size', () => {
        render(<ApplicationLogo />);

        const logo = screen.getByRole('img', { name: 'Graveyard Jokes' });
        expect(logo).toHaveClass('h-24', 'w-24');
    });

    it('applies custom logo size', () => {
        render(<ApplicationLogo logoSize="h-12 w-12" />);

        const logo = screen.getByRole('img', { name: 'Graveyard Jokes' });
        expect(logo).toHaveClass('h-12', 'w-12');
    });

    it('applies container classes', () => {
        render(<ApplicationLogo containerClasses="justify-center items-center" />);

        const container = screen.getByRole('img', { name: 'Graveyard Jokes' }).parentElement;
        expect(container).toHaveClass('justify-center', 'items-center');
    });

    it('has an accessible name', () => {
        render(<ApplicationLogo />);

        expect(screen.getByRole('img', { name: 'Graveyard Jokes' })).toBeInTheDocument();
    });
});
