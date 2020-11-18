import React from 'react';

function File({file, index, removeFile, getFile}){

	return(
	  <div className="file-container">
		<div className="file-name" onClick={() => getFile(index)}>
		  {file.file_name}
		</div>
		<div className="delete-file" onClick={() => removeFile(index)}>&#10006;</div>
	  </div>
	);
}

export default File;