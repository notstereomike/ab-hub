// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXCuQ_fslJu_cQIrU9kfceB1IRINoxbGc",
    authDomain: "ab-snake.firebaseapp.com",
    databaseURL: "https://ab-snake-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ab-snake",
    storageBucket: "ab-snake.appspot.com",
    messagingSenderId: "404692561562",
    appId: "1:404692561562:web:0cb96a1a39dd5b5ea77923",
    measurementId: "G-1HKE4EV9CC"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // This should be at the top of your script.js file, after initializing Firebase
  const database = firebase.database();
  
  // Fetch scores from Firebase
  database.ref('/scores').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const scores = Object.values(data);
      scores.sort((a, b) => b.score - a.score);
      // Update your leaderboard here with the scores data
      updateLeaderboard(scores);
    }
  });
  
  function submitScore(name, company, email, score) {
    console.log("Submitting score to Firebase...");
    const newScoreKey = database.ref().child('scores').push().key;
  
    console.log('New score key:', newScoreKey); // Log the new score key
  
    // Create the data we want to update
    const scoreData = {
      name: name,
      company: company,
      email: email,
      score: score,
      date: firebase.database.ServerValue.TIMESTAMP,
    };
  
    console.log('Score data:', scoreData); // Log the score data
  
    // Create the updates object
    let updates = {};
    updates['/scores/' + newScoreKey] = scoreData;
  
    // Update the database
    return database
      .ref()
      .update(updates)
      .then(() => {
        console.log('Score submitted successfully.'); // Log success
      })
      .catch((error) => {
        console.error('Error submitting score:', error); // Log any errors
      });
  }
  
  // Function to show the game over pop-up
  function showGameOverPopup() {
    gameOverOverlay.style.display = 'flex';
    gameScoreMessage.innerText = `You scored ${score} Points!`;
  
    // Get a reference to the input fields and buttons
    const nameInput = document.getElementById('name');
    const companyInput = document.getElementById('company');
    const emailInput = document.getElementById('email');
    const submitButton = document.getElementById('game-over-submit-button');
    const cancelButton = document.getElementById('game-over-cancel-button');
  
    // Add an event listener to the submit button
    submitButton.addEventListener('click', function (event) {
      // Prevent the button from submitting normally
      event.preventDefault();
  
      // Get the user's input
      const userName = nameInput.value;
      const userCompany = companyInput.value;
      const userEmail = emailInput.value;
  
      // Call submitScore
      submitScore(userName, userCompany, userEmail, score);
  
      // Clear the input fields
      nameInput.value = '';
      companyInput.value = '';
      emailInput.value = '';
  
      // Hide the game over overlay
      gameOverOverlay.style.display = 'none';
  
      showThanksPopup();
    });
  
    // Add an event listener to the cancel button
    cancelButton.addEventListener('click', function (event) {
      // Prevent the button from submitting normally
      event.preventDefault();
  
      // Clear the input fields
      nameInput.value = '';
      companyInput.value = '';
      emailInput.value = '';
  
      // Hide the game over overlay
      gameOverOverlay.style.display = 'none';
    });
  }
  
  // Game variables
  let snake = [{ x: 11, y: 11 }];
  let direction = { x: 1, y: 0 };
  let apple = null;
  let score = 0;
  let gameStarted = false;
  let gameOver = false;
  
  // Initialize snake speed
  let snakeSpeed = 2;
  
  // Game constants
  const GAME_BOARD_SIZE = 20;
  
  // Game board element
  const gameBoard = document.getElementById('game-board');
  
  // Start pop-up box element
  const startOverlay = document.getElementById('start-overlay');
  const startButton = document.getElementById('start-button');
  
  // Game over pop-up box element
  const gameOverOverlay = document.getElementById('game-over-overlay');
  const gameScoreMessage = document.getElementById('game-over-message');
  
  // Thanks pop-up box element
  const thanksOverlay = document.getElementById('thanks-overlay');
  const restartButton = document.getElementById('restart-button');
  const cancelButton = document.getElementById('cancel-button');
  
  // Leaderboard element
  const leaderboardList = document.getElementById('leaderboard-list');
  
  // Input fields and button for leaderboard entry
  const nameInput = document.getElementById('name');
  const companyInput = document.getElementById('company');
  const emailInput = document.getElementById('email');
  const submitButton = document.getElementById('submit-button');
  
  // Function to show the thanks pop-up
  function showThanksPopup() {
    hideGameOverPopup();
    thanksOverlay.style.display = 'flex';
  }
  
  // Function to hide the thanks pop-up
  function hideThanksPopup() {
    thanksOverlay.style.display = 'none';
  }
  
  // Function to show the start pop-up
  function showStartPopup() {
    startOverlay.style.display = 'flex';
  }
  
  // Function to hide the start pop-up
  function hideStartPopup() {
    startOverlay.style.display = 'none';
  }
  
  // Function to show the game over pop-up
  function showGameOverPopup() {
    gameOverOverlay.style.display = 'flex';
    gameScoreMessage.innerText = `You scored ${score} Points! Enter your details to be added to our leaderboard!`;
  }
  
  // Function to hide the game over pop-up
  function hideGameOverPopup() {
    gameOverOverlay.style.display = 'none';
  }
  
  function checkCollision(pos) {
    return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
  }
  
  function generateApple() {
    let newApplePosition;
  
    // Keep generating new positions until we find one not occupied by the snake.
    do {
      newApplePosition = {
        x: Math.floor(Math.random() * GAME_BOARD_SIZE) + 1,
        y: Math.floor(Math.random() * GAME_BOARD_SIZE) + 1
      };
    } while (checkCollision(newApplePosition));
  
    return newApplePosition;
  }
  
  // Function to start the game loop
  function startGame() {
    hideStartPopup();
    resetGame();
    drawGame(); // Draw initial game state
    gameStarted = true;
    gameLoop(); // Start the game loop
  }
  
  // Event listener for start button
  startButton.addEventListener('click', startGame);
  
  // Event listener for submit button
  submitButton.addEventListener('click', () => {
    const name = nameInput.value;
    const company = companyInput.value;
    const email = emailInput.value;
  
    // Check if input fields are empty
    if (!name || !company || !email) {
      // Show an error message or prevent submission
      return;
    }
  
    // Add score to leaderboard
    addScoreToLeaderboard(name, company, email, score)
      .then(() => {
        // Clear input fields
        nameInput.value = '';
        companyInput.value = '';
        emailInput.value = '';
  
        // Show the Thanks pop-up
        showThanksPopup();
      })
      .catch((error) => {
        console.error('Error submitting score:', error);
      });
  
    // Clear input fields
    nameInput.value = '';
    companyInput.value = '';
    emailInput.value = '';
  });
  
  // Function to add score to leaderboard
  function addScoreToLeaderboard(name, company, email, score) {
    const leaderboardEntry = {
      name,
      company,
      email,
      score,
    };
  
    const newScoreKey = database.ref('/scores').push().key;
  
    const updates = {};
    updates['/scores/' + newScoreKey] = leaderboardEntry;
  
    return database
      .ref()
      .update(updates)
      .then(() => {
        console.log('Score submitted successfully.');
      })
      .catch((error) => {
        console.error('Error submitting score:', error);
      });
  }
  
  // Function to update the current score on the webpage
  function updateScore() {
    const scoreValueElement = document.getElementById('current-score');
    scoreValueElement.textContent = score;
  }
  
  // Function to update the leaderboard
  function updateLeaderboard(scores) {
    leaderboardList.innerHTML = '';
  
    for (let i = 0; i < Math.min(scores.length, 3); i++) {
      const leaderboardEntry = scores[i];
      const listItem = document.createElement('li');
      listItem.innerText = `${leaderboardEntry.name} (${leaderboardEntry.company}): ${leaderboardEntry.score} points`;
      leaderboardList.appendChild(listItem);
    }
  
    // Update highest score
    if (scores.length > 0) {
      const highestScore = scores[0].score;
      const highScoreElement = document.getElementById('high-score');
      highScoreElement.textContent = highestScore;
    }
  }
  
  
  // Function to restart the game
  function restartGame() {
    gameStarted = false;
    gameOver = false;
    hideThanksPopup();
    resetGame();
    startGame();
    hideStartPopup(); // Add this line to hide the start pop-up
  }
  
  // Function to cancel and go back to the start screen
  function cancelGame() {
    hideGameOverPopup();
    hideThanksPopup();
    showStartPopup();
  }
  
  // Event listener for restart button
  restartButton.addEventListener('click', restartGame);
  
  // Event listener for cancel button
  cancelButton.addEventListener('click', cancelGame);
  
  // Initialize leaderboard
  let scores = [];
  
  // Show start pop-up when the page loads
  window.addEventListener('DOMContentLoaded', () => {
    showStartPopup();
  });
  
  // Game update function
  function updateGame() {
    if (!gameStarted || gameOver) return; // Don't update if the game hasn't started or the game is over
  
    // If the snake hasn't started moving, skip this game update
    if (direction.x === 0 && direction.y === 0) return;
  
    // Update snake position
    const head = { ...snake[0] }; // Get current head position
    head.x += direction.x;
    head.y += direction.y;
  
    // Game over condition
    if (
      head.x < 1 ||
      head.y < 1 ||
      head.x > GAME_BOARD_SIZE ||
      head.y > GAME_BOARD_SIZE ||
      checkCollision(head)
    ) {
      endGame();
      return;
    }
  
    snake.unshift(head); // Add new head to snake
  
    if (apple && apple.x === head.x && apple.y === head.y) {
      // Snake ate the apple
      score++;
      apple = null;
      updateScore();
      snakeSpeed += 0.1;
    } else {
      // Remove tail
      snake.pop();
    }
  
    // Create new apple
    if (apple === null) {
      apple = generateApple();  // Modified this line to use the new generateApple function
    }
  
    drawGame();
  }
  
  // Game draw function
  function drawGame() {
    // Clear game board
    gameBoard.innerHTML = '';
  
    // Draw snake
    snake.forEach((part) => {
      const snakeElement = document.createElement('div');
      snakeElement.style.gridRowStart = part.y;
      snakeElement.style.gridColumnStart = part.x;
      snakeElement.classList.add('snake-part');
      gameBoard.appendChild(snakeElement);
    });
  
    // Draw apple
    if (apple !== null) {
      const appleElement = document.createElement('div');
      appleElement.style.gridRowStart = apple.y;
      appleElement.style.gridColumnStart = apple.x;
      appleElement.classList.add('apple');
      gameBoard.appendChild(appleElement);
    }
  }
  
  // Function to check collision with the snake itself
  function checkCollision(position) {
    for (let i = 0; i < snake.length; i++) {
      const part = snake[i];
      if (part.x === position.x && part.y === position.y) {
        console.log('Collision detected with part:', part);
        console.log('Position:', position);
        return true;
      }
    }
    return false;
  }
  
  // Function to end the game
  function endGame() {
    gameOver = true;
    showGameOverPopup();
  }
  
  // Event listener for arrow keys
  // Event listener for arrow keys and on-screen arrow buttons
  window.addEventListener('keydown', (e) => {
    if (!gameStarted) return; // Only handle arrow key events when the game has started
  
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y !== 1) direction = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (direction.y !== -1) direction = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) direction = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (direction.x !== -1) direction = { x: 1, y: 0 };
        break;
    }
  });
  
  // Event listeners for on-screen arrow buttons
  const upButton = document.getElementById('up-button');
  const downButton = document.getElementById('down-button');
  const leftButton = document.getElementById('left-button');
  const rightButton = document.getElementById('right-button');
  
  upButton.addEventListener('click', () => {
    if (!gameStarted) return;
    if (direction.y !== 1) direction = { x: 0, y: -1 };
  });
  
  downButton.addEventListener('click', () => {
    if (!gameStarted) return;
    if (direction.y !== -1) direction = { x: 0, y: 1 };
  });
  
  leftButton.addEventListener('click', () => {
    if (!gameStarted) return;
    if (direction.x !== 1) direction = { x: -1, y: 0 };
  });
  
  rightButton.addEventListener('click', () => {
    if (!gameStarted) return;
    if (direction.x !== -1) direction = { x: 1, y: 0 };
  });
  
  // Function to reset the game state
  function resetGame() {
    snake = [{ x: 11, y: 11 }];
    direction = { x: 1, y: 0 };
    apple = generateApple();
    score = 0;
    updateScore();
    gameStarted = false;
    gameOver = false;
    snakeSpeed = 2;
    hideGameOverPopup();
  }
  
  // Game loop
  function gameLoop() {
    if (gameStarted && !gameOver) {
      setTimeout(() => {
        updateGame();
        gameLoop();
      }, 1000 / snakeSpeed);
    }
  }