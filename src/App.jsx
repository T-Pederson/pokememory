import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { v4 as uuid } from "uuid";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [pokemon, setPokemon] = useImmer([
    { name: "pikachu", sprite: "", clicked: false, id: uuid() },
    { name: "doduo", sprite: "", clicked: false, id: uuid() },
    { name: "togepi", sprite: "", clicked: false, id: uuid() },
    { name: "mankey", sprite: "", clicked: false, id: uuid() },
    { name: "golduck", sprite: "", clicked: false, id: uuid() },
    { name: "gengar", sprite: "", clicked: false, id: uuid() },
    { name: "growlithe", sprite: "", clicked: false, id: uuid() },
    { name: "exeggcute", sprite: "", clicked: false, id: uuid() },
    { name: "rhyhorn", sprite: "", clicked: false, id: uuid() },
    { name: "scyther", sprite: "", clicked: false, id: uuid() },
    { name: "dragonite", sprite: "", clicked: false, id: uuid() },
    { name: "voltorb", sprite: "", clicked: false, id: uuid() },
  ]);

  useEffect(() => {
    for (const each of pokemon) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${each.name}`)
        .then((response) => response.json())
        .then((response) => {
          setPokemon((draft) => {
            draft.find((draftEach) => draftEach.name === each.name).sprite =
              response.sprites.front_default;
          });
        });
    }
  }, [pokemon, setPokemon]);

  function checkForScore(e) {
    const clickedName = e.target.id;

    if (!pokemon.find((each) => each.name === e.target.id).clicked) {
      processScore(clickedName);
    } else {
      resetGame();
    }
  }

  function processScore(name) {
    setPokemon((draft) => {
      draft.find((draftEach) => name === draftEach.name).clicked = true;
    });
    setScore(score + 1);
    if (score + 1 > bestScore) setBestScore(score + 1);
    shuffleBoard();
  }

  function resetGame() {
    setPokemon((draft) => {
      draft.map((draftEach) => (draftEach.clicked = false));
    });
    if (score > bestScore) setBestScore(score);
    setScore(0);
    shuffleBoard();
  }

  function shuffleBoard() {
    setPokemon((draft) => {
      let currentIndex = draft.length;

      while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [draft[currentIndex], draft[randomIndex]] = [
          draft[randomIndex],
          draft[currentIndex],
        ];
      }
    });
  }

  function resetScores() {
    setScore(0);
    setBestScore(0);
  }

  if (score === 12) {
    return (
      <>
        <h1>PokeMemory</h1>
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
        <p>You win!</p>
        <button onClick={resetScores}>Reset</button>
      </>
    );
  } else {
    return (
      <>
        <h1>PokeMemory</h1>
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
        <div id="board">
          {pokemon.map((each) => (
            <img
              id={each.name}
              src={each.sprite}
              alt={each.name}
              key={each.id}
              onClick={checkForScore}
            ></img>
          ))}
        </div>
      </>
    );
  }
}

export default App;
