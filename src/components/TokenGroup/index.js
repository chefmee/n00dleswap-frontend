import React from 'react';
import { Container, Wrapper, TokenImg, TokenInfo, TokenPrice, TokenName, TradeButton, ImageContainer } from './style';

export default function TokenGroup({...props}) {
  return (
    <Container>
      <Wrapper>
        <ImageContainer>
          <TokenImg src={`/assets/PNG/${props.img}`} />
        </ImageContainer>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', alignItems: 'flex-end' }}>
          <TokenInfo>
            <TokenName>{props.name}</TokenName>
            <TokenPrice>{props.price}</TokenPrice>
            <div style={{ fontSize: '14px', color: '#ffffff' }}>Prices shown are in USD</div>
          </TokenInfo>
          <TradeButton>Trade</TradeButton>
        </div>
      </Wrapper>
    </Container>
  );
}