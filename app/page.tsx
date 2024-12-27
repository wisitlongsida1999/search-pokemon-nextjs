// app/page.tsx

'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import Search from '../components/Search'
import Result from '../components/Result'
import { ApolloWrapper } from '../lib/apollo-wrapper'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { HomeIcon } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex justify-end mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/">
          <motion.button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HomeIcon className="mr-2" size={20} />
            Home
          </motion.button>
        </Link>
      </motion.div>
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
        <ApolloWrapper>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-32">
                <motion.div 
                  className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            }
          >
            <SearchParamsWrapper />
          </Suspense>
        </ApolloWrapper>
      </motion.div>
    </main>
  )
}

function SearchParamsWrapper() {
  const searchParams = useSearchParams()
  const pokemonName = searchParams.get('name')

  return pokemonName ? <Result name={pokemonName} /> : <Search />
}

