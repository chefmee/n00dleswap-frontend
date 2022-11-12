import React from "react";
import { Button, Panel, WindowContent, LoadingIndicator } from "react95";
import { useSelector, useDispatch } from "react-redux";
import { select, unselectAll } from "../../reducers/selectNFT";
import { open as openWindow } from "../../reducers/openWindow";
import { useAccount, useNetwork } from "wagmi";
import axios from "axios";
import { setModalStatus } from "../../reducers/modal";
import { ModalTypes } from "../../constants/modalTypes";
export function MyNFTsSelector() {
  /**
   * Wagmi init
   */
  const { address } = useAccount();
  const { chain } = useNetwork();

  /**
   * Redux
   */
  const [nfts, setNfts] = React.useState([]);
  const dispatch = useDispatch();
  const setWindowStack = (a) => dispatch(openWindow(a));
  
  /**
   * States
   */
  const [loadBar, setLoadBar] = React.useState(true);
  const { selectedNFTs, isSameCollection } = useSelector((state) => state.selectNFT);
  const isInSelectedNFTs = (n) =>
    selectedNFTs.indexOf(
      n.address + "|*|" + n.id + "|*|" + n.imageUrl + "|*|" + n.name
    ) !== -1;
    
  /**
   * Effects
   */
  React.useEffect(() => {
    async function get() {
      const res = await axios.get(
        `https://core-service-ipnp6ty54a-uc.a.run.app/v0/collaterals?owner=${address}&ethereum=0x${chain?.id.toString(
          16
        )}`
      );
      // after fetching API, load bar is turned off
      setLoadBar(false);
      setNfts(res.data.map((e) => ({ ...e, address: e.collection.address })));
    }
    get();
  }, [address]);

  React.useEffect(() => {
    if (!isSameCollection) {
      dispatch(setModalStatus({
        type: ModalTypes.ERROR,
        message: 'Can only select NFTs from the same collection'
      }))
    }
  }, [isSameCollection])
  
  return (
    <WindowContent>
      {/* load bar started out as flase so make Loading... as default, then if nft length is 0, show no nft, if nft length is bigger than 0, show the nfts */}
      {loadBar ? (
        <>
          <p
            style={{
              textAlign: "center",
              marginBottom: "0.5rem",
            }}
          >
            Loading...
          </p>
          <LoadingIndicator isLoading />
        </>
      ) : nfts.length === 0 ? (
        <>
          <p
            style={{
              textAlign: "center",
              marginBottom: "0.5rem",
              color: "#ff3300",
            }}
          >
            You have no NFTs to select
          </p>
        </>
      ) : (
        <>
          <p style={{ padding: "0.5rem" }}>
            Select your NFTs to list them for sale &nbsp;{" "}
            {selectedNFTs?.length ? (
              <>
                <Button
                  onClick={() =>
                    setWindowStack({ action: "push", window: "createpool" })
                  }
                >
                  List {selectedNFTs?.length} NFTs
                </Button>
                <Button
                  onClick={() => {
                    dispatch(unselectAll());
                  }}
                >
                  Unselect all
                </Button>
              </>
            ) : (
              <></>
            )}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexFlow: "row wrap",
              maxHeight: 500,
              overflow: "scroll",
            }}
          >
            {nfts.map((n) => {
              return (
                <Panel
                  onClick={() => dispatch(select(n))}
                  variant={!isInSelectedNFTs(n) ? "inside" : "well"}
                  key={n.address + "|*|" + n.id}
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    height: 180,
                    width: 180,
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                  }}
                >
                  <img src={n.imageUrl} height="80%" />
                  <p
                    style={{
                      overflowX: "hidden",
                      overflowY: "visible",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {n.name}
                  </p>
                </Panel>
              );
            })}
          </div>

          <Panel
            variant="well"
            style={{
              marginTop: "1rem",
              marginBottom: "-1rem",
              padding: "0.1rem 0.25rem",
              width: "100%",
            }}
          >
            NFTs selected: {selectedNFTs?.length}
          </Panel>
        </>
      )}
    </WindowContent>
  );
}
