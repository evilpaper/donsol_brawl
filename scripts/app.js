/*

TODO
- Implement restart - hundredrabbits donsol do this by switching "run" to "restart"
- Write some tests, for practice
- Position element correctly on screen
- Make it responsive
- Add styles
- Add effects
- Add sound
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
    this.discard = [];
  }
}

const board = document.querySelector(".d-board");
const run = document.querySelector(".d-pass");

const vitalityElement = document.querySelector(".d-vitality");
const attackElement = document.querySelector(".d-attack");
const roundElement = document.querySelector(".d-round");
const foldedElement = document.querySelector(".d-cards-folded");
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
    /*
    const cardElement = document.createElement("p");
    cardElement.classList.add("d-card");
    cardElement.style.backgroundImage = `url(${card.img})`;
    */
    const cardElement = document.createElement("img");
    cardElement.classList.add("d-card");
    cardElement.src = `${card.img}`;

    cardElement.setAttribute("suite", card.suite);
    cardElement.setAttribute("value", card.value);

    board.appendChild(cardElement);
    roundElement.innerHTML = game.round.toString();
  }
};

const clearBoard = _ => {
  const cards = Array.from(board.querySelectorAll("img"));
  cards.forEach(card => {
    var elem = board.querySelector("img");
    elem.parentNode.removeChild(elem);
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
  attackElement.innerHTML = game.attack.toString();
  vitalityElement.innerHTML = game.vitality.toString();
  strengthOfLastOpponentElement.innerHTML = game.strengthOfLastOpponent.toString();
  foldedElement.innerHTML = game.turn.toString();
  deckElement.innerHTML = 52 - game.discard.length;
};

const flipCard = card => {
  card.classList.add("flipped");
};

run.addEventListener("click", function(event) {
  const cards = Array.from(board.querySelectorAll("img"));
  if (cards.length === 4 || cards.length === 1) {
    cards.forEach(card => {
      const suite = card.getAttribute("suite");
      const value = parseInt(card.getAttribute("value"));
      deck.push({ suite: suite, value: value });
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
  const suite = card.getAttribute("suite");
  const value = parseInt(card.getAttribute("value"));

  game.turn++;
  game.attack = updateAttack(suite, value, game);
  game.vitality = updateVitality(suite, value, game);

  game.discard.unshift({ suite: suite, value: value });

  renderGameStats(game, deck);
  flipCard(card);

  const cards = Array.from(board.querySelectorAll(".flipped"));
  console.log(cards);

  if (game.vitality <= 0) {
    clearBoard();
    const gameOverMessage = document.createElement("h1");
    gameOverMessage.classList.add("d-game-over");
    gameOverMessage.innerHTML = "K-O - You lost!";
    board.appendChild(gameOverMessage);
  } else if (cards.length === 4) {
    if (game.discard.length === 52) {
      clearBoard();
      const gameOverMessage = document.createElement("h1");
      gameOverMessage.classList.add("d-game-over");
      gameOverMessage.innerHTML = "K.O - You win!";
      board.appendChild(gameOverMessage);
    } else {
      clearBoard();
      dealCards();
    }
  }
});

function init() {
  return (game = new Game());
}

init();
shuffle(deck);
dealCards();
renderGameStats(game);
