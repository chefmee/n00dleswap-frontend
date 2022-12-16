import React from 'react';
import { Wrapper, Logo, SearchBar, Button, WalletConnectButton } from './style';
import LogoImg from '../../assets/PNG/Logo1.png'
export default function Header() {
  return (
    <Wrapper>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem'}}>
        <Logo src={LogoImg}/>
        <SearchBar placeholder='Search Collections...' />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem'}}>
        <Button>Collections</Button>
        <Button>My Offers</Button>
        <Button>My Pools</Button>
        <WalletConnectButton>Connect Wallet</WalletConnectButton>
      </div>
    </Wrapper>
  );
}