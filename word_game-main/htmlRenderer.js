function renderLoginForm(errorMessage = '') {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Word Guessing Game - Login</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
      <div class="login-container">
        <h1>Word Guessing Game</h1>
        <form action="/login" method="POST" onsubmit="return validateForm()" class="login-form">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" placeholder="Enter your username">
          <button type="submit">Login</button>
        </form>
        <p id="error-message" class="error">${errorMessage}</p>
        <script>
          function validateForm() {
            var username = document.getElementById('username').value;
            if (username.trim() === '') {
              document.getElementById('error-message').textContent = 'Please enter a username.';
              return false;
            }
            return true;
          }
        </script>
      </div> 
      </body>
      </html>
    `;
  }
  
  function renderGamePage(username, gameState, words, message = '') {
    const { secretWord, guesses, guessCount } = gameState;
    const isGameWon = guesses.map(g => g.toLowerCase()).includes(secretWord.toLowerCase());
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Word Guessing Game</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Word Guessing Game</h1>
        <p>Welcome, <span class="username"> ${username}!</p>
        <div class="game-container">
          <h2>Possible Words</h2>
          <div class="word-list">
            ${words.map(word => `<span class="word">${word}</span>`).join('')}
          </div>
          <h2>Your Guesses</h2>
          <div class="game-content">
            <ul>
              ${guesses.map(guess => `<li>${guess} (${countMatchingLetters(guess, secretWord)} matching letters)</li>`).join('')}
            </ul>
            <p>Guess count: ${guessCount}</p>
            
            ${isGameWon ? 
              `<p class="success">Congratulations! You've guessed the word: ${secretWord}</p>` :
              `<form action="/guess" method="POST" class="guess-form">
                <label for="guess">Guess a word:</label>
                <input type="text" id="guess" name="guess" required>
                <button type="submit" class="guess-button">Guess</button>
              </form>`
            }
           
            ${message ? `<p class="${getMessageClass(message)}">${message}</p>` : ''}
          </div>
          <form action="/new-game" method="POST" class="new-game-button">
            <button type="submit">Start New Game</button>
          </form>
          <form action="/logout" method="POST" class="logout-form">
            <button type="submit" class="logout-button">Logout</button>
          </form>
        </div>
      </body>
      </html>
    `;
  }
  
  function countMatchingLetters(guess, secretWord) {
    const guessLetters = guess.toLowerCase().split('');
    const secretLetters = secretWord.toLowerCase().split('');
    return guessLetters.filter(letter => secretLetters.includes(letter)).length;
  }
  
  function getMessageClass(message) {
    if (message.startsWith('Correct guess:')) return 'Success';
    if (message.startsWith('Incorrect guess:')) return 'Error';
    if (message.startsWith('Invalid guess:')) return 'Failed';
    if (message.startsWith('Valid guess:')) return 'info';
    return 'default';
  }
  
  module.exports = {
    renderLoginForm,
    renderGamePage,
    countMatchingLetters
  };