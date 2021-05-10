<template>
  <v-card
    :loading="loading"
    class="my-12"
  >
    <div class="p-12 d-flex justify-space-between">
      <v-card-title class="text-h4">
        Fahrzeugbilder
      </v-card-title>
      <v-switch
        v-if="canEdit"
        v-model="editMode"
        label="Bearbeiten"
        large
        class="my-auto mx-4"
      />
    </div>
    <v-card-text>
      <EditCarImages
        v-if="editMode"
        :image-ids="value"
        @change="onImagesChange"
        @loading="onLoading"
      />
      <ViewCarImages
        v-else
        :image-ids="value"
        :loading="loading"
        @loading="onLoading"
      />
    </v-card-text>
  </v-card>
</template>
<script>
import ViewCarImages from '../components/ViewCarImages.vue'
import EditCarImages from '../components/EditCarImages.vue'

export default {
  components: {
    ViewCarImages,
    EditCarImages
  },
  props: {
    startInEditMode: {
      type: Boolean,
      value: false
    },
    value: {
      type: Array,
      default: () => [],
      immediate: true,
      handler (val) {
        if (!val) {
          this.imageIds = []
          return
        }
        this.imageIds = val
      }
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      imageIds: [],
      loading: false,
      editMode: this.startInEditMode
    }
  },
  methods: {
    onImagesChange(event) {
      this.$emit('input', event)
    },
    onLoading(value) {
      this.loading = value
    }
  },
}
</script>
