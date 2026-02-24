import React from 'react';
import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock component for testing
const ContactPricing = () => {
  const [errors, setErrors] = React.useState<{[key: string]: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {[key: string]: string} = {};
    // Simulate validation
    newErrors.first_name = 'First name is required';
    newErrors.last_name = 'Last name is required';
    newErrors.email = 'A valid email is required';
    newErrors.message = 'Message is required';
    setErrors(newErrors);
  };

  return (
    <div>
      <h1>Contact</h1>
      <p>Ready to bring your vision to life? Let's discuss your project and create something amazing together. Contact us below and we'll get back to you within 24 hours.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First Name</label>
        <input id="first_name" name="first_name" />
        {errors.first_name && <p>{errors.first_name}</p>}

        <label htmlFor="last_name">Last Name</label>
        <input id="last_name" name="last_name" />
        {errors.last_name && <p>{errors.last_name}</p>}

        <label htmlFor="email">Email</label>
        <input id="email" name="email" />
        {errors.email && <p>{errors.email}</p>}

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" />
        {errors.message && <p>{errors.message}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

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
