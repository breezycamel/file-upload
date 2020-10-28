import React, {useState,useEffect} from 'react';
import axios from 'axios';
import './App.css';
import download from 'downloadjs';

function App() {
  const [inputFile, setInputFile] = useState();
  const [files, setFiles] = useState([]);

  function  getFile(){
      download("http://localhost:8000/files/3.pdf", "3.pdf");
  }

  function removeFile(i){
    console.log(i);
    axios.post("http://localhost:8000/delete", {fileId: files[i]._id})
      .then(res => setFiles(res.data));
  }
  
  //this hook upload file and retrieve new list of files
  useEffect(() => {
    const data = new FormData();
    data.append('file', inputFile);
    axios.post("http://localhost:8000/upload", data, {})
      .then(res => setFiles(res.data));
  },[inputFile]);

  return (
    <div className="App">
      <div className="input-container">
        <div className="file-input-form">
          <label className="file-input-label" htmlFor="file-input">Upload Your Files</label>
          <input type="file" id="file-input" onChange={(e) => setInputFile(e.target.files[0])}/>    
        </div>
      </div>

      {files.map((file,i) =>
        <File key={i} file={file} index={i} removeFile={removeFile}/>
      )}
    </div>
  );
}

function File({file, index, removeFile}){

  return(
    <div className="file-container">
      <div className="file-name">
        {file.filename}
      </div>
      <div className="delete-file" onClick={() => removeFile(index)}>&#10006;</div>
    </div>
  );
}

export default App;


