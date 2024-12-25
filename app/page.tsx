// app/page.tsx
'use client'

import { Suspense } from 'react'
import Search from '../components/Search'
import Result from '../components/Result'
import { ApolloWrapper } from '../lib/apollo-wrapper'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const searchParams = useSearchParams()
  const pokemonName = searchParams.get('name')

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
        className="max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Search />
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
            {pokemonName && <Result name={pokemonName} />}
          </Suspense>
        </ApolloWrapper>
      </motion.div>
    </main>
  )
}

