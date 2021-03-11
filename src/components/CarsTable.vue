<template>
  <div>
    <h1>List</h1>
    <table>
      <thead>
        <th>Brand</th>
        <th>Color</th>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.id">
          <td> {{ car.brand }} </td>
          <td> {{ car.color }} </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ListCars from '../queries/ListCars'

export default {
  name: 'CarsTable',
  apollo: {
    cars: {
      query: () => ListCars,
      update: data => data.listCars.items
    }
  }
}
</script>

<style scoped>
table {
  margin-left: auto;
  margin-right: auto;
}
</style>
