
import styled from 'styled-components'
import ButtonBackground from '../../assets/PNG/Button1.png'

export const Container = styled.div`
    border: 3px dashed #FF08C1;
    border-radius: 22px;
    padding: 12px;
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    padding: 1rem 2rem;
    border: 3px solid #FFFFFF;
    box-shadow: 0px 0px 20px 3px #2D0CF9;
    border-radius: 14px;
    background: #000000;
`;

export const TokenImg = styled.img`
    width: 6rem;
`;

export const TokenInfo = styled.div`
`;

export const TokenName = styled.div`
    font-size: 28px;
    color: #ffffff;
`;

export const TokenPrice = styled.div`
    font-size: 28px;
    color: #ff08c1;
`;

export const TradeButton = styled.div`
    height: 100%;
    background:url(${ButtonBackground});
    background-repeat: round;
    color: #ffffff;
    padding: 1rem 1.5rem;
    font-size: 20px;
`;

export const ImageContainer = styled.div`
    height: 6rem;
`;