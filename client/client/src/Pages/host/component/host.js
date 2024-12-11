import '../styles/host.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';





function Host() {
    const navigate = useNavigate();

    const [hostState, setHostState] = useState(0);

    const handleRevealClicked = () => {

        setHostState(1);
    }

    const handleSkipClicked = () => {

        setHostState(2);
    }







  return (

    <div id="hostMainDiv">

        <h1 id='hostTitle'>Fact Frenzy</h1>

        {hostState === 0 && 
         <>
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>Next Question Preview:</h1>
                <h1 id='nextQuestion'>What is 10 + 10?</h1> 
            </div>
    

            <button id="revealNextQuestionButton" onClick={handleRevealClicked}>Reveal Next Question</button>
        </>
        }

        {hostState === 1 && 
         <>
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>Displayed Question:</h1>
                <h1 id='nextQuestion'>What is 10 + 10?</h1> 
            </div>
    

            <button id="revealNextQuestionButton" onClick={handleSkipClicked}>Skip</button>
        </>
        }
        {hostState === 2 && 
         <>
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>Displayed Question:</h1>
                <h1 id='nextQuestion'>What is 10 + 10?</h1> 
            </div>
    

           <div id="rightOrWrongButtonsDiv">

                <button id="revealNextQuestionButton" onClick={handleRevealClicked}>Correct</button>
                <button id="revealNextQuestionButton" onClick={handleRevealClicked}>Incorrect</button>

           </div>
        </>
        }
       


    </div>

   
  );
}

export default Host;