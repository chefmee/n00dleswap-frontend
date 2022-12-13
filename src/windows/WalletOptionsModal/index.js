import React from "react";
import { List, ListItem, WindowContent } from "react95";
import {useAccount, useConnect} from "wagmi";

export function WalletOptionsModal() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const { address } = useAccount()

  return (
    <WindowContent>
      <List>
        {connectors.map((connector) => (
          <ListItem
            disabled={!connector.ready || !!address}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </ListItem>
        ))}
      </List>
        <br></br>
      {error && <p>{error.message}</p>}
        {address && <p>Connected as {address}. Please disconnect from your wallet app.</p>}
    </WindowContent>
  );
}
