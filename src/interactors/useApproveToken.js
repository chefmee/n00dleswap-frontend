import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { BigNumber } from 'ethers';
import ERC777Abi from '../abis/ERC777.json'

/**
 * Bond Tokens
 * @param {string} depositoryAddress
 * @param {BigNumber | string} amount Amount of token to deposit in fully extended phase
 * @param {*} slippageFactor 0 to 1
 * @returns {{isLoading: boolean, isSuccess: boolean}}
 */
export const useApproveToken = (tokenAddress, depositoryAddress, amount)=> {
  const { config } = usePrepareContractWrite({
    addressOrName: tokenAddress,
    contractInterface: ERC777Abi,
    functionName: 'approve',
    args: [depositoryAddress, amount]
  })
  return useContractWrite(config)
} 
