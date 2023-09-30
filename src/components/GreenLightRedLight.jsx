import React, { useState, useEffect } from 'react';

const GreenLightRedLight = () => {
  const [gameState, setGameState] = useState('initial'); 
  const [playerData, setPlayerData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    difficulty: 'Easy',
  });
  const [errors, setErrors] = useState({
    nameError: '',
    emailError: '',
    mobileNumberError: '',
  });
  const [boxColor, setBoxColor] = useState('red');
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(40);

  useEffect(() => {
    let intervalId;
    let timeoutId;

    const changeBoxColor = () => {
      setBoxColor((prevColor) => (prevColor === 'red' ? 'green' : 'red'));

      
      const randomInterval = Math.floor(Math.random() * 501) + 1000;

     
      intervalId = setTimeout(changeBoxColor, randomInterval);
    };

    if (gameState === 'playing') {
      changeBoxColor();

      timeoutId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 0) {
            setGameState('lost');
            clearTimeout(intervalId); 
            clearInterval(timeoutId);
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearTimeout(intervalId);
      clearInterval(timeoutId);
    };
  }, [gameState]);

  const handleBoxClick = () => {
    if (boxColor === 'green' && gameState === 'playing') {
      setScore(score + 1);
      const winningScore = getWinningScore();
      if (score + 1 === winningScore) {
        setGameState('won');
      }
    } else {
      setGameState('lost');
    }
  };

  const getWinningScore = () => {
    switch (playerData.difficulty) {
      case 'Easy':
        return 10;
      case 'Medium':
        return 15;
      case 'Hard':
        return 25;
      default:
        return 10;
    }
  };

  const handleStartGame = () => {
    const { name, email, mobileNumber } = playerData;
    let nameError = '';
    let emailError = '';
    let mobileNumberError = '';

    if (name.length < 3) {
      nameError = 'Please Enter a valid name';
    }

    if (!email.includes('@')) {
      emailError = 'Please Enter a valid email id';
    }

    if (mobileNumber.length !== 10) {
      mobileNumberError = 'Please Enter a valid mobile number';
    }

    setErrors({ nameError, emailError, mobileNumberError });

    if (nameError === '' && emailError === '' && mobileNumberError === '') {
      setGameState('playing');
    }
  };

  const handleTryAgain = () => {
    setGameState('initial');
    setScore(0);
    setTimeRemaining(40);
    setBoxColor('red');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'initial':
        return (
          <div>
            <h1 style={{ color: 'blue' }}>Play The Game</h1>
            <div className="form-group">
              <label htmlFor="name" style={{ color: 'brown' }}>
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={playerData.name}
                onChange={(e) => setPlayerData({ ...playerData, name: e.target.value })}
              />
              {<div className="error">{errors.nameError}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="email" style={{ color: 'brown' }}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={playerData.email}
                onChange={(e) => setPlayerData({ ...playerData, email: e.target.value })}
              />
              {<div className="error">{errors.emailError}</div>}
            </div>
            <div className="form-group" style={{ color: 'brown' }}>
              <label htmlFor="mobileNumber">Mobile Number:</label>
              <input
                type="tel"
                id="mobileNumber"
                value={playerData.mobileNumber}
                onChange={(e) => setPlayerData({ ...playerData, mobileNumber: e.target.value })}
              />
              {<div className="error">{errors.mobileNumberError}</div>}
            </div>
            <div className="form-group" style={{ color: 'brown' }}>
              <label htmlFor="difficulty">Difficulty Level:</label>
              <select
                id="difficulty"
                value={playerData.difficulty}
                onChange={(e) => setPlayerData({ ...playerData, difficulty: e.target.value })}
              >
                <option value="Easy">Easy (10 points to win)</option>
                <option value="Medium">Medium (15 points to win)</option>
                <option value="Hard">Hard (25 points to win)</option>
              </select>
            </div>
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        );
      case 'playing':
        return (
          <div id="gamescreen">
            <div
              className="color-box"
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: boxColor,
                position: 'relative',
                left: '100px',
              }}
              onClick={handleBoxClick}
            ></div>
            <div className="info">
              <h2 style={{ color: 'yellow' }}>Score: {score}</h2>
              <h2 style={{ color: 'yellow' }}>Time Remaining: {timeRemaining}</h2>
              <h2 style={{ color: 'yellow' }}>Difficulty Level: {playerData.difficulty}</h2>
              <h2 style={{ color: 'yellow' }}>Points to Win: {getWinningScore()}</h2>
            </div>
            
          </div>
        );
      case 'won':
        return (
          <div>
            <h2 style={{ color: 'green' }}>Congratulations You Won!</h2>
            <button onClick={handleTryAgain}>Try Again</button>
          </div>
        );
      case 'lost':
        return (
          <div>
            <h2 style={{ color: 'red' }}>Game Over</h2>
            <button onClick={handleTryAgain}>Try Again</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="game-container">{renderContent()}</div>
    </div>
  );
};

export default GreenLightRedLight
