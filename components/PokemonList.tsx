//components/PokemonList.tsx

'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ALL_POKEMONS } from '../lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_POKEMONS = 151 // Assuming we want to fetch all original 151 Pokémon

export default function PokemonList() {
  const [searchTerm, setSearchTerm] = useState('')
  const { loading, error, data } = useQuery(GET_ALL_POKEMONS, {
    variables: { first: TOTAL_POKEMONS },
  })

  const filteredPokemons = data?.pokemons.filter((pokemon: any) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (error) return <p className="text-center text-red-500" role="alert">Error: {error.message}</p>

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
          <motion.div 
            className="h-16 w-16 border-t-4 border-b-4 border-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredPokemons.map((pokemon: any) => (
              <motion.div key={`${pokemon.id}-${pokemon.name}`} variants={itemVariants} layout>
                <Link href={`/?name=${pokemon.name}`}>
                  <motion.div 
                    className="bg-gray-800 p-4 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={100}
                      height={100}
                      className="mx-auto mb-2"
                    />
                    <h3 className="text-white font-semibold text-lg">{pokemon.name}</h3>
                    <p className="text-gray-400 text-sm">{pokemon.types.join(', ')}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}


