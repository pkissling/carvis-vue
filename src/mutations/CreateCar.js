import gql from 'graphql-tag'
  export default gql`
    mutation createCar($createcarinput: CreateCarInput!) {
      createCar(input: $createcarinput) {
        brand
        color
        mileage
        username
      }
    }
`
