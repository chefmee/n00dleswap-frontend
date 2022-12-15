import { Button, TextField, WindowContent, Fieldset, Tabs, Tab, TabBody, Panel } from "react95";
import { useState } from "react";
import { BigNumber } from 'ethers';
import bn from 'bignumber.js'
import { useGetTokenBalance } from "../../interactors/useGetTokenBalance";
import { useApproveToken } from "../../interactors/useApproveToken";
import { useWaitForTransaction } from "wagmi";
import { useGetTokenAllowance } from "../../interactors/useGetTokenAllowance";
import { useXSushiDeposit } from "../../interactors/xSushi/useDepositXSushi";
import { useXSushiLeave } from "../../interactors/xSushi/useLeaveXSushi";
import { MaxButton } from "../utils/MaxButton";
const displayNum = (x) => new bn(x?.data?.toString() ?? 0).div(new bn('1000000000000000000')).toFixed(18).slice(0, -10)
export function XSushiStaking() {
  const [state, setState] = useState({
    activeTab: 0
  });
  const [staken00dAmount, setStaken00dAmount] = useState(0)
  const [stake3ggAmount, setStake3ggAmount] = useState(0)
  const [unstaken00dAmount, setUnstaken00dAmount] = useState(0)
  const [unstake3ggAmount, setUnstake3ggAmount] = useState(0)
  const handleChange = (e, value) => setState({ activeTab: value });
  const n00dbal = useGetTokenBalance('0x147aB744f058A52e828BEE84A9C58660F2fF5Ff9')

  const eggbal = useGetTokenBalance('0xdAE5add81B1fa1b04C0DF225F0C3A029b93cB91B')
  const Xn00dbal = useGetTokenBalance('0x3f20ff7f6892ba44565FB639D714DAc5E7325Bc4')
  const X3ggbal = useGetTokenBalance('0x0c73a7c29d688deBF7f82AeA5DA3418A9675e110')
  //const balanceResX = useGetTokenBalances( ['0x0c73a7c29d688deBF7f82AeA5DA3418A9675e110','0x3f20ff7f6892ba44565FB639D714DAc5E7325Bc4'])
  const n00dAllowance = useGetTokenAllowance('0x147aB744f058A52e828BEE84A9C58660F2fF5Ff9', '0x3f20ff7f6892ba44565FB639D714DAc5E7325Bc4')
  const eggAllowance = useGetTokenAllowance('0xdAE5add81B1fa1b04C0DF225F0C3A029b93cB91B', '0x0c73a7c29d688deBF7f82AeA5DA3418A9675e110')

  const { write: write3ggApprove, isSuccess, data: data3ggApprove } = useApproveToken('0xdAE5add81B1fa1b04C0DF225F0C3A029b93cB91B', '0x0c73a7c29d688deBF7f82AeA5DA3418A9675e110', '1234567891234567891234589123456789')
  const { isLoading: is3ggApproveLoading, isSuccess: is3ggApproveSuccess } = useWaitForTransaction({
    hash: data3ggApprove?.hash,
  })
  const { write: writen00dApprove, isSuccess: disuccess, data: datan00dApprove } = useApproveToken('0x147aB744f058A52e828BEE84A9C58660F2fF5Ff9', '0x3f20ff7f6892ba44565FB639D714DAc5E7325Bc4', '1234567891234567891234589123456789')
  const { isLoading: isn00dApproveLoading, isSuccess: isn00dApproveSuccess } = useWaitForTransaction({
    hash: datan00dApprove?.hash,
  })
  const { write: writen00dXEnter, isSuccess: en00dIsuccess, data: datan00dXEnter } = useXSushiDeposit('0x3f20ff7f6892ba44565FB639D714DAc5E7325Bc4', new bn(staken00dAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: isn00dXEnterLoading, isSuccess: isn00dXEnterSuccess } = useWaitForTransaction({
    hash: datan00dXEnter?.hash,
  })
  const { write: write3ggXEnter, isSuccess: e3ggIsuccess, data: data3ggXEnter } = useXSushiDeposit('0x0c73a7c29d688deBF7f82AeA5DA3418A9675e110', new bn(stake3ggAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: is3ggXEnterLoading, isSuccess: is3ggXEnterSuccess } = useWaitForTransaction({
    hash: data3ggXEnter?.hash,
  })
  const { write: writen00dXLeave, isSuccess: ln00dIsuccess, data: datan00dXLeave } = useXSushiLeave('0x3f20ff7f6892ba44565FB639D714DAc5E7325Bc4', new bn(unstaken00dAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: isn00dXLeaveLoading, isSuccess: isn00dXLeaveSuccess } = useWaitForTransaction({
    hash: datan00dXLeave?.hash,
  })
  const { write: write3ggXLeave, isSuccess: l3ggIsuccess, data: data3ggXLeave } = useXSushiLeave('0x0c73a7c29d688deBF7f82AeA5DA3418A9675e110', new bn(unstake3ggAmount).times(new bn('1000000000000000000')).toFixed(0))
  const { isLoading: is3ggXLeaveLoading, isSuccess: is3ggXLeaveSuccess } = useWaitForTransaction({
    hash: data3ggXLeave?.hash,
  })
  const { activeTab } = state;
  return <div className='window-content'>


    <Tabs value={activeTab} onChange={handleChange}>
       <Tab value={0}>Stake</Tab>
      <Tab value={1}>Unstake</Tab>
    </Tabs>
    <TabBody >
    <p>Add an 'X' in front of your n00d and 3gg to receive extra toppings on your usual farming rewards!</p> <p>Receive 100% of penalties from early claiming of rewards, e.g. farming or trading rewards.</p><br></br>
    {/*{activeTab === 0? <>*/}
    {/*  <iframe src='https://dune.com/embeds/1374036/2338222/364e7133-0480-468c-91c2-373feae31c9a'></iframe>*/}
    {/*  <iframe src='https://dune.com/embeds/1374107/2338437/31cfacfc-bb94-47d9-934e-5248902dd328'></iframe>*/}
    {/*</>: <></>}*/}
      {activeTab === 1 ? <><Fieldset label='Get Xn00d'>
        <p>n00d balance: {displayNum(n00dbal)}</p>
        <p>Amount to stake</p>
        <input className="input" placeholder="n00d" value={`${staken00dAmount}`.replace(/^0+/, '')} onChange={e => {
          e.target.value !== "" ? setStaken00dAmount(e.target.value) : setStaken00dAmount(0)
        }}></input><MaxButton changeFunction={setStaken00dAmount} target={displayNum(n00dbal)}></MaxButton>
        {isn00dApproveSuccess || new bn(n00dAllowance?.data?.toString() ?? 0).div(new bn('1000000000000000000')).gte(new bn(staken00dAmount)) ?
          <div className='button' onClick={() => writen00dXEnter?.()}>{isn00dXEnterLoading? 'Staking...' : 'Stake'}</div> : <div className='button' onClick={() => writen00dApprove?.()}>{isn00dApproveLoading ? 'Approving...' : 'Approve'}</div>}
      </Fieldset>
        <Fieldset label='Get X3gg'>
          <p>3gg balance: {displayNum(eggbal)}</p>
          <p>Amount to stake</p>
          <input className="input" placeholder="3gg" value={`${stake3ggAmount}`.replace(/^0+/, '')} onChange={e => {
            e.target.value !== "" ? setStake3ggAmount(e.target.value) : setStake3ggAmount(0)
          }}></input><MaxButton changeFunction={setStake3ggAmount} target={displayNum(eggbal)}></MaxButton>
          {is3ggApproveSuccess || new bn(eggAllowance?.data?.toString() ?? 0).div(new bn('1000000000000000000')).gte(new bn(stake3ggAmount)) ?
            <div className='button' onClick={() => write3ggXEnter?.()}>{is3ggXEnterLoading? 'Staking...' : 'Stake'}</div> : <div className='button' onClick={() => write3ggApprove?.()}>{is3ggApproveLoading ? 'Approving...' : 'Approve'}</div>}
        </Fieldset></> : <></>}




      {activeTab === 1 ? <><Fieldset label='Get back n00d'>
        <p>Xn00d balance: {displayNum(Xn00dbal)}</p>
        <p>Amount to unstake</p>
        <input className="input" placeholder="n00d" value={`${unstaken00dAmount}`.replace(/^0+/, '')} onChange={e => {
          e.target.value !== "" ? setUnstaken00dAmount(e.target.value) : setUnstaken00dAmount(0)
        }}></input><MaxButton changeFunction={setUnstaken00dAmount} target={displayNum(Xn00dbal)}></MaxButton>
        <div className='button' onClick={() => writen00dXLeave?.()}>{isn00dXLeaveLoading ? 'Unstaking...' : 'Unstake'}</div>
      </Fieldset>
        <Fieldset label='Get back 3gg'>
          <p>X3gg balance: {displayNum(X3ggbal)}</p>
          <p>Amount to unstake</p>
          <input className="input" placeholder="3gg" value={`${unstake3ggAmount}`.replace(/^0+/, '')} onChange={e => {
            e.target.value !== "" ? setUnstake3ggAmount(e.target.value) : setUnstake3ggAmount(0)
          }}></input><MaxButton changeFunction={setUnstake3ggAmount} target={displayNum(X3ggbal)}></MaxButton>
          <div className='button' onClick={() => write3ggXLeave?.()}>{is3ggXLeaveLoading ? 'Unstaking...' : 'Unstake'}</div>
        </Fieldset></> : <></>}

    </TabBody>
    <br></br>
    <Panel variant='well' className='footer' style={{width: '100%'}}>
          This is beta software. Always check smart contracts. Use at your own risk.
        </Panel>
  </div>
}
