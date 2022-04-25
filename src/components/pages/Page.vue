<template>
  <div>
    <v-row>
      <v-col>
        <v-breadcrumbs
          v-if="renderBreadCrumbs"
          :items="breadcrumbs"
        >
          <template #divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row v-if="title">
      <v-col class="text-h2"
             align="center"
      >
        {{ title }}
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center"
             class="body-1"
      >
        <slot />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Page extends Vue {
  @Prop({ required: true })
  title!: string

  get breadcrumbs(): { text: string, disabled: boolean, href: string }[] {
    const breadcrumbs = this.$route?.meta?.breadcrumbs?.call(this, this.$route, this.title)
    if (!breadcrumbs?.length) {
      return []
    }
    return breadcrumbs.map((item: { text: string, href: string}) => {
      return { text: item.text, href: item.href }
    })
  }

  get renderBreadCrumbs(): boolean {
    return this.breadcrumbs.length > 1
  }
}
</script>
