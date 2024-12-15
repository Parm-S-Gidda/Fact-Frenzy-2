import '../styles/screenLeft.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ScreenLeft() {

    const [userName, setUserName] = useState("");
    const navigate = useNavigate();


    const handleReturnclicked = () =>{

      navigate('/');
    }

  return (

    <div id="screenLeftMain">

      <h1 id="screenLeftTitle">Fact Frenzy</h1>

      <h2 id="screenLeftMessage">The game host has left the lobby</h2>

      <button id="screenLeftReturn" onClick={handleReturnclicked}>Return Home</button>

    </div>
   
  );
}

export default ScreenLeft;