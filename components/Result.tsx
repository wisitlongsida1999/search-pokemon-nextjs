// components/Result.tsx

'use client'

import { useQuery } from '@apollo/client'
import { GET_POKEMON } from '../lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Result({ name }: { name: string }) {
  const { loading, error, data } = useQuery(GET_POKEMON, {
    variables: { name },
  });

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">An error occurred: {error.message}</p>;
  if (!data || !data.pokemon) return <p className="text-center text-red-500">Pokémon not found</p>;

  const pokemon = data.pokemon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-600 drop-shadow-md">{pokemon.name}</h2>
        <div className="flex justify-center mb-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={250}
              height={250}
              className="rounded-full border-8 border-yellow-400 shadow-2xl"
            />
          </motion.div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <InfoCard title="Type" content={pokemon.types.join(', ')} bgColor="bg-red-100" textColor="text-red-700" />
          <InfoCard title="Classification" content={pokemon.classification} bgColor="bg-green-100" textColor="text-green-700" />
          <InfoCard title="Height" content={`${pokemon.height.minimum} - ${pokemon.height.maximum}`} bgColor="bg-blue-100" textColor="text-blue-700" />
          <InfoCard title="Weight" content={`${pokemon.weight.minimum} - ${pokemon.weight.maximum}`} bgColor="bg-purple-100" textColor="text-purple-700" />
        </div>
        
        <h3 className="text-3xl font-semibold mt-8 mb-6 text-blue-600 text-center">Attacks</h3>
        <div className="grid grid-cols-2 gap-6">
          <AttackList title="Fast Attacks" attacks={pokemon.attacks.fast} bgColor="bg-orange-100" textColor="text-orange-700" />
          <AttackList title="Special Attacks" attacks={pokemon.attacks.special} bgColor="bg-indigo-100" textColor="text-indigo-700" />
        </div>
        
        {pokemon.evolutions && (
          <>
            <h3 className="text-3xl font-semibold mt-10 mb-6 text-blue-600 text-center">Evolutions</h3>
            <div className="grid grid-cols-3 gap-6">
              {pokemon.evolutions.map((evolution: any) => (
                <Link href={`/?name=${evolution.name}`} key={evolution.id} className="text-center group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-100 p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out"
                  >
                    <Image
                      src={evolution.image}
                      alt={evolution.name}
                      width={120}
                      height={120}
                      className="mx-auto rounded-full border-4 border-yellow-400 shadow-lg"
                    />
                    <p className="mt-3 font-semibold text-blue-600 text-lg">{evolution.name}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

function InfoCard({ title, content, bgColor, textColor }: { title: string, content: string, bgColor: string, textColor: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${bgColor} p-4 rounded-lg shadow-md`}
    >
      <p className={`font-semibold ${textColor}`}>{title}</p>
      <p className="text-gray-700 mt-1">{content}</p>
    </motion.div>
  )
}

function AttackList({ title, attacks, bgColor, textColor }: { title: string, attacks: any[], bgColor: string, textColor: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${bgColor} p-5 rounded-lg shadow-md`}
    >
      <h4 className={`font-semibold mb-3 text-xl ${textColor}`}>{title}</h4>
      <ul className="space-y-2">
        {attacks.map((attack: any) => (
          <li key={attack.name} className="text-gray-700 flex justify-between items-center">
            <span>{attack.name}</span>
            <span className="font-semibold">Damage: {attack.damage}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

