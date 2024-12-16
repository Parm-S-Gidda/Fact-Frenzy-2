import '../styles/nameChoose.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

function NameChoose() {

    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const {roomKey} = location.state || {};


    const handleBackClicked = () => {
        navigate('/')
    }

    const handleInputOnChange = (e) => {

        setUserName(e.target.value)
      
    }

    const handleJoinClicked = async () => {

        if(userName.length <= 0){
            alert("Please input a valid username")
            return;
        }


        try {

            const response = await fetch('https://fact-frenzy-service-993031554602.us-west1.run.app/' + roomKey + '/addUser', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomKey: roomKey, userName: userName }),
            });

            if (!response.ok) {
                alert("Could not join game, please try again later")
            }

            const data = await response.json();

            console.log("All Players: " + data)

    
            navigate('/Lobby', { state: {isScreen:false, roomKey: roomKey, userName: userName, playerList:data}})
        }
        catch (error) {

            console.log(error.message)
        }

       
    }

  return (

    <div className='chooseNameMainDiv'>

        <h1 id="nameSelectTitle">Fact Frenzy</h1>

        <div id="enterNameDiv">

            <h2 id="enterNameTitle">Enter A Username</h2>
            <input type="text" id="enterNameInput" name='enterNameInput' onChange={handleInputOnChange} ></input>

            <div id="enterNameButtonDiv">

                <button className="joinLobbyButtons" onClick={handleJoinClicked}>Join</button>
                <button className="joinLobbyButtons" onClick={handleBackClicked}>Back</button>

                
            </div>

        </div>

        



    </div>

   
  );
}

export default NameChoose;