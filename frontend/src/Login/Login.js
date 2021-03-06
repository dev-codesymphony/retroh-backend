import React, { useState } from "react";
import Web3 from "web3/dist/web3.min.js";

let web3 = undefined; // Will hold the web3 instance

export const Login = ({ onLoggedIn }) => {
  const [loading, setLoading] = useState(false); // Loading button state

  const referredby = localStorage.getItem("referral_code");

  const handleAuthenticate = ({ publicAddress, signature }) =>
    fetch(`/api/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());

  const handleSignMessage = async ({ publicAddress, nonce }) => {
    try {
      const signature = await web3.eth.personal.sign(
        `I am signing my one-time nonce: ${nonce}`,
        publicAddress,
        "" // MetaMask will ignore the password argument here
      );

      return { publicAddress, signature };
    } catch (err) {
      throw new Error("You need to sign the message to be able to log in.");
    }
  };

  function generateUID(length) {
    return window
      .btoa(
        Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2)))
          .map((b) => String.fromCharCode(b))
          .join("")
      )
      .replace(/[+/]/g, "")
      .substring(0, length);
  }

  const handleSignup = async (publicAddress) => {
    const username = generateUID(5);
    let url = "/api/users?referredby=";
    if (referredby) {
      url = `/api/users?referredby=${referredby}`;
    }

    const body = JSON.stringify({ publicAddress, username });
    const headers = {
      "Content-Type": "application/json",
    };
    const res = await fetch(`${url}`, {
      body: body,
      headers: headers,
      method: "POST",
    });

    const resJson = await res.json();
    document.getElementById("wallet_connection").click();
    // return resJson;
  };
  const handleClick = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      window.alert("Please install MetaMask first.");
      return;
    }

    if (!web3) {
      try {
        // Request account access if needed
        await window.ethereum.enable();

        // We don't know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        web3 = new Web3(window.ethereum);
      } catch (error) {
        window.alert("You need to allow MetaMask.");
        return;
      }
    }

    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert("Please activate MetaMask first.");
      return;
    }

    const publicAddress = await coinbase.toLowerCase();
    setLoading(true);

    // Look if user with current publicAddress is already present on backend
    fetch(`/api/users?publicAddress=${publicAddress}`)
      .then((response) => response.json())
      // If yes, retrieve it. If no, create it.
      .then(async (users) =>
        users.length ? users[0] : await handleSignup(publicAddress)
      )
      // Popup MetaMask confirmation modal to sign message
      .then(handleSignMessage)
      // Send signature to backend on the /auth route
      .then(handleAuthenticate)
      // Pass accessToken back to parent component (to save it in localStorage)
      .then(onLoggedIn)
      .catch((err) => {
        // window.alert(err);
        setLoading(false);
      });
  };

  return (
    <>
      <button
        id="wallet_connection"
        className="Login-button Login-mm btn btn-default"
        onClick={handleClick}
      >
        <img
          className="connect"
          src="/images/connect-wallet.svg"
          alt="connect wallet"
          width={19}
          height={32}
        />
        <span className="button-text">
          {loading ? "Please wait Loading..." : "Connect your wallet"}
        </span>
        <span className="token-info">
          <span className="points">+1</span>
          <img src="/images/token.svg" alt="+1 token" width={32} height={32} />
        </span>
      </button>
    </>
  );
};
