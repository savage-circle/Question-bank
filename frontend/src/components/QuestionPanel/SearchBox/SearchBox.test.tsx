import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SearchBox from "./SearchBox.tsx";

describe('SearchBox', () => {
  it('renders the search input', () => {
    render(<SearchBox value="" onChange={vi.fn()} />);

    expect(
      screen.getByPlaceholderText('Search...'),
    ).toBeInTheDocument();
  });

  it('displays the provided search value', () => {
    render(
      <SearchBox
        value="dependency"
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByDisplayValue('dependency'),
    ).toBeInTheDocument();
  });

  it('calls onChange with the entered value', () => {
    const onChange = vi.fn();

    render(
      <SearchBox
        value=""
        onChange={onChange}
      />,
    );

    const searchInput = screen.getByPlaceholderText('Search...');

    fireEvent.change(searchInput, {
      target: { value: 'java' },
    });

    expect(onChange).toHaveBeenCalledWith('java');
  });
});