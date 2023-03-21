<template>
  <Head title="Dashboard" />
  <div>
    <collection />
  </div>
</template>

<script>
import { Head } from '@inertiajs/inertia-vue3'
import Layout from '@/Shared/Layout.vue'
import Collection from '../Components/Collection.vue'

export default {
  components: {
    Head,
    Collection
  },
  layout: Layout,
}
</script>
