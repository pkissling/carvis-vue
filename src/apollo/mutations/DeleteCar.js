import gql from 'graphql-tag'
export default gql`

mutation deleteCar($deletecarinput: DeleteCarInput!) {
  deleteCar(input: $deletecarinput) {
    id
  }
}
`
