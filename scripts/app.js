const board = document.querySelector("section");
const deck = [
  { pattern: "heart", value: 1 },
  { pattern: "heart", value: 2 },
  { pattern: "heart", value: 3 },
  { pattern: "heart", value: 4 },
  { pattern: "heart", value: 5 },
  { pattern: "heart", value: 6 },
  { pattern: "heart", value: 7 },
  { pattern: "heart", value: 8 },
  { pattern: "heart", value: 9 },
  { pattern: "heart", value: 10 },
  { pattern: "heart", value: 11 },
  { pattern: "heart", value: 12 },
  { pattern: "heart", value: 13 },
  { pattern: "heart", value: 14 },
  { pattern: "tile", value: 1 },
  { pattern: "clover", value: 1 },
  { pattern: "pike", value: 1 }
];

const drawNewCards = document.querySelector("button");

// Implement the Fisher-Yates Shuffle Algorithm link: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = array => {
  return array.sort(() => 0.5 - Math.random());
};

const getNextCard = (deck) => {
  return deck.shift();
}

const dealCards = () => {
  for (let count = 0; count < 4; count++) {
    const nextCard = getNextCard(deck)
    const card = document.createElement("p");
    card.innerHTML = `${nextCard.pattern} ${nextCard.value}`;
    board.appendChild(card);
  }
};

const clearBoard = () => {
  cards = Array.from(board.querySelectorAll("p"));
  cards.forEach(card => {
    var elem = board.querySelector("p");
    elem.parentNode.removeChild(elem);
  })
}

drawNewCards.addEventListener("click", function(event) {
  clearBoard();
  dealCards();
});

shuffle(deck);
dealCards();

