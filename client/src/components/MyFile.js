import React, {useState,useEffect} from 'react';
import axios from 'axios';
import '../App.css';
import File from './file.js';

function MyFile({accessToken}) {
  const [inputFile, setInputFile] = useState();
  const [files, setFiles] = useState([]);
  console.log(accessToken);
  
  async function getFile(i){
    window.location.href = `http://localhost:8000/file/download/${files[i]._id}`;
  }

  function removeFile(i){
    console.log('Bearer ' + accessToken);
    axios.post("http://localhost:8000/file/delete", {
      file_id: files[i].file_id
    },{
      headers : {
        'Authorization' : 'Bearer ' + accessToken
      }
    })
    .then(res => setFiles(res.data));
  }
  
  //This hook retrieve a list of files uploaded by the user
  useEffect(() => {
    if(accessToken != ''){
      axios.get("http://localhost:8000/file/private", {
        headers : {
          'Authorization' : 'Bearer ' + accessToken
        }
      }).then(res => {setFiles(res.data); console.log(res)});
    }
    
  },[accessToken]);

  //This hook upload file and retrieve new list of files
  useEffect(() => {
    if (inputFile != null){
      const data = new FormData();
      data.append('file', inputFile);
      axios.post("http://localhost:8000/upload", data, {
        headers : {
          'Authorization' : 'Bearer ' + accessToken
        }
      })
      .then(res => {setFiles(res.data); console.log(res)});
    }
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

export default MyFile;