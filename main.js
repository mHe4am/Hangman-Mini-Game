let container = document.querySelector(".container");
let lettersContainer = document.querySelector(".letters");
let letters = "abcdefghijklmnopqrstuvwxyz";

let lettersArr = Array.from(letters);

// Generate letters elements
lettersArr.forEach((letter) => {
  let span = document.createElement("span");
  span.className = "letter-box";
  span.appendChild(document.createTextNode(letter));
  lettersContainer.appendChild(span);
});

// Fetch data from json data file
async function getData() {
  let data = await fetch("./data.json");
  data = data.json();
  return data;
}

// Use json data
getData().then((categories) => {
  // Get random category
  let categoriesValues = Object.keys(categories);
  let categoryRandomNum = Math.floor(Math.random() * categoriesValues.length); // random num from categories range
  let randomCategory = categoriesValues[categoryRandomNum];
  // put the chosen category inside the span
  document.querySelector(".category span").innerHTML = randomCategory;

  // Get random word from the chosen category
  let wordsValues = categories[randomCategory];
  let wordRandomNum = Math.floor(Math.random() * wordsValues.length); // random num from words range

  let LettersContainer = document.querySelector(".guessed-letters");
  // Get the chosen word
  let chosenWord = wordsValues[wordRandomNum];
  // Make array from chosen word
  let wordArray = Array.from(chosenWord);

  // Create letters spans
  wordArray.forEach((letter) => {
    let span = document.createElement("span");
    if (letter === " ") {
      span.className = "with-space";
    }
    LettersContainer.appendChild(span);
  });

  // Deal with clicked letters
  let guessSpans = document.querySelectorAll(".guessed-letters span");
  let draw = document.querySelector(".hangman-draw");
  let mistakesNum = 0;

  document.addEventListener("click", (el) => {
    let status = false;

    if (el.target.className === "letter-box") {
      // Prevent user from clicking same button again
      el.target.classList.add("clicked");

      let clickedLetter = el.target.innerHTML.toLowerCase();

      // Loop on the chosen word to know if it's icludes the clicked letter or not
      wordArray.forEach((wordLetter, wordIndex) => {
        if (clickedLetter.toLowerCase() === wordLetter.toLowerCase()) {
          status = true;
          guessSpans.forEach((span, spanIndex) => {
            if (wordIndex === spanIndex) {
              span.innerHTML = clickedLetter;
            }
          });
        }
      });
      if (status !== true) {
        mistakesNum++;
        draw.classList.add(`wrong-${mistakesNum}`);
        // Play Fail Sound
        document.getElementById("fail").play();
        if (mistakesNum >= 8) {
          container.classList.add("help"); // Disable letters buttons
          endGame(false); // End Game With Lose
        }
      } else {
        // Play Success Sound
        document.getElementById("success").play();
      }
      // Array to save the guessed letters
      let guessedArr = [];
      // Array from original word
      let originalWord = Array.from(chosenWord.toLowerCase());
      // Remove spaces from original word array if there's any
      let wordNoSpaces = originalWord.filter(function (str) {
        return /\S/.test(str);
      });
      // Check if player wins
      for (let i = 0; i < guessSpans.length; i++) {
        if (guessSpans[i].innerHTML !== "") {
          guessedArr.push(guessSpans[i].innerHTML);
        }
        if (wordNoSpaces.length === guessedArr.length) {
          let result = wordNoSpaces.every((element) =>
            guessedArr.includes(element)
          );
          if (result === true) {
            container.classList.add("help"); // Disable letters buttons
            endGame(true);
          }
        }
      }
    }
  });

  // End Game Function
  function endGame(result) {
    let div = document.createElement("div");
    div.className = "result-popup";
    let img = document.createElement("img");
    img.className = "result-img";
    img.setAttribute("alt", "result-img");

    if (result === true) {
      let text;
      if (mistakesNum === 0) {
        text = `Win!, You got it with ${mistakesNum} mistakes.\nThat's the best score ever!`;
      } else if (mistakesNum === 1 || mistakesNum === 2) {
        text = `Win!, You got it after ${mistakesNum} mistakes.\nYou look like a pro!`;
      } else if (mistakesNum === 3 || mistakesNum === 4) {
        text = `Win!, You got it after ${mistakesNum} mistakes.\nIt seems that you know some tricks already!`;
      } else if (mistakesNum === 5 || mistakesNum === 6) {
        text = `Win!, You got it after ${mistakesNum} mistakes.\nYou struggled a little bit but you got it!`;
      } else if (mistakesNum === 7) {
        text = `Win!, You got it after ${mistakesNum} mistakes.\nYou barely lost it!`;
      }
      img.setAttribute("src", "./imgs/win.png");
      div.appendChild(img);
      div.appendChild(document.createTextNode(text));
    } else {
      img.setAttribute("src", "./imgs/lose.png");
      div.appendChild(img);
      div.appendChild(
        document.createTextNode(`Lose!, The word was "${chosenWord}"`)
      );
    }

    // Customize popup window & Set-up Play Again button
    let againBtn = document.createElement("span");
    againBtn.className = "play-again";
    againBtn.appendChild(document.createTextNode("Play again!"));
    againBtn.setAttribute("onclick", "location.reload()");
    div.appendChild(againBtn);

    document.body.appendChild(div);
  }
});

// Need help button
let helpBtn = document.querySelector(".info");

helpBtn.onclick = () => {
  let div = document.createElement("div");
  div.className = "info-popup";

  let titleSpan = document.createElement("span");
  titleSpan.appendChild(document.createTextNode("Game info"));
  div.appendChild(titleSpan);

  let infoText = `Hangman is a fun and easy game where you can test your word skills. The computer will choose a word from a random category and you have to guess it by clicking on the shown letters. The word will be hidden by dashes and each correct letter will fill in the blank. But be careful, each wrong letter will add a part of a hangman figure on a gallows. If the figure is complete before you guess the word, you lose the game. Can you guess the word before the hangman hangs?`;
  div.appendChild(document.createTextNode(infoText));
  // Close Button
  let closeSpan = document.createElement("span");
  closeSpan.className = "close-popup";
  closeSpan.appendChild(document.createTextNode(`Close`));
  div.appendChild(closeSpan);
  // To Disable clicking on body elements "only container"
  container.classList.add("help");

  closeSpan.addEventListener("click", () => {
    div.remove();
    // Remove "help" class from the container to let user click on elements again
    container.classList.remove("help");
  });

  document.body.appendChild(div);
};
