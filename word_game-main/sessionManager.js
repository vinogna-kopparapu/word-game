const sessions = {};
const userGames = {};

function isValidUsername(username) {
  const allowedChars = /^[a-zA-Z0-9_]+$/;
  return allowedChars.test(username);
}

function createSession(username) {
  const sid = generateSessionId();
  sessions[sid] = { username };
  return sid;
}

function getSession(sid) {
  return sessions[sid];
}

function destroySession(sid) {
  delete sessions[sid];
}

function createGame(username, words) {
  const secretWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
  userGames[username] = {
    secretWord,
    guesses: [],
    guessCount: 0,
    possibleWords: words.map(word => word.toLowerCase()),
  };
  console.log(`New game started for ${username}. Secret word: ${secretWord}`);
  return userGames[username];
}

function getActiveGame(username) {
  return userGames[username];
}

function isValidGuess(guess, gameState) {
  const lowerGuess = guess.toLowerCase();
  return gameState.possibleWords.includes(lowerGuess) && !gameState.guesses.includes(lowerGuess);
}

function makeGuess(username, guess) {
  const gameState = userGames[username];
  
  if (!gameState) {
    return { success: false, message: 'No active game. Please start a new game.' };
  }

  const lowerGuess = guess.toLowerCase();
  
  if (!gameState.possibleWords.includes(lowerGuess)) {
    return { success: false, message: 'Invalid guess: Word not in the list.' };
  }
  
  if (gameState.guesses.includes(lowerGuess)) {
    return { success: false, message: 'Invalid guess: Word already guessed.' };
  }
 
  
  gameState.guesses.push(lowerGuess);
  gameState.guessCount++;

  const matchingLetters = countMatchingLetters(lowerGuess, gameState.secretWord);
  const isCorrect = lowerGuess === gameState.secretWord;

  let message;
  if (isCorrect) {
    message = 'Correct guess: Congratulations! You\'ve guessed the word!';
  } else {
    message = `Valid guess: Your guess matched ${matchingLetters} letters${matchingLetters !== 1 ? 's' : ''}`;
    if (matchingLetters === gameState.secretWord.length && lowerGuess !== gameState.secretWord) {
    message += ' All letters match, but in the wrong order.';
  }
}


  return { 
    success: true, 
    message: message,
    isCorrect: isCorrect
  };
}

function countMatchingLetters(guess, secretWord) {
  const guessLetters = guess.split('');
  const secretLetters = secretWord.split('');
  return guessLetters.filter(letter => secretLetters.includes(letter)).length;
}

function generateSessionId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = {
  isValidUsername,
  createSession,
  getSession,
  destroySession,
  createGame,
  getActiveGame,
  isValidGuess,
  makeGuess
};