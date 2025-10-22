import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from '../pages/home';

describe('HomePage', () => {
  it('renders increment button', () => {
    render(<HomePage />);
    expect(screen.getByText('Increment count')).toBeInTheDocument();
  });

  it('displays initial count', () => {
    render(<HomePage />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
});
