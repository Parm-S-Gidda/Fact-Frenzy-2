import '../styles/nameChoose.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NameChoose() {

    const [userName, setUserName] = useState("");
    const navigate = useNavigate();


    const handleBackClicked = () => {
        navigate('/')
    }

    const handleInputOnChange = (e) => {

        setUserName(e.target.value)
      
    }

    const handleJoinClicked = () => {

        if(userName.length <= 0){
            alert("Please input a valid username")
            return;
        }

        navigate('/Lobby')
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