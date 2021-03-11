import gql from 'graphql-tag'
  export default gql`
    mutation createCar($brand: String!, $color: String!) {
        createCar(input: {
            brand: $brand, color: $color
        }) {
            brand
            color
        }
    }
`
