import { Anchor, Button, TextField, WindowContent, Table, TableHead, TableRow, TableHeadCell, TableBody, TableDataCell, Fieldset, Radio, Tooltip } from "react95";
import { useSelector, useDispatch } from 'react-redux'
import React from 'react'
import BigNumber from "bignumber.js";
import { useNetwork, useAccount, useContractRead, useWaitForTransaction, useContractWrite, erc721ABI } from "wagmi";
import { unselectAll } from "../../reducers/selectNFT";
import { useApproveNFT } from "../../interactors/useApproveNFT";
import LSSVMFactory from '../../abis/LSSVMFactory.json'
import { view } from "../../reducers/imageViewer";
import { open } from "../../reducers/openWindow";
import { setIsSudoMirror, setPriceIncrement, setStartPrice } from "../../reducers/pool";
import {useLocation} from "react-router-dom";
import axios from "axios";

const factoryAddress = {
  '5': '0x875CC787648E5aaC2b1f01F104b064a8b3e6095B',
  '1': '0x5389D491cC274205B873E37F09d1e21FAffbF270'
}
const wethAddress = {
  '5': '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  '1': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
}

const linearBondingAddress = {
  '1': '0x5B6aC51d9B1CeDE0068a1B26533CAce807f883Ee',
  '5': '0xaC6dcFF6E13132f075e36cA3a7F403236f869438'
}

export function CreatePool({ type }) {
  const [imgUrl, setImgUrl] = React.useState('')
  const [contractName, setContractName] = React.useState('')
  /**
   * Wagmi Init
   */
  const { chain } = useNetwork()
  const { address } = useAccount()

  /**
   * Redux
   */
  const dispatch = useDispatch()
  const selectNFTs = useSelector((state) => state.selectNFT)
  const search = useLocation().search
  const collectionAddress = new URLSearchParams(search).get("collectionAddress");
  const nftId = new URLSearchParams(search).get("nftId");
  /**
   * User states
   */
  // TODO: Move to Redux
  const { isSudoMirror, startPrice, priceIncrement } = useSelector((state) => state.pool)

  /**
   * Wagmi Calls
   */
  const { write, data: approveData } = useApproveNFT(selectNFTs[0]?.split('|*|')[0], factoryAddress[chain?.id], true)
  const { isLoading: isApproveLoading, } = useWaitForTransaction({
    hash: approveData?.hash,
  })
  const { data: NFTAllowance } = useContractRead({
    addressOrName: selectNFTs[0]?.split('|*|')[0],
    contractInterface: erc721ABI,
    functionName: 'isApprovedForAll',
    args: [address, factoryAddress[chain?.id]],
    watch: true
  })
  const { write: writeCreatePool, data: createPoolTxData } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: factoryAddress[chain?.id],
    contractInterface: LSSVMFactory,
    functionName: 'createPairERC20',
    args: [[wethAddress[chain?.id], selectNFTs[0]?.split('|*|')[0], linearBondingAddress[chain?.id], address, 1,
    new BigNumber(priceIncrement).times(new BigNumber('1000000000000000000')).toFixed(0),
      "0",
    new BigNumber(startPrice).minus(new BigNumber(priceIncrement)).times(new BigNumber('1000000000000000000')).toFixed(0),
    selectNFTs.map(sn => sn?.split('|*|')[1]),
      "0",
    ], wethAddress[chain?.id], isSudoMirror],
  })
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: createPoolTxData?.hash,
  })

  /**
   * Effects
   */
  React.useEffect(() => {
    if (isSuccess) dispatch(unselectAll())
  }, [isSuccess])


  React.useEffect(() => {
    if (collectionAddress && nftId) {
      axios.get(`https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.REACT_APP_ALCHEMY_API_TOKEN}/getNFTMetadata?contractAddress=${collectionAddress}&tokenId=${nftId}&refreshCache=false`).then(v => {
        setImgUrl(v.data.media[0].gateway)
        setContractName(v.data.contractMetadata.name)
        console.log(v.data.media.gateway)
      })
    }
  }, [imgUrl])

  return <WindowContent>
    <div>You are listing {selectNFTs.length ? selectNFTs.length : ''} {nftId && '1'} NFT(s) from <Anchor target={'_blank'} href={'https://etherscan.io/address/' + collectionAddress || selectNFTs[0]?.split('|*|')[0]}>{contractName || selectNFTs[0]?.split('|*|')[0]}</Anchor></div>
    <Table>
      <TableHead>
        <TableRow head>
          <TableHeadCell >Thumbnail</TableHeadCell>
          <TableHeadCell >ID</TableHeadCell>
          <TableHeadCell >Name</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {selectNFTs && selectNFTs.map(sn => <TableRow key={sn} onClick={
          () => {
            //preview image
            dispatch(view(sn?.split('|*|')[2] || 'https://notjustalabel-prod.s3-accelerate.amazonaws.com/s3fs-public/images/designers/209585/avatar/content_not_found_notjustalabel_127658440.jpg'))
            dispatch(open({ action: 'push', window: 'imageviewer' }))
          }
        }>
          <TableDataCell style={{ textAlign: 'center', justifyContent: 'center' }}>
            <img src={sn?.split('|*|')[2]} style={{
              maxHeight: '30px'
            }} />
          </TableDataCell>
          <TableDataCell style={{ textAlign: 'right' }}>{sn?.split('|*|')[1]}</TableDataCell>
          <TableDataCell>{sn?.split('|*|')[3]}</TableDataCell>
        </TableRow>)}
        {nftId && <TableRow onClick={
          () => {
            //preview image
            dispatch(view( imgUrl || 'https://notjustalabel-prod.s3-accelerate.amazonaws.com/s3fs-public/images/designers/209585/avatar/content_not_found_notjustalabel_127658440.jpg'))
            dispatch(open({ action: 'push', window: 'imageviewer' }))
          }
        }>
          <TableDataCell style={{ textAlign: 'center', justifyContent: 'center' }}>
            <img src={imgUrl} style={{
              maxHeight: '30px'
            }} />
          </TableDataCell>
          <TableDataCell style={{ textAlign: 'right' }}>{collectionAddress}</TableDataCell>
          <TableDataCell>{nftId}</TableDataCell>
        </TableRow>}
      </TableBody>
    </Table>
    <br></br>
    <Fieldset label='Listing mode'>
      <Tooltip text='Allows you to list in Opensea, X2Y2, etc. at the same time' enterDelay={59} leaveDelay={500}>
        <Radio
          checked={!isSudoMirror}
          onClick={() => dispatch(setIsSudoMirror(false))}
          value={true}
          label='Unlocked'
          name='lmode' />
      </Tooltip>
      &nbsp;
      <Tooltip text='Dual listing in sudoswap. sudoswap will lockup your NFT.' enterDelay={59} leaveDelay={500}>
        <Radio
          checked={isSudoMirror}
          onClick={() => dispatch(setIsSudoMirror(true))}
          value={false}
          label='Sudo-dual'
          name='lmode' />
      </Tooltip>
    </Fieldset>
    <div>Start Price (ETH): <TextField onChange={e => dispatch(setStartPrice(e.target.value))} type='number'></TextField></div>
    <div>Price Increment (ETH): <TextField onChange={e => dispatch(setPriceIncrement(e.target.value))} type='number'></TextField></div>
    <div>The first NFT being sold in this pool will have a sell price of {startPrice} ETH and the second will be sold at {Number(startPrice) + Number(priceIncrement)} ETH, etc.</div>
    <div>Step 1:</div>
    <Button disabled={isApproveLoading || NFTAllowance} onClick={() => write?.()}>{isApproveLoading ? 'Approving collection for trade...' : NFTAllowance ? 'Collection allowed for trade' : 'Approve collection for trade'}</Button><br></br>
    <div>Step 2:</div>
    <Button disabled={isLoading || !NFTAllowance} onClick={() => {
      writeCreatePool?.()
    }}>{isLoading ? 'Creating Pool...' : 'Create Pool'}</Button>
  </WindowContent>
}
