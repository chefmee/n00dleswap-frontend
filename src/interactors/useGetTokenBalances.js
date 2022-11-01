import { useContractReads, useAccount } from 'wagmi'
import ERC777Abi from '../abis/ERC777.json'


export const useGetTokenBalances = (addresses)=> {
  const { address, isConnecting, isDisconnected } = useAccount()

  return useContractReads({
    contracts: [
      addresses.map((addressOrName, i) => {
        return ({
        addressOrName,
        contractInterface: ERC777Abi,
        functionName: 'balanceOf',
        args: [address]
      })
    }),
    ],
  })
} 
