<template>
  <v-card class="my-12">
    <v-card-actions class="d-block d-sm-flex">
      <v-btn
        color="primary"
        type="submit"
      >
        <span v-if="carId">
          Speichern
        </span>
        <span v-else>
          Hinzufügen
        </span>
      </v-btn>

      <v-spacer />

      <v-btn
        v-if="carId"
        color="error"
        text
        @click="showCarDeletionModal = true"
      >
        Löschen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    carId: {
      type: String,
      default: null
    }
  }
}
</script>