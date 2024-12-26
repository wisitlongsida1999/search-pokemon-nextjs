import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Search from '../components/Search'

// Mock the useRouter hook
jest.mock('next/navigation', () => {
  const push = jest.fn();
  return {
    useRouter: () => ({
      push,
    }),
    useSearchParams: () => ({
      get: jest.fn(),
    }),
  };
});


describe('Search Component', () => {
  it('renders a search input and button', () => {
    render(<Search />)
    expect(screen.getByPlaceholderText('Search Pokémon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('updates input value when typed', () => {
    render(<Search />)
    const input = screen.getByPlaceholderText('Search Pokémon')
    fireEvent.change(input, { target: { value: 'Pikachu' } })
    expect(input).toHaveValue('Pikachu')
  })

  it('calls router.push with correct query on form submission', () => {
    const { useRouter } = require('next/navigation');
    const router = useRouter(); // ดึง router mock มาใช้
    render(<Search />);
  
    const input = screen.getByPlaceholderText('Search Pokémon');
    const button = screen.getByRole('button', { name: 'Search' });
  
    fireEvent.change(input, { target: { value: 'Charizard' } });
    fireEvent.click(button);
  
    expect(router.push).toHaveBeenCalledWith('/?name=Charizard');
  });
  
})

