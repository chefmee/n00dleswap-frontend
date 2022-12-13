import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureChains, chain } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import store from './store.js'
import { Provider } from 'react-redux'

import { WagmiConfig, createClient } from 'wagmi'
const root = ReactDOM.createRoot(document.getElementById('root'));


const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.goerli],
  [alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_TOKEN })],
  // [jsonRpcProvider({
  //   rpc: (chain) => ({
  //     http: `https://rpc.tenderly.co/fork/2280f484-0104-4fb8-862b-8770805671ff`,
  //   }),
  // }),]
)
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

root.render(
  <Provider store={store}><WagmiConfig client={client}><App />
  </WagmiConfig></Provider>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
