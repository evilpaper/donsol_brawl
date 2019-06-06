/*

TODO
- Implement restart
- Put cards left on the board in the bottom of the pile
- Fix bug that give error if first card is a heart
 */

const player = {
  vitality: 21,
  maximumVitality: 21,
  attack: 0,
  strengthOfLastOpponent: 0,
  score: 0
};
const game = {
  round: 0,
  turn: 0,
  cardCount: 0
};
const board = document.querySelector("section");
const run = document.querySelector(".d-new-cards");
const vitalityElement = document.querySelector(".d-vitality");
const attackElement = document.querySelector(".d-attack");
const roundElement = document.querySelector(".d-round");
const cardsCountElement = document.querySelector(".d-card-count");
const strengthOfLastOpponentElement = document.querySelector(".d-attack-break");
const cardsInDeckElement = document.querySelector(".d-cards-in-deck");
const discard = [];

vitalityElement.innerHTML = player.vitality.toString();
attackElement.innerHTML = player.attack.toString();
strengthOfLastOpponentElement.innerHTML = player.strengthOfLastOpponent.toString();
cardsCountElement.innerHTML = game.cardCount;

// Implement the Fisher-Yates Shuffle Algorithm link: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = array => {
  return array.sort(() => 0.5 - Math.random());
};

const getNextCard = deck => {
  return deck.shift();
};

const getNumberOfCardsToDeal = () => {
  const cards = Array.from(board.querySelectorAll("p"));
  return 4 - cards.length;
};

const dealCards = () => {
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
  console.log("Cards left in deck is = " + deck.length);
};

const clearBoard = () => {
  const cards = Array.from(board.querySelectorAll("p"));
  cards.forEach(card => {
    var elem = board.querySelector("p");
    elem.parentNode.removeChild(elem);
  });
};

const updatePlayerAttack = (suite, value, player) => {
  if (suite === "Heart") {
    return player.attack;
  }

  if (suite === "Diamond") {
    player.strengthOfLastOpponent = 0;
    return value;
  }

  if (suite === "Clubs" || suite === "Spades") {
    if (player.attack === 0) {
      player.strengthOfLastOpponent === 0;
      return 0;
    }
    if (
      player.strengthOfLastOpponent === 0 ||
      value < player.strengthOfLastOpponent
    ) {
      player.strengthOfLastOpponent = value;
      return player.attack;
    }
    if (value >= player.strengthOfLastOpponent) {
      player.strengthOfLastOpponent = 0;
      return 0;
    }
  }
};

const updatePlayerVitality = (suite, value) => {
  if (suite === "Clubs" || suite === "Spades") {
    const damage = value - player.attack > 0 ? value - player.attack : 0;
    return (player.vitality = player.vitality - damage);
  }
  if (suite === "Heart") {
    if (discard[0].suite === "Heart") {
      return player.vitality;
    } else {
      player.vitality = player.vitality + value;
      return player.vitality > 21 ? 21 : player.vitality;
    }
  }
  return player.vitality;
};

function updateVisualState(card, game, player) {
  attackElement.innerHTML = player.attack.toString();
  vitalityElement.innerHTML = player.vitality.toString();
  strengthOfLastOpponentElement.innerHTML = player.strengthOfLastOpponent.toString();
  cardsCountElement.innerHTML = game.cardCount.toString();
  card.parentNode.removeChild(card);
}

run.addEventListener("click", function(event) {
  const cards = Array.from(board.querySelectorAll("p"));
  if (cards.length === 4 || cards.length === 1) {
    cards.forEach(card => {
      const suite = card.getAttribute("suite");
      const value = parseInt(card.getAttribute("value"));
      deck.push({ suite: suite, value: value });
      console.log(card);
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

  game.cardCount++;
  player.attack = updatePlayerAttack(suite, value, player);
  player.vitality = updatePlayerVitality(suite, value, player);

  discard.unshift({ suite: suite, value: value });

  updateVisualState(card, game, player);

  // Get the number of cards left on the board
  const cards = Array.from(board.querySelectorAll("p"));

  if (player.vitality === 0) {
    clearBoard();
    const gameOverMessage = document.createElement("p");
    gameOverMessage.innerHTML = "K-O - You lost!";
    board.appendChild(gameOverMessage);
  } else if (cards.length === 0) {
    // Check if board is empty
    dealCards();
  }
});

shuffle(deck);
dealCards();
