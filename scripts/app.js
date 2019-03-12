
const player = {
  currentHealth: 21,
  maxHealth: 21,
  currentGuard: 0,
  maxGuard: 11
}
const board = document.querySelector("section");
const run = document.querySelector(".d-new-cards");
const vitalityElement = document.querySelector(".d-vitality");
const guardElement = document.querySelector(".d-guard")

vitalityElement.innerHTML = player.currentHealth.toString()
guardElement.innerHTML = player.currentGuard.toString()

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

run.addEventListener("click", function(event) {
  clearBoard();
  dealCards();
});

board.addEventListener("click", event => {
  const card = event.target;
  const pattern = card.getAttribute("pattern")
  const value = card.getAttribute("value")
  console.log(pattern)
  if (pattern === "Clover") {
    player.currentHealth = player.currentHealth - value
    vitalityElement.innerHTML = player.currentHealth.toString()
  }
  card.parentNode.removeChild(card)

  // Check if board is empty
  const cards = Array.from(board.querySelectorAll("p"));
  if (cards.length < 1) {
    dealCards();
  }
})

shuffle(deck);
dealCards();

