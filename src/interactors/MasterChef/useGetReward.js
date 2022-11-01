import { useContractRead, useAccount } from 'wagmi'
import MasterChef from '../../abis/MasterChef.json'


export const useGetPendingReward = (taddress, pid)=> {
  const { address, isConnecting, isDisconnected } = useAccount()
  
  return useContractRead({
        addressOrName: taddress,
        contractInterface: MasterChef,
        functionName: 'pendingSushi',
        args: [pid, address],
        watch: true
  })
} 
