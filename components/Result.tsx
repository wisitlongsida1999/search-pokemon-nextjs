// components/Result.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GET_POKEMON, GET_ALL_POKEMONS } from '../lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon, ArrowRight } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'

const TOTAL_POKEMONS = 151

export default function Result({ name }: { name: string }) {
  const [search, setSearch] = useState(name)
  const [showDropdown, setShowDropdown] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  const router = useRouter()
  const searchParams = useSearchParams()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { loading, error, data } = useQuery(GET_POKEMON, {
    variables: { name },
  })
  const { data: allPokemonData } = useQuery(GET_ALL_POKEMONS, {
    variables: { first: TOTAL_POKEMONS },
  })

  useEffect(() => {
    const pokemonName = searchParams.get('name')
    if (pokemonName) {
      setSearch(pokemonName)
    }
  }, [searchParams])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?name=${encodeURIComponent(search)}`)
    setShowDropdown(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setShowDropdown(true)
  }

  const filteredPokemons = allPokemonData?.pokemons.filter((pokemon: any) =>
    pokemon.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-6">
        <motion.form 
          onSubmit={handleSearch} 
          className="mb-6 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <motion.input
              type="text"
              value={search}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search Pokémon"
              className="w-full px-4 py-2 pl-10 pr-4 text-white bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <AnimatePresence>
            {showDropdown && filteredPokemons.length > 0 && (
              <motion.div
                ref={dropdownRef}
                className="absolute z-10 w-full mt-1 bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {filteredPokemons.map((pokemon: any) => (
                  <div
                    key={pokemon.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-600 text-white"
                    onClick={() => {
                      setSearch(pokemon.name)
                      setShowDropdown(false)
                      router.push(`/?name=${encodeURIComponent(pokemon.name)}`)
                    }}
                  >
                    {pokemon.name}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            type="submit"
            className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </motion.form>

        {loading ? (
          <motion.div 
            className="flex justify-center items-center h-64"
            variants={itemVariants}
          >
            <div className="h-16 w-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center text-red-500"
            variants={itemVariants}
          >
            <p>An error occurred while searching for "{name}".</p>
            <p>Please try another Pokémon name.</p>
          </motion.div>
        ) : !data || !data.pokemon ? (
          <motion.div 
            className="text-center text-yellow-500"
            variants={itemVariants}
          >
            <p>No Pokémon found with the name "{name}".</p>
            <p>Please check the spelling and try again.</p>
          </motion.div>
        ) : (
          <>
            <motion.h2 
              className="text-3xl font-bold mb-4 text-center text-white"
              variants={itemVariants}
            >
              {data.pokemon.name}
            </motion.h2>
            <motion.div 
              className="flex justify-center mb-6"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src={data.pokemon.image}
                  alt={data.pokemon.name}
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-yellow-400 shadow-lg"
                />
              </motion.div>
            </motion.div>
            <motion.div 
              className="grid grid-cols-2 gap-4 mb-6"
              variants={containerVariants}
            >
              <InfoCard title="Type" content={data.pokemon.types.join(', ')} />
              <InfoCard title="Classification" content={data.pokemon.classification} />
              <InfoCard title="Height" content={`${data.pokemon.height.minimum} - ${data.pokemon.height.maximum}`} />
              <InfoCard title="Weight" content={`${data.pokemon.weight.minimum} - ${data.pokemon.weight.maximum}`} />
            </motion.div>
            
            <motion.h3 
              className="text-2xl font-semibold mt-6 mb-4 text-white"
              variants={itemVariants}
            >
              Attacks
            </motion.h3>
            <motion.div 
              className="grid grid-cols-2 gap-4"
              variants={containerVariants}
            >
              <AttackList title="Fast Attacks" attacks={data.pokemon.attacks.fast} />
              <AttackList title="Special Attacks" attacks={data.pokemon.attacks.special} />
            </motion.div>
            
            {data.pokemon.evolutions && (
              <>
                <motion.h3 
                  className="text-2xl font-semibold mt-6 mb-4 text-white"
                  variants={itemVariants}
                >
                  Evolution Chain
                </motion.h3>
                <motion.div 
                  className="flex flex-wrap justify-center items-center gap-4"
                  variants={containerVariants}
                >
                  <EvolutionChain pokemon={data.pokemon} />
                </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

function InfoCard({ title, content }: { title: string, content: string }) {
  return (
    <motion.div 
      className="bg-gray-700 p-3 rounded-lg"
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      }}
      whileHover={{ scale: 1.05 }}
    >
      <p className="font-semibold text-gray-300">{title}</p>
      <p className="text-white">{content}</p>
    </motion.div>
  )
}

function AttackList({ title, attacks }: { title: string, attacks: any[] }) {
  return (
    <motion.div 
      className="bg-gray-700 p-4 rounded-lg"
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      }}
      whileHover={{ scale: 1.02 }}
    >
      <h4 className="font-semibold mb-2 text-gray-300">{title}</h4>
      <ul className="list-disc list-inside">
        {attacks.map((attack: any) => (
          <motion.li 
            key={attack.name} 
            className="text-white"
            whileHover={{ x: 5 }}
          >
            {attack.name} - Damage: {attack.damage}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

function EvolutionChain({ pokemon }: { pokemon: any }) {
  const renderEvolution = (evo: any, level: number) => {
    const key = `${evo.id}-${level}`
    
    return (
      <div key={key} className="flex flex-row items-center justify-center">
        <EvolutionCard evolution={evo} isCurrent={level === 0} />
        {evo.evolutions && evo.evolutions.length > 0 && (
          <>
            <div className="flex flex-col items-center mx-4">
              <ArrowRight className="text-blue-400" size={24} />
              <p className="text-sm text-gray-400 text-center">
                {evo.evolutionRequirements?.amount} {evo.evolutionRequirements?.name}
              </p>
            </div>
            {renderEvolution(evo.evolutions[0], level + 1)}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-start min-w-max px-4">
        {renderEvolution(pokemon, 0)}
      </div>
    </div>
  )
}

function EvolutionCard({ evolution, isCurrent }: { evolution: any, isCurrent: boolean }) {
  const borderColor = isCurrent ? 'border-yellow-400' : 'border-blue-400'
  const bgColor = isCurrent ? 'bg-gray-600' : 'bg-gray-700'

  return (
    <Link href={`/?name=${evolution.name}`}>
      <motion.div
        className={`${bgColor} p-3 rounded-lg text-center min-w-[120px]`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Image
          src={evolution.image}
          alt={evolution.name}
          width={80}
          height={80}
          className={`mx-auto rounded-full border-2 ${borderColor}`}
        />
        <p className="mt-2 font-semibold text-white">{evolution.name}</p>
        {isCurrent && <p className="text-xs text-yellow-400">Current</p>}
      </motion.div>
    </Link>
  )
}

