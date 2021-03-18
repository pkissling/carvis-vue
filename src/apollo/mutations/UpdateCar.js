import gql from 'graphql-tag'
export default gql`

mutation updateCar($updatecarinput: UpdateCarInput!) {
  updateCar(input: $updatecarinput) {
    id
    brand
    color
    mileage
    username
  }
}
`
