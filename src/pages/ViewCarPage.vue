<template>
  <b-container fluid>
    <h1>Anzeigen</h1>
    {{ carId }}
  </b-container>
</template>

<script>
export default {
  props: [
    'carId'
  ]
}
</script>
