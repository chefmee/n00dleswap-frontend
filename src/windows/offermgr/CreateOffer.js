import {  Button, TextField, WindowContent, Table, TableHead, TableRow, TableHeadCell, TableBody, TableDataCell } from "react95";
import { useSelector, useDispatch } from 'react-redux'
import React from 'react'
import axios from 'axios'
import { useAccount, useNetwork, useWaitForTransaction, useContractWrite } from "wagmi";
import BigNumber from "bignumber.js";
import LSSVMFactory from "../../abis/LSSVMFactory.json"
import Web3 from "web3";
import { useApproveToken } from "../../interactors/useApproveToken";
import { useGetTokenAllowance } from "../../interactors/useGetTokenAllowance";
import { setStartPrice, setPriceIncrement, setStakeAmount, setKeyword } from "../../reducers/offer";
import { setModalStatus } from "../../reducers/modal";
import { usePrompt } from "../../hooks/usePrompt";

const factoryAddress = {
  '5': '0x9DdBea8C5a1fBbaFB06d7CFF1d17a6A3FdFc5080',
  '1': '0x142abF0BDb409cb047c79229e3aD749371E82f87'
}
const wethAddress = {
  '5': '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  '1': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
}
const web3 = new Web3()

export function CreateOffer({ type }) {
  /**
   * Wagmi setup
   */
  const { chain } = useNetwork()
  const { address } = useAccount()

  /**
   * User states
   */
  // TODO: Move to Redux
  const { startPrice, priceIncrement, keyword, stakeAmount } = useSelector((state) => state.offer)
  const dispatch = useDispatch()

  /**
   * Auto states
   */
  const [nfts, setNfts] = React.useState([])
  const nftCollectionAddress = web3.utils.isAddress(keyword) ? keyword : nfts?.[0]?.address

  /**
   * Wagmi calls
   */
  const WETHAllowance = useGetTokenAllowance(wethAddress[chain?.id], factoryAddress[chain?.id])
  const { write: writeWETHApprove, data: dataWETHApprove } = useApproveToken(wethAddress[chain?.id], factoryAddress[chain?.id], '1234567891234567891231231234589123456789')
  const { isLoading: isWETHApproveLoading, isSuccess: isWETHApproveSuccess } = useWaitForTransaction({
    hash: dataWETHApprove?.hash,
  })
  const { write: writeCreatePool, data: createPoolTxData, isError: isPrepareCreateError, error } = useContractWrite({
    mode: 'recklesslyUnprepared',
    overrides: {
      value: new BigNumber(stakeAmount).times(new BigNumber('1000000000000000000')).toFixed(0),
    },
    addressOrName: factoryAddress[chain?.id],
    contractInterface: LSSVMFactory,
    functionName: 'createPairERC20',
    args: [[wethAddress[chain?.id], nftCollectionAddress, '0xaC6dcFF6E13132f075e36cA3a7F403236f869438', address, 0,
    new BigNumber(priceIncrement).times(new BigNumber('1000000000000000000')).toFixed(0),
      "0",
    new BigNumber(startPrice).plus(new BigNumber(priceIncrement)).times(new BigNumber('1000000000000000000')).toFixed(0),
    [],
    new BigNumber(stakeAmount).times(new BigNumber('1000000000000000000')).toFixed(0),
    ], wethAddress[chain?.id], false],

  })
  const { isLoading: isCreateLoading, isSuccess: isCreateSuccess, isError: isCreateError } = useWaitForTransaction({
    hash: createPoolTxData?.hash,
  })

  /**
   * Effects
   */
  React.useEffect(() => {
    if (isPrepareCreateError && !error.message.includes('user rejected transaction')) {
      dispatch(setModalStatus({
        type: 'error',
        message: 'Create pool error. Is the address you entered a NFT cotract address?'
      }))
    }
  }, [isPrepareCreateError])
  React.useEffect(() => {
    async function get() {
      const res = await axios.get(`https://core-service-ipnp6ty54a-uc.a.run.app/collections/search?ethereum=${chain?.id}&query=${keyword}`)
      setNfts(res.data)
    }
    if (keyword !== '') get()
  }, [keyword])

  return <WindowContent>
    {nfts.length !== 1 ? <>Filter: <TextField placeholder="keyword or NFT contract address" onChange={e => dispatch(setKeyword(e.target.value))}></TextField></> :
      <Button onClick={() => {
        setNfts([])
        dispatch(setKeyword(''))
      }}>Select again</Button>}

    {nftCollectionAddress == keyword ? <></> :
      <Table>
        <TableHead>
          <TableRow head>
            <TableHeadCell >Thumbnail</TableHeadCell>
            <TableHeadCell >Name</TableHeadCell>
            <TableHeadCell >Address</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nfts.map(sn => <TableRow onClick={() => setNfts([sn])}>
            <TableDataCell style={{ textAlign: 'center' }}>
              <img src={sn.imageUrl} style={{
                maxHeight: '30px'
              }} />
            </TableDataCell>
            <TableDataCell style={{ textAlign: 'right' }}>{sn.name}</TableDataCell>
            <TableDataCell>{sn?.address}</TableDataCell>
          </TableRow>)}
        </TableBody>
      </Table>}
    <p>Start Price (ETH): <TextField onChange={e => dispatch(setStartPrice(e.target.value))} type='number'></TextField></p>
    <p>Price Decrement (ETH): <TextField onChange={e => dispatch(setPriceIncrement(e.target.value))} type='number'></TextField></p>
    <p>Amount to stake (ETH): <TextField onChange={e => dispatch(setStakeAmount(e.target.value))} type='number'></TextField></p>
    <p>The first NFT being sold to this pool will have a sell price of {startPrice} ETH and the second will be sold at {Number(startPrice) - Number(priceIncrement)} ETH, etc.</p>
    <p>Step 1:</p>
    <Button disabled={new BigNumber(
      WETHAllowance.data?.toString()).gte(new BigNumber(stakeAmount).times('1000000000000000000'))
      || isWETHApproveLoading
      || !stakeAmount
      || !startPrice
      } onClick={() => writeWETHApprove?.()}>{isWETHApproveLoading? 'Approving Factory...': new BigNumber(
        WETHAllowance.data?.toString()).gte(new BigNumber(stakeAmount).times('1000000000000000000')) ? 'Factory Approved': 'Approve Factory'}</Button>
    <p>Step 2:</p>
    <Button onClick={() => {

        writeCreatePool?.()


    }} disabled={isCreateLoading || isCreateSuccess}>{isCreateLoading? 'Making Offer...': isCreateSuccess? 'Offer made': 'Make Offer'}</Button>
  </WindowContent>
}
