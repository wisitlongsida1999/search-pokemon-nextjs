import { gql } from "@apollo/client";

export const GET_POKEMON = gql`
  query pokemon($name: String!) {
    pokemon(name: $name) {
      id
      number
      name
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      classification
      types
      resistant
      weaknesses
      fleeRate
      maxCP
      maxHP
      image
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        number
        name
        image
        evolutionRequirements {
          amount
          name
        }
        evolutions {
          id
          number
          name
          image
          evolutionRequirements {
            amount
            name
          }
          evolutions {
            id
            number
            name
            image
            evolutionRequirements {
              amount
              name
            }
          }
        }
      }
      evolutionRequirements {
        amount
        name
      }
    }
  }
`;

export const GET_ALL_POKEMONS = gql`
  query pokemons($first: Int!) {
    pokemons(first: $first) {
      id
      number
      name
      image
      types
    }
  }
`;

