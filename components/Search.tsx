// components/Search.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Search() {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const name = searchParams.get('name')
    if (name) {
      setSearch(name)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?name=${encodeURIComponent(search)}`)
  }

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Pokémon"
          className="w-full px-6 py-3 pl-12 pr-4 text-lg text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
        <SearchIcon className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
      </div>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 w-full px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-lg"
      >
        Search
      </motion.button>
    </form>
  )
}

