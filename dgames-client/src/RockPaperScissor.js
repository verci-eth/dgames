import React from 'react';
import { ethers } from 'ethers';
import RPS from './utils/RPS.json';

function RockPaperScissor() {
  const [start, setStart] = React.useState(false);
  const [choice, setChoice] = React.useState('');
  const [computer, setComputer] = React.useState('');
  const [result, setResult] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const CONTRACT_ADDRESS = '0x968AE3Df2268A6642E34BEF9D6729658dA0Cc4e1';

  const chooseRock = () => {
    if(choice) {
      alert('you already chose');
      return;
    }
    setChoice('rock');
  }

  const choosePaper = () => {
    if(choice) {
      alert('you already chose');
      return;
    }
    setChoice('paper');
  }

  const chooseScissors = () => {
    if(choice) {
      alert('you already chose');
      return;
    }
    setChoice('scissors');
  }

  const randomPick = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  const startGame = async () => {
    try{
      const { ethereum } = window;
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      const goerliChainId = '0x5';
      if (chainId !== goerliChainId) {
        alert('pls connect to Goerli Testnet');
        return;
      }
  
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, RPS.abi, signer);

      let txn = await contract.newGame();
      setProcessing(true);

      const receipt = await provider.getTransactionReceipt(txn.hash);
      setProcessing(false);

      if (receipt.status === 1) {
        setStart(true);
      } else {
        alert('transaction failed');
      }
    }
    catch(error) {
      alert(error)
    }
  }

  const renderPlayerChoice = () => (
    <div>
      <div>player choice: {choice}</div>
      <div>computer choice: {computer}</div>
      <div>game result: {result}</div>
    </div>
  )

  const renderMakeChoice = () => (
    <div>
      <p>make your choice</p>
      <button onClick={chooseRock}>rock</button>
      <button onClick={choosePaper}>paper</button>
      <button onClick={chooseScissors}>scissors</button>
    </div>
  )

  const renderStartGame = () => (
    <div>
      <button onClick={startGame}>start game</button>
      {processing ? <p>starting new game...</p> : null}
    </div>
  )

  React.useEffect(() => {
    setComputer(randomPick(['rock', 'paper', 'scissors']));

    if (choice === computer) {
      setResult('tie');
    } else if (
      (choice === 'rock' && computer === 'scissors') ||
      (choice === 'scissors' && computer === 'paper') ||
      (choice === 'paper' && computer === 'rock')
    ) {
      setResult('you win');
    } else {
      setResult('you lose');
    }
  }, [choice, computer]);

  return (
    <div>
      {start ? ( renderMakeChoice() ) : ( renderStartGame() )}
      {choice ? ( renderPlayerChoice() ) : null}
    </div>
  )
}

export default RockPaperScissor;
