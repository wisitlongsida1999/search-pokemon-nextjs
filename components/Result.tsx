'use client'

import { useQuery } from '@apollo/client'
import { GET_POKEMON } from '../lib/queries'
import Image from 'next/image'
import Link from 'next/link'

export default function Result({ name }: { name: string }) {
  const { loading, error, data } = useQuery(GET_POKEMON, {
    variables: { name },
  })

  if (loading) return <p className="text-center">Loading...</p>
  if (error) return <p className="text-center text-red-500">Pokemon not found</p>

  const pokemon = data.pokemon

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">{pokemon.name}</h2>
        <div className="flex justify-center mb-4">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
        <p className="mb-2"><strong>Type:</strong> {pokemon.types.join(', ')}</p>
        <p className="mb-2"><strong>Classification:</strong> {pokemon.classification}</p>
        <p className="mb-2"><strong>Height:</strong> {pokemon.height.minimum} - {pokemon.height.maximum}</p>
        <p className="mb-2"><strong>Weight:</strong> {pokemon.weight.minimum} - {pokemon.weight.maximum}</p>
        
        <h3 className="text-xl font-semibold mt-4 mb-2">Attacks</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-1">Fast Attacks</h4>
            <ul className="list-disc list-inside">
              {pokemon.attacks.fast.map((attack: any) => (
                <li key={attack.name}>{attack.name} - Damage: {attack.damage}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Special Attacks</h4>
            <ul className="list-disc list-inside">
              {pokemon.attacks.special.map((attack: any) => (
                <li key={attack.name}>{attack.name} - Damage: {attack.damage}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {pokemon.evolutions && (
          <>
            <h3 className="text-xl font-semibold mt-4 mb-2">Evolutions</h3>
            <div className="grid grid-cols-3 gap-4">
              {pokemon.evolutions.map((evolution: any) => (
                <Link href={`/?name=${evolution.name}`} key={evolution.id} className="text-center">
                  <Image
                    src={evolution.image}
                    alt={evolution.name}
                    width={100}
                    height={100}
                    className="mx-auto rounded-lg"
                  />
                  <p className="mt-2">{evolution.name}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

