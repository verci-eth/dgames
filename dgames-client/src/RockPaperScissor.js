import React from 'react';
import { ethers } from 'ethers';
import RPS from './utils/RPS.json';

function RockPaperScissor() {
  const [choice, setChoice] = React.useState('');
  const [computer, setComputer] = React.useState('');
  const [result, setResult] = React.useState('');
  const [link, setLink] = React.useState('');
  const [msgValue, setMsgValue] = React.useState(0.005);
  const [processing, setProcessing] = React.useState(false);
  const CONTRACT_ADDRESS = '0x53f6FA5bC0Ddcfb0A3Fe3FF2473126f689Bab4A7';
  const min_bet = 0.001
  const max_bet = 0.01

  const handleChange = event => {
    let i = event.target.value
    if(i > max_bet) {
      setMsgValue(max_bet);
    }
    else if (i < min_bet) {
      setMsgValue(min_bet);
    }
    else {
      setMsgValue(i);
    }
  }

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

  const playAgain = () => {
    setChoice('');
    setComputer('');
    setResult('');
  }

  const playGame = async (player_choice) => {
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

      contract.on('GameResult', (computer, message) => {
        if(computer.toNumber() === 0) {
          setComputer('rock');
        }
        else if(computer.toNumber() === 1) {
          setComputer('paper');
        }
        else if(computer.toNumber() === 2) {
          setComputer('scissors');
        }
        setResult(message);
      });

      setProcessing(true);
      const txn =  await contract.playGame(player_choice, {value : ethers.utils.parseEther(msgValue.toString()), gasLimit : 100000});
      await txn.wait();
      setLink(`https://goerli.etherscan.io/tx/${txn.hash}`)
      setProcessing(false);
    }
    catch(error) {
      setProcessing(false);
      playAgain();
      if(error.code === 'ACTION_REJECTED') {
        alert('accept the transaction to start a new game')
      }
      else if(error.code === 'TRANSACTION_REPLACED') {
        alert('transaction has been canceled')
      }
      else {
        console.log(error)
        alert(`pls contact @verci_eth to report this error\n\nerror code: ${error.code}\n\n${error}`)
      }
    }
  }

  const renderFinalResults = () => (
    <div>
      <p>computer choice: <b style={{color: '#2DD2FF'}}>{computer}</b></p>
      <p><b style={result === 'player win' ? {color:'#45E773'} : result === 'player lose' ? {color:'#FE484C'} : {color:'#FFDD00'}}>{result}</b></p>
      {link ? <p>game txn <b><a href={link} target='_blank' rel="noreferrer">here</a></b></p> : null}
      <button onClick={playAgain}>play again</button>
    </div>
  )

  const renderGameResults = () => (
    <div>
      <p>player choice: <b style={{color: '#2DD2FF'}}>{choice}</b></p>
      {processing ? <p style={{color: '#FFDD00'}}>processing game result..</p> : ( renderFinalResults() )}
    </div>
  )

  const renderMakeChoice = () => (
    <div>
      <p className='rules'>HOW TO PLAY</p>
      <div><b>you VS smart contract</b></div>
      <p style={{color: '#FFDD00'}}><b>1. bet your eth {min_bet} - {max_bet}</b></p>
      <input
        type="number"
        value={msgValue}
        onChange={handleChange}
        min={min_bet}
        max={max_bet}
        step={0.001}
      />
      <p style={{color: '#FFDD00'}}><b>2. make your choice</b></p>
      <button onClick={chooseRock}>rock</button>
      <button onClick={choosePaper}>paper</button>
      <button onClick={chooseScissors}>scissors</button>
      <p style={{color: '#FFDD00'}}><b>3. wait for the result</b></p>
      <div>player win {'>'}{'>'} u get 2x</div>
      <div>draw {'>'}{'>'} u get em back</div>
      <div>player lose {'>'}{'>'} fund contract</div>
    </div>
  )

  React.useEffect(() => {
    let player_choice;
    if(choice === 'rock') {
      player_choice = 0;
      playGame(player_choice);
    }
    else if(choice === 'paper') {
      player_choice = 1;
      playGame(player_choice);
    }
    else if(choice === 'scissors') {
      player_choice = 2;
      playGame(player_choice);
    }
  }, [choice]);

  return (
    <div>
      {choice ? ( renderGameResults() ) : ( renderMakeChoice() )}
    </div>
  )
}

export default RockPaperScissor;
