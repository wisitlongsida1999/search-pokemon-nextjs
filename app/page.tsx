// app/page.tsx

import { Suspense } from 'react'
import Search from '../components/Search'
import Result from '../components/Result'
import { ApolloWrapper } from '../lib/apollo-wrapper'

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const pokemonName = (await searchParams).name as string | undefined

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600 drop-shadow-md">
        PokéSearch
      </h1>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <Search />
        <ApolloWrapper>
          <Suspense fallback={<div className="text-center text-gray-600">Loading...</div>}>
            {pokemonName && <Result name={pokemonName} />}
          </Suspense>
        </ApolloWrapper>
      </div>
    </main>
  )
}

