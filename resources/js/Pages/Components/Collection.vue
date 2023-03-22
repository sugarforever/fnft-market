<template>
  <Head title="Dashboard" />
  <div>
    <div class="name">{{ contractSpec.name }}</div>
    <div class="symbol">{{ contractSpec.symbol }}</div>
    <div>
      <div class="flex flex-row flex-wrap gap-10">
        <div v-for="(token, index) in tokens" :key="index" class="w-[200px] border flex flex-col">
          <nft :token="token" :writableContract="writableContract" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Head } from '@inertiajs/inertia-vue3'
import Layout from '@/Shared/Layout.vue'
import NFT from './NFT.vue'
import { onMounted, reactive, ref } from 'vue'
import { getContractSpec, getToken, getWritableContract } from '../../Modules/contract'

const tokensCount = 10

export default {
  components: {
    Head,
    'nft': NFT
  },
  computed: {
    user() {
      return this.$page.props.auth.user
    }
  },
  layout: Layout,
  setup() {
    const contractSpec = reactive({
      name: "",
      symbol: ""
    })
    const tokens = ref([]);
    onMounted(async () => {
      const spec = await getContractSpec()
      contractSpec.name = spec.name
      contractSpec.symbol = spec.symbol

      const promises = [];
      for (let tokenId = 0; tokenId < tokensCount; ++tokenId) {
        promises.push(getToken(tokenId));
      }

      tokens.value = await Promise.all(promises);
    })

    return {
      contractSpec,
      tokens,
      writableContract: getWritableContract()
    }
  }
}
</script>
