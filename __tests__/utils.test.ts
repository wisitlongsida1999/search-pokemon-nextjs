import { formatPokemonName } from '../utils/formatPokemonName'

describe('Utility Functions', () => {
  describe('formatPokemonName', () => {
    it('capitalizes the first letter of the Pokémon name', () => {
      expect(formatPokemonName('pikachu')).toBe('Pikachu')
      expect(formatPokemonName('CHARIZARD')).toBe('Charizard')
      expect(formatPokemonName('mR. MiMe')).toBe('Mr. mime')
    })
  })
})

