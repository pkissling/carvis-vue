<template>
  <v-row v-if="owner && creationDate">
    <v-col class="caption">
      Erstellt von
      <span class="font-weight-bold">
        {{ owner }}
      </span>
      am
      <span class="font-weight-bold">{{ creationDate }}</span>
      <p v-if="createdAt !== updatedAt">
        Zuletzt aktualisiert
        <span class="font-weight-bold">
          {{ updatedDate }}
        </span>
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { relativeTimeDifference } from '@/utilities/time'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class OwnerCaption extends Vue {
  @Prop({ required: false, default: null })
  owner!: string

  @Prop({ required: false, default: '' })
  createdAt!: string

  @Prop({ required: false, default: '' })
  updatedAt!: string

  get creationDate(): string {
    const date = new Date(this.createdAt)
    const days = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const months = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const year = date.getFullYear()
    return `${days}.${months}.${year}`
  }

  get updatedDate(): string | undefined {
    return relativeTimeDifference(this.updatedAt)
  }
}
</script>