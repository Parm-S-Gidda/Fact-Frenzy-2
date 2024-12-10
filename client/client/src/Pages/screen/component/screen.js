import '../styles/screen.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Screen() {

    // 0 - Wait for host 1 - Question Displayed
    const [screenSate, setScreenState] = useState(0);
    const [isFlex, setIsFlex] = useState(false);
    const navigate = useNavigate(0);

    const tempClick = () => {

        setIsFlex((prevIsFlex) => !prevIsFlex)
    }
   





  return (

    <div id="screenMainDiv" onClick={tempClick}>

        <h1 id="screenTitle">Fact Frenzy</h1>

        {screenSate === 0 ? (

            <div className="questionDiv">What is 10 + 10?</div>
        ) : (

            <div className="questionDiv">Wait for host to display next question</div>
        )}

        

        <div id="scoreListDiv">

            <h1 className='userScores'>Parm: 0</h1>
            <h1 className='userScores'>Eric: 0</h1>
            <h1 className='userScores'>Lou: 0</h1>
            <h1 className='userScores'>Gelo: 0</h1>
            <h1 className='userScores'>Cathy: 0</h1>

        </div>

        <div id="screenBackgroundBlack" style={{ display: isFlex ? 'flex' : 'none' }}>

            <div id="buzzDiv" >BUZZ</div>

        </div>


    </div>

   
  );
}

export default Screen;