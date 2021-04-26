var a = 2;
window.addEventListener(
  "DOMContentLoaded",
  () => {
    setTimeout(change, 1);
    document.querySelector(".arrow").addEventListener("click", change, false);
  },
  true
);

function rearrange(card) {
  let cards = document.querySelectorAll(".cards .card");
  for (let n = 0; n < cards.length; n++) {
    cards[n].classList.remove("card--left");
    cards[n].classList.remove("card--center");
    cards[n].classList.remove("card--right");
  }
  cards[card].classList.add("card--center");
  if (card == 0) {
    cards[2].classList.add("card--left");
    cards[1].classList.add("card--right");
  }
  if (card == 1) {
    cards[0].classList.add("card--left");
    cards[2].classList.add("card--right");
  }
  if (card == 2) {
    cards[1].classList.add("card--left");
    cards[0].classList.add("card--right");
  }
}

function change() {
  rearrange(a);
  a = ++a % 3;
}
