import React from 'react';
import { Wrapper, TokenImage, TokenName, ActivityNumber, ActivityTime, Badge, Address, EthIcon, EthPriceValue } from './style';

export default function RecentActivity({...props}) {
  return (
    <Wrapper>
      <TokenImage src={`assets/PNG/${props.img}`}></TokenImage>
      <TokenName>{props.name}</TokenName>
      <ActivityNumber>{props.activityNumber}</ActivityNumber>
      <ActivityTime>{props.time}</ActivityTime>
      <Badge isSold={props.isSold}>{props.isSold ? 'Sold to' : 'Bought by'}</Badge>
      <Address>{props.address}</Address>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.2rem'}}>
        <EthIcon src='assets/PNG/Eth.png'/>
        <EthPriceValue>{props.ethPrice}</EthPriceValue>
      </div>
    </Wrapper>
  );
}