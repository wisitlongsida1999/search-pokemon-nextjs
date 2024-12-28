import React from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import Result from '../components/Result'
import { GET_POKEMON } from '../lib/queries'

const mocks = [
  {
    request: {
      query: GET_POKEMON,
      variables: { name: 'Pikachu' },
    },
    result: {
      data: {
        pokemon: {
          id: '025',
          number: '025',
          name: 'Pikachu',
          types: ['Electric'],
          classification: 'Mouse Pokémon',
          height: { minimum: '0.35m', maximum: '0.45m' },
          weight: { minimum: '5.25kg', maximum: '6.75kg' },
          image: 'https://img.pokemondb.net/artwork/pikachu.jpg',
          attacks: {
            fast: [{ name: 'Quick Attack', type: 'Normal', damage: 8 }],
            special: [{ name: 'Thunderbolt', type: 'Electric', damage: 55 }],
          },
          evolutions: [
            {
              id: '026',
              number: '026',
              name: 'Raichu',
              image: 'https://img.pokemondb.net/artwork/raichu.jpg',
            },
          ],
        },
      },
    },
  },
];

// Mock the useRouter and useSearchParams hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

describe('Result Component', () => {
  it('renders loading state', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Result name="Pikachu" />
      </MockedProvider>
    )
    expect(screen.getByRole('status')).toHaveTextContent('Loading...')
  })

  it('renders Pokémon data after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Result name="Pikachu" />
      </MockedProvider>
    )

    // Wait for the data to load
    const pikachuHeading = await screen.findByRole('heading', { name: 'Pikachu' })
    expect(pikachuHeading).toBeInTheDocument()

    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Electric')).toBeInTheDocument()
    expect(screen.getByText('Classification')).toBeInTheDocument()
    expect(screen.getByText('Mouse Pokémon')).toBeInTheDocument()
    expect(screen.getByText('Quick Attack - Damage: 8')).toBeInTheDocument()
    expect(screen.getByText('Thunderbolt - Damage: 55')).toBeInTheDocument()
    expect(screen.getByText('Raichu')).toBeInTheDocument()
  })

  it('renders error state', async () => {
    const errorMock = [
      {
        request: {
          query: GET_POKEMON,
          variables: { name: 'InvalidPokemon' },
        },
        error: new Error('An error occurred'),
      },
    ]

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <Result name="InvalidPokemon" />
      </MockedProvider>
    )

    const errorMessage = await screen.findByText('An error occurred while searching for "InvalidPokemon".')
    expect(errorMessage).toBeInTheDocument()
  })
})

