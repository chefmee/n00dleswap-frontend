
import styled from 'styled-components'

export const Wrapper = styled.div`
    width: 70vw;
    display: flex;
    flex-direction: row;
    border: 1px solid #000000;
    box-shadow: 0px 0px 5px 1px rgba(255, 8, 193, 0.87);
    border-radius: 11px;
    padding: 1rem;
    gap: 0.5rem;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
`;

export const TokenImage = styled.img`
    width: 3rem;
    border-radius: 50%;
    background: #1B1B1B;
`;

export const TokenName = styled.div`
    max-width: 10rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #ffffff;
`;

export const ActivityNumber = styled.div`
    color: #ffffff;
    flex-grow: 1;
`;

export const ActivityTime = styled.div`
    color: #ffffff;
`;

export const Badge = styled.span`
    color: #ffffff;
    background:  ${props => props.isSold ? "#0F32C8" : "#9C34FF"};;
    border-radius: 15.5px;
    padding: 0.5rem 1.5rem;
    width: 4rem;
    text-align: center;
`;

export const Address = styled.div`
    max-width: 10rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #ffffff;
`;

export const EthIcon = styled.img`
    height: 1.5rem;
`;

export const EthPriceValue = styled.div`
    font-size: 32px;
    color: #A53CFF;
`;
