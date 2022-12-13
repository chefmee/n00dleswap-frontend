import { Anchor, Button, WindowContent, Table, TableHead, TableRow, TableHeadCell, TableBody, TableDataCell, Fieldset, Panel } from "react95";
import React from "react";
import { erc721ABI, useAccount, useContractRead, useContractReads, useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import BigNumber from "bignumber.js";
import { erc20ABI } from "wagmi/dist/wagmi.cjs";
import { createAlchemyWeb3 } from "@alch/alchemy-web3/dist/esm";
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { select, unselectAll } from "../../reducers/selectNFT";
import LSSVMFactory from '../../abis/LSSVMFactory.json'
import LSSVMSwap from '../../abis/LSSVMSwap.json'
import { hexZeroPad } from "ethers/lib/utils";
import { useApproveNFT } from "../../interactors/useApproveNFT";
import { setSelectedRow } from "../../reducers/pool";
import { usePrompt } from "../../hooks/usePrompt";
import { setModalStatus } from "../../reducers/modal";
import { ModalTypes } from "../../constants/modalTypes";

const factoryAddress = {
  '5': '0x9DdBea8C5a1fBbaFB06d7CFF1d17a6A3FdFc5080',
  '1': '0x142abF0BDb409cb047c79229e3aD749371E82f87'
}

const alchemyAddress = {
  '5': 'https://eth-goerli.g.alchemy.com/v2/' + process.env.REACT_APP_ALCHEMY_API_TOKEN,
  '1': 'https://eth-mainnet.g.alchemy.com/v2/' + process.env.REACT_APP_ALCHEMY_API_TOKEN
}
const wethAddress = {
  '5': '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  '1': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
}
export function MyListings() {
  /**
   * Wagmi/Web3 Init
   */
  const { chain } = useNetwork()
  const { address } = useAccount()
  const web3 = createAlchemyWeb3(alchemyAddress[chain?.id])

  /**
   * Redux
   */
  const { selectedNFTs, isSameCollection } = useSelector((state) => state.selectNFT);
  const dispatch = useDispatch();

  /**
   * User states
   */
  // TODO: Move to Redux
  const selectedRow = useSelector((state) => state.pool.selectedRow);

  /**
   * One time user states
   */
  const [newSpotPrice, setNewSpotPrice] = React.useState(null)
  const [newDelta, setNewDelta] = React.useState(null)

  /**
   * Auto states
   */
  const [pools, setPools] = React.useState([])
  const contract = new web3.eth.Contract(LSSVMFactory, factoryAddress[chain?.id])
  const isInSelectedNFTs = (n) =>
    selectedNFTs.indexOf(
      n.address + "|*|" + n.id + "|*|" + n.imageUrl + "|*|" + n.name
    ) !== -1;
  const [fauxselectedRow, setFauxSelectedRow] = React.useState({})
  const [poolsTxCount, setPoolsTxCount] = React.useState({})
  const [isModifyingNFTOfPool, setIsModityingNFTOfPool] = React.useState(0)
  const [myNFTs, setMyNFTs] = React.useState([])
  const { promptDialog } = usePrompt();

  /**
   * Wagmi calls
   */
  const { data: heldIDs } = useContractRead({
    addressOrName: selectedRow?.poolAddress,
    contractInterface: LSSVMSwap,
    functionName: 'getAllHeldIds',
    watch: true
  })
  const { data: selectedPoolsData } = useContractReads({
    contracts: [

      {
        addressOrName: selectedRow?.collection?.address,
        contractInterface: erc721ABI,
        functionName: 'isApprovedForAll',
        args: [address, selectedRow?.poolAddress],
        watch: true
      }
    ]
  })
  const { write: changeSpotPrice } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: selectedRow?.poolAddress,
    contractInterface: LSSVMSwap,
    functionName: 'changeSpotPrice',
    args: [new BigNumber(newSpotPrice).times('1000000000000000000').toFixed(0)],
  })
  const { data: poolsData } = useContractReads({
    contracts: [{
      addressOrName: fauxselectedRow?.poolAddress,
      contractInterface: LSSVMSwap,
      functionName: 'getAllHeldIds',
      watch: true
    }
    ].concat(pools.flatMap(pool => {
      return [
        {
          addressOrName: pool.poolAddress,
          contractInterface: LSSVMSwap,
          functionName: 'spotPrice',
          watch: true
        },
      ]
    })).concat(pools.flatMap(pool => {
      return [
        {
          addressOrName: pool.poolAddress,
          contractInterface: LSSVMSwap,
          functionName: 'delta',
          watch: true
        },
      ]
    }))
      .concat(pools.flatMap(pool => {
        return [
          {
            addressOrName: pool.collection?.address,
            contractInterface: erc721ABI,
            functionName: 'name'
          },
        ]
      }))
      .concat(pools.flatMap(pool => {
        return [
          {
            addressOrName: pool.collection?.address,
            contractInterface: erc721ABI,
            functionName: 'symbol'
          },
        ]
      }))
      .concat(pools.flatMap(pool => {
        return [
          {
            addressOrName: pool.nftExposure !== undefined ? pool.poolAddress : wethAddress[chain?.id],
            contractInterface: pool.nftExposure !== undefined ? LSSVMSwap : erc20ABI,
            functionName: pool.nftExposure !== undefined ? 'getAllHeldIds' : 'balanceOf',
            watch: true,
            args: pool.nftExposure !== undefined ? [] : [pool.poolAddress],
          },
        ]
      })),
  })
  const { write: changeDelta } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: selectedRow?.poolAddress,
    contractInterface: LSSVMSwap,
    functionName: 'changeDelta',
    args: [new BigNumber(newDelta).times('1000000000000000000').toFixed(0)],
  })
  const { write: writeApprove, ...l } = useApproveNFT(selectedRow?.collection?.address, selectedRow?.poolAddress, true)
  const data = selectedPoolsData?.[0]
  const NFTIdsListed = heldIDs
  console.log(heldIDs)
  const [withdrawalAmount, setWithdrawalAmount] = React.useState(null)
  const { config: withdrawConfig } = usePrepareContractWrite({
    addressOrName: selectedRow?.poolAddress,
    contractInterface: LSSVMSwap,
    functionName: 'withdrawERC20',
    args: [wethAddress[chain?.id], new BigNumber(withdrawalAmount).times('1000000000000000000').toFixed(0)],
  })
  const { write: writeWithdraw } = useContractWrite(withdrawConfig)

  const { config: addremoveConfig } = usePrepareContractWrite({
    addressOrName: selectedRow?.poolAddress,
    contractInterface: LSSVMSwap,
    functionName: isModifyingNFTOfPool === 1 ? 'addNFTToPool' : isModifyingNFTOfPool === 2 ? 'removeNFTFromPool' : '',
    args: [selectedNFTs.map(sn => sn.split("|*|")[1])],
  })
  const { write: writeAddRemove } = useContractWrite(addremoveConfig)

  /**
   * Effects
   */
  React.useEffect(() => {
    async function x() {
      const nftPoolEvents = await contract.getPastEvents('NewPair', {
        fromBlock: 0,
        toBlock: 'latest',
        topics: [
          '0x58656af46770649bb8f9032123301ed6bf482c8f0d8a714e84aa6faa3e50022c',
          hexZeroPad(address, 32),
          [],
          hexZeroPad(1, 32)
        ]
      })
      const wethPoolEvents = await contract.getPastEvents('NewPair', {
        fromBlock: 0,
        toBlock: 'latest',
        topics: [
          '0x58656af46770649bb8f9032123301ed6bf482c8f0d8a714e84aa6faa3e50022c',
          hexZeroPad(address, 32),
          [],
          hexZeroPad(0, 32)
        ]
      })
      const poolsWithMeta = await Promise.all(nftPoolEvents.map(ne => ({ ...ne, ...ne.returnValues, nftExposure: 0 })).concat(wethPoolEvents.map(ne => ({ ...ne, ...ne.returnValues, ethExposure: 0 }))).map(
        async ({ transactionHash, ...x }) => {
          return { ...x, collection: { address: x.nft } }
        }
      ))
      setPools(poolsWithMeta)
    }
    x()
  }, [address, chain])
  React.useEffect(() => {
    setFauxSelectedRow(pools[pools.length - 1])
    async function x() {
      const ptc = {}
      for (let pool of pools) {
        const contract = new web3.eth.Contract(LSSVMSwap, pool.poolAddress)
        ptc[pool.poolAddress] = (await contract.getPastEvents('SwapNFTOutPair', { fromBlock: 0, toBlock: 'latest' })).length +
          (await contract.getPastEvents('SwapNFTInPair', { fromBlock: 0, toBlock: 'latest' })).length
      }
      setPoolsTxCount(ptc)
    }
    x()
  }, [pools])
  React.useEffect(() => {
    if (newSpotPrice) changeSpotPrice?.()
  }, [newSpotPrice])
  React.useEffect(() => {
    if (newDelta) changeDelta?.()
  }, [newDelta])
  React.useEffect(() => {
    if (withdrawalAmount) writeWithdraw?.()
  }, [withdrawalAmount])
  const { data: tokenURIs } = useContractReads({
    contracts: NFTIdsListed?.map((n) => {
      return {
        addressOrName: selectedRow?.collection?.address,
        contractInterface: erc721ABI,
        functionName: 'tokenURI',
        args: [n.toString()],
      }

    }) || []
  })

  React.useEffect(() => {
    setMyNFTs([])
    async function x() {
      dispatch(unselectAll())
      const res = await axios.get(`https://core-service-ipnp6ty54a-uc.a.run.app/v0/collaterals?owner=${address}&ethereum=0x${chain?.id.toString(16)}`)
      setMyNFTs(res.data.map(e => ({ ...e, address: e.collection.address })).filter(e => e.address?.toLowerCase() == selectedRow?.collection?.address.toLowerCase() && NFTIdsListed.map(n => n.toString()).indexOf(e.id) === -1))
    }

    async function y() {
      dispatch(unselectAll())
      try {
        const res = await Promise.allSettled(tokenURIs.map(async (n) => await axios.get(n)))
        setMyNFTs(tokenURIs.map((re, i) => ({ ...res[i].value?.data || { name: selectedRow?.symbol }, id: NFTIdsListed?.[i].toString(), address: selectedRow?.address })))

      } catch (e) {
        console.log(e)
        setMyNFTs(tokenURIs.map((re, i) => ({ name: selectedRow?.symbol, id: NFTIdsListed?.[i].toString(), address: selectedRow?.address })))

      }
    }
    if (isModifyingNFTOfPool == 1) x()
    else if (isModifyingNFTOfPool == 2 && tokenURIs?.[0]) y()
    else setMyNFTs([])
  }, [isModifyingNFTOfPool, selectedRow])

  React.useEffect(() => {
    if (!isSameCollection) {
      dispatch(setModalStatus({
        type: ModalTypes.ERROR,
        message: 'Can only select NFTs from the same collection'
      }))
    }
  }, [isSameCollection])


  /**
   * Dependent auto states
   */
  const spotPrices = poolsData?.slice(1, 1 + pools?.length)
  const deltas = poolsData?.slice(1 + pools?.length, 1 + pools?.length * 2)
  const names = poolsData?.slice(1 + pools?.length * 2, 1 + pools?.length * 3)
  const symbols = poolsData?.slice(1 + pools?.length * 3, 1 + pools?.length * 4)
  const exposure = poolsData?.slice(1 + pools?.length * 4, 1 + pools?.length * 5)
  const filledPools = pools?.map((p, i) => {
    return {
      ...p,
      currentSpot: spotPrices?.[i],
      currentDelta: deltas?.[i],
      name: names?.[i],
      symbol: symbols?.[i],
      exposure: p.nftExposure !== undefined ? exposure?.[i]?.filter(e => e != 0).length : new BigNumber(exposure?.[i]?.toString()).div('1000000000000000000')
    }
  })

  return <WindowContent>
    {selectedRow?.collection ? <Button onClick={() => dispatch(setSelectedRow({}))}>Re-select</Button> : <></>}
    <Table>
      <TableHead>
        <TableRow head>
          <TableHeadCell >Collection </TableHeadCell>
          <TableHeadCell>Direction</TableHeadCell>
          <TableHeadCell >Exposure</TableHeadCell>
          <TableHeadCell >Transaction Count</TableHeadCell>
          <TableHeadCell >Current Spot Price (ETH)</TableHeadCell>
          <TableHeadCell >Delta (ETH)</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(selectedRow?.collection ? [selectedRow] : filledPools).map(sn => <TableRow onClick={() => dispatch(setSelectedRow(sn))}>
          <TableDataCell style={{ textAlign: 'center' }}>
            {sn.name || 'Loading Name...'} ({sn.collection?.address})
          </TableDataCell>
          <TableDataCell>{sn.nftExposure !== undefined ? 'Sell NFT' : 'Buy NFT'}</TableDataCell>
          <TableDataCell style={{ textAlign: 'right' }}>{sn.nftExposure !== undefined ? `${sn.exposure} ${sn.symbol || 'Loading Name...'}` : `${sn.exposure} ETH`}</TableDataCell>
          <TableDataCell style={{ textAlign: 'right' }}>{poolsTxCount[sn.poolAddress] ?? 'Loading Transactions...'}</TableDataCell>
          <TableDataCell style={{ textAlign: 'right' }}>{new BigNumber(sn?.currentSpot?.toString())[sn.nftExposure !== undefined ? 'plus' : 'minus'](new BigNumber(sn?.currentDelta?.toString())).div?.('1000000000000000000')?.toString() || 'Loading Spot...'}</TableDataCell>
          <TableDataCell style={{ textAlign: 'right' }}>{new BigNumber(sn?.currentDelta?.toString()).div?.('1000000000000000000')?.toString() || 'Loading Delta...'}</TableDataCell>
        </TableRow>)}
      </TableBody>
    </Table>
    <br></br>
    {selectedRow?.collection ? <Fieldset label="Actions">
      <Button onClick={
        async () => {
          const spotPrice = await promptDialog('Input new spot price (in ETH)');
          setNewSpotPrice(spotPrice)
        }
      }>Change Spot Price</Button>
      <Button onClick={
        async () => {
          const delta = await promptDialog('Input new delta (in ETH)');
          setNewDelta(delta)
        }
      }>Change Delta</Button>
      {selectedRow?.nftExposure !== undefined ? <>
        <Button onClick={() => setIsModityingNFTOfPool(1)}>Add NFT</Button>
        <Button onClick={() => setIsModityingNFTOfPool(2)}>Remove NFT</Button>
        <Button disabled={data} onClick={() => writeApprove?.()}>Approve Collection For Trade</Button>
        <br></br>
        <p>NFTs Listed for Trade: {NFTIdsListed?.map(e => `#${e}, `)}</p>
      </> : <></>}
      {isModifyingNFTOfPool === 1 ? <Button onClick={writeAddRemove}>Add {selectedNFTs.length} NFT(s) to Pool</Button> : isModifyingNFTOfPool === 2 ? <Button onClick={writeAddRemove}>Remove {selectedNFTs.length} NFT(s) from Pool</Button> : <></>}
      {isModifyingNFTOfPool > 0 ? <div style={{
        display: "flex",
        flexDirection: "row",
        flexFlow: "row wrap",
        maxHeight: 500,
        overflow: "scroll",
      }}>
        {myNFTs.map((n) => {
          return (
            <Panel
              onClick={() => dispatch(select(n))}
              variant={!isInSelectedNFTs(n) ? "inside" : "well"}
              key={n.address + "|*|" + n.id}
              style={{
                marginTop: "1rem",
                padding: "1rem",
                height: 180,
                width: 180,
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
              }}
            >
              <img src={n.imageUrl || n.image} height="80%" />
              <p
                style={{
                  overflowX: "hidden",
                  overflowY: "visible",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {n.name + ' ' + n.id}
              </p>
            </Panel>
          );
        })}
      </div> : <></>}
      {selectedRow?.ethExposure !== undefined ? <>
        <Button onClick={
          async () => {
            const withd = await promptDialog('Input withdrawal amount (in ETH)')
            setWithdrawalAmount(withd)
          }
        }>Withdraw ETH</Button>
        <br></br>
        <p>You will receive WETH instead of ETH. Unwrap them to ETH here: <Anchor href="https://app.uniswap.org/#/swap?inputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" target="_blank">https://app.uniswap.org/#/swap?inputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2</Anchor></p>

      </> : <></>}

    </Fieldset> : <></>}
  </WindowContent>
}
