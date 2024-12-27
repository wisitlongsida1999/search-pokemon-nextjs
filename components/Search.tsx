// components/Search.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useQuery } from '@apollo/client'
import { GET_ALL_POKEMONS } from '../lib/queries'
import PokemonList from './PokemonList'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

const TOTAL_POKEMONS = 151

const pokemonTypes = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground',
  'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
]

export default function Search() {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loading, error, data } = useQuery(GET_ALL_POKEMONS, {
    variables: { first: TOTAL_POKEMONS },
  })

  useEffect(() => {
    const name = searchParams.get('name')
    const types = searchParams.get('types')
    if (name) {
      setSearch(name)
    }
    if (types) {
      setSelectedTypes(types.split(','))
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchQuery = new URLSearchParams()
    if (search) searchQuery.set('name', search)
    if (selectedTypes.length) searchQuery.set('types', selectedTypes.join(','))
    router.push(`/?${searchQuery.toString()}`)
  }

  const handleTypeToggle = (types: string[]) => {
    setSelectedTypes(types)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedTypes([])
    router.push('/')
  }

  const filteredPokemons = data?.pokemons.filter((pokemon: any) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedTypes.length === 0 || selectedTypes.every(type => pokemon.types.includes(type)))
  ) || []

  return (
    <div>
      <motion.form 
        onSubmit={handleSearch} 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Pokémon"
            className="w-full px-4 py-2 pl-10 pr-4 text-white bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="mt-4 mb-4">
          <h3 className="text-white font-semibold mb-2">Filter by Type (Intersection)</h3>
          <ToggleGroup.Root
            type="multiple"
            className="flex flex-wrap gap-2"
            value={selectedTypes}
            onValueChange={handleTypeToggle}
          >
            {pokemonTypes.map((type) => (
              <ToggleGroup.Item
                key={type}
                value={type}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedTypes.includes(type)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>
        <div className="flex gap-2">
          <motion.button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
          <motion.button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.form>
      {error ? (
        <p className="text-center text-red-500" role="alert">Error: {error.message}</p>
      ) : (
        <>
          <p className="text-white mb-4">
            Showing {filteredPokemons.length} of {data?.pokemons.length || 0} Pokémon
          </p>
          <PokemonList loading={loading} pokemons={filteredPokemons} />
        </>
      )}
    </div>
  )
}

