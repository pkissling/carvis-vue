<template>
  <v-row v-if="owner && creationDate">
    <v-col class="caption">
      <p class="mb-1">
        Erstellt von
        <OwnerChip
          :name="owner"
          :user-id="createdBy"
          :show-details="showDetails"
        />
        am
        <span class="font-weight-bold">
          {{ creationDate }}
        </span>
      </p>
      <p>
        <span v-if="createdAt !== updatedAt">
          Zuletzt aktualisiert
          <span class="font-weight-bold">
            {{ updatedDate }}
          </span>
        </span>
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { relativeTimeDifference } from '@/utilities/time'
import { Component, Vue, Prop } from 'vue-property-decorator'
import OwnerChip from '@/components/OwnerChip.vue'

@Component({ components: { OwnerChip }})
export default class OwnerCaption extends Vue {
  @Prop({ required: true })
  owner!: string

  @Prop({ required: true })
  createdAt!: string

  @Prop({ required: true })
  updatedAt!: string

  @Prop({ required: true })
  createdBy!: string

  @Prop({ required: false, default: true })
  showDetails!: boolean

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

<style scoped>
.col {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>