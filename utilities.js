//New Vec Digital Utitlities
//Last Updated 04/22/2016

function nvId(elementId){
	return document.getElementById(elementId);
}

function nvClass(elementClass){
	return document.getElementsByClassName(elementClass);
}

function nvRand(num){
	return Math.floor(Math.random() * num);
}

function nvArray2D(columns, rows, initVal){
	var newArray = new Array(columns);
	
	for(var a = 0; a < columns; a++){
		newArray[a] = new Array(rows);
		for(var b = 0; b < rows; b++){
			newArray[a][b] = initVal;
		}
	}

	return newArray;
}

function nvArray3D(columns, rows, depth, initVal){
	var newArray = new Array(columns);
	for(var a = 0; a < columns; a++){
		newArray[a] = new Array(rows);
		for(var b = 0; b < rows; b++){
			newArray[a][b] = new Array(depth);
			for(var c = 0; c < depth; c++){
				newArray[a][b][c] = initVal;
			}
		}
	}

	return newArray;
}

function nvInLimits2D(x, xLow, xHigh, y, yLow, yHigh){
	if(x <= xLow || y <= yLow)
		return false;
	else if(x >= xHigh || y >= yHigh)
		return false;
	else
		return true;
}

function nvLoad(fileLoaderId){
	if (window.File && window.FileReader && window.FileList && window.Blob){
		var myFile = nvId(fileLoaderId).files[0];
		var myData = '';
		
		if (myFile){
			var reader = new FileReader();
	    
	    reader.onload = function(element){ 
		    myData = reader.result;  
	     }
			reader.readAsText(myFile);
		}
		else{ 
			alert("Failed to load file");
		}
	}
	else{
		alert('The File APIs are not fully supported by your browser.');
	}
}

function nvSave(content){
	var downloadVehicle = document.createElement('a');
	downloadVehicle.href = 'data:text/plain;charset=utf-16;' + content;
	downloadVehicle.download = 'Tiles.txt';
	document.body.appendChild(downloadVehicle);
	downloadVehicle.click();
	document.body.removeChild(downloadVehicle);
}