
import styled from 'styled-components'
import ButtonBackground from '../../assets/PNG/Button3.png'

export const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 4rem;
    align-self: stretch;
`;

export const Logo = styled.img`
    width: 10rem;
    height: 2rem;
`;

export const SearchBar = styled.input`
    padding: 0.5rem
`;

export const Button = styled.div`
    color: #ffffff;
    font-size: 1rem; /* 16px */
    line-height: 1.5rem; /* 24px */  
`;

export const WalletConnectButton = styled.div`
    background:url(${ButtonBackground});
    background-repeat: round;
    color: #000000;
    padding: 1rem 1.5rem
`;