
import styled from 'styled-components'
import ButtonBackground from '../../assets/PNG/Button1.png'

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rem;
`;

export const BannerContainer = styled.img`
    width: 60vw;
`;

export const BannerText = styled.div`
    width: 40vw;
    font-size: 3rem;
    line-height: 3rem;
    color: #ffffff;
    text-align: center;
`;

export const Button = styled.div`
    background:url(${ButtonBackground});
    background-repeat: round;
    color: #ffffff;
    padding: 1rem 1.5rem;
    font-size: 20px;
    width: 15rem;
    text-align: center;
`;

export const Title = styled.div`
    font-size: 2rem;
    line-height: 2rem;
    color: #ffffff;
    text-align: center;
`;

export const LoadButton = styled.div`
    background:url(${ButtonBackground});
    background-repeat: round;
    color: #ffffff;
    padding: 1rem 3rem;
    font-size: 20px;
`;

export const SlideButton = styled.img`
    width: 3rem;
    height: 3rem;
`

