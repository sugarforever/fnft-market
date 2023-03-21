<template>
  <Head title="Dashboard" />
  <div>
    <div class="name">{{ contractSpec.name }}</div>
    <div class="symbol">{{ contractSpec.symbol }}</div>
    <div>
      <div class="flex flex-row flex-wrap gap-10">
        <div v-for="(token, index) in tokens" :key="index" class="w-[200px] border flex flex-col">
          <nft :token="token" :writableContract = "writableContract" />
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
import { ethers } from "ethers"

const contractAddress = '0x7F0192141F58A8a28C5882d1252A1f83b68E7036'
const tokensCount = 10
const jsonRPCEndpoint = "https://api.hyperspace.node.glif.io/"
const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function ownerOf(uint) view returns (address)",
  "function tokenURI(uint) view returns (string)",
  "function mint(address, uint)"
];

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
    const provider = new ethers.providers.JsonRpcProvider(jsonRPCEndpoint)
    const contract = new ethers.Contract(contractAddress, abi, provider)
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    const writableContract = new ethers.Contract(contractAddress, abi, signer)
    const convertIpfsUriToHttpUrl = (ipfsURI) => {
      const subURL = ipfsURI.replace('ipfs://', 'ipfs/')
      return `https://ipfs.io/${subURL}`
    }

    const contractSpec = reactive({
      name: "",
      symbol: ""
    })
    const tokens = ref([]);
    onMounted(async () => {
      contractSpec.name = await contract.name()
      contractSpec.symbol = await contract.symbol()

      for (let tokenId = 0; tokenId < tokensCount; ++tokenId) {
        let owner = ""
        try {
          owner = await contract.ownerOf(tokenId);
        } catch (error) {

        }
        let tokenURI = ""
        try {
          tokenURI = await contract.tokenURI(tokenId);
        } catch (error) {

        }

        let imageUrl = ""
        if (tokenURI && tokenURI.startsWith("ipfs://")) {
          const metadataHttpURL = convertIpfsUriToHttpUrl(tokenURI)
          const response = await axios.get(metadataHttpURL)
          const { image } = response.data
          imageUrl = convertIpfsUriToHttpUrl(image)
        }
        tokens.value.push({
          owner,
          imageUrl,
          tokenId,
          tokenURI
        })
      }
    })

    return {
      contractSpec,
      tokens,
      writableContract
    }
  }
}
</script>
