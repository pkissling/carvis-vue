import gql from 'graphql-tag'
  export default gql`
    mutation createCar($brand: String, $color: String, $mileage: Int) {
      createCar(input: { brand: $brand, color: $color, mileage: $mileage }) {
        brand
        color
        mileage
      }
    }
`
