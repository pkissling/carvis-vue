<template>
  <div>
    <h1>List</h1>
    <div v-if="$apollo.loading">Loading...</div>
    <div v-else>
      <table>
        <thead>
          <th>ID</th>
          <th>Brand</th>
          <th>Color</th>
        </thead>
        <tbody>
          <tr v-for="car in cars" :key="car.id">
            <td> {{ car.id }} </td>
            <td> {{ car.brand }} </td>
            <td> {{ car.color }} </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ListCars from '../queries/ListCars'

export default {
  name: 'CarsTable',
  apollo: {
    cars: {
      query: () => ListCars,
      update: data => data.listCars.items,
      prefetch: true
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
