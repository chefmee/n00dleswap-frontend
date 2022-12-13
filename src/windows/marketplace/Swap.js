import { TextField, Button, TableRow, Panel, LoadingIndicator, Radio, WindowContent, Fieldset, Table, TableBody, TableDataCell, TableHead, TableHeadCell, Anchor } from "react95";
import { useNetwork, useAccount, useContractReads, useWaitForTransaction, usePrepareContractWrite, useContractWrite, useContractRead, erc721ABI, erc20ABI } from "wagmi";
import LSSVMFactory from '../../abis/LSSVMFactory.json'
import { hexZeroPad } from "ethers/lib/utils";
import LSSVMSwap from '../../abis/LSSVMSwap.json'
import ERC777 from '../../abis/ERC777.json'
import React from "react";
import BigNumber from "bignumber.js";
import axios from "axios";
import { useApproveToken } from "../../interactors/useApproveToken";
import { useGetTokenAllowance } from "../../interactors/useGetTokenAllowance";
import LSSVMRouter from '../../abis/LSSVMRouter.json'
import LSSVMRouterBuy from '../../abis/LSSVMRouterBuy.json'
import { useApproveNFT } from "../../interactors/useApproveNFT";
import { useDispatch, useSelector } from "react-redux";
import { select, unselectAll } from "../../reducers/selectNFTSwap";
import { setKeyword, setAmount, setIsPurchase } from "../../reducers/swap";
import { setModalStatus } from "../../reducers/modal";
import { ModalTypes } from "../../constants/modalTypes";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const factoryAddress = {
  '5': '0x9DdBea8C5a1fBbaFB06d7CFF1d17a6A3FdFc5080',
  '1': '0x142abF0BDb409cb047c79229e3aD749371E82f87'
}
const routerAddress = {
  '5': '0xaa71eB729daE61883E590DB9F365E3f8Ec11c7bC',
  '1': '0x39E923b15cEAa2c001B75ab3A29F28E7774aFff5'
}

const alchemyAddress = {
  '5': 'https://eth-goerli.g.alchemy.com/v2/' + process.env.REACT_APP_ALCHEMY_API_TOKEN,
  '1': 'https://eth-mainnet.g.alchemy.com/v2/' + process.env.REACT_APP_ALCHEMY_API_TOKEN
}
const wethAddress = {
  '5': '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  '1': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function Swap() {
  /**
   * Wagmi/Web3 setup
   */
  const { chain } = useNetwork()
  const { address } = useAccount()
  const web3 = createAlchemyWeb3(alchemyAddress[chain?.id])
  const contract = new web3.eth.Contract(LSSVMFactory, factoryAddress[chain?.id])

  /**
   * Redux
   */
  const dispatch = useDispatch()
  const { selectedNFTs, isSameCollection } = useSelector((state) => state.selectNFTSwap)

  /**
   * User states
   */
  // TODO: Move to Redux
  const { keyword, isPurchase, amount } = useSelector((state) => state.swap)
  
  /**
   * Auto states
   */
  const [offers, setOffers] = React.useState()
  const [nfts, setNfts] = React.useState([])
  const isInSelectedNFTs = (n) => selectedNFTs.indexOf(n.address + '|*|' + n.id + '|*|' + n.imageUrl + '|*|' + n.name) !== -1 
  const [myNFTs, setMyNFTs] = React.useState([])
  const nftCollectionAddress = web3.utils.isAddress(keyword) ? keyword : nfts?.[0]?.address
  const total = offers?.slice(0, !isPurchase ? selectedNFTs?.length : amount).reduce((p, c) => p.plus(c.spot), new BigNumber(0))
  const offersPerPool = offers?.slice(0, !isPurchase ? selectedNFTs?.length : amount).reduce((p, o) => {
    if (p[o.poolAddress]) p[o.poolAddress].push(o.id)
    else p[o.poolAddress] = [o.id]
    return p
  }, {})
  const nftsToBuy=Object.keys(offersPerPool || {})?.map(address => ([address, offersPerPool[address]]))

  /**
   * Wagmi calls
   */
  // WETH Allowance
  const WETHAllowance = useGetTokenAllowance(wethAddress[chain?.id], routerAddress[chain?.id])
  // NFT Allowance
  const { data: NFTAllowance } = useContractRead({
    addressOrName: nftCollectionAddress,
    contractInterface: erc721ABI,
    functionName: 'isApprovedForAll',
    args: [address, routerAddress[chain?.id]],
    watch: true
  })
  const { write: writeApproveNFT, data: approveData } = useApproveNFT(nftCollectionAddress, routerAddress[chain?.id], true)
  const { isLoading: isApproveLoading } = useWaitForTransaction({ hash: approveData?.hash })
  const { write: writeWETHApprove, data: dataWETHApprove } = useApproveToken(wethAddress[chain?.id], routerAddress[chain?.id], '1234567891234567891231231234589123456789')
  const { isLoading: isWETHApproveLoading } = useWaitForTransaction({
    hash: dataWETHApprove?.hash,
  })
  // Buy NFTs
  const { write: writeBuyNFT, data: buyNFTData} = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: routerAddress[chain?.id],
    contractInterface: LSSVMRouterBuy,
    functionName: 'swapETHToWETHForSpecificNFTs' ,
    args: [ nftsToBuy,
    total?.toFixed(0), address, (Date.now() / 1000 + 600).toFixed(0), wethAddress[chain?.id]],
    overrides: {
      value: total?.toFixed(0) ,
    },
  })
  const {isLoading: isBuyNFTLoading, isSuccess: isBuyNFTSuccess} = useWaitForTransaction({hash: buyNFTData?.hash})
  // Sell NFTs
  const { write: writeSellNFT, data: sellNFTData} = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: routerAddress[chain?.id],
    contractInterface: LSSVMRouter,
    functionName: 'swapNFTsForToken',
    args: 
    [ selectedNFTs?.map((sn, i) => [offers?.[i].poolAddress, sn?.split('|*|')[1]]).reduce((payload, offer) => {
      const poolBucketInd = payload.findIndex(p => {
        return p?.[0] == offer?.[0]
      })
      if (poolBucketInd !== -1) payload[poolBucketInd][1].push(offer[1])
      else payload.push([offer?.[0], [offer[1]]])
      return payload
    }, [])
    ,total?.toFixed(0), address, (Date.now() / 1000 + 600).toFixed(0)],
  })
  const {isLoading: isSellNFTLoading, isSuccess: isSellNFTSuccess} = useWaitForTransaction({hash: sellNFTData?.hash})

  /**
   * Effects
   */  
  // Logic to get Real-time offers
  React.useEffect(() => {
    if (!web3.utils.isAddress(keyword) && nfts?.length !== 1) return
    async function x() {
      let nftPoolEvents = []
      let wethPoolEvents = []
      if (isPurchase) {
        nftPoolEvents = await contract.getPastEvents('NewPair', {
          fromBlock: 0,
          toBlock: 'latest',
          topics: [
            '0x58656af46770649bb8f9032123301ed6bf482c8f0d8a714e84aa6faa3e50022c',
            [],
            web3.utils.isAddress(keyword) ? hexZeroPad(keyword, 32) : hexZeroPad(nfts?.[0]?.address, 32),
            hexZeroPad(1, 32)
          ]
        })
      } else {
        wethPoolEvents = await contract.getPastEvents('NewPair', {
          fromBlock: 0,
          toBlock: 'latest',
          topics: [
            '0x58656af46770649bb8f9032123301ed6bf482c8f0d8a714e84aa6faa3e50022c',
            [],
            web3.utils.isAddress(keyword) ? hexZeroPad(keyword, 32) : hexZeroPad(nfts?.[0]?.address, 32),
            hexZeroPad(0, 32)
          ]
        })
      }
      const poolsWithMetaPromises =(isPurchase ? nftPoolEvents : wethPoolEvents).map(ne => ({ ...ne, ...ne.returnValues })).filter(ne => ne.msgSender?.toLowerCase() !== address?.toLowerCase()).map(
        async ({ transactionHash, ...x }) => {
          const sContract = new web3.eth.Contract(LSSVMSwap, x.poolAddress)
          let delta=0, spot=0
          let wethBalanceCanBuyIDs = []
          if (!isPurchase) {
            delta = await sContract.methods.delta().call()
            spot = await sContract.methods.spotPrice().call()
            const wethContract = new web3.eth.Contract(ERC777, wethAddress[chain?.id])
            let wethBalance = await wethContract.methods.balanceOf(x.poolAddress).call()
            let i = 1
            while (new BigNumber(wethBalance.toString()).gt(0)) {
              if (new BigNumber(wethBalance).minus(spot).minus(new BigNumber(delta).multipliedBy(i + 1)).gt(0)) wethBalanceCanBuyIDs.push(9999)
              wethBalance = new BigNumber(wethBalance).minus(spot).minus(new BigNumber(delta).multipliedBy(i + 1))
              i++;
            }
          }
          const heldIds = isPurchase ? (await sContract.methods.getAllHeldIds().call()).filter(e => e != 0) : wethBalanceCanBuyIDs
          if (isPurchase && heldIds.length > 0) {
            delta = await sContract.methods.delta().call()
            spot = await sContract.methods.spotPrice().call()
          }
          
          return { ...x, delta, spot, heldIds }
        }
      )
      const poolsWithMeta = []
      for (let poolPromise of poolsWithMetaPromises) {
        await sleep(30)
        poolsWithMeta.push(await poolPromise)
      }
      const sortedOffers = poolsWithMeta.flatMap(p => {
        return p.heldIds.map((e, i) => ({
          poolAddress: p.poolAddress,
          id: e,
          spot: new BigNumber(p.spot)[isPurchase ? 'plus' : 'minus'](new BigNumber(p.delta).multipliedBy(i + 1)).multipliedBy(isPurchase ? new BigNumber(1.005) : new BigNumber(0.995))
        }))
      })
      sortedOffers.sort((a, b) => {
       return isPurchase? a.spot.minus(b.spot).toNumber() : b.spot.minus(a.spot).toNumber()
      })
      setOffers(sortedOffers)
    }
    x()
    if (isBuyNFTSuccess || isSellNFTSuccess) {
      dispatch(setModalStatus({
        type: ModalTypes.SUCCESS,
        message: 'Trade Success!'
      }))
    }
  }, [address, chain, nfts, keyword, isPurchase, isBuyNFTSuccess, isSellNFTSuccess])
  // Get collections from gem.xyz by keyword
  React.useEffect(() => {
    dispatch(unselectAll())
    async function get() {
      const res = await axios.get(`https://core-service-ipnp6ty54a-uc.a.run.app/collections/search?ethereum=${chain?.id}&query=${keyword}`)
      setNfts(res.data)
    }
    if (keyword !== '' && !web3.utils.isAddress(keyword)) get()
  }, [keyword])

  React.useEffect(() => {
    if (!isSameCollection) {
      dispatch(setModalStatus({
        type: ModalTypes.ERROR,
        message: 'Can only select NFTs from the same collection'
      }))
    }
  }, [isSameCollection])

  // Get user's NFTs
  React.useEffect(() => {
    async function get() {
      const res = await axios.get(`https://core-service-ipnp6ty54a-uc.a.run.app/v0/collaterals?owner=${address}&ethereum=0x${chain?.id.toString(16)}`)
      setMyNFTs(res.data.map(e => ({ ...e, address: e.collection.address })).filter(e => e.address?.toLowerCase() == nftCollectionAddress?.toLowerCase()))
    }
    if (!isPurchase) get()
  }, [address, nftCollectionAddress, isPurchase, isSellNFTSuccess])

  return <WindowContent>
    <Fieldset label='I am'>
      <Radio
        checked={isPurchase}
        onClick={(e) => dispatch(setIsPurchase(true))}
        value={true}
        label='buying'
        name='buyorsell' />
      <Radio
        checked={!isPurchase}
        onClick={(e) => dispatch(setIsPurchase(false))}
        value={false}
        label='selling'
        name='buyorsell' />
    </Fieldset>
    {nfts.length !== 1 ? <>Filter: <TextField placeholder="keyword or NFT Address" onChange={e => dispatch(setKeyword(e.target.value))}></TextField></> :
      <Button onClick={() => {
        setNfts([])
        dispatch(setKeyword(''))
      }}>Select again</Button>}
    {web3.utils.isAddress(keyword) ? <></> :
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
            <TableDataCell key={sn.address+sn.name} style={{ textAlign: 'center' }}>
              <img src={sn.imageUrl} style={{
                maxHeight: '30px'
              }} />
            </TableDataCell>
            <TableDataCell style={{ textAlign: 'right' }}>{sn.name}</TableDataCell>
            <TableDataCell>{sn.address}</TableDataCell>
          </TableRow>)}
        </TableBody>
      </Table>
    }

    <p>{isPurchase ? 'Purchase' : 'Sell'} amount (NFTs): {isPurchase ? <TextField onChange={e => dispatch(setAmount(e.target.value))} type='number'></TextField> : selectedNFTs.length}</p>
    <p>You {isPurchase ? 'pay' : 'get'}: {new BigNumber(total)?.dividedBy('1000000000000000000').toString()} ETH</p>
    {
      amount > 0 && isPurchase ? <>
        <Button disabled={new BigNumber(WETHAllowance.data?.toString())?.gt(total) || isWETHApproveLoading} onClick={() => writeWETHApprove?.()}>{isWETHApproveLoading? 'Approving Router For Trade...':'Approve Router for Trade'}</Button>
        <Button disabled={new BigNumber(WETHAllowance.data?.toString())?.lte(total) || isBuyNFTLoading} onClick={() => {
          writeBuyNFT?.()
        }}>{isBuyNFTLoading? 'Buying...': 'Buy'}</Button>
        <p>Summary:</p>
        <p>{offers?.slice(0, !isPurchase ? selectedNFTs?.length : amount).length} NFTs available for purchase</p>
        {Object.keys(offersPerPool || {}).map(o =>
          <div key={o}>
            <p>[Pool {o}]</p>
            <p>IDs: {offersPerPool[o].map(e => <span key={`${o} ${e}`}>#{e}, </span>)}</p>

          </div>)}
      </> : <></>
    }
    {nftCollectionAddress !== undefined && isNaN(total?.toNumber()) ? <>
            <p style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Loading...</p>
            <LoadingIndicator isLoading />
          </>:<></>}
    {!isPurchase && nftCollectionAddress !== undefined && offers?.length > 0?
      <><div style={{
        display: 'flex',
        flexDirection: 'row',
        flexFlow: 'row wrap',
        maxHeight: 500,
        overflow: 'scroll'
      }}>{myNFTs.length > 0 ? myNFTs.map(n => {
        return <Panel
          onClick={() => dispatch(select(n))}
          variant={!isInSelectedNFTs(n) ? 'inside' : 'well'}
          key={n.address + '|*|' + n.id}
          style={{
            marginTop: '1rem',
            padding: '1rem',
            height: 180,
            width: 180,
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
          }}
        >
          <img src={n.imageUrl} height="80%" />
          <p style={{
            overflowX: 'hidden',
            overflowY: 'visible',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>{n.name}</p>

        </Panel>
        
      }) : <>
        <p style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Loading...</p>
        <LoadingIndicator isLoading />
      </>}
      </div><br></br>
        <Button disabled={NFTAllowance || isApproveLoading} onClick={() => writeApproveNFT?.()}>{isApproveLoading ? 'Approving Router For Trade...': 'Approve Router for Trade'}</Button>
        <Button disabled={!NFTAllowance || isSellNFTLoading} onClick={() => {
          writeSellNFT?.()
        }}>{isSellNFTLoading? 'Selling...': 'Sell'}</Button>
        <br></br>
        <p>You will receive WETH instead of ETH. Unwrap them to ETH here: <Anchor href="https://app.uniswap.org/#/swap?inputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" target="_blank">https://app.uniswap.org/#/swap?inputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2</Anchor></p></> : <></>
    }
    {
      amount > 0 && offers?.length == 0 ? <p>No NFTs available for purchase</p> : <></>
    }
    {
      !isPurchase && offers?.length == 0 ? <p>No offers available</p> : <></>
    }
  </WindowContent>

}