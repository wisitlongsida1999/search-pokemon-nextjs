//components/PokemonList.tsx

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Pokemon {
  id: string
  name: string
  image: string
  types: string[]
}

interface PokemonListProps {
  loading: boolean
  pokemons: Pokemon[]
}

export default function PokemonList({ loading, pokemons }: PokemonListProps) {
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
            {pokemons.map((pokemon) => (
              <motion.div key={`${pokemon.id}-${pokemon.name}`} variants={itemVariants} layout>
                <Link href={`/?name=${pokemon.name}`}>
                  <motion.div 
                    className="bg-gray-800 p-4 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-2 relative">
                      <Image
                        src={pokemon.image}
                        alt={pokemon.name}
                        fill
                        sizes="(max-width: 768px) 96px, 96px"
                        className="object-contain"
                        priority
                      />
                    </div>
                    <h3 className="text-white font-semibold text-lg">{pokemon.name}</h3>
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-pink-600 text-white"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
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

