# INFO6250 Project1 - Server-side Dynamic Site

**Due Sun Oct 20, 11:59pm PT**

Special Notes:
- This is a big part of your grade, please check the requirements CAREFULLY
- It is absolutely not worth risking it to copy work, the risk is just not worth it.  Make sure you understand the expectations about copying, ChatGPT/Copilot/etc, and referencing anyone's work.

## Submission Instructions

- Start from the up-to-date main branch (git checkout main; git pull origin main)
- Create a feature branch named 'project1' (git checkout -b project1)
- Create a package.json and necessary files to complete the work described in this README
  - You can add/modify any files except as limited below
    - In particular: Do not load external JS, no client-side/browser JS, do not change words.js
  - Remember that all work you submit must be based on my code or represent your writing
    - Do not start from someone else's code - write it all yourself
    - ChatGPT and other LLMs do not count as writing it yourself
- Add, commit, and push the branch to github
    - Don't forget to check the files, this project is not in work/, you may have .gitignore mismatch!
- Create a PR to merge to main
- Be sure to include the reviewer(s).

## Goals

- You will build a web-based word guessing game
  - this site will use only backend-generated HTML
  - this site will use no front-end JS
- You will demonstrate the skills taught in class
- Extra Credit: You have visuals, styling, or functionality beyond the minimum required

## Functional Requirements

For all the below Requirements: 
- **Possible words** means the words found in the list in words.js when the program runs
    - If the list in words.js changes before the program runs, your program will treat the new list as the "possible words"
- A **game** means one specific secret word for this user is chosen from the possible words and the user takes multiple turns making guesses
  - A **new game** means a new secret word for this user is selected, the number of guesses made is reset to 0, and the all words in the possible words list are again valid guesses 
    - Statistics about previous games may be preserved if you wish
        - This means you can track how many games have been played, how many have been finished, the lowest number of turns before a game was finished, the largest number of turns before a game was finished, or anything other such details that do not impact the current game being played by any player
- **valid guess** means a guess that is:
  - is one of the possible word, and
  - has not already been guessed this game 
- Guesses are not case-sensitive, so "these" is both a "valid guess" and a "correct guess" if one of the possible words is "THESE"
- **invalid guess** means a guess that:
- is not one of possible words, OR
- is a possible word that has already been guessed this game
- **correct guess** means a valid guess that IS the secret word (case-insensitive)
- **incorrect guess** means a valid guess that is not the secret word
    - A guess that is in the list of possible words but is not the secret word is a "valid guess" and an "incorrect" guess the first time it is guessed in a game, but guessing that word a second time in a game is an "invalid guess" and neither a "correct guess" nor an "incorrect guess"
  - A guess that shares all of the letters of the secret word but is NOT the secret word (such as EAT vs TEA), is NOT a correct guess and does not win the game

### Home Page

When the User loads the page (path: `/`)
- the site will determine if the user is logged in (based on `sid` session cookie)

- If the user is not logged in:
  - the page will display a login form instead of the below content
  - the login form will ask for a username but will NOT ask for a password
  - the login form will POST to `/login` (see "The Login Flow")

- A logged in user will see:
  - A list of words the secret word could be
    - You should consider the different ways to show this list in HTML in a way that is easy to read and works for different browser window sizes without requiring horizontal scrolling
  - A list of any previously made valid guesses and how many letters each matched (see "Making a Guess")
  - A count of how many valid guesses they have made so far this game (essentially, a score a player wants to keep low)
  - What their most recent valid guess was, and how many letters it matched
    - or, if their previous guess was invalid they will be told that guess and that it was invalid
        - There is no requirement to show an invalid guess if it was not the most recent guess
  - If their previous guess was correct: a message saying they have won
  - If their previous guess was incorrect: an option to make another guess (see "Making a Guess")
  - An option to logout
  - An option to start a new game
  - Notice: All of the above is true even if they reload the page. The user stays logged in and the displayed information does not change
  - You can choose how to display the above information.  You might combine the list of available words and the list of guessed words and matches, or you might have them as separate lists, for example. What matters is:
    - The information is all present
    - The information is understandable to an average user

- A different user will see the above information for themselves, not the information of a different user, and their game is not altered if another player is playing a separate game at the same time
  - Use different browsers or browser-profiles to test this - each profile can log in separately as different users

### Making a Guess

A guess will be sent as a POST to the path `/guess`
- The server will check for a valid session id
  - If there is not a valid session id, the page will display a message and a login form
    - Hint: an invalid session id could come from manually changing your cookie or restarting the server (the server will forget all session ids, but the browser will still have the sid cookie)
- The server will check for a valid guess
  - If the guess is not valid, the server will update the server state for that player and respond with a redirect to the Home Page 
  - If the guess is valid, the server will update the server state for that player and respond with a redirect to the Home Page
  - Note: this is different than the error message from the express-login assignment.  Here the knowledge of what error to show needs to be in the information stored in the server.
  - Hint: See "Home Page" for ideas on what details the server state will have to know.  If we had a database much of that information would be there, but because we do not we will simply hold the state data in different objects.  Remember to keep information for different players separate.

The guess is evaluated for how many letters match between the guess and secret word (see "Starting a New Game"), regardless of position of the letters in the word and regardless of the upper/lower case of the letters.  
- Hint: This should sound like an earlier assignment

### Starting a New Game

A new game begins when a user starts a new game or logs in for the first time.
- A secret word is picked at random from the list of available words
  - Hint: see Math.random() at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random to get a random number, and Math.floor() to convert that to an integer.
  - The list of available words is exported by the provided `words.js` file
    - `require()` this file in your JS to get the array of words.
    - You may change the words in words.js, but you should not otherwise alter the file.
      - Notice: You should not otherwise alter the file.  Don't add more logic to words.js, though you can have a file that has more logic and that itself loads words.js.
      - Your game code must still work if we replace words.js with a different list of words that are exported the same way

If the user is starting a new game by virtue of logging in for the first time, it is done as part of login and does not require extra navigation in the browser

If the user is manually starting a new game, it is done as a POST to `/new-game`
- The server will check for a valid session id
  - If there is not a valid session id, the page will display a message and a login form
    - Hint: an invalid session id could come from manually changing your cookie or restarting the server (the server will forget all session ids, but the browser will still have the sid cookie)
- If there is a valid session, after updating the state, the response will redirect to the Home Page.

To help with grading, the server will `console.log()` the username and the chosen secret word whenever a new game is started for a player.
- This is not a debugging console.log().  Be careful to make sure all debugging console.log() statements are removed before turning in your project

Important: No information is sent to the browser that allows someone to learn the secret word without playing the game

### The Login Flow

Login is performed as a POST to `/login`
- It will send only the username, no password
- If the username is valid the server will respond with a `sid` cookie using a uuid.
  - a "valid username" is one composed only of allowed characters
    - You select the list of valid characters
  - Enforce the validity of the username by having an allowlist of valid characters
  - explicitly disallow username "dog" 
    - This simulates a user with a bad password, since we aren't using passwords
  - after setting the cookie header, respond with a redirect to the Home Page
  - a user with a valid username will always be treated as if the are an existing user
    - There is no user registration in this application - any valid, non-"dog" username is allowed to login
- If the username is invalid (but not "dog"), respond with a login form that contains a message about the username being invalid
- If the username is "dog", respond with a login form that contains a message saying "dog" is not granted access.
    - These "show a login form that contains a message" should NOT be the results of redirects

If a username that is in the middle of a game logs in
- They will be able to resume their existing game
- Hint: This means the game info is not tied to their session id, it is tied to their username
  - Hint2: Have one object that connects sessions to usernames, and a second, separate object that connects usernames to game state

### The Logout Flow

A user logs out with a POST to `/logout`
- Even a user with no session id or an invalid session id can logout
- This will clear the session id cookie (if any) on the browser
- This will remove the session information (if any) from the server
  - Hint `delete obj["key"]` will remove the "key" property from object "obj"
- Logout does NOT clear the game information from the server
  - The user can log in as the same username and resume the game
- After the logout process the server will respond with a redirect to the Home Page

Hint: Be sure to test login/logout, resuming a game already in-progress, and related requirements!

## Visual Requirements

- The game requires some effort to visually present the data and forms
  - spacing, color, and layout of sections should make it readable and presentable as a demonstration of skill
  - In particular, make sure:
    - The list of allowed words is formatted to fit on most screens without scrolling
    - A user playing the game can understand the information they are presented (such as what guesses have been made and their corresponding) 
- The game does not need to work on mobile screens, but it should look appropriate at a range of desktop sizes
- This is not a web design class, so I do not expect art.  However, even fully backend coders must be able to present their work pleasantly.

## Implementation Requirements

- Your code should follow the best-practices outlined in class
- Your work must demonstrate the skills from class.  Simply "working" is insufficient!
- The game must be runnable via: 
  - `npm install` 
  - `node server.js`
  - going to `http://localhost:3000`
- Multiple players must be able to play separate games (from different browsers) simultaneously
- Logout and a later login must allow you to resume a game
  - as long as the server has not restarted.  No long-term persistence is expected.
- The server-side MUST enforce security (session and field validity)
  - Do not display to the screen any value that came from user input unless that value was allow-filtered on the server
- You may reuse files or parts of files from previous assignments or classes - but they will be graded by the criteria here!
- You may create your HTML as you see fit, but it must be fundamentally semantically valid and other best practices from class
- You may create the CSS as you see fit but you must follow the best practices given in class and obey any restrictions listed here
- You may add icons and background images but there is no requirement to do so
  - So long as any icons are done without outside JS or CSS
- You should install `express` and `cookie-parser` modules ONLY
- Do not use external JS other than the above
  - This includes express-session.  Do not use express-session. 
  - Built in options (ones you do not have to install with npm) like Math are not external libraries and are allowed
- You must add additional JS files (server-side ONLY) that YOU write to uphold the idea of separation of concerns
- You must use the correct HTTP methods (GET for loading pages, POST for adding content)
- Reloading a page should not trigger a POST (use a redirect)
  - Except for any listed cases with invalid sessions
- Do not use external CSS libraries
- You may not use CSS floats to do more than manage flowing text with images
- You may not use HTML tables or CSS table layouts
- Do not have any files in your PR except for the project (no files from other assignments, for example)
- Use arrays and objects when they each make sense
- Do not use Map() or Set() for this exam
  - In order to ensure you can use plain objects and arrays 
  - Map() is not the same as the .map() method on an array - an array .map() is allowed
- Do not use `var`
- use `const` and `let` appropriately
- Do not use `alert`, `prompt`, or other blocking JS prompts
- Do not use poor variable and function names
- Do not have functions that are too big/do too much
- Do not have console.log messages from debugging
  - The console.log to show the secret word is allowed and required
- Do not have commented out code
  - Useful comments as discussed in class are welcome though
- Do not use localStorage, sessionStorage, or indexedDB
- Do not use meta tag refreshes
- Do not use CSS preprocessors, minifiers, or other tools to modify your CSS

## Extra Credit

Styling, appearance, or functionality beyond the above minimums that create a pleasant and professional experience can be worth extra credit.  Extra credit is limited, so focus on the needed requirements first.

- This does not change any requirements, make sure those are still fulfilled
- This does not permit using outside libraries, services, etc - this is meant o show your advanced knowledge of the concepts from class.
- Use colors, borders, and whitespace to make different areas clear and distinct
- Track data about multiple games, showing a personal best, an average score, perhaps a leaderboard of users and the best (lowest) number of guesses to win that is shown to all users
- improve the experience of the game - make it clear and easy to see what has been guessed and what guesses are available
- use line-spacing/padding/margins to improve the legibility of text 
- Put the app in "context" - as a web application on a page/site
- You do not need to create any additional pages, links to fake pages are permitted if the requirements are all met.

## Grading Rubric

Note: The project is to show your understanding of the material from class.  If you don't do that, you can lose points, even it "it works".  Do NOT copy or generate your work (see "do-not-copy-work.md" at the root of this repo).

This project is graded on a number of categories, each graded on the below scale:
- Missing (0)
- Needs Improvement (1)
- Good (2)
- Excellent (3)

This means a single mistake might cost you 0 points or more than 1 point, depending on how much that mistake changes your demonstration of the skills from class.

The categories for this project are:

### Submission
- Does PR follow submission expectations?  (contains only change from assignment, correct branch name, good commit message(s), reviewers assigned)
- Did you create a correct and usable package.json file?
- Did you ONLY install permitted modules?

### Overall Requirements
- Does the app work overall and meet all requirements not covered by other criteria?
- Were all restrictions not covered by other criteria followed?
- Does the code demonstrated the requested skills and lessons?
- Are you using static and dynamic assets per the requirements? (static CSS, dynamic HTML)
- Would a user understand what to do on each page?
- Are the requests to login/logout/change stored word all POST requests?
- Are all POST requests that succeed returning a redirect?
- Are all non-redirect requests sending full HTML pages?

### Sessions and User Data
- Are users logged in using a session id?
- Is the username and attempted guesses validated using an allowlist of valid characters?
- Are only logged in users shown the option to logout?
- Does logout remove the sid from both the server side session AND the browser?
- Are games stored outside of the session?
- Are games tracked by username?
- Can multiple users (using different profiles/browsers) log in at the same time and not see or overwrite each others' data?
- Can a user reload the page and continue to see and play their game?
- Can a users each play games at the same general time without interfereing with each other?
- Can a user logout and log back in to still see their game in progress?

### Model View Controller (MVC)/Separation of Concerns (SOC)
- Are stored values and logic about the stored values (models) separated from HTML generation (views) and server routes (controller)?
- Are functions and files named so their meaning and purpose within the MVC/SOC concepts are understandable?
- Can `words.js` be replaced with a new list of words and the program works with that new list?

### Security
- Do the necessary backend routes (`/guess`, `/new-game`) check the validity of the session id and respond as required?
- Do the necessary backend routes (`/guess`, `/login`) properly sanitize the input and respond as required?
- Is "dog" denied access differently than a username of invalid characters?
- Are inputs checked using an allowlist of permitted characters?

### Visual Requirements
- Is all text legible? Of sufficient size, clarity, and contrast?
- Are different parts of the page content visually distinct?
- Is it clear what the user should do?
- Is it clear what the user can do?
- Is it clear what the information on screen means?
- Is the list of allowed words formatted to fit on most screens without scrolling?
- Does the page handle most reasonable desktop sizes without jumbled presentation or horizontal scrolling?

### JS Quality 
- Is the JS following the best practices given in the course?
- Are functions and variables named meaningfully?
- Are functions doing too many different things?
- Is code visually broken up into "paragraphs" with different purposes?
- Are comments helpful?  Not just repeating what the code says, and providing context or reasoning?
- Is code indented and formatted consistently and according to the best practices provided in the course?

### HTML & CSS Quality
- Is the HTML complete and valid?
- Are all form fields properly associated with a text label?
    - Quick test: click on the text of the label, the field should be selected
- Are the HTML and CSS formatted and indented per the standards given in the course?
- Does the content work at various reasonable "desktop" sizes of a browser window?
- Are HTML elements used in semanatically appropriate ways?
- Are Semantic HTML elements used when available and appropriate?
- Are all class names semantic and kebab-case (or BEM) style?
- Does the page work when there are enough guesses to require scrolling?

### Extra Credit
Not all of these are required to receive credit.  The total impression of the below is ranked on the 3 point rubric considering what is _beyond the requirements_.
- Do you have colors/visual spacing/whitespace to improve legibility and focus notably beyond basic requirements?
- Do you provide additional page elements to provide additional context of the app and a place for future options?
- Do you provide a pleasant game experience in terms of understanding each turn and the state of the game?
- Are you presenting additional information that demonstrates a deep understanding of state impacted by multiple users among web requests?


