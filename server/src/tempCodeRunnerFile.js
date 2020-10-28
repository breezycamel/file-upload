gfs.find().toArray((err,files) => {
		if(!files || files.length === 0){
			console.log("No file");
		}
		else{
			const f = files.map(file => {
				if (file.contentType === "image/png" || file.contentType === "image/jpeg") {
					file.isImage = true;
				} 
				else {
					file.isImage = false;
				}
					return file;
				})
				.sort((a, b) => {
				return (new Date(b["uploadDate"]).getTime() - new Date(a["uploadDate"]).getTime());
			});
		}
	});