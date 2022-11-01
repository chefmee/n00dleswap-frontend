import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { BigNumber } from 'ethers';
import MasterChef from '../../abis/MasterChef.json'

/**
 * Bond Tokens
 * @param {string} depositoryAddress
 * @param {BigNumber | string} amount Amount of token to deposit in fully extended phase
 * @returns {{isLoading: boolean, isSuccess: boolean}}
 */
export const useMasterChefDeposit = (depositoryAddress, pid, amount)=> {

  return useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: depositoryAddress,
    contractInterface: MasterChef,
    functionName: 'deposit',
    args: [pid, amount]
  })
} 
