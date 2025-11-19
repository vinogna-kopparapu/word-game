const express = require('express');
const cookieParser = require('cookie-parser');
const sessionManager = require('./sessionManager');
const htmlRenderer = require('./htmlRenderer');
const words = require('./words');

const app = express();
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const sid = req.cookies.sid;
  const session = sessionManager.getSession(sid);

  if (session) {
    const username = session.username;
    const gameState = sessionManager.getActiveGame(username);
    if (gameState) {
      return res.send(htmlRenderer.renderGamePage(username, gameState, words));
    } else {
      const newGameState = sessionManager.createGame(username, words);
      return res.send(htmlRenderer.renderGamePage(username, newGameState, words));
    }
  } else {
    res.send(htmlRenderer.renderLoginForm());
  }
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  
  if (!username || username.trim() === '') {
    return res.send(htmlRenderer.renderLoginForm('Please enter a username.'));
  }
  
  if (username.toLowerCase() === 'dog') {
    return res.send(htmlRenderer.renderLoginForm('Dog is not Permitted.'));
  }
  
  if (!sessionManager.isValidUsername(username)) {
    return res.send(htmlRenderer.renderLoginForm('Username is Invalid.'));
  }
  
  const sid = sessionManager.createSession(username);
  res.cookie('sid', sid);

  let gameState = sessionManager.getActiveGame(username);
  
  if (!gameState) {
    gameState = sessionManager.createGame(username, words);
  } else {
    console.log(`Resumed game for ${username}. Secret word: ${gameState.secretWord}`);
  }

  res.send(htmlRenderer.renderGamePage(username, gameState, words));
});

app.post('/guess', (req, res) => {
  const sid = req.cookies.sid;
  const session = sessionManager.getSession(sid);

  if (!session) {
    return res.send(htmlRenderer.renderLoginForm('Session expired. Please log in again.'));
  }

  const username = session.username;
  const guess = req.body.guess;

  const gameState = sessionManager.getActiveGame(username);

  if (!gameState) {
    return res.send(htmlRenderer.renderLoginForm('No active game. Please start a new game.'));
  }

 
  const result = sessionManager.makeGuess(username, guess);

  
  const statusMessage = result.message;

  res.send(htmlRenderer.renderGamePage(username, gameState, words, statusMessage));
});
app.post('/new-game', (req, res) => {
  const sid = req.cookies.sid;
  const session = sessionManager.getSession(sid);

  if (!session) {
    return res.send(htmlRenderer.renderLoginForm('Session expired. Please log in again.'));
  }

  const username = session.username;
  const newGameState = sessionManager.createGame(username, words);
  
  res.send(htmlRenderer.renderGamePage(username, newGameState, words));
});

app.post('/logout', (req, res) => {
  const sid = req.cookies.sid;
  sessionManager.destroySession(sid);
  res.clearCookie('sid');
  res.send(htmlRenderer.renderLoginForm());
});

app.listen(3000, () => {
  console.log('Access the application at http://localhost:3000');
});