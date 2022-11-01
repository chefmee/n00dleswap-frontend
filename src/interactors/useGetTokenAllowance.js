import { useContractRead, useAccount } from 'wagmi'
import ERC777Abi from '../abis/ERC777.json'


export const useGetTokenAllowance = (taddress, spender)=> {
  const { address, isConnecting, isDisconnected } = useAccount()
  
  return useContractRead({
        addressOrName: taddress,
        contractInterface: ERC777Abi,
        functionName: 'allowance',
        args: [address, spender],
        watch: true
  })
} 
