import gql from 'graphql-tag'
export default gql`

query listCars {
  listCars {
    items {
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
      ownerUsername
      createdAt
      updatedAt
    }
  }
}
`
