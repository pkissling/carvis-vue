import gql from 'graphql-tag'
export default gql`

query getCar($id: ID!) {
  getCar(id: $id) {
    id
    brand
    type
    modelSeries
    modelYear
    modelDetails
    bodyType
    capacity
    horsePower
    transmission
    countryOfOrigin
    colorExterior
    colorExteriorManufacturer
    colorAndMaterialInterior
    mileage
    vin
    additionalEquipment
    condition
    shortDescription
    description
    price
    ads
    images
    ownerUsername
    ownerName
    createdAt
    updatedAt
  }
}
`
