// app/page.tsx
'use client'

'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import Search from '../components/Search'
import Result from '../components/Result'
import PokemonList from '../components/PokemonList'
import { ApolloWrapper } from '../lib/apollo-wrapper'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const searchParams = useSearchParams()
  const pokemonName = searchParams.get('name')
  const [showList, setShowList] = useState(!pokemonName)

  useEffect(() => {
    const handlePokemonSearched = () => setShowList(false)
    window.addEventListener('pokemonSearched', handlePokemonSearched)
    return () => window.removeEventListener('pokemonSearched', handlePokemonSearched)
  }, [])

  useEffect(() => {
    setShowList(!pokemonName)
  }, [pokemonName])

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex items-center justify-center mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src="/pokeball.png"
            alt="Pokéball"
            width={60}
            height={60}
            className="mr-4"
          />
        </motion.div>
        <motion.h1 
          className="text-5xl font-bold text-center text-white neon-text"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          PokéSearch
        </motion.h1>
      </motion.div>
      <motion.div 
        className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Search />
        <div className="mt-4 mb-8 flex justify-center">
          <motion.button
            className={`px-4 py-2 rounded-full mr-2 ${showList ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setShowList(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Pokémon
          </motion.button>
          <motion.button
            className={`px-4 py-2 rounded-full ${!showList ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setShowList(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search Result
          </motion.button>
        </div>
        <ApolloWrapper>
          <Suspense fallback={
            <div className="flex justify-center items-center h-32">
              <motion.div 
                className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          }>
            {showList ? (
              <PokemonList />
            ) : (
              pokemonName && <Result name={pokemonName} />
            )}
          </Suspense>
        </ApolloWrapper>
      </motion.div>
    </main>
  )
}

