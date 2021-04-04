import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { BouncerProxy } from '../abi/BouncerProxyABI.js';
import { useAlert, positions } from "react-alert";


export const Web3Context = createContext();

const Web3Provider = props => {

  const [currentAccount, setCurrentAccount] = useState('');
  const [currentNetworkID, setCurrentNetworkID] = useState(0);
  const [bouncerContract, setBouncerContract] = useState({});
  let [web3, setWeb3] = useState({});
  const alert = useAlert();
  // let web3;
  const checkWeb3Provider = async () => {
    if (window.ethereum) {
      // let web3 = new Web3(window.ethereum);
      web3 = new Web3(Web3.givenProvider);
      setWeb3(web3);
      await window.ethereum.request({ method: 'eth_requestAccounts' }); // get permission to access accounts
      const contractAddress = '0x9f930eE9305F816F5C6d9bDc1a6073Fee19Ace43'; //Deployed to the rinkeby test network
      const bouncerContract = new web3.eth.Contract(BouncerProxy, contractAddress);
      console.log('bouncerContract', bouncerContract);
      setBouncerContract(bouncerContract);

      //Set to the currentAccount state whatever account the user is using at the moment he loads the page
      const accounts = await web3.eth.getAccounts();
      setCurrentAccount(accounts[0]);
      //Set to networkdId the ID of the network the user has in use in Metamask
      let currentNetworkID = await web3.eth.net.getId();
      setCurrentNetworkID(currentNetworkID);

      //Detect metamask account change
      window.ethereum.on('accountsChanged', function (accounts) {
        //console.log('accountsChanges',accounts[0]);
        setCurrentAccount(accounts[0]);
      });
      //Detect metamask network ID change
      window.ethereum.on('chainChanged', function (networkId) {
        // console.log('chainChanged',networkId);
        setCurrentNetworkID(networkId);
      });
    } else {
      console.warn("No web3 detected. Falling back to https://data-seed-prebsc-1-s1.binance.org:8545. You should remove this fallback when you deploy live",);
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      let web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545"),);
    }
  };

  console.log('currentNetworkID', currentNetworkID);

  const showAlert = () => {
    if (currentNetworkID === 0) {
      alert.info('Loading...', { position: positions.BOTTOM_RIGHT });
    } else if (currentNetworkID === 97) {
      alert.success("Great! You are connected to the BSC Test Network", { position: positions.BOTTOM_RIGHT });
    } else {
      alert.error(
        "This application will only work in the Kovan or Rinkeby Test Network, please change the network to the Rinkeby Test Network", { position: positions.BOTTOM_RIGHT }
      );
    }
  };

  useEffect(() => {
    checkWeb3Provider();
  }, []);

  useEffect(() => {
    showAlert();
  }, [currentNetworkID]);

  return (
    <Web3Context.Provider
      value={{
        currentAccount,
        bouncerContract,
        web3,
      }}
    >
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
