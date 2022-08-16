



export default function TEST(props) {
  function startbutton() {
    new Audio('./Audio/StartButton.mp3').play()
  }
  function startgame() {
    new Audio('./Audio/StartGame.mp3').play()
    new Audio('./Audio/Shuffling.mp3').play()
  }
  function betting() {
    new Audio('./Audio/Click.mp3').play()
  }
  function flip() {
    new Audio('./Audio/Flip.mp3').play()
  }
  function endgame() {
    new Audio('./Audio/Lubby.mp3').play()
    new Audio('./Audio/EndGame.mp3').play()
  }


  return(
    <div>
      <button onClick={startbutton}>startbutton</button>
      <button onClick={startgame}>startgame</button>
      <button onClick={betting}>betting</button>
      <button onClick={flip}>flip</button>
      <button onClick={endgame}>endgame</button>

    </div>
  )
};