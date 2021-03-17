import gql from 'graphql-tag'

export default gql`

mutation deleteCar($id: ID!) {
  deleteCar(id: $id) {
    id
  }
}
`
