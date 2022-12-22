
import React from "react";
import { ThemeProvider } from "styled-components";
import {
  AppBar,
  Toolbar,
  Button,
  List,
  ListItem,
  Divider,
  Window,
  WindowHeader,
} from "react95";
// pick a theme of your choice
import original from "react95/dist/themes/original";
// original Windows95 font (optionally)

import {useAccount, useEnsName, useNetwork, useSwitchNetwork} from 'wagmi';
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
import { WalletOptionsModal } from "./windows/WalletOptionsModal";
import { Modal } from "./windows/Modal";
import { setModalStatus } from "./reducers/modal";
import { ModalTypes } from "./constants/modalTypes";
import {useLocation} from "react-router-dom";

export default function Default() {
  const search = useLocation().search;
  const action = new URLSearchParams(search).get("action");
  const collectionAddress = new URLSearchParams(search).get("collectionAddress");


  const [open, setOpen] = React.useState(false);
  const [welcomeWindow, setWelcomeWindow] = React.useState(true);
  const [iexploreWindow, setIexploreWindow] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);
  const [iframesrc, _setIframesrc] = React.useState("");
  const [isEligible, setIsEligible] = React.useState(
    false || process.env.NODE_ENV === "development"
  );
  const [windowPositions, setWindowPositions] = React.useState({});
  const [windowSizes, setWindowSizes] = React.useState({});
  const windowStack = useSelector((state) => state.openWindow);
  const { message } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const setWindowStack = (a) => dispatch(openWindow(a));
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
  const [width, height] = useWindowSize();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork()
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  React.useEffect(() => {
    if (window.eSheep) {
      if (!initialized) {
        const esheep = new window.eSheep();
        esheep.Start();
        setWindowStack({ action: "push", window: "n00d" });

        setWindowStack({ action: "push", window: "walletSelector" });
        setInitialized(true);
      }
    }
  }, [window.eSheep]);

  React.useEffect(() => {
    if (action === 'list') {
      if (address) {
        setWindowStack({ action: "push", window: "createpool" });
      } else {
        dispatch(setModalStatus({
          type: ModalTypes.ERROR,
          message: `You are about to list an NFT from collection address ${collectionAddress}. Please connect your wallet first to complete the listing.`
        }))
      }

    }
  }, [address])

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
  }, [width, height, windowPositions]);

  React.useEffect(() => {
    if (chain?.id && chain?.id != 1 && chain?.id != 5) {
      dispatch(setModalStatus({
        type: ModalTypes.ERROR,
        message: `Network ${chain?.id} not supported. A switch network prompt is activated in Metamask to help you switch the network.`
      }))
      switchNetwork?.(1) // switch to ethereum network
    }
  }, [chain])


  const spawnStraySheep = () => {
    const esheep = new window.eSheep();
    esheep.Start();
  };

  const onConnectButtonClicked = () => {
    setWindowStack({ action: "push", window: "walletSelector" })
  };

  function setIframesrc(x) {
    if (windowStack.indexOf("iexplore") === -1)
      setWindowStack({ action: "push", window: "iexplore" });
    _setIframesrc(x);
  }

  return (
    <Wrapper>
      <GlobalStyles></GlobalStyles>
      <ThemeProvider theme={original}>
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
                  x: 50 + (i * 40),
                  y: 50 + (i * 40),
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
                maxHeight={'70vh'}
              >
                <Window>
                <WindowHeader
                  active={i === windowStack.length - 1}
                  className="window-header"
                >
                  <span>{window}.exe</span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      gap: "0.25rem",
                    }}
                  >
                    {/* <Button onClick={(event) => {
                        setWindowStack({ action: 'max', window: win });
                      }}>
                      </Button> */}
                    <Button
                      onClick={(event) => {
                        setWindowStack({ action: "del", window: window });
                        setWelcomeWindow(!welcomeWindow);
                        event.stopPropagation();
                      }}
                    >
                      <span className="close-icon" />
                    </Button>
                  </div>
                </WindowHeader>
                <div
                  style={{
                    overflowY: "scroll",
                    overflowX: "hidden",
                    height: "calc(100% - 2.5em)",
                  }}
                >
                  {windows[window]}
                </div>
              </Window>
            </Rnd>
          );
        })}
        {message.length > 0 && <Modal />}

        <AppBar>
          <Toolbar style={{ justifyContent: "space-between" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Button
                onClick={() => setOpen(!open)}
                active={open}
                style={{ fontWeight: "bold" }}
              >
                <img
                  src={logoIMG}
                  alt="react95 logo"
                  style={{ height: "20px", marginRight: 4 }}
                />
                Start
              </Button>
              {open && (
                <List
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "100%",
                  }}
                  onClick={() => setOpen(false)}
                >
                  <ListItem disabled={address} onClick={onConnectButtonClicked}>
                    <span role='img' aria-label='🔗'>

                      🔗
                    </span>
                    {address ? "Connected" : "Connect Wallet"}
                  </ListItem>
                  <Divider></Divider>
                  <ListItem disabled={!address} onClick={() => setWindowStack({ action: 'push', window: 'x' })}>
                    <span role='img' aria-label='👨‍🍳' >
                      👨‍🍳
                    </span>
                    &nbsp;Fee staking
                  </ListItem>
                  {/* <ListItem disabled={!address} onClick={() => setWindowStack({ action: 'push', window: 'stake' })}>
                    <span role='img' aria-label='🍴' >
                      🍴
                    </span>
                    Dining Table (Staking)
                  </ListItem> */}
                  <Divider />
                  <ListItem
                    disabled={!address}
                    onClick={() =>
                      setWindowStack({ action: "push", window: "nftselector" })
                    }
                  >
                    <span role="img" aria-label="🤑">
                      🤑
                    </span>
                    List your NFT
                  </ListItem>
                  <ListItem
                    disabled={!address}
                    onClick={() =>
                      setWindowStack({ action: "push", window: "createoffer" })
                    }
                  >
                    <span role="img" aria-label="💱">
                      💱
                    </span>
                    Create offer for NFT
                  </ListItem>
                  <ListItem
                    disabled={!address}
                    onClick={() =>
                      setWindowStack({ action: "push", window: "mypools" })
                    }
                  >
                    <span role="img" aria-label="🏊">
                      🏊
                    </span>
                    My Pools
                  </ListItem>
                  <Divider></Divider>
                  <ListItem
                    disabled={!address}
                    onClick={() =>
                      setWindowStack({ action: "push", window: "sweep" })
                    }
                  >
                    <span role="img" aria-label="🔀">
                      🔀
                    </span>
                    Sweep NFTs
                  </ListItem>
                  <Divider />

                  <ListItem
                    onClick={() => {
                      setWindowStack({ action: "push", window: "n00d" });
                      setWelcomeWindow(true);
                    }}
                  >
                    <span role="img" aria-label="👨‍💻">
                      👨‍💻
                    </span>
                    Info
                  </ListItem>
                  <ListItem
                    onClick={() => {
                      spawnStraySheep();
                    }}
                  >
                    straysheep.exe
                  </ListItem>
                </List>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Wrapper>
  );
}

