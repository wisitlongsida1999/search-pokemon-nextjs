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

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">An error occurred: {error.message}</p>;
  if (!data || !data.pokemon) return <p className="text-center text-red-500">Pokémon not found</p>;

  const pokemon = data.pokemon;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-6">
        <motion.h2 
          className="text-3xl font-bold mb-4 text-center text-white"
          variants={itemVariants}
        >
          {pokemon.name}
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
              src={pokemon.image}
              alt={pokemon.name}
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
          <InfoCard title="Type" content={pokemon.types.join(', ')} />
          <InfoCard title="Classification" content={pokemon.classification} />
          <InfoCard title="Height" content={`${pokemon.height.minimum} - ${pokemon.height.maximum}`} />
          <InfoCard title="Weight" content={`${pokemon.weight.minimum} - ${pokemon.weight.maximum}`} />
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
          <AttackList title="Fast Attacks" attacks={pokemon.attacks.fast} />
          <AttackList title="Special Attacks" attacks={pokemon.attacks.special} />
        </motion.div>
        
        {pokemon.evolutions && (
          <>
            <motion.h3 
              className="text-2xl font-semibold mt-6 mb-4 text-white"
              variants={itemVariants}
            >
              Evolutions
            </motion.h3>
            <motion.div 
              className="grid grid-cols-3 gap-4"
              variants={containerVariants}
            >
              {pokemon.evolutions.map((evolution: any) => (
                <Link href={`/?name=${evolution.name}`} key={evolution.id}>
                  <motion.div
                    className="bg-gray-700 p-3 rounded-lg text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={evolution.image}
                      alt={evolution.name}
                      width={100}
                      height={100}
                      className="mx-auto rounded-full border-2 border-yellow-400"
                    />
                    <p className="mt-2 font-semibold text-white">{evolution.name}</p>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
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



