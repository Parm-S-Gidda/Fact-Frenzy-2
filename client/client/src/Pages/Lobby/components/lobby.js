import '../styles/lobby.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';

function Lobby() {
    const navigate = useNavigate();
    const location = useLocation();

    const { isScreen } = location.state || {};

    const handleLeaveClicked = () => {

        navigate('/')
    }

    const startClicked = () => {

      navigate('/Screen')
    }

  return (

    <div id="userLobbyMain">

        <h1 id="lobbyTitle">Fact Frenzy</h1>

        <h2 id="lobbyCode">Lobby Code: 5</h2>

        <div id="displayePlayers">
            <h2>Parm (Host)</h2>
            <h2>Cathy</h2>
            <h2>Eric</h2>
            <h2>Gelo</h2>
            <h2>Lou</h2>

        </div>

        <div id="playerLobbyDiv">

          {isScreen ? (<button className="settingButtons" onClick={startClicked}>Start</button>): (<></>)}
                    
                    <button className="settingButtons" onClick={handleLeaveClicked}>Leave</button>

        </div>


    </div>



   
  );
}

export default Lobby;