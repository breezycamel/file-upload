import React, {useState,useEffect} from 'react';
import axios from 'axios';
import '../App.css';
import File from './file.js';

function Home() {
  const [inputFile, setInputFile] = useState();
  const [files, setFiles] = useState([]);

  async function getFile(i){
    window.location.href = `https://localhost:8000/files/${files[i]._id}/${files[i].filename}`;
  }

  function removeFile(i){
    console.log(i);
    axios.post("https://localhost:8000/delete", {fileId: files[i]._id})
      .then(res => setFiles(res.data));
  }
  
  //this hook upload file and retrieve new list of files
  useEffect(() => {
    const data = new FormData();
    data.append('file', inputFile);
    axios.post("https://localhost:8000/upload", data, {})
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
        <File key={i} file={file} index={i} removeFile={removeFile} getFile={getFile}/>
      )}
    </div>
  );
}

export default Home;