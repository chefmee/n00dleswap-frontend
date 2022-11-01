import { useContractRead, useAccount } from 'wagmi'
import ERC777Abi from '../abis/ERC777.json'


export const useGetTokenBalance = (taddress)=> {
  const { address, isConnecting, isDisconnected } = useAccount()
  
  return useContractRead({
        addressOrName: taddress,
        contractInterface: ERC777Abi,
        functionName: 'balanceOf',
        args: [address],
        watch: true
  })
} 
