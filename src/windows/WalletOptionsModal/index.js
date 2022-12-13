import React from "react";
import { List, ListItem, WindowContent } from "react95";
import { useConnect } from "wagmi";

export function WalletOptionsModal() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <WindowContent>
      <List>
        {connectors.map((connector) => (
          <ListItem
            disabled={!connector.ready}
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
      {error && <p>{error.message}</p>}
    </WindowContent>
  );
}
