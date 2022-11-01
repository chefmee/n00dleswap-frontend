import React from 'react';
import {
  Button,
  WindowContent,
  Fieldset,
  Anchor,
  TextField,
  Tabs,
  Tab,
  TabBody,
  Panel
} from 'react95';
import bn from 'bignumber.js'
import { useGetTokenBalance } from '../../interactors/useGetTokenBalance';
import { useContractReads, useAccount } from 'wagmi'
import { useSelector, useDispatch } from 'react-redux'
import { useGetTokenAllowance } from '../../interactors/useGetTokenAllowance';
import { useApproveToken } from '../../interactors/useApproveToken';
import { useWaitForTransaction } from 'wagmi';
import { useGetStakedAmount } from '../../interactors/MasterChef/useGetStakedAmount';
import { useGetPendingReward } from '../../interactors/MasterChef/useGetReward';
import { useMasterChefDeposit } from '../../interactors/MasterChef/useDepositMasterChef';
import { useMasterChefWithdraw } from '../../interactors/MasterChef/useWithdraw';
import { open as openWindow } from '../../reducers/openWindow';
import { useGetTokenBalancePool } from '../../interactors/useGetTokenBalancePool';
import { MaxButton } from '../utils/MaxButton';
import { BigNumber } from 'ethers';
const displayNum = (x) => new bn(x?.data?.toString() ?? 0).div(new bn('1000000000000000000')).toFixed(18).slice(0, -10)
const displayNum2 = (x) => new bn(x?.toString() ?? 0).div(new bn('1000000000000000000')).toFixed(18).slice(0, -10)

const displayDate = (x, l) => {
  if (x?.eq(0)) return new Date(new bn(Date.now() / 1000).plus(l).times(new bn(1000)).toNumber()).toLocaleString()
  return new Date(new bn(x?.toString()).plus(l).times(new bn(1000)).toNumber()).toLocaleString()
}
export default function StakeWindow({ emission, depositoryAddress }) {
  const dispatch = useDispatch()
  const setWindowStack = (a) => dispatch(openWindow(a))
  const { address, isConnecting, isDisconnected } = useAccount()
  const Xn00dbal = useGetTokenBalance('0x3561081260186E69369E6C32F280836554292E08')
  const X3ggbal = useGetTokenBalance('0x3C4f8a74B54175E372fc784A83C5b2D6Bcd12EE2')
  const eggETHbal = useGetTokenBalance('0x8d7b35c1446f51c67d64f6884aa644c741a16d6e')
  const n00dETHbal = useGetTokenBalance('0x5476db8b72337d44a6724277083b1a927c82a389')

  // const Xn00dbalP = useGetTokenBalancePool(depositoryAddress, '0x3561081260186E69369E6C32F280836554292E08')
  // const X3ggbalP = useGetTokenBalancePool(depositoryAddress, '0x3C4f8a74B54175E372fc784A83C5b2D6Bcd12EE2')
  // const eggETHbalP = useGetTokenBalancePool(depositoryAddress, '0x8d7b35c1446f51c67d64f6884aa644c741a16d6e')
  // const n00dETHbalP = useGetTokenBalancePool(depositoryAddress, '0x5476db8b72337d44a6724277083b1a927c82a389')
  // //allowance
  const Xn00dAllowance = useGetTokenAllowance('0x3561081260186E69369E6C32F280836554292E08', depositoryAddress)
  const X3ggAllowance = useGetTokenAllowance('0x3C4f8a74B54175E372fc784A83C5b2D6Bcd12EE2', depositoryAddress)
  const eggETHAllowance = useGetTokenAllowance('0x8d7b35c1446f51c67d64f6884aa644c741a16d6e', depositoryAddress)
  const n00dETHAllowance = useGetTokenAllowance('0x5476db8b72337d44a6724277083b1a927c82a389', depositoryAddress)

  //approve
  const { write: writeX3ggApprove, data: data3ggApprove } = useApproveToken('0x3C4f8a74B54175E372fc784A83C5b2D6Bcd12EE2', depositoryAddress, '1234567891234567891234589123456789')
  const { isLoading: isX3ggApproveLoading, isSuccess: isX3ggApproveSuccess } = useWaitForTransaction({
    hash: data3ggApprove?.hash,
  })
  const { write: writeXn00dApprove, data: datan00dApprove } = useApproveToken('0x3561081260186E69369E6C32F280836554292E08', depositoryAddress, '1234567891234567891234589123456789')
  const { isLoading: isXn00dApproveLoading, isSuccess: isXn00dApproveSuccess } = useWaitForTransaction({
    hash: datan00dApprove?.hash,
  })
  const { write: write3ggETHApprove, data: data3ggETHApprove } = useApproveToken('0x8d7b35c1446f51c67d64f6884aa644c741a16d6e', depositoryAddress, '1234567891234567891234589123456789')
  const { isLoading: is3ggETHApproveLoading, isSuccess: is3ggETHApproveSuccess } = useWaitForTransaction({
    hash: data3ggETHApprove?.hash,
  })
  const { write: writen00dETHApprove, data: datan00dETHApprove } = useApproveToken('0x5476db8b72337d44a6724277083b1a927c82a389', depositoryAddress, '1234567891234567891234589123456789')
  const { isLoading: isn00dETHApproveLoading, isSuccess: isn00dETHApproveSuccess } = useWaitForTransaction({
    hash: datan00dETHApprove?.hash,
  })

  //stake amounts
  const [n00dETHStakeAmount, setn00dETHStakeAmount] = React.useState(0)
  const [eggETHStakeAmount, seteggETHStakeAmount] = React.useState(0)
  const [Xn00dStakeAmount, setXn00dStakeAmount] = React.useState(0)
  const [X3ggStakeAmount, setX3ggStakeAmount] = React.useState(0)

  //unstake amounts
  const [unn00dETHStakeAmount, setunn00dETHStakeAmount] = React.useState(0)
  const [uneggETHStakeAmount, setuneggETHStakeAmount] = React.useState(0)
  const [unXn00dStakeAmount, setunXn00dStakeAmount] = React.useState(0)
  const [unX3ggStakeAmount, setunX3ggStakeAmount] = React.useState(0)
  //staked amounts
  const X3ggStaked = useGetStakedAmount(depositoryAddress, 0)
  const Xn00dStaked = useGetStakedAmount(depositoryAddress, 1)
  const n00dETHStaked = useGetStakedAmount(depositoryAddress, 2)
  const eggETHStaked = useGetStakedAmount(depositoryAddress, 3)


  const Xn00dReward = useGetPendingReward(depositoryAddress, 1)
  const X3ggReward = useGetPendingReward(depositoryAddress, 0)
  const eggETHReward = useGetPendingReward(depositoryAddress, 3)
  const n00dETHReward = useGetPendingReward(depositoryAddress, 2)
  // writes
  const { write: writeX3ggDeposit, data: data3ggDeposit } = useMasterChefDeposit(depositoryAddress, 0, new bn(X3ggStakeAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: isX3ggDepositLoading, isSuccess: isX3ggDepositSuccess } = useWaitForTransaction({
    hash: data3ggDeposit?.hash,
  })
  const { write: writeXn00dDeposit, data: datan00dDeposit } = useMasterChefDeposit(depositoryAddress, 1, new bn(Xn00dStakeAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: isXn00dDepositLoading, isSuccess: isXn00dDepositSuccess } = useWaitForTransaction({
    hash: datan00dDeposit?.hash,
  })
  const { write: write3ggETHDeposit, data: data3ggETHDeposit } = useMasterChefDeposit(depositoryAddress, 3, new bn(eggETHStakeAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: is3ggETHDepositLoading, isSuccess: is3ggETHDepositSuccess } = useWaitForTransaction({
    hash: data3ggETHDeposit?.hash,
  })
  const { write: writen00dETHDeposit, data: datan00dETHDeposit } = useMasterChefDeposit(depositoryAddress, 2, new bn(n00dETHStakeAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: isn00dETHDepositLoading, isSuccess: isn00dETHDepositSuccess } = useWaitForTransaction({
    hash: datan00dETHDeposit?.hash,
  })







  const { write: writeX3ggWithdraw, data: data3ggWithdraw } = useMasterChefWithdraw(depositoryAddress, 0, new bn(unX3ggStakeAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: isX3ggWithdrawLoading, isSuccess: isX3ggWithdrawSuccess } = useWaitForTransaction({
    hash: data3ggWithdraw?.hash,
  })
  const { write: writeXn00dWithdraw, data: datan00dWithdraw } = useMasterChefWithdraw(depositoryAddress, 1, new bn(unXn00dStakeAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: isXn00dWithdrawLoading, isSuccess: isXn00dWithdrawSuccess } = useWaitForTransaction({
    hash: datan00dWithdraw?.hash,
  })
  const { write: write3ggETHWithdraw, data: data3ggETHWithdraw } = useMasterChefWithdraw(depositoryAddress, 3, new bn(uneggETHStakeAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: is3ggETHWithdrawLoading, isSuccess: is3ggETHWithdrawSuccess } = useWaitForTransaction({
    hash: data3ggETHWithdraw?.hash,
  })
  const { write: writen00dETHWithdraw, data: datan00dETHWithdraw } = useMasterChefWithdraw(depositoryAddress, 2, new bn(unn00dETHStakeAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: isn00dETHWithdrawLoading, isSuccess: isn00dETHWithdrawSuccess } = useWaitForTransaction({
    hash: datan00dETHWithdraw?.hash,
  })



  const { write: writeX3ggWithdraw0, data: data3ggWithdraw0 } = useMasterChefWithdraw(depositoryAddress, 0, 0)
  const { isLoading: isX3ggWithdrawLoading0, isSuccess: isX3ggWithdrawSuccess0 } = useWaitForTransaction({
    hash: data3ggWithdraw0?.hash,
  })
  const { write: writeXn00dWithdraw0, data: datan00dWithdraw0 } = useMasterChefWithdraw(depositoryAddress, 1, 0)
  const { isLoading: isXn00dWithdrawLoading0, isSuccess: isXn00dWithdrawSuccess0 } = useWaitForTransaction({
    hash: datan00dWithdraw0?.hash,
  })
  const { write: write3ggETHWithdraw0, data: data3ggETHWithdraw0 } = useMasterChefWithdraw(depositoryAddress, 3, 0)
  const { isLoading: is3ggETHWithdrawLoading0, isSuccess: is3ggETHWithdrawSuccess0 } = useWaitForTransaction({
    hash: data3ggETHWithdraw0?.hash,
  })
  const { write: writen00dETHWithdraw0, data: datan00dETHWithdraw0 } = useMasterChefWithdraw(depositoryAddress, 2, 0)
  const { isLoading: isn00dETHWithdrawLoading0, isSuccess: isn00dETHWithdrawSuccess0 } = useWaitForTransaction({
    hash: datan00dETHWithdraw0?.hash,
  })

  const setActiveTab = (e, value) => setState({ activeTab: value });
  const [state, setState] = React.useState({
    activeTab: 0
  });
  const { activeTab } = state;
  return (

    <WindowContent>
      <Tabs value={activeTab} onChange={setActiveTab}>
      <Tab value={0}>Analytics</Tab>
        {/* <Tab value={1}>Stake</Tab> */}
        <Tab value={1}>Unstake</Tab>
        <Tab value={2}>Claim</Tab>
      </Tabs>
      <TabBody>
        <p>Stake Xn00d/X3gg and LPs</p>
        {/* dune1: <IexploreWindow iframesrc={'https://dune.com/embeds/1374389/2338916/34a8473e-b172-4596-b11b-45380372b679'}></IexploreWindow>,
    dune2: <IexploreWindow iframesrc={'https://dune.com/embeds/1374759/2339461/99ecbf23-8b9b-4997-aa6a-603a6b58193a'}></IexploreWindow>,
    dune3: <IexploreWindow iframesrc={'https://dune.com/embeds/1374416/2338933/03429e99-26c1-4b73-ad85-39c81ed458e9'}></IexploreWindow>,
    dune4: <IexploreWindow iframesrc={'https://dune.com/embeds/1374792/2339476/896b21a7-6b8e-4215-a992-fa5f6c6067cf'}></IexploreWindow> */}
    {activeTab === 0? <>
      <iframe src='https://dune.com/embeds/1374389/2338916/34a8473e-b172-4596-b11b-45380372b679'></iframe>
      <iframe src='https://dune.com/embeds/1374759/2339461/99ecbf23-8b9b-4997-aa6a-603a6b58193a'></iframe>
      <iframe src='https://dune.com/embeds/1374416/2338933/03429e99-26c1-4b73-ad85-39c81ed458e9'></iframe>
      <iframe src='https://dune.com/embeds/1374792/2339476/896b21a7-6b8e-4215-a992-fa5f6c6067cf'></iframe>
    </>: <></>}
        {/* {activeTab === 1 ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Fieldset label='Xn00d'>
                Emission: {emission[1] / Math.min(...emission)}x
                <br></br>
                <Anchor onClick={() => setWindowStack({ action: 'push', window: 'x' })}>Get Xn00d</Anchor>
                <br></br>
                You have: {displayNum(Xn00dbal)}
                <br></br>
                You stake:&nbsp;
                <TextField value={`${Xn00dStakeAmount}`.replace(/^0+/, '')} onChange={e => {
                  e.target.value !== "" ? setXn00dStakeAmount(e.target.value) : setXn00dStakeAmount(0)
                }} />
                <MaxButton changeFunction={setXn00dStakeAmount} target={displayNum(Xn00dbal)}></MaxButton>
                {isXn00dApproveSuccess || new bn(Xn00dAllowance?.data?.toString() ?? 0).div(new bn('1000000000000000000')).gte(new bn(Xn00dStakeAmount)) ?
                  <Button disabled={Xn00dStaked?.data?.[0]?.gt(BigNumber.from(1000000000000))} onClick={() => writeXn00dDeposit?.()}>{isXn00dDepositLoading ? 'Staking...' : 'Stake'}</Button> : <Button onClick={() => writeXn00dApprove?.()}>{isXn00dApproveLoading ? 'Approving...' : 'Approve'}</Button>}&nbsp;
                {Xn00dStaked?.data?.[0]?.gt(BigNumber.from(1000000000000)) ? <p>Please unstake before staking again.</p> : <></>}
              </Fieldset>
              <Fieldset label='X3gg'>
                Emission: {emission[3] / Math.min(...emission)}x
                <br></br>
                <Anchor onClick={() => setWindowStack({ action: 'push', window: 'x' })}>Get X3gg</Anchor>
                <br></br>
                You have: {displayNum(X3ggbal)}
                <br></br>
                You stake:&nbsp;
                <TextField value={`${X3ggStakeAmount}`.replace(/^0+/, '')} onChange={e => {
                  e.target.value !== "" ? setX3ggStakeAmount(e.target.value) : setX3ggStakeAmount(0)
                }} />
                <MaxButton changeFunction={setX3ggStakeAmount} target={displayNum(X3ggbal)}></MaxButton>
                {isX3ggApproveSuccess || new bn(X3ggAllowance?.data?.toString() ?? 0).div(new bn('1000000000000000000')).gte(new bn(X3ggStakeAmount)) ?
                  <Button disabled={X3ggStaked?.data?.[0]?.gt(BigNumber.from(10000000000000))} onClick={() => writeX3ggDeposit?.()}>{isX3ggDepositLoading ? 'Staking...' : 'Stake'}</Button> : <Button onClick={() => writeX3ggApprove?.()}>{isX3ggApproveLoading ? 'Approving...' : 'Approve'}</Button>}&nbsp;
                {X3ggStaked?.data?.[0]?.gt(BigNumber.from(1000000000000)) ? <p>Please unstake before staking again.</p> : <></>}
              </Fieldset>
              <br />

            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Fieldset label='n00d/ETH'>
                Emission: {emission[0] / Math.min(...emission)}x
                <span role='img' aria-label='😍'>
                  😍
                </span>
                <br></br>
                You have: {displayNum(n00dETHbal)}
                <br></br>
                You stake:&nbsp;
                <TextField value={`${n00dETHStakeAmount}`.replace(/^0+/, '')} onChange={e => {
                  e.target.value !== "" ? setn00dETHStakeAmount(e.target.value) : setn00dETHStakeAmount(0)
                }} />
                <MaxButton changeFunction={setn00dETHStakeAmount} target={displayNum(n00dETHbal)}></MaxButton>
                {isn00dETHApproveSuccess || new bn(n00dETHAllowance?.data?.toString() ?? 0).div(new bn('1000000000000000000')).gte(new bn(n00dETHStakeAmount)) ?
                  <Button disabled={n00dETHStaked?.data?.[0]?.gt(BigNumber.from(1000000000000))} onClick={() => writen00dETHDeposit?.()}>{isn00dETHDepositLoading ? 'Staking...' : 'Stake'}</Button> : <Button onClick={() => writen00dETHApprove?.()}>{isn00dETHApproveLoading ? 'Approving...' : 'Approve'}</Button>}&nbsp;
                {n00dETHStaked?.data?.[0]?.gt(BigNumber.from(1000000000000)) ? <p>Please unstake before staking again.</p> : <></>}
              </Fieldset>
              <Fieldset label='3gg/ETH'>
                Emission: {emission[2] / Math.min(...emission)}x<span role='img' aria-label='😍'>
                  😍
                </span>
                <br></br>
                You have: {displayNum(eggETHbal)}
                <br></br>
                You stake:&nbsp;
                <TextField value={`${eggETHStakeAmount}`.replace(/^0+/, '')} onChange={e => {
                  e.target.value !== "" ? seteggETHStakeAmount(e.target.value) : seteggETHStakeAmount(0)
                }} />
                <MaxButton changeFunction={seteggETHStakeAmount} target={displayNum(eggETHbal)}></MaxButton>
                {is3ggETHApproveSuccess || new bn(eggETHAllowance?.data?.toString() ?? 0).div(new bn('1000000000000000000')).gte(new bn(eggETHStakeAmount)) ?
                  <Button disabled={eggETHStaked?.data?.[0]?.gt(BigNumber.from(1000000000000))} onClick={() => write3ggETHDeposit?.()}>{is3ggETHDepositLoading ? 'Staking...' : 'Stake'}</Button> : <Button onClick={() => write3ggETHApprove?.()}>{is3ggETHApproveLoading ? 'Approving...' : 'Approve'}</Button>}&nbsp;
                {eggETHStaked?.data?.[0]?.gt(BigNumber.from(1000000000000)) ? <p>Please unstake before staking again.</p> : <></>}
              </Fieldset>
              <br />

            </div>
          </div>

        ) : <></>} */}
        {activeTab === 1 ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>


              <Fieldset label='Xn00d'>
                Emission: {emission[1] / Math.min(...emission)}x
                <br></br>
                You staked: {displayNum2(Xn00dStaked?.data?.[0])}
                <br></br>Pending n00d reward: {displayNum(Xn00dReward)}
                <br></br>Pending 3gg rewards: {displayNum(Xn00dReward) * 2857142}<br></br>
                (50% will be donated to single stakers if claimed before {displayDate(Xn00dStaked?.data?.[2], 86400 * 14)})
                <br></br>
                You unstake:&nbsp;
                <TextField value={`${unXn00dStakeAmount}`.replace(/^0+/, '')} onChange={e => {
                  e.target.value !== "" ? setunXn00dStakeAmount(e.target.value) : setunXn00dStakeAmount(0)
                }} />
                <MaxButton changeFunction={setunXn00dStakeAmount} target={displayNum2(Xn00dStaked?.data?.[0])}></MaxButton>
                <Button onClick={() => writeXn00dWithdraw?.()}>{isXn00dWithdrawLoading ? 'Unstaking...' : 'Unstake'}</Button>&nbsp;
              </Fieldset>
              <br />
              <Fieldset label='X3gg'>
                Emission: {emission[3] / Math.min(...emission)}x
                <br></br>
                You staked: {displayNum2(X3ggStaked?.data?.[0])}
                <br></br>Pending n00d reward: {displayNum(X3ggReward)}
                <br></br>Pending 3gg rewards: {displayNum(X3ggReward) * 9523809}<br></br>
                (50% will be donated to single stakers if claimed before {displayDate(X3ggStaked?.data?.[2], 86400 * 14)})
                <br></br>
                You unstake:&nbsp;
                <TextField value={`${unX3ggStakeAmount}`.replace(/^0+/, '')} onChange={e => {
                  e.target.value !== "" ? setunX3ggStakeAmount(e.target.value) : setunX3ggStakeAmount(0)
                }} />
                <MaxButton changeFunction={setunX3ggStakeAmount} target={displayNum2(X3ggStaked?.data?.[0])}></MaxButton>
                <Button onClick={() => writeX3ggWithdraw?.()}>{isX3ggWithdrawLoading ? 'Unstaking...' : 'Unstake'}</Button>&nbsp;
              </Fieldset>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Fieldset label='n00d/ETH'>
                Emission: {emission[0] / Math.min(...emission)}x
                <span role='img' aria-label='😍'>
                  😍
                </span>
                <br></br>
                You staked: {displayNum2(n00dETHStaked?.data?.[0])}
                <br></br>
                Pending n00d reward: {displayNum(n00dETHReward)}<br></br>
                Pending 3gg rewards: {displayNum(n00dETHReward) * 1666666}<br></br>
                (50% will be donated to single stakers if claimed before {displayDate(n00dETHStaked?.data?.[2], 86400 * 7)})
                <br></br>
                You unstake:&nbsp;
                <TextField value={`${unn00dETHStakeAmount}`.replace(/^0+/, '')} onChange={e => {
                  e.target.value !== "" ? setunn00dETHStakeAmount(e.target.value) : setunn00dETHStakeAmount(0)
                }} />
                <MaxButton changeFunction={setunn00dETHStakeAmount} target={displayNum2(n00dETHStaked?.data?.[0])}></MaxButton>
                <Button onClick={() => writen00dETHWithdraw?.()}>{isn00dETHWithdrawLoading ? 'Unstaking...' : 'Unstake'}</Button>&nbsp;
              </Fieldset>
              <Fieldset label='3gg/ETH'>
                Emission: {emission[2] / Math.min(...emission)}x<span role='img' aria-label='😍'>
                  😍
                </span>
                <br></br>
                You staked: {displayNum2(eggETHStaked?.data?.[0])}
                <br></br>Pending n00d reward: {displayNum(eggETHReward)}
                <br></br>Pending 3gg rewards: {displayNum(eggETHReward) * 14814814}<br></br>
                (50% will be donated to single stakers if claimed before {displayDate(eggETHStaked?.data?.[2], 86400 * 7)})
                <br></br>
                You unstake:&nbsp;
                <TextField value={`${uneggETHStakeAmount}`.replace(/^0+/, '')} onChange={e => {
                  e.target.value !== "" ? setuneggETHStakeAmount(e.target.value) : setuneggETHStakeAmount(0)
                }} />
                <MaxButton changeFunction={setuneggETHStakeAmount} target={displayNum2(eggETHStaked?.data?.[0])}></MaxButton>
                <Button onClick={() => write3ggETHWithdraw?.()}>{is3ggETHWithdrawLoading ? 'Unstaking...' : 'Unstake'}</Button>&nbsp;
              </Fieldset>

            </div>
          </div>

        ) : <></>}
        {activeTab === 2 ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>


              <Fieldset label='Xn00d'>
                Emission: {emission[1] / Math.min(...emission)}x
                <br></br>
                You staked: {displayNum2(Xn00dStaked?.data?.[0])}
                <br></br>Pending n00d reward: {displayNum(Xn00dReward)}
                <br></br>Pending 3gg rewards: {displayNum(Xn00dReward) * 2857142}<br></br>
                (50% will be donated to single stakers if claimed before {displayDate(Xn00dStaked?.data?.[2], 86400 * 14)})
                <br></br>
                <Button onClick={() => writeXn00dWithdraw0?.()}>{isXn00dWithdrawLoading0 ? 'Claiming...' : 'Claim'}</Button>&nbsp;
              </Fieldset>
              <br />
              <Fieldset label='X3gg'>
                Emission: {emission[3] / Math.min(...emission)}x
                <br></br>
                You staked: {displayNum2(X3ggStaked?.data?.[0])}
                <br></br>Pending n00d reward: {displayNum(X3ggReward)}
                <br></br>Pending 3gg rewards: {displayNum(X3ggReward) * 9523809}<br></br>
                (50% will be donated to single stakers if claimed before {displayDate(X3ggStaked?.data?.[2], 86400 * 14)})
                <br></br>
                <Button onClick={() => writeX3ggWithdraw0?.()}>{isX3ggWithdrawLoading0 ? 'Claiming...' : 'Claim'}</Button>&nbsp;
              </Fieldset>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Fieldset label='n00d/ETH'>
                Emission: {emission[0] / Math.min(...emission)}x
                <span role='img' aria-label='😍'>
                  😍
                </span>
                <br></br>
                You staked: {displayNum2(n00dETHStaked?.data?.[0])}
                <br></br>
                Pending n00d reward: {displayNum(n00dETHReward)}<br></br>
                Pending 3gg rewards: {displayNum(n00dETHReward) * 1666666}<br></br>
                (50% will be donated to single stakers if claimed before {displayDate(n00dETHStaked?.data?.[2], 86400 * 7)})
                <br></br>

                <Button onClick={() => writen00dETHWithdraw0?.()}>{isn00dETHWithdrawLoading0 ? 'Claiming...' : 'Claim'}</Button>&nbsp;
              </Fieldset>
              <Fieldset label='3gg/ETH'>
                Emission: {emission[2] / Math.min(...emission)}x<span role='img' aria-label='😍'>
                  😍
                </span>
                <br></br>
                You staked: {displayNum2(eggETHStaked?.data?.[0])}
                <br></br>Pending n00d reward: {displayNum(eggETHReward)}
                <br></br>Pending 3gg rewards: {displayNum(eggETHReward) * 14814814}<br></br>
                (50% will be donated to single stakers if claimed before {displayDate(eggETHStaked?.data?.[2], 86400 * 7)})
                <br></br>
                <Button onClick={() => write3ggETHWithdraw0?.()}>{is3ggETHWithdrawLoading0 ? 'Claiming...' : 'Claim'}</Button>&nbsp;

              </Fieldset>

            </div>
          </div>

        ) : <></>}

      </TabBody>
      <br></br>
      <Panel variant='well' className='footer' style={{ width: '100%' }}>
        This is beta software. Always check smart contracts. Use at your own risk.
      </Panel>
    </WindowContent>

  )
}