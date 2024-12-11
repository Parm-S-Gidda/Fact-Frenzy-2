import '../styles/endScreen.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';





function EndScreen() {
    const navigate = useNavigate(0);

    const leaveClicked = () => {

        navigate('/')
    }






  return (

    <div id="endScreenMain">

        <h1 id="endScreenTitle">Fact Frenzy</h1>

        <h1 id='endScreenWinner'>Parm Wins!</h1>

        <div id="endScreenScoreDiv">

            <h1 id='endScreenScoreTitle'>Scores</h1>

            <ol id="endScreenList">
                <li>Parm: 10</li>
                <li>Cathy: 5</li>
                <li>Eric: 3</li>
                <li>Gelo: 2</li>
                <li>Lou: 1</li>
            </ol>


        </div>

    
        <button id="leaveEndScreen" onClick={leaveClicked}>Leave</button>

        
    </div>

   
  );
}

export default EndScreen;