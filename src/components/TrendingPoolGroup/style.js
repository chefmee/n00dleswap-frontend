
import styled from 'styled-components'
import ButtonBackground from '../../assets/PNG/Button1.png'

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 3px solid #FFFFFF;
    box-shadow: 0px 0px 20px 4px #2D0CF9;
    border-radius: 19px;
    width: 23rem;
`;

export const Header = styled.img`
    width: 100%;
`;

export const TrendingInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    align-items: center;
    padding: 1rem 0.5rem;
`;

export const EthIcon = styled.img`
    height: 1.5rem;
`;

export const PoolName = styled.div`
    font-size: 24px;
    color: #ffffff;
    max-width: 10rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const PoolListingValue = styled.div`
    font-size: 16px;
    color: #FF08C1;
`;

export const PoolListingText = styled.div`
    font-size: 14px;
    color: #ffffff;
`;

export const FloorPriceValue = styled.div`
    font-size: 32px;
    color: #A53CFF;
`;

export const FloorPriceText = styled.div`
    font-size: 14px;
    color: #ffffff;
`;

export const BidValue = styled.div`
    font-size: 32px;
    color: #A53CFF;
`;

export const BidText = styled.div`
    font-size: 14px;
    color: #ffffff;
`;

export const TokenPrice = styled.div`
    font-size: 28px;
    color: #ff08c1;
`;

export const OfferButton = styled.div`
    height: 100%;
    background:url(${ButtonBackground});
    background-repeat: round;
    color: #ffffff;
    font-size: 20px;
    padding: 1rem 4.5rem;
`;

export const ImageContainer = styled.div`
    height: 12rem;
    width: 100%;
    background: #1B1B1B
`;