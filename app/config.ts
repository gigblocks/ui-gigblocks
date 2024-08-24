import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage,  } from 'wagmi'
import {scrollSepolia} from '@wagmi/core/chains'
import ABI from './json/abi.json'
export const projectId = '22476627d5ffb372ddfd127a12d61241'

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'GigBlocks',
  description: `Revolutionize Freelancing with Scroll-Powered Decentralization`,
  url: 'https://chaincash.netlify.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create a custom localhost chain
// const localHostChain = {
//   id: 31337,
//   name: 'Localhost',
//   network: 'localhost',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Ethereum',
//     symbol: 'ETH',
//   },
//   rpcUrls: {
//     default: {
//       http: ['http://192.168.1.7:8545'], // Replace 192.168.1.7 with the actual IP
//     },
//     public: {
//       http: ['http://192.168.1.7:8545'], // Replace 192.168.1.7 with the actual IP
//     },
//   },
// }

// Create wagmiConfig
const chains:any = [scrollSepolia]
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})

export const BASE_URL = 'https://services.gigblocks.net'
export const WALLET_ADDRESS = '0xcaa94f71984474bF224E6A42b0d789d219CbFC82';
export const GigBlocksAbi = ABI