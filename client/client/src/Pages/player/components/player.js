import '../styles/player.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Player() {

    const [userName, setUserName] = useState("");
    const navigate = useNavigate();




  return (

    <div id="playerMainDiv">

        <h1 id="playerTitle">Fact Frenzy</h1>

        <h1 id="currentPlayerPoints">0</h1>

        <button id="buzzButton">BUZZ</button>

    </div>
   
  );
}

export default Player;