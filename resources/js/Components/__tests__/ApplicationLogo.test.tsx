import React from 'react';
import { render, screen } from '@testing-library/react';
import ApplicationLogo from '../applicationLogo';

// Mock import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_ASSET_URL: 'https://cdn.example.com'
      }
    }
  }
});

describe('ApplicationLogo', () => {
  it('renders logo image with correct src', () => {
    render(<ApplicationLogo />);
    
    const img = screen.getByAltText('GraveYardJokes Studios Logo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://cdn.example.com/images/GraveYardJokesLogoJester.svg');
  });

  it('applies default logo size', () => {
    render(<ApplicationLogo />);
    
    const img = screen.getByAltText('GraveYardJokes Studios Logo');
    expect(img).toHaveClass('h-24', 'w-24');
  });

  it('applies custom logo size', () => {
    render(<ApplicationLogo logoSize="h-12 w-12" />);
    
    const img = screen.getByAltText('GraveYardJokes Studios Logo');
    expect(img).toHaveClass('h-12', 'w-12');
  });

  it('applies container classes', () => {
    render(<ApplicationLogo containerClasses="justify-center items-center" />);
    
    const container = screen.getByAltText('GraveYardJokes Studios Logo').parentElement;
    expect(container).toHaveClass('justify-center', 'items-center');
  });

  it('has correct alt text for accessibility', () => {
    render(<ApplicationLogo />);
    
    expect(screen.getByAltText('GraveYardJokes Studios Logo')).toBeInTheDocument();
  });
});