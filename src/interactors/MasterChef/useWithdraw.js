import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { BigNumber } from 'ethers';
import MasterChef from '../../abis/MasterChef.json'

/**
 * Bond Tokens
 * @param {string} depositoryAddress
 * @param {BigNumber | string} amount Amount of token to deposit in fully extended phase
 * @returns {{isLoading: boolean, isSuccess: boolean}}
 */
export const useMasterChefWithdraw = (depositoryAddress, pid, amount)=> {
  const { config } = usePrepareContractWrite({
    addressOrName: depositoryAddress,
    contractInterface: MasterChef,
    functionName: 'withdraw',
    args: [pid, amount]
  })
  return useContractWrite(config)
} 
