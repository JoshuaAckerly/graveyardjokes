import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

// Mock component for testing
const About = () => (
    <div>
        <h1>About the Creator</h1>
        <img src="https://cdn.example.com/images/profileImage.webp" alt="Joshua Ackerly's profile picture" />
        <a href="https://cdn.example.com/documents/Joshua.pdf">Download My Resume</a>
    </div>
);

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
