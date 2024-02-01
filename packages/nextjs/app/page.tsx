"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Frame from "../public/Frame.jpg";
import Eframe from "../public/ethframe.jpg";
import twitterLogo from "../public/twitter-logo.svg";
import Domains from "../utils/Domains.json";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { AbiItem } from "web3-utils";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Add the domain you will be minting
const tld = ".lyx";
const CONTRACT_ADDRESS = "0xf94279151ea5d9E89775b677481b1653D2f21927";

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  // Add some state data propertie
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState("");

  // const connectWallet = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       alert("Get MetaMask -> https://metamask.io/");
  //       return;
  //     }

  //     const accounts = await ethereum.request({ method: "eth_requestAccounts" });

  //     console.log("Connected", accounts[0]);
  //     setCurrentAccount(accounts[0]);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) {
      return;
    }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price = domain.length === 3 ? "14.2" : domain.length === 4 ? "4.2" : "4.2";
    console.log("Minting domain", domain, "with price", price);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Domains.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let tx = await contract.register(domain, { value: ethers.utils.parseEther(price) });
        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash);

          // Set the record for the domain
          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

          setRecord("");
          setDomain("");
        } else {
          alert("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render methods
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/X5LeLm1YRHVPa/giphy.gif?cid=790b7611igsi1or8vwh1t9yf8mqxq3ylz71zck1tfb1l7e10&ep=v1_gifs_search&rid=giphy.gif&ct=g"
        alt=""
      />
      {/* Call the connectWallet function we just wrote when the button is clicked */}
      <button className="cta-button connect-wallet-button">Connect UP (coming soon)</button>
      <br />
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );

  const renderInputForm = () => {
    return (
      <div className="form-container">
        <div className="first-row">
          <input type="text" value={domain} placeholder="domain" onChange={e => setDomain(e.target.value)} />
          <p className="tld"> {tld} </p>
        </div>

        <input
          type="text"
          value={record}
          placeholder="whats ur UP address?"
          onChange={e => setRecord(e.target.value)}
        />

        <div className="button-container">
          <p style={{ textAlign: "center" }}></p>
          {/* Call the mintDomain function when the button is clicked*/}
          <button className="cta-button mint-button" onClick={mintDomain}>
            Mint
          </button>
          <br></br>
        </div>
      </div>
    );
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Register your</span>
            <span className="block text-4xl font-bold">.LYX domain name</span>
          </h1>
        </div>
        <div className="App">
          <div className="container">
            <div className="header-container">
              <header></header>
            </div>

            {/* {!currentAccount && renderNotConnectedContainer()}
        {/* Render the input form if an account is connected */}
            {currentAccount && renderInputForm()}

            <br></br>
            <br></br>
          </div>
        </div>
        <div className="chains flex justify-center items-center gap-12 flex-col sm:flex-row">
          <input type="radio" name="radio-3" class="radio radio-secondary" checked />
          <input type="radio" name="radio-3" class="bsc radio radio-secondary" disabled />
          <input type="radio" name="radio-3" class="radio radio-secondary" disabled />
          <input type="radio" name="radio-3" class="radio radio-secondary" disabled />
        </div>
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <span>MATIC</span>
          <span>BSC</span>
          <span>ETH</span>
          <span>LUKSO</span>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Coming soon to a chain near you...</span>
          </h1>
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none">
              <path fill="url(#B)" d="M0 0h270v270H0z" />
              <defs>
                <filter id="A" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity=".225" width="200%" height="200%" />
                </filter>
              </defs>
              <path
                d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z"
                fill="#fff"
              />
              <defs>
                <linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#cb5eee" />
                  <stop offset="1" stopColor="#FE005B" stopOpacity=".99" />
                </linearGradient>
              </defs>
              <text
                x="32.5"
                y="231"
                fontSize="27"
                fill="#fff"
                filter="url(#A)"
                fontFamily="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif"
                fontWeight="bold"
              >
                multichain🆙.lyx
              </text>
            </svg>
            <Image src={Frame}></Image>
            <Image src={Eframe}></Image>
            <svg width="270" height="270" viewBox="0 0 270 270" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_3_19)">
                <path d="M0 0H270V270H0V0Z" fill="url(#paint0_linear_3_19)" />
                <g clipPath="url(#clip1_3_19)">
                  <path
                    d="M248.894 26.8429L220.606 11.9813C215.596 9.33957 209.404 9.33957 204.394 11.9813L176.106 26.8429C171.096 29.4847 168 34.3549 168 39.6236V69.3616C168 74.6303 171.096 79.5006 176.106 82.1423L204.394 97.0187C209.404 99.6604 215.596 99.6604 220.606 97.0187L248.894 82.1423C253.904 79.5006 257 74.6303 257 69.3616V39.6236C257 34.3549 253.92 29.4847 248.894 26.8429ZM234.953 57.4517L226.539 70.7194C225.388 72.5494 223.248 73.671 220.93 73.671H204.086C201.768 73.671 199.628 72.5494 198.477 70.7194L190.047 57.4517C188.896 55.6216 188.896 53.3784 190.047 51.5483L198.461 38.2806C199.612 36.4506 201.752 35.329 204.07 35.329H220.897C223.216 35.329 225.356 36.4506 226.507 38.2806L234.92 51.5483C236.104 53.3784 236.104 55.6216 234.953 57.4517Z"
                    fill="#FFF8FA"
                  />
                </g>
              </g>
              <defs>
                <linearGradient id="paint0_linear_3_19" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#" />
                  <stop offset="1" stopColor="#FE005B" stopOpacity="0.99" />
                </linearGradient>
                <clipPath id="clip0_3_19">
                  <rect width="270" height="270" fill="white" />
                </clipPath>
                <clipPath id="clip1_3_19">
                  <rect width="89" height="89" fill="white" transform="translate(168 10)" />
                </clipPath>
              </defs>
              <text
                x="32.5"
                y="231"
                fontSize="27"
                fill="#fff"
                filter="url(#A)"
                fontFamily="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif"
                fontWeight="bold"
              >
                comingsoon.lyx
              </text>
            </svg>
          </div>
          <div className="flex justify-center items-center gap-48 flex-col sm:flex-row">
            <span>live now</span>
            <span>coming soon</span>
            <span>coming soon</span>
            <span>coming soon</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
