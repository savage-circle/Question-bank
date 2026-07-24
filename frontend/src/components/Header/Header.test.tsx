import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Question Bank')).toBeInTheDocument();
  });
});
