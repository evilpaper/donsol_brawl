
const player = {
  vitality: 21,
  maximumVitality: 21,
  guard: 0,
  maximumGuard: 11
}
const board = document.querySelector("section");
const run = document.querySelector(".d-new-cards");
const vitalityElement = document.querySelector(".d-vitality");
const guardElement = document.querySelector(".d-guard")

vitalityElement.innerHTML = player.vitality.toString()
guardElement.innerHTML = player.guard.toString()

// Implement the Fisher-Yates Shuffle Algorithm link: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = array => {
  return array.sort(() => 0.5 - Math.random());
};

const getNextCard = (deck) => {
  return deck.shift();
}

const getNumberOfCardsToDeal = () => {
  const cards = Array.from(board.querySelectorAll("p"));
  return 4 - cards.length;
}

const dealCards = () => {
  if (deck.length < 1) return;
  const numberOfCards = getNumberOfCardsToDeal();
  for (let count = 0; count <= numberOfCards-1; count++) {
    const card = getNextCard(deck)
    const cardElement = document.createElement("p");
    cardElement.innerHTML = `${card.pattern} ${card.value}`;
    cardElement.setAttribute('pattern', card.pattern)
    cardElement.setAttribute('value', card.value)
    board.appendChild(cardElement);
  }
};

const clearBoard = () => {
  const cards = Array.from(board.querySelectorAll("p"));
  cards.forEach(card => {
    var elem = board.querySelector("p");
    elem.parentNode.removeChild(elem);
  })
}

const updatePlayerVitality = (pattern, value) => {
  if (pattern === "Clover" || pattern === "Pike") {
    return player.vitality = player.vitality - value
  }
  if (pattern === "Heart") {
    return player.vitality = player.vitality + value
  }
  return player.vitality
}

const updatePlayerGuard = (value) => {
  return player.guard + value
}

// Maybe this could be a cleaner solution, have to think...
const updatePlayerVitalityProperties = {
  clover: function(value1, value2) {
    return value1 + value2
  }
}

run.addEventListener("click", function(event) {
  clearBoard();
  dealCards();
});

board.addEventListener("click", event => {
  const card = event.target;
  const pattern = card.getAttribute("pattern")
  const value = parseInt(card.getAttribute("value"));

  // Update player stats
  player.vitality = updatePlayerVitality(pattern, value)
  if (pattern === "Tile") {
    player.guard = updatePlayerGuard(value)
  }

  // Update DOM
  vitalityElement.innerHTML = player.vitality.toString()
  guardElement.innerHTML = player.guard.toString()

  card.parentNode.removeChild(card)

  // Check if board is empty
  const cards = Array.from(board.querySelectorAll("p"));
  if (cards.length < 1) {
    dealCards();
  }
})

shuffle(deck);
dealCards();

