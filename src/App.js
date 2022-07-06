import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { ethers, providers} from 'ethers';

import Stack from '@mui/material/Stack';

import { abi } from './exports';

import Animate from "react-move/Animate";

import ftm from './ftm.png';

const provider = new providers.JsonRpcProvider('https://rpc.ftm.tools');

function App() {
  const [ mint, setMintClick ] = useState(true);
  const [ mintPrice, setMintPrice ] = useState(0);
  const [ acctData, setAcctData ] = useState({
    account: '',
    signer: null,
  });
  const [ contract, setContract ] = useState(
    new ethers.Contract('0x4360025dFFD59c5191E0967e6fa36B8EDe232828', abi, provider)
  );
  const [ minted, setMinted ] = useState(false);

  const [ left, setLeft ] = useState(3333);

  const [ ftmPrice, setFtmPrice ] = useState(0);

  const connectWallet = async () => {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0xFA",
        rpcUrls: ["https://rpc.ftm.tools"],
        chainName: "Fantom Opera",
        nativeCurrency: {
            name: "FTM",
            symbol: "FTM",
            decimals: 18
        },
        blockExplorerUrls: ["https://ftmscan.com/"]
      }]
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum, 250);
    let signer = provider.getSigner();
    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];

    setAcctData({
      signer: signer,
      account: account,
    });

    console.log(acctData)

    setContract(
      new ethers.Contract('0x4360025dFFD59c5191E0967e6fa36B8EDe232828', abi, signer)
    );
  };

  const getMintPrice = async () => {
    await contract.functions.getPrice().then(result => {
      setMintPrice(result/10**18);
    });
  };

  const getSupply = async () => {
    await contract.functions.totalSupply().then(result => {
      setLeft(3333 - result);
    });
  };

  const getFTMPrice = async () => {
    await fetch('https://api.coingecko.com/api/v3/coins/fantom?localization=false').then(async result => {
      setFtmPrice((await result.json())["market_data"]["current_price"]["usd"])
      console.log(ftmPrice)
    })
  }

  const everything = () => {
    getMintPrice();
    getSupply();
    getFTMPrice();
  };

  everything();

  const mintClickHandler = () => {
    setMintClick(!mint);
  }

  const Home = () => {
    return(<><header className="App-header">
    <h1>
      Welcome to the Ultimate Realm
    </h1>
    <p>
      {`Mint price is currently ${`${mintPrice} FTM or $${(mintPrice*ftmPrice).toFixed(3)} USD` || "[loading...]"}.`}
    </p>
    <button
      onClick={mintClickHandler}
      style={{
        height: '10vh',
        width: '20vw',
        borderRadius: '30px',
        fontSize: '24px',
        backgroundColor: '#763f5a',
        border: '0px',
        cursor: 'pointer',
        boxShadow: '5px 10px 108px #000'
      }}
    >
      Mint a Fantom...
    </button></header></>);
  }

  const [ fantPos, setPos ] = useState(0);

  const randPos = () => {
    setPos(Math.floor(Math.random() * window.innerWidth));
    return fantPos;
  }

  const [ text, setText ] = useState('0');

  const handleUpdate = (e) => {
    if (parseInt(e.target.value) > 10) {
      setText('10');
    } else if (parseInt(e.target.value) < 1) {
      setText('1');
    } else {
      setText(e.target.value);
    }
  };

  const mintFantoms = async () => {
    console.log(text);
    await contract.functions.publicMint(text, { value: ethers.utils.parseEther((mintPrice*(parseInt(text))).toString())});
    setMinted(true);
  };

  const MintPage = () => {
    return (<><header className="App-header">
      {/*http://www.rw-designer.com/cursor-extern.php?id=75397)*/}
      <h1 style={{marginTop: ''}}>Summon An Ultimate Fantom</h1>
      <br />
      <ul>
        <li>20% of all mint goes to hold2earn rewards</li>
        <li>10% of all mint goes to buying and burning <a className="lnk" href="https://app.spiritswap.finance">SPIRIT</a></li>
        <li>15% of all mint goes to buying and burning <a className="lnk" href="https://fractalstudios.io/rndm/buy.html">RNDM</a></li>
        <li>30% of all mint goes to <a className="lnk" href="https://ftmscan.com/token/0x16dbd24713c1e6209142bcfeed8c170d83f84924">OPR</a> and <a className="lnk" href="https://staking.fantoms.art/">Staking OPR</a></li>
        <li>1% goes to paying independent artists that worked on the Fantoms (1%/artist)</li>
      </ul>
      <br />
      <h3>There are {left} Fantoms left</h3>
      <button onClick={connectWallet} style={{
        height: '7.5vh',
        width: '12.5vw',
        borderRadius: '30px',
        fontSize: '16px',
        backgroundColor: '#763f5a',
        border: '0px',
        cursor: 'pointer',
        marginBottom: '10px',
        color: '#FFF',
      }}>{acctData.account ? `${(acctData.account.split('')[0])}${(acctData.account.split('')[1])}${(acctData.account.split('')[2])}${(acctData.account.split('')[3])}${(acctData.account.split('')[4])}${(acctData.account.split('')[5])}${(acctData.account.split('')[6])}${(acctData.account.split('')[7])}${(acctData.account.split('')[8])}${(acctData.account.split('')[9])}${(acctData.account.split('')[10])}...` : "Connect Wallet"}</button>
      <Stack direction="row" margin={2}>
        <input type="number" min={1} max={10} onChange={handleUpdate} value={parseInt(text)} style={{
          height: '7.5vh',
          width: '12.5vw',
          borderRadius: '30px',
          fontSize: '16px',
          backgroundColor: '#763f5a',
          border: '0px',
          marginBottom: '10px',
          marginRight: '5px',
          paddingLeft: '3vw',
          color: '#FFF',
        }}/>
        <button onClick={mintFantoms} style={{
          height: '7.5vh',
          width: '12.5vw',
          borderRadius: '30px',
          fontSize: '16px',
          backgroundColor: '#763f5a',
          border: '0px',
          cursor: 'pointer',
          marginBottom: '10px',
          color: '#FFF',
        }}>Summon!</button>
      </Stack>
    </header></>)
  };

  return (
    <div className="App">{mint ? <Home/> : <MintPage/>}</div>
  );
}

export default App;
