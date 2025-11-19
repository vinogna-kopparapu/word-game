const words = require('./words');

const gameStates = {};

function isValidUsername(username) {
  const allowedChars = /^[a-zA-Z0-9_]+$/;
  return allowedChars.test(username) && username.toLowerCase() !== 'dog';
}

function startNewGame(username) {
  const secretWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
  gameStates[username] = {
    secretWord,
    guesses: [],
    guessCount: 0,
  };
  console.log(`New game started for ${username}. Secret word: ${secretWord}`);
  return gameStates[username];
}

function isValidGuess(guess, gameState) {
  const possibleWords = words.map(word => word.toLowerCase());
  return possibleWords.includes(guess.toLowerCase()) && 
         !gameState.guesses.map(g => g.toLowerCase()).includes(guess.toLowerCase());
}

function countMatchingLetters(guess, secretWord) {
  const guessLetters = guess.toLowerCase().split('');
  const secretLetters = secretWord.toLowerCase().split('');
  return guessLetters.filter(letter => secretLetters.includes(letter)).length;
}

function makeGuess(username, guess) {
    const gameState = gameStates[username];
    
    if (!gameState) {
      return { success: false, message: 'No active game. Please start a new game.' };
    }
  
    guess = guess.toLowerCase();
    
    if (!isValidGuess(guess, gameState)) {
      if (!words.map(word => word.toLowerCase()).includes(guess)) {
        return { success: false, message: 'Invalid guess: Word not in the list.' };
      } else {
        return { success: false, message: 'Invalid guess: Word already guessed.' };
      }
    }
  
    gameState.guesses.push(guess);
    gameState.guessCount++;
  
    const matchingLetters = countMatchingLetters(guess, gameState.secretWord);
    const validGuess = `Valid guess: Your guess matched ${matchingLetters} .`;
    if (guess === gameState.secretWord) {
        return { 
          success: true, 
          validGuess: validGuess,
          correctGuess: 'Correct guess! Congratulations! You\'ve guessed the word!', 
          matchingLetters: guess.length 
        };
      } else {
        return { 
          success: true, 
          validGuess: validGuess,
          correctGuess: 'Incorrect guess. Try again.', 
          matchingLetters 
        };
      }
}

module.exports = {
  isValidUsername,
  startNewGame,
  makeGuess,
  isValidGuess,
  countMatchingLetters,
};