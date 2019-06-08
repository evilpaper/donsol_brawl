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

const game = {
  vitality: 21,
  maximumVitality: 21,
  attack: 0,
  attackHistory: [],
  strengthOfLastOpponent: 0,
  round: 0,
  turn: 0,
  discard: []
};

const board = document.querySelector("section");
const run = document.querySelector(".d-new-cards");

const vitalityElement = document.querySelector(".d-vitality");
const attackElement = document.querySelector(".d-attack");
const roundElement = document.querySelector(".d-round");
const cardsCountElement = document.querySelector(".d-card-count");
const strengthOfLastOpponentElement = document.querySelector(".d-attack-break");

const discard = [];

vitalityElement.innerHTML = game.vitality.toString();
attackElement.innerHTML = game.attack.toString();
strengthOfLastOpponentElement.innerHTML = game.strengthOfLastOpponent.toString();
cardsCountElement.innerHTML = game.turn;

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
  const cards = Array.from(board.querySelectorAll("p"));
  return 4 - cards.length;
};

const dealCards = _ => {
  if (deck.length < 1) return;

  game.round++;

  const numberOfCards = getNumberOfCardsToDeal();
  for (let count = 0; count <= numberOfCards - 1; count++) {
    const card = getNextCard(deck);
    const cardElement = document.createElement("p");
    cardElement.innerHTML = `${card.suite} ${card.value}`;
    cardElement.setAttribute("suite", card.suite);
    cardElement.setAttribute("value", card.value);
    board.appendChild(cardElement);
    roundElement.innerHTML = game.round.toString();
  }
};

const clearBoard = _ => {
  const cards = Array.from(board.querySelectorAll("p"));
  cards.forEach(card => {
    var elem = board.querySelector("p");
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
    return (game.vitality = game.vitality - damage);
  }
  if (suite === "Heart") {
    if (discard.length === 0) return game.vitality;
    if (discard[0].suite === "Heart") {
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

const updateVisualState = (card, game) => {
  attackElement.innerHTML = game.attack.toString();
  vitalityElement.innerHTML = game.vitality.toString();
  strengthOfLastOpponentElement.innerHTML = game.strengthOfLastOpponent.toString();
  cardsCountElement.innerHTML = game.turn.toString();
  card.parentNode.removeChild(card);
};

run.addEventListener("click", function(event) {
  const cards = Array.from(board.querySelectorAll("p"));
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

board.addEventListener("click", event => {
  const card = event.target;
  const suite = card.getAttribute("suite");
  const value = parseInt(card.getAttribute("value"));

  game.turn++;
  game.attack = updateAttack(suite, value, game);
  game.vitality = updateVitality(suite, value, game);

  discard.unshift({ suite: suite, value: value });

  updateVisualState(card, game);

  const cards = Array.from(board.querySelectorAll("p"));

  if (game.vitality === 0) {
    clearBoard();
    const gameOverMessage = document.createElement("p");
    gameOverMessage.innerHTML = "K-O - You lost!";
    board.appendChild(gameOverMessage);
  } else if (cards.length === 0) {
    dealCards();
  }
});

shuffle(deck);
dealCards();
