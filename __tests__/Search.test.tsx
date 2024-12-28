import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import Search from '../components/Search'
import { GET_ALL_POKEMONS } from '../lib/queries'

// Mock the useRouter and useSearchParams hooks
const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

const mocks = [
  {
    request: {
      query: GET_ALL_POKEMONS,
      variables: { first: 151 },
    },
    result: {
      data: {
        pokemons: [
          { id: '001', name: 'Bulbasaur', types: ['Grass', 'Poison'], image: 'bulbasaur.jpg' },
          { id: '004', name: 'Charmander', types: ['Fire'], image: 'charmander.jpg' },
          { id: '007', name: 'Squirtle', types: ['Water'], image: 'squirtle.jpg' },
        ],
      },
    },
  },
]

describe('Search Component', () => {
  it('renders a search input and button', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Search />
      </MockedProvider>
    )
    expect(screen.getByPlaceholderText('Search Pokémon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('updates input value when typed', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Search />
      </MockedProvider>
    )
    const input = screen.getByPlaceholderText('Search Pokémon')
    fireEvent.change(input, { target: { value: 'Pikachu' } })
    expect(input).toHaveValue('Pikachu')
  })

  it('calls router.push with correct query on form submission', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Search />
      </MockedProvider>
    )
  
    const input = screen.getByPlaceholderText('Search Pokémon')
    const button = screen.getByRole('button', { name: 'Search' })
  
    fireEvent.change(input, { target: { value: 'Charizard' } })
    fireEvent.click(button)
  
    expect(pushMock).toHaveBeenCalledWith('/?name=Charizard')
  })

  it('displays filtered Pokémon list when typing', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Search />
      </MockedProvider>
    )

    const input = screen.getByPlaceholderText('Search Pokémon')
    fireEvent.change(input, { target: { value: 'Char' } })

    const charmander = await screen.findByText('Charmander')
    expect(charmander).toBeInTheDocument()
    expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument()
    expect(screen.queryByText('Squirtle')).not.toBeInTheDocument()
  })
})

