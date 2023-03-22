import axios from 'axios'
import { ethers } from "ethers"
import { convertIpfsUriToHttpUrl } from "./ipfsUtil"

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
const contract = new ethers.Contract(
  contractAddress,
  abi,
  new ethers.providers.JsonRpcProvider(jsonRPCEndpoint)
)

const getWritableContract = () => {
  const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
  return new ethers.Contract(contractAddress, abi, signer)
}

const getContractSpec = async () => {
  return {
    name: await contract.name(),
    symbol: await contract.symbol()
  }
}

const getToken = async (tokenId) => {
  let owner = ""
  try {
    owner = await contract.ownerOf(tokenId);
  } catch (error) { }

  let tokenURI = ""
  try {
    tokenURI = await contract.tokenURI(tokenId);
  } catch (error) { }

  let imageUrl = ""
  if (tokenURI && tokenURI.startsWith("ipfs://")) {
    const metadataHttpURL = convertIpfsUriToHttpUrl(tokenURI)
    const response = await axios.get(metadataHttpURL)
    const { image } = response.data
    imageUrl = convertIpfsUriToHttpUrl(image)
  }
  return {
    owner,
    imageUrl,
    tokenId,
    tokenURI
  }
}

export {
  getContractSpec,
  getToken,
  getWritableContract
}
