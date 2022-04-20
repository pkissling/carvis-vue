<template>
  <v-card class="my-12">
    <template slot="progress">
      <v-progress-linear indeterminate />
    </template>
    <v-card-title class="text-h4 title">
      Kontaktdaten
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col>
          <v-alert border="left"
                   dense
                   outlined
                   text
                   color="accent"
                   type="info"
          >
            Diese Informationen sind nur für Dich sichtbar.
          </v-alert>
        </v-col>
      </v-row>
      <v-row>
        <TextField v-model="value.contactDetails.name"
                   label="Name"
        />
        <TextField v-model="value.contactDetails.company"
                   label="Firma"
        />
      </v-row>

      <v-row>
        <TextField v-model="value.contactDetails.email"
                   label="E-Mail"
        />
        <TextField v-model="value.contactDetails.phone"
                   label="Telefon"
        />
      </v-row>

      <v-row>
        <TextArea v-model="value.contactDetails.freeText"
                  label="Freitext"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import TextField from '@/components/fields/TextField.vue'
import TextArea from '@/components/fields/TextArea.vue'

export default {
  components: {
    TextField,
    TextArea
  },
  props: {
    value: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>
.col {
  padding-top: 0px;
  padding-bottom: 0px;
}

.title {
  margin-bottom: 16px;
}
</style>
