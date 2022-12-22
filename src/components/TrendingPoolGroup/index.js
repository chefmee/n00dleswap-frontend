import React from 'react';
import { Wrapper, Header, PoolName, PoolListingValue, PoolListingText, EthIcon, FloorPriceValue, FloorPriceText, BidValue, BidText, OfferButton, ImageContainer, TrendingInfo } from './style';

export default function TrendingPoolGroup({...props}) {
  return (
    <Wrapper>
      <Header src='assets/PNG/Tab1.png'></Header>
      <ImageContainer></ImageContainer>
      <TrendingInfo>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
          <PoolName>{props.name}</PoolName>
          <div>
            <PoolListingValue>{props.listing}</PoolListingValue>
            <PoolListingText>Listing</PoolListingText>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.2rem'}}>
              <EthIcon src='assets/PNG/Eth.png'/>
              <FloorPriceValue>{props.floorPrice}</FloorPriceValue>
            </div>
            <FloorPriceText>Floor Price</FloorPriceText>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.2rem'}}>
              <EthIcon src='assets/PNG/Eth.png'/>
              <BidValue>{props.bid}</BidValue>
            </div>
            <BidText>Highest Bid</BidText>
          </div>
        </div>
        <OfferButton>Make collection offer</OfferButton>
      </TrendingInfo>
    </Wrapper>
  );
}