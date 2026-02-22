import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import About from '../about';

Object.defineProperty(global, 'import', {
    value: {
        meta: {
            env: {
                VITE_ASSET_URL: 'https://cdn.example.com',
            },
        },
    },
});

describe('About Page', () => {
    beforeEach(() => {
        (global as any).fetch = jest.fn().mockImplementation(() => Promise.resolve({ ok: true }));
    });

    it('renders main heading', () => {
        render(<About />);

        expect(screen.getByText('About the Creator')).toBeInTheDocument();
    });

    it('renders profile image from CDN', () => {
        render(<About />);

        const profileImage = screen.getByAltText("Joshua Ackerly's profile picture");
        expect(profileImage).toBeInTheDocument();
        expect(profileImage.getAttribute('src')).toContain('/images/profileImage.webp');
    });

    it('renders resume download link', () => {
        render(<About />);

        const resumeLink = screen.getByRole('link', { name: /Download My Resume/i });
        expect(resumeLink).toBeInTheDocument();
        expect(resumeLink.getAttribute('href')).toContain('/documents/Joshua.pdf');
    });
});
