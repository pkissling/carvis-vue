import gql from 'graphql-tag'
export default gql`

query getCar($id: ID!) {
  getCar(id: $id) {
    id
    brand
    color
    mileage
    username
  }
}
`
