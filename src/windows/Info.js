import React from 'react';
import {
  WindowContent, Button, Anchor
} from 'react95';
import logoIMG from '../assets/noodlogo.png';

export default function InfoWindow({ setWelcomeWindow, setIframesrc, isEligible }) {
  return (

    <WindowContent>
      <p>Welcome to n00dleSwap - the DEX for NFT and NFTfi degens, built by degens.</p>
      <br></br><p style={{fontWeight: 'bold'}}>{'It is time for the public. Tweet about it and taste our r@men!'}</p>
      <br></br><p>
        Press "Start" to see all available functions.
      </p>
      
      <Button onClick={
        () => {
          const noodles = [
            'a steaming bowl of Tonkatsu Ramen',
            'a steaming bowl of Shio Ramen',
            'Seafood Pasta',
            'Pho Dac Biet',
            'Bun Bo Hue',
            'Capellini with Garlic, Lemon and Parmesan',
            'Capellini Pomodoro',
            'Cheese Tortellini in Garlic Butter Sauce',
            'Pad Thai',
            'Brisket Ho Fun',
            'Fishball Ho Fun',
            'Udon',
            'Spaghetti Napoli',
            'American Chop Suey',
            'Rice Vermicelli with Pork Chop',
            'Instant Noodles',
            'Cup Noodles',
            'Mee Goreng',
            'Prawn Mee',
            'Assam Laksa',
            'Vegetable Hakka Noodles',
            'Lo Mein',
            'Tamjai',
            'Taiwanese Braised Beef Noodles',
            'Lanzhou Ramen',
            'Rice Noodles',
            'Jollof noodles with boiled egg',
            'Wonton noodles',
            'Lasagna',
          ]
          window.open(`https://twitter.com/intent/tweet?text=I had ${(noodles[(Math.random() * noodles.length).toFixed(0)])} at @n00dleSwap. Reserve your table now! Degens only...`)
        }
      }>🍜&nbsp;Reserve table</Button>
      <br></br><br></br>
      <p>[Tokens]</p>
      <p><b>Token addresses has been updated!</b></p>
      <p>NOOD: 0x147ab744f058a52e828bee84a9c58660f2ff5ff9 <Anchor onClick={() => window.open('https://app.uniswap.org/#/swap?outputCurrency=0x147ab744f058a52e828bee84a9c58660f2ff5ff9&inputCurrency=ETH&use=V2')}>(Trade)</Anchor></p>
      <p>EGG: 0xdAE5add81B1fa1b04C0DF225F0C3A029b93cB91B <Anchor onClick={() => window.open('https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xdae5add81b1fa1b04c0df225f0c3a029b93cb91b&use=V2')}>(Trade)</Anchor></p>
      <br></br>
      <p>[Stats]</p>
      <p>Dune Analytics: <Anchor onClick={() => window.open('https://dune.com/n00dlelover/n00dle-lovers')}>https://dune.com/n00dlelover/n00dle-lovers</Anchor></p>
      <br></br>
      <p>[Docs]</p>
      <p>Intro:  <u color='blue' onClick={() => setIframesrc("https://mirror.xyz/n00dleswap.eth/LXfky6hGx3jxfKWfE8i03fXWzmOJjnVWH5DNS9RC_u8")}>Link</u> </p>
      <p>Tokenomics:  <u color='blue' onClick={() => setIframesrc("https://mirror.xyz/n00dleswap.eth/1XeriEDNXd_LvsqRJl1ohkvW1h9cCg83ozWNFA73NMY")}>Link</u> </p>
      <br></br>
      <p>[Socials]</p>
      <p>Discord: <u color='blue' onClick={() => window.open('https://discord.gg/wtbRxPGYHn')}>https://discord.gg/wtbRxPGYHn</u></p>
      <p>Twitter: <u color='blue' onClick={() => setIframesrc("data:text/html;charset=utf-8,%3Ca%20class%3D%22twitter-timeline%22%20href%3D%22https%3A//twitter.com/n00dleSwap%3Fref_src%3Dtwsrc%255Etfw%22%3ETweets%20by%20n00dleSwap%3C/a%3E%0A%3Cscript%20async%20src%3D%22https%3A//platform.twitter.com/widgets.js%22%20charset%3D%22utf-8%22%3E%3C/script%3E%0A")}>https://twitter.com/n00dleSwap</u></p>
      <p>Telegram: <u color='blue' onClick={() => window.open('https://t.me/noodleswap')}>https://t.me/noodleswap</u></p>
      <br></br>
      <img
        src={logoIMG}
        style={{ maxWidth: 200 }}
        alt='react95 logo'
      />
    </WindowContent>
  )
}