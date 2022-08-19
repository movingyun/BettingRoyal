



export default function TEST(props) {
  const startButton = new Audio('./Audio/StartButton.mp3')
  const startGame = new Audio('./Audio/StartGame.mp3')
  const Shuffling = new Audio('./Audio/Shuffling.mp3')
  const clickBet = new Audio('./Audio/Click.mp3')
  const flipCard = new Audio('./Audio/Flip.mp3')
  const lubbySound = new Audio('./Audio/Lubby.mp3')
  const endGame = new Audio('./Audio/EndGame.mp3')

  function startbutton() {
    startButton.play()
  }
  function startgame() {
    startGame.play()
    Shuffling.play()
  }
  function betting() {
    clickBet.play()
  }
  function flip() {
    flipCard.play()
  }
  function endgame() {
    lubbySound.play()
    endGame.play()
  }


  // return(
  //   <div>
  //     <button onClick={startbutton}>startbutton</button>
  //     <button onClick={startgame}>startgame</button>
  //     <button onClick={betting}>betting</button>
  //     <button onClick={flip}>flip</button>
  //     <button onClick={endgame}>endgame</button>

  //   </div>
  // )
};