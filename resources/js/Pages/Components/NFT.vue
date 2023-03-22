<template>
  <figure class="aspect-w-4 aspect-h-3 flex flex-col flex-1">
    <div class="flex flex-1 items-center justify-center">
      <img class="w-full" :src="imageSrc" alt="Token image" />
    </div>
    <!--figcaption>{{ token.tokenId }}</figcaption-->
    <figcaption class="flex-0 text-center py-4">
      <button class="text-white bg-fuchsia-500 px-6 py-1 rounded" v-if="!token.owner" @click="mint">Mint</button>
      <button class="text-white bg-indigo-500 px-6 py-1 rounded"
        v-if="token.owner && token.owner == eth_address">List</button>
    </figcaption>
  </figure>
</template>

<script>
export default {
  components: {
  },
  computed: {
    eth_address() {
      return this.$page.props.auth?.user?.eth_address
    },
    imageSrc() {
      return this.token?.imageUrl ? this.token.imageUrl : "/question-mark.png"
    }
  },
  props: ['token', 'writableContract'],
  methods: {
    mint() {
      this.writableContract.mint(this.eth_address, this.token.tokenId)
    }
  }
}
</script>
