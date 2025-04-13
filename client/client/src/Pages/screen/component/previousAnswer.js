import { useEffect } from 'react';

function PreviousAnswer({setDisplayPreviousAnswer, previousAnswer}) {

    useEffect(() => {
        const timer = setTimeout(() => {
            setDisplayPreviousAnswer(false);
        }, 4000);

        return () => clearTimeout(timer); 
    }, []);

    return (

        <div id="previousAnswerDarkBackground">

            <div id="previousAnswerMainDiv">

                <h1 id="previousAnswerText">Previous Answer: {previousAnswer}</h1>

            </div>


        </div>


    )
}

export default PreviousAnswer