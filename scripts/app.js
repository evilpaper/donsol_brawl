/*

TODO
- Add restart
- Make it obvious when you can run by highligting the button
- Make the "board" size static so it does not collapse during win or lose (eg. when there are no cards)
- Make sure "deck" shows right value, especially when cards should be put back
- Add animations to
  - Cards fade in, cards fade out
  - Stats update 
  - Add effects
    - WHAM
    - POW
    etc.
- Add sound
  - Background music like Donsol from hundredrabbits
  - Flip card effects like Crad Crawl
*/

class Game {
  constructor() {
    this.vitality = 21;
    this.maximumVitality = 21;
    this.attack = 0;
    this.attackHistory = [];
    this.strengthOfLastOpponent = 0;
    this.round = 0;
    this.turn = 0;
    this.stage = [];
    this.discard = [];
    this.deck = new Deck();
  }
  init() {
    this.vitality = 21;
    this.maximumVitality = 21;
    this.attack = 0;
    this.attackHistory = [];
    this.strengthOfLastOpponent = 0;
    this.round = 0;
    this.turn = 0;
    this.stage = [];
    this.discard = [];
    this.deck = new Deck();
  }
}

const board = document.querySelector(".d-board");
const run = document.querySelector(".d-pass");

const vitalityElement = document.querySelector(".d-vitality");
const attackElement = document.querySelector(".d-attack");
const strengthOfLastOpponentElement = document.querySelector(".d-attack-break");
const deckElement = document.querySelector(".d-cards-in-pile");

const shuffle = array => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const getNextCard = deck => {
  return deck.shift();
};

const setBoardHeight = () => {
  const card = board.querySelector("img");
  const cardHeight = card.style.height;
  board.style.height = "320px";
};

const getNumberOfCardsToDeal = () => {
  const cards = Array.from(board.querySelectorAll("img"));
  return 4 - cards.length;
};

const dealCards = _ => {
  if (deck.length < 1) return;

  game.round++;

  const numberOfCards = getNumberOfCardsToDeal();

  for (let count = 0; count <= numberOfCards - 1; count++) {
    const card = getNextCard(deck);
    const cardElement = `
      <div class="d-card-container"
        suite="${card.suite}"
        value="${card.value}"
      >
       <img 
          class="d-card" 
          suite="${card.suite}"
          value="${card.value}"
          src="${card.img}"
        >
      </div>
        `;
    board.insertAdjacentHTML("beforeend", cardElement);
  }
};

const clearBoard = _ => {
  const cards = Array.from(board.querySelectorAll(".d-card-container"));
  cards.forEach(card => {
    card.parentNode.removeChild(card);
  });
};

const updateAttack = (suite, value, game) => {
  if (suite === "Heart") {
    return game.attack;
  }

  if (suite === "Diamond") {
    game.attackHistory = [];
    game.strengthOfLastOpponent = 0;
    return value;
  }

  if (suite === "Clubs" || suite === "Spades") {
    game.attackHistory.unshift({ suite: suite, value: value });

    if (game.attack === 0) {
      return 0;
    }
    if (
      game.strengthOfLastOpponent === 0 ||
      value < game.strengthOfLastOpponent
    ) {
      game.strengthOfLastOpponent = value;
      return game.attack;
    }
    if (value >= game.strengthOfLastOpponent) {
      game.strengthOfLastOpponent = 0;
      game.attackHistory = [];
      return 0;
    }
  }
};

const updateVitality = (suite, value) => {
  if (suite === "Clubs" || suite === "Spades") {
    const damage = value - game.attack > 0 ? value - game.attack : 0;
    const vitality = (game.vitality = game.vitality - damage);
    return vitality < 0 ? 0 : vitality;
  }
  if (suite === "Heart") {
    if (game.discard.length === 0) return game.vitality;
    if (game.discard[0].suite === "Heart") {
      return game.vitality;
    } else {
      game.vitality = game.vitality + value;
      return game.vitality > game.maximumVitality
        ? game.maximumVitality
        : game.vitality;
    }
  }
  return game.vitality;
};

const renderGameStats = (game, deck) => {
  attackElement.innerHTML = game.attack === 0 ? "-" : game.attack.toString();
  vitalityElement.innerHTML = game.vitality.toString();
  strengthOfLastOpponentElement.innerHTML =
    game.attack === 0 ? "-" : game.strengthOfLastOpponent.toString();
};

const flipCard = card => {
  card.classList.add("flipped");
};

run.addEventListener("click", function(event) {
  const cards = Array.from(board.querySelectorAll("img"));
  if (cards.length === 4 || cards.length === 1) {
    cards.forEach(card => {
      console.log(card);
      const suite = card.getAttribute("suite");
      const value = parseInt(card.getAttribute("value"));
      const img = card.getAttribute("img");
      deck.push({ suite: suite, value: value, img: img });
    });
    clearBoard();
    dealCards();
  } else {
    console.log("Sorry, can't run.");
  }
});

const updateCardVisualState = card => {
  card.parentNode.removeChild(card);
};

board.addEventListener("click", event => {
  const card = event.target;
  console.log(card);
  if (card.classList.contains("flipped")) {
    return;
  }
  if (card.classList.contains("d-game-over")) {
    location.reload();
    return;
  }
  const suite = card.getAttribute("suite");
  const value = parseInt(card.getAttribute("value"));

  game.turn++;
  game.attack = updateAttack(suite, value, game);
  game.vitality = updateVitality(suite, value, game);

  game.discard.unshift({ suite: suite, value: value });

  renderGameStats(game, deck);
  flipCard(card);

  const cards = Array.from(board.querySelectorAll(".flipped"));

  if (game.vitality <= 0) {
    clearBoard();
    const gameOverMessage = document.createElement("h1");
    gameOverMessage.classList.add("d-game-over");
    gameOverMessage.innerHTML = "K.O! You lost!";
    board.appendChild(gameOverMessage);
  } else if (cards.length === 4) {
    if (game.discard.length === 52) {
      clearBoard();
      const gameOverMessage = document.createElement("h1");
      gameOverMessage.classList.add("d-game-over");
      gameOverMessage.innerHTML = "K.O! You win!";
      board.appendChild(gameOverMessage);
    } else {
      clearBoard();
      dealCards();
    }
  }
});

const game = new Game();
shuffle(deck);
dealCards();
setBoardHeight();
renderGameStats(game);
