
const player = {
  currentHealth: 21,
  maxHealth: 21,
  currentDefense: 0
}

const board = document.querySelector("section");
const run = document.querySelector(".d-new-cards");
const vitalityElement = document.querySelector(".d-vitality");
const guardElement = document.querySelector(".d-guard")

vitalityElement.innerHTML = "33"
guardElement.innerHTML = "10"
console.log("guardElement")

// Implement the Fisher-Yates Shuffle Algorithm link: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = array => {
  return array.sort(() => 0.5 - Math.random());
};

const getNextCard = (deck) => {
  return deck.shift();
}

const getNumberOfCardsToDeal = () => {
  const cards = Array.from(board.querySelectorAll("p"));
  console.log(cards.length)
  return 4 - cards.length;
}

const dealCards = () => {
  if (deck.length < 1) return;
  const numberOfCards = getNumberOfCardsToDeal();
  console.log(numberOfCards)
  for (let count = 0; count <= numberOfCards-1; count++) {
    const nextCard = getNextCard(deck)
    const card = document.createElement("p");
    card.innerHTML = `${nextCard.pattern} ${nextCard.value}`;
    card.setAttribute('value', nextCard.value)
    board.appendChild(card);
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
  console.log(event.target);
  const card = event.target;
  card.parentNode.removeChild(card)
})

shuffle(deck);
dealCards();

