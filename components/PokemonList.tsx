//components/PokemonList.tsx


'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { GET_POKEMONS } from '../lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const ITEMS_PER_PAGE = 20

export default function PokemonList() {
  const [allPokemons, setAllPokemons] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { loading, error, data, fetchMore } = useQuery(GET_POKEMONS, {
    variables: { first: ITEMS_PER_PAGE },
  })

  useEffect(() => {
    if (data?.pokemons) {
      setAllPokemons(prevPokemons => {
        const newPokemons = data.pokemons.filter((pokemon: any) => 
          !prevPokemons.some(p => p.id === pokemon.id)
        );
        return [...prevPokemons, ...newPokemons];
      });
    }
  }, [data])

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    fetchMore({
      variables: {
        first: allPokemons.length + ITEMS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.pokemons.length === prev.pokemons.length) {
          setHasMore(false);
          return prev;
        }
        return {
          pokemons: fetchMoreResult.pokemons
        };
      }
    });
  }, [loading, hasMore, allPokemons.length, fetchMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMore();
        }
      },
      { 
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, loading, hasMore]);

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
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {allPokemons.map((pokemon: any) => (
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
      {loading && (
        <div className="flex justify-center items-center h-32 mt-8" aria-live="polite" aria-busy="true">
          <motion.div 
            className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
      {hasMore && <div ref={loadMoreRef} className="h-20" />}
      {!hasMore && <p className="text-center text-gray-500 mt-8">No more Pokémon to load</p>}
    </div>
  )
}

