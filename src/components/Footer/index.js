import React from 'react';
import { Wrapper, Logo, Icon, Text } from './style';
import LogoImg from '../../assets/PNG/Logo1.png';
import TwitterIcon from '../../assets/Icons/twitter.svg';
import DiscordIcon from '../../assets/Icons/discord.svg';
import GitHubIcon from '../../assets/Icons/github.svg';
import TelegramIcon from '../../assets/Icons/telegram.svg';

export default function Footer() {
  return (
    <Wrapper>
      <Icon src={TwitterIcon}/>
      <Icon src={DiscordIcon}/>
      <Icon src={GitHubIcon}/>
      <Icon src={TelegramIcon}/>
      <Logo src={LogoImg}/>
      <Text>Whitepaper</Text>
      <Text>Tokenomics</Text>
      <Text>Stats</Text>
    </Wrapper>
  );
}