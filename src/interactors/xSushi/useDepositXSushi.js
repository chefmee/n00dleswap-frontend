import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { BigNumber } from 'ethers';
import xSUSHI from '../../abis/xSUSHI.json'

/**
 * Bond Tokens
 * @param {string} depositoryAddress
 * @param {BigNumber | string} amount Amount of token to deposit in fully extended phase
 * @returns {{isLoading: boolean, isSuccess: boolean}}
 */
export const useXSushiDeposit = (depositoryAddress, amount)=> {
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: depositoryAddress,
    contractInterface: xSUSHI,
    functionName: 'enter',
    args: [amount],
  })
} 
