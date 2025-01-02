import { languages } from "../languages.js";
import { useState } from "react";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "../utils/farewellMessages.js";
import Confetti from "react-confetti";

export default function Main() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [gussedLetters, setGussedLetters] = useState([]);

  const wrongGuessCount = gussedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => gussedLetters.includes(letter));
  const isGameLost = wrongGuessCount === languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = gussedLetters[gussedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  const currentWordArr = currentWord.split("").map((char, index) => {
    const toReveal = isGameLost || gussedLetters.includes(char);
    const className = clsx(
      isGameLost && !gussedLetters.includes(char) && "missed-letters"
    );
    return (
      <span className={className} key={index}>
        {toReveal && char.toUpperCase()}
      </span>
    );
  });

  const alphabets = "abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
    <button
      onClick={() => userInput(letter)}
      key={letter}
      disabled={isGameOver}
      aria-disabled={gussedLetters.includes(letter)}
      aria-label={`Letter ${letter}`}
      className={clsx(
        gussedLetters.includes(letter) &&
          currentWord.split("").includes(letter) &&
          "correct-choice",
        gussedLetters.includes(letter) &&
          !currentWord.split("").includes(letter) &&
          "wrong-choice"
      )}
    >
      {letter.toUpperCase()}
    </button>
  ));

  function userInput(letter) {
    setGussedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  const langHTML = languages.map((langObject, index) => {
    return (
      <span
        style={{
          backgroundColor: langObject.backgroundColor,
          color: langObject.color,
        }}
        key={langObject.name}
        className={clsx(index < wrongGuessCount && "dead-key")}
      >
        {langObject.name}
      </span>
    );
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }

    return null;
  }

  function newGame() {
    setCurrentWord(getRandomWord());
    setGussedLetters([]);
  }

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the world within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <section
        className={clsx("game-status", {
          win: isGameWon,
          lost: isGameLost,
          farewell: !isGameOver && isLastGuessIncorrect,
        })}
      >
        {renderGameStatus()}
      </section>

      <section aria-live="polite" role="status" className="languages-container">
        {langHTML}
      </section>

      <section className="current-word">{currentWordArr}</section>

      {/*Aria live region*/}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry! The letter ${lastGuessedLetter} is not in the word.`}
          You have {languages.length - 1} attemps left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              gussedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>

      <section className="keyboard">{alphabets}</section>

      {isGameOver && (
        <button onClick={newGame} className="new-game-button">
          New Game
        </button>
      )}
    </main>
  );
}
