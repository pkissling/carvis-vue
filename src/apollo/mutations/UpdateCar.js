import gql from 'graphql-tag'
export default gql`

mutation updateCar($updatecarinput: UpdateCarInput!) {
  updateCar(input: $updatecarinput) {
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
