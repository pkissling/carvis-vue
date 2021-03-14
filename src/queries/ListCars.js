import gql from 'graphql-tag'
  export default gql`
    query listCars {
      listCars {
        items {
          id
          brand
          color,
          mileage
        }
      }
    }
`
