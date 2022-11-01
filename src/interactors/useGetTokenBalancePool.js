import { useContractRead, useAccount } from 'wagmi'
import ERC777Abi from '../abis/ERC777.json'


export const useGetTokenBalancePool = (paddress, taddress)=> {
  
  return useContractRead({
        addressOrName: taddress,
        contractInterface: ERC777Abi,
        functionName: 'balanceOf',
        args: [paddress],
        watch: true
  })
} 
