import { useContractRead, useAccount } from 'wagmi'
import MasterChef from '../../abis/MasterChef.json'


export const useGetStakedAmount = (taddress, pid)=> {
  const { address, isConnecting, isDisconnected } = useAccount()
  
  return useContractRead({
        addressOrName: taddress,
        contractInterface: MasterChef,
        functionName: 'userInfo',
        args: [pid, address],
         watch: true
  })
} 
