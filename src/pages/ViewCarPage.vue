<template>
  <b-container fluid>
    <h1>Anzeigen</h1>
    <b-table
      :items="this.carAttributes"
      striped
      small
      hover
      bordered
      primary-key="key"
    >
    </b-table>
  </b-container>
</template>

<script>
import GetCar from '../apollo/queries/GetCar'

export default {
  props: [
    'carId'
  ],
  apollo: {
    car: {
      query: () => GetCar,
      update: data => data.getCar,
      variables () {
        return {
          id: this.carId,
        }
      },
      prefetch: true
    }
  },
  computed: {
    carAttributes() {
      if (!this.car) {
        return []
      }

      return Object.keys(this.car)
        .filter(attr => !attr.startsWith('_'))
        .map(attr => {
          return {
            key: attr,
            value: this.car[attr]
          }
        })
    }
  }
}
</script>
