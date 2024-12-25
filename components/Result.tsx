// components/Result.tsx


'use client'

import { useQuery } from '@apollo/client'
import { GET_POKEMON } from '../lib/queries'
import Image from 'next/image'
import Link from 'next/link'

export default function Result({ name }: { name: string }) {
  const { loading, error, data } = useQuery(GET_POKEMON, {
    variables: { name },
  });

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">An error occurred: {error.message}</p>;
  if (!data || !data.pokemon) return <p className="text-center text-red-500">Pokémon not found</p>;

  const pokemon = data.pokemon;

  return (
    <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105">
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">{pokemon.name}</h2>
        <div className="flex justify-center mb-6">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width={200}
            height={200}
            className="rounded-full border-4 border-yellow-400 shadow-lg"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="font-semibold text-gray-700">Type</p>
            <p>{pokemon.types.join(', ')}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="font-semibold text-gray-700">Classification</p>
            <p>{pokemon.classification}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="font-semibold text-gray-700">Height</p>
            <p>{pokemon.height.minimum} - {pokemon.height.maximum}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="font-semibold text-gray-700">Weight</p>
            <p>{pokemon.weight.minimum} - {pokemon.weight.maximum}</p>
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold mt-6 mb-4 text-blue-600">Attacks</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-red-700">Fast Attacks</h4>
            <ul className="list-disc list-inside">
              {pokemon.attacks.fast.map((attack: any) => (
                <li key={attack.name} className="text-gray-700">{attack.name} - Damage: {attack.damage}</li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-700">Special Attacks</h4>
            <ul className="list-disc list-inside">
              {pokemon.attacks.special.map((attack: any) => (
                <li key={attack.name} className="text-gray-700">{attack.name} - Damage: {attack.damage}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {pokemon.evolutions && (
          <>
            <h3 className="text-2xl font-semibold mt-6 mb-4 text-blue-600">Evolutions</h3>
            <div className="grid grid-cols-3 gap-4">
              {pokemon.evolutions.map((evolution: any) => (
                <Link href={`/?name=${evolution.name}`} key={evolution.id} className="text-center group">
                  <div className="bg-yellow-100 p-3 rounded-lg transition-all duration-200 ease-in-out transform group-hover:scale-105">
                    <Image
                      src={evolution.image}
                      alt={evolution.name}
                      width={100}
                      height={100}
                      className="mx-auto rounded-full border-2 border-yellow-400"
                    />
                    <p className="mt-2 font-semibold text-blue-600">{evolution.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

