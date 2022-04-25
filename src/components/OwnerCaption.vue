<template>
  <v-row v-if="owner && creationDate">
    <v-col class="caption">
      <p class="mb-1">
        Erstellt von
        <UserContact
          :name="owner"
          :user-id="createdBy"
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
import UserContact from '@/components/OwnerChip.vue'

@Component({ components: { UserContact }})
export default class OwnerCaption extends Vue {
  @Prop({ required: false, default: '' })
  owner!: string

  @Prop({ required: false, default: '' })
  createdAt!: string

  @Prop({ required: false, default: '' })
  updatedAt!: string

  @Prop({ required: false, default: '' })
  createdBy!: string

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