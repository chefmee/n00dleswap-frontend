import React from 'react';
import { useAccount, useConnect, useEnsName, useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Wrapper, GlobalStyles } from './Styles';
import logoIMG from './assets/noodlogo.png';
import InfoWindow from './windows/Info';
import IexploreWindow from './windows/Iexplore';
import StakeWindow from './windows/staking/Stake';
import { MyNFTsSelector } from './windows/listingmgr/MyNFTsSelector';
import { useDispatch, useSelector } from 'react-redux';
import { open as openWindow } from './reducers/openWindow';
import { CreatePool } from './windows/listingmgr/CreatePool';
import { ImagePreview } from './windows/utils/ImagePreview';
import { CreateOffer } from './windows/offermgr/CreateOffer';
import { Swap } from './windows/marketplace/Swap';
import { MyListings } from './windows/listingmgr/MyPools';
import { XSushiStaking } from './windows/staking/xSushiStaking';
import { Rnd } from 'react-rnd';
import {
  useWindowSize,
} from '@react-hook/window-size';
import './App.css';
import { useSwitchNetwork} from 'wagmi';
import makeBlockie from 'ethereum-blockies-base64';
import { WalletOptionsModal } from "./windows/WalletOptionsModal";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
export default function Default() {
  const [open, setOpen] = React.useState(false);
  const [welcomeWindow, setWelcomeWindow] = React.useState(true);
  const [iexploreWindow, setIexploreWindow] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);
  const [iframesrc, _setIframesrc] = React.useState("");
  const [isEligible, setIsEligible] = React.useState(false || process.env.NODE_ENV === 'development');
  const [windowPositions, setWindowPositions] = React.useState({});
  const [windowSizes, setWindowSizes] = React.useState({});
  const [showWalletOptions, setShowWalletOptions] = React.useState(false);

  const windowStack = useSelector((state) => state.openWindow);
  const dispatch = useDispatch();
  const setWindowStack = (a) => dispatch(openWindow(a));
  const [width, height] = useWindowSize();

  const { chain } = useNetwork();
  if (chain?.id && chain?.id != 1 && chain?.id != 5) alert(`Network ${chain?.id} not supported`);
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const windows = {
    n00d: (
      <InfoWindow
        key={"n00d"}
        isEligible={isEligible}
        setIframesrc={setIframesrc}
        setWindowStack={setWindowStack}
      ></InfoWindow>
    ),
    iexplore: <IexploreWindow iframesrc={iframesrc}></IexploreWindow>,
    stake: (
      <StakeWindow
        emission={[14, 7, 4.5, 3.5]}
        depositoryAddress={"0x91bF23d27170712e0E93BDa5478f86bbFF2C1915"}
      ></StakeWindow>
    ),
    nftselector: <MyNFTsSelector></MyNFTsSelector>,
    createpool: <CreatePool></CreatePool>,
    imageviewer: <ImagePreview></ImagePreview>,
    x: <XSushiStaking></XSushiStaking>,
    createoffer: <CreateOffer></CreateOffer>,
    sweep: <Swap></Swap>,
    mypools: <MyListings></MyListings>,
    walletSelector: <WalletOptionsModal></WalletOptionsModal>
  };

  const onConnectButtonClicked = () => {
    setWindowStack({ action: "push", window: "walletSelector" })
  };

  React.useEffect(() => {
    if (window.eSheep) {
      if (!initialized) {
        const esheep = new window.eSheep();
        esheep.Start();
        setWindowStack({ action: "push", window: "n00d" });
        if (address) setWindowStack({ action: "push", window: "walletSelector" });
        setInitialized(true);
      }
    }
  }, [window.eSheep]);

  React.useEffect(() => {
    if (Object.entries(windowPositions).length > 0) {
      Object.entries(windowPositions).forEach(([key, value]) => {
        if (value) {
          if (width < value.x) {
            setWindowPositions({ [key]: { ...value, x: width - 200 } });
          }

          if (height < value.y) {
            setWindowPositions({ [key]: { ...value, y: height - 200 } });
          }
        }
      });
    }
  }, [width, height]);

  const spawnStraySheep = () => {
    const esheep = new window.eSheep();
    esheep.Start();
  };

  function setIframesrc(x) {
    if (windowStack.indexOf("iexplore") === -1)
      setWindowStack({ action: "push", window: "iexplore" });
    _setIframesrc(x);
  }
  const { switchNetwork } = useSwitchNetwork()

  if (chain?.id && chain?.id != 1 && chain?.id != 5) {
    switchNetwork?.(1) // switch to ethereum network
  };

  const handleOnDragEnd = (result) => {
    setWindowStack({ action: 'focus', window: result.draggableId });
    setIexploreWindow(!iexploreWindow);
  };

  const replacerFunc = () => {
    const visited = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (visited.has(value)) {
          return;
        }
        visited.add(value);
      }
      return value;
    };
  };

  React.useEffect(() => {
    const normalizedWindowPositions = {};
    Object.entries(windowPositions).map(([key, value]) => {
      normalizedWindowPositions[key] = {
        x: value.x,
        y: value.y,
      }
    });
    window.localStorage.setItem('windowPositions', JSON.stringify(normalizedWindowPositions, replacerFunc()))
  }, [windowPositions]);

  React.useEffect(() => {
    const normalizedWindowSizes = {};
    Object.entries(windowSizes).map(([key, value]) => {
      normalizedWindowSizes[key] = {
        width: value.width,
        height: value.height,
      }
    });
    window.localStorage.setItem('windowSizes', JSON.stringify(normalizedWindowSizes, replacerFunc()))
  }, [windowSizes]);

  return (
    <Wrapper>
      <GlobalStyles></GlobalStyles>
        {
          windowStack.map((window, i) => {
            return (
              <Rnd
                key={window + i}
                onDragStop={(e, data) => {
                  setWindowPositions(pos => {
                    return {  ...pos, [window]: data }
                  });
                }}
                onResizeStop={(e, data, ref) => {
                  setWindowSizes(sizes => {
                    return {  ...sizes, [window]: ref.style }
                  });
                  //e.stopImmediatePropagation()
                }}
                onClick={
                  () => {
                    setWindowStack({ action: 'focus', window: window });
                    setIexploreWindow(!iexploreWindow);
                  }}
                default={{
                  x: (width / 2 - 200) + (i * 40),
                  y: 100 + (i * 40),
                  width: 1000,
                }}
                position={windowPositions[window]}
                size={windowSizes[window]}
                minWidth={300}
                dragHandleClassName="window-header"
                enableResizing={{
                  bottom: true,
                  bottomLeft: false,
                  bottomRight: true,
                  left: false,
                  right: true,
                  top: false,
                  topLeft: false,
                  topRight: false
                }}
                maxWidth={'100vw'}
              >
                <div className="window">
                  <div active={i === windowStack.length - 1} className='window-header'>
                    <span>{window}.exe</span>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '0.25rem' }}>
                      <div className='close-button' onClick={(event) => {
                        setWindowStack({ action: 'del', window: window });
                        setWelcomeWindow(!welcomeWindow);
                        event.stopPropagation();
                      }}>
                        <span className='close-icon' />
                      </div>
                    </div>
                  </div>
                  <div>
                    {windows[window]}
                  </div>
                </div>
              </Rnd>
            );
          })
        }
        <div className='toolbar'>
          <div className='start-button' onClick={() => setOpen(!open)}>
            <img
              src={logoIMG}
              alt='react95 logo'
              style={{ height: '20px', marginRight: '14px' }}
            />
            Start
          </div>
          {open && (
            <div className='menu' onClick={() => setOpen(false)}>
              <div className={`menu-item ${!address ? '' : 'menu-item-disabled'}`} onClick={connect}>
                <span role='img' aria-label='🔗'>
                  🔗
                </span>
                {address ? 'Connected' : 'Connect Wallet'}
              </div>
              {/* <Divider></Divider>
              <div className={`menu-item ${address ? '' : 'menu-item-disabled'}`} onClick={() => setWindowStack({ action: 'push', window: 'x' })}>
                <span role='img' aria-label='👨‍🍳' >
                  👨‍🍳
                </span>
                &nbsp;Prepare Meal (Earn fees)
              </div>
              <div className={`menu-item ${address ? '' : 'menu-item-disabled'}`} onClick={() => setWindowStack({ action: 'push', window: 'stake' })}>
                <span role='img' aria-label='🍴' >
                  🍴
                </span>
                Dining Table (Staking)
              </div> */}
              <div className={`menu-item ${address ? '' : 'menu-item-disabled'}`} onClick={() => setWindowStack({ action: 'push', window: 'nftselector' })}>
                <span role='img' aria-label='🤑' >
                  🤑
                </span>
                List your NFT
              </div>
              <div className={`menu-item ${address ? '' : 'menu-item-disabled'}`} onClick={() => setWindowStack({ action: 'push', window: 'createoffer' })}>
                <span role='img' aria-label='💱' >
                  💱
                </span>
                Create offer for NFT
              </div>
              <div className={`menu-item ${address ? '' : 'menu-item-disabled'}`} onClick={() => setWindowStack({ action: 'push', window: 'mypools' })}>
                <span role='img' aria-label='🏊' >
                  🏊
                </span>
                My Pools
              </div>
              <div className={`menu-item ${address ? '' : 'menu-item-disabled'}`} onClick={() => setWindowStack({ action: 'push', window: 'sweep' })}>
                <span role='img' aria-label='🔀'>
                  🔀
                </span>
                Sweep NFTs
              </div>

              <div className={`menu-item ${address ? '' : 'menu-item-disabled'}`} onClick={() => {
                setWindowStack({ action: 'push', window: 'n00d' });
                setWelcomeWindow(true);
              }}>
                <span role='img' aria-label='👨‍💻'>
                  👨‍💻
                </span>
                Info
              </div>
              <div className={`menu-item ${address ? '' : 'menu-item-disabled'}`} onClick={() => {
                spawnStraySheep();
              }}>
                straysheep.exe
              </div>
            </div>
          )}
        </div>
    </Wrapper>
  );
}
