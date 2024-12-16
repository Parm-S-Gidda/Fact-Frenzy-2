import '../styles/addedQuestions.css';
import { useEffect, useState } from 'react';

function AddedQuestions({record, index, deleteEntry}) {

  return (

    <div className="recordMainDiv">
      <div className="deleteButtonDiv">
        <button className="deleteButton" onClick={() => deleteEntry(index)} >X</button>
      </div>
      <div className="settingAsnwerDiv">{record.Question}</div>
      <div className="settingQuestionDiv">{record.Answer}</div>
  </div>

   
  );
}

export default AddedQuestions;