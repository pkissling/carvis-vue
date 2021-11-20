<template>
  <v-card class="my-12">
    <v-card-actions class="d-block d-sm-flex">
      <v-btn
        color="primary"
        type="submit"
      >
        <span v-if="id">
          Speichern
        </span>
        <span v-else>
          Hinzufügen
        </span>
      </v-btn>

      <v-spacer />

      <v-btn
        v-if="id"
        color="error"
        text
        @click="$emit('delete')"
      >
        Löschen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: null
    }
  }
}
</script>