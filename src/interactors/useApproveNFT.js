import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { BigNumber } from 'ethers';
import ERC721Abi from '../abis/ERC721.json'

/**
 * Bond Tokens
 * @param {string} depositoryAddress
 * @param {BigNumber | string} amount Amount of token to deposit in fully extended phase
 * @param {*} slippageFactor 0 to 1
 * @returns {{isLoading: boolean, isSuccess: boolean}}
 */
export const useApproveNFT = (tokenAddress, depositoryAddress, boo)=> {
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: tokenAddress,
    contractInterface: ERC721Abi,
    functionName: 'setApprovalForAll',
    args: [depositoryAddress, 'true']
  })
} 
