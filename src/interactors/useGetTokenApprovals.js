import { useContractReads, useAccount } from 'wagmi'
import ERC777Abi from '../abis/ERC777.json'

/**
 * 
 * Give an array of addresses of token, gives you an array of balances of token balances of current connected user. Beware of decimals
 * @param {string[]} addresses 
 * @returns {{data: BigNumber[]}} balances
 * 
 */
export const useGetTokenApprovals = (addresses, spenders)=> {
  const { address, isConnecting, isDisconnected } = useAccount()
  return useContractReads({
    contracts: [
      addresses.map((addressOrName, i) => ({
        addressOrName,
        contractInterface: ERC777Abi,
        functionName: 'allowance',
        args: [address, spenders[i]]
      })),
    ],
  })
} 
