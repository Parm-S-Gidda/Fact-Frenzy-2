import '../styles/addedQuestions.css';
import { useEffect, useState } from 'react';

function AddedQuestions({record, index, deleteEntry}) {

  return (

    <div className="recordMainDiv">
    <div className="deleteButtonDiv">
      <button className="deleteButton" onClick={() => deleteEntry(index)} >X</button>
    </div>
    <div className="answerDiv">{record.Question}</div>
    <div className="questionDiv">{record.Answer}</div>
  </div>

   
  );
}

export default AddedQuestions;