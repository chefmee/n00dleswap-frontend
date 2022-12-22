import React, { useRef } from 'react';
import Header from '../../components/Header';
import { Wrapper, BannerContainer, BannerText, Button, Title, LoadButton, SlideButton } from './style';
import BannerImg from '../../assets/PNG/Banner1.png';
import TokenGroup from '../../components/TokenGroup';
import TrendingPoolGroup from '../../components/TrendingPoolGroup';
import RecentActivity from '../../components/RecentActivity';
import Footer from '../../components/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper";
import ArrowLeft  from '../../assets/PNG/arrowleft@4x.png';
import ArrowRight  from '../../assets/PNG/arrowright@4x.png';
import 'swiper/swiper.min.css';

export default function Landing() {
  const swiperRef = useRef();

  const onOverviewPrev = () => {
    if (swiperRef.current) {
        swiperRef.current.slidePrev();
    }
  }

  const onOverviewNext = () => {
      if (swiperRef.current) {
          swiperRef.current.slideNext();
      }
  }

  return (
    <Wrapper>
      <Header/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center'}}>
        <BannerContainer src={BannerImg} />
        <BannerText>The DEX for NFT and NFTfi degens, built by degens</BannerText>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem'}}>
          <Button>Sell your NFT</Button>
          <Button>Create an NFT offer</Button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center'}}>
        <Title>Token Prices</Title>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem'}}>
          <TokenGroup name='$nOOd' price='2.11579' img='Eggicon.png'></TokenGroup>
          <TokenGroup name='$3gg' price='0.0000240' img='Noodicon.png'></TokenGroup>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center'}}>
        <Title>Trending Pools</Title>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', alignItems: 'center'}}>
          <SlideButton src={ArrowLeft} onClick={onOverviewPrev} />
          <Swiper
              style={{ display: 'flex', width: '70vw'}}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              breakpoints={{
                  1600: {
                      slidesPerView: 3
                  },
                  1100: {
                      slidesPerView: 2
                  },
                  250: {
                      slidesPerView: 1
                  },
              }}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
            >
            <SwiperSlide>
              <TrendingPoolGroup name='Bored Ape Kennel Club' floorPrice='2.11579' listing='9,999' bid='99.99' img='Eggicon.png'></TrendingPoolGroup>
            </SwiperSlide>
            <SwiperSlide>          
              <TrendingPoolGroup name='Azuki' floorPrice='0.0000240' listing='9,999' bid='99.99' img='Noodicon.png'></TrendingPoolGroup>
            </SwiperSlide>
            <SwiperSlide>          
              <TrendingPoolGroup name='Chromie Squiggle by Snowfro' floorPrice='0.0000240' listing='9,999' bid='99.99' img='Noodicon.png'></TrendingPoolGroup>
            </SwiperSlide>
            <SwiperSlide>
              <TrendingPoolGroup name='Bored Ape Kennel Club' floorPrice='2.11579' listing='9,999' bid='99.99' img='Eggicon.png'></TrendingPoolGroup>
            </SwiperSlide>
            <SwiperSlide>          
              <TrendingPoolGroup name='Azuki' floorPrice='0.0000240' listing='9,999' bid='99.99' img='Noodicon.png'></TrendingPoolGroup>
            </SwiperSlide>
            <SwiperSlide>          
              <TrendingPoolGroup name='Chromie Squiggle by Snowfro' floorPrice='0.0000240' listing='9,999' bid='99.99' img='Noodicon.png'></TrendingPoolGroup>
            </SwiperSlide>
          </Swiper>
          <SlideButton src={ArrowRight} onClick={onOverviewNext} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center'}}>
        <Title>Recent Activities</Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <RecentActivity name='Bored Ape Kennel Club' isSold={true} activityNumber='#6071' time='99 mins ago' address='0xa67273968sd9' ethPrice='99.99' img='Eggicon.png'></RecentActivity>
          <RecentActivity name='Azuki' activityNumber='#6071' isSold={true} time='99 mins ago' address='0xa67273968sd9' ethPrice='99.99' img='Noodicon.png'></RecentActivity>
          <RecentActivity name='Chromie Squiggle by Snowfro' isSold={false} activityNumber='#6071' time='99 mins ago' address='0xa67273968sd9' ethPrice='99.99' img='Noodicon.png'></RecentActivity>
        </div>
        <LoadButton>Load More</LoadButton>
      </div>
      <Footer />
    </Wrapper>
  );
}