<template>
  <v-row
    v-if="subject"
    justify="center"
  >
    <v-dialog
      v-model="dialog"
      persistent
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          {{ subject }} wirklich löschen?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="cancel"
          >
            Abbrechen
          </v-btn>
          <v-btn
            color="red"
            text
            @click="submit"
          >
            Löschen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    subject: {
      type: String,
      default: ''
    }
  }
  ,
  data () {
    return {
      dialog: true,
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.car)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>