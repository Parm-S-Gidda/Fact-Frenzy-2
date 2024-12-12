import '../styles/screenLeft.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ScreenLeft() {

    const [userName, setUserName] = useState("");
    const navigate = useNavigate();




  return (

    <h1>ScreenLeft</h1>
   
  );
}

export default ScreenLeft;