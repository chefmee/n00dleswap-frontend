import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { BigNumber } from 'ethers';
import DepositABI from '../abis/Deposit.json'

/**
 * Bond Tokens
 * @param {string} depositoryAddress
 * @param {BigNumber | string} amount Amount of token to deposit in fully extended phase
 * @param {*} slippageFactor 0 to 1
 * @returns {{isLoading: boolean, isSuccess: boolean}}
 */
export const useDeposit = (depositoryAddress, amount)=> {
  const { config, error: prepareError,
    isError: isPrepareError, } = usePrepareContractWrite({
    addressOrName: depositoryAddress,
    contractInterface: DepositABI,
    functionName: 'deposit',
    args: [amount],
  })
  return [prepareError, isPrepareError, useContractWrite(config)]
} 
