var canvas = document.getElementById("canvasObject"),
	file = document.getElementById("fileObject");

var imageOrg = null,
    imageMod = null;    

var modified = false;

function upload() {
	
	imageOrg = new SimpleImage(file);
	imageMod = new SimpleImage(file);

	imageOrg.drawTo(canvas);

}

function verify(image) {

	if (image === null || ! image.complete()) {

		return false;	

	} else {

		return true;

	}

}

function convert(hex, color) {

	var array = [];
	
	for (var i = 1; i < hex.length; i+= 2) {
	
		array.push(parseInt(hex.slice(i , i + 2), 16));
	
	} 
	
	switch(color.toLowerCase()) {
	case 'red':
		
		return array[0];
		break;
	case 'green':
	
		return array[1];
		break;
	case 'blue':
	
		return array[2];
		break;
		
	}
    
}

function hueScale(hex, pixel) {
    
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/3;
    
    if (avg < 128) {
    
    	pixel.setRed(convert(hex, 'red') / 127.5 * avg);
	    pixel.setGreen(convert(hex, 'green') / 127.5 * avg);
	    pixel.setBlue(convert(hex, 'blue') / 127.5 * avg);
        
    } else {
    
    	pixel.setRed((2 - convert(hex, 'red') / 127.5) * avg + 2 * convert(hex, 'red') - 255);
	    pixel.setGreen((2 - convert(hex, 'green') / 127.5) * avg + 2 * convert(hex, 'green') - 255);
    	pixel.setBlue((2 - convert(hex, 'blue') / 127.5) * avg + 2 * convert(hex, 'blue') - 255);
        
    }
    
}

function makeHue() {

	if ( verify(imageMod) ) {
	
		var colorInput = document.getElementById("colorObject"),
			hex = colorInput.value;

		imageMod.setSize(300, 300);
    
    	for (var pixel of imageMod.values()) {
		        
		    hueScale(hex, pixel);
        
    	}
	
		imageMod.drawTo(canvas);
	    
	    modified = true;
	    
	    //To give the next event handler unadulterated image data:
		imageMod = new SimpleImage(file);
		
	} else {
        
        alert("Image is not ready!");
        
    }

}

var toggle = 0;

function makeRainbow() {

	if ( verify(imageMod) ) {
		
		
		++toggle;
		
		if (toggle === 5) {
		
			toggle = 1;
		
		} 
		
		var side = 300;
			
		imageMod.setSize(side, side);		

		for (var pixel of imageMod.values()) {
						
			var x = pixel.getX(),
				y = pixel.getY(),
				z,
				w;
				
			var condition = [[z >= side * 6/7, x - y >= 214, x + y >= 2 * (side) * 6/7], [z >= side * 5/7, x - y >= 128, x + y >= 2 * (side) * 5/7], [z >= side * 4/7, x - y >= 43, x + y >= 2 * (side) * 4/7], [z >= side * 3/7, x - y >= -43, x + y >= 2 * (side) * 3/7], [z >= side * 2/7, x - y >= -128, x + y >= 2 * (side) * 2/7], [z >= side * 1/7, x - y >= -214, x + y >= 2 * (side) * 1/7], [x >= 0, x - y >= -300, x + y >= 0]];
			
			switch (toggle) {
			case 1:
			
				w = 0;
		    	z = x;
		    	
				break;
			case 2:
			
				w = 0;
		    	z = y;
		    	
				break;
			case 3:
			
				w = 1;
				
				break;
			case 4:
			
				w = 2;
				
				break;
			
			}
		    
		    if (condition[0][w]) {
		        
	        	hueScale("#EE82EE", pixel);
	            
	        } else if (condition[1][w]) {
	        
	        	hueScale("#4B0082", pixel);
	            
	        } else if (condition[2][w]) {
	            
	            hueScale("#0000FF", pixel);
	            
	        } else if (condition[3][w]) {
	        
	        	hueScale("#00FF00", pixel);
	            
	        } else if (condition[4][w]) {
	            
	            hueScale("#FFFF00", pixel);
	            
	        } else if (condition[5][w]) {
	            
	            hueScale("#FF7F00", pixel);
	            
	        } else if (condition[6][w]) {
	            
	            hueScale("#FF0000", pixel);
	            
	        }
		    
		}
		
		imageMod.drawTo(canvas);
	    
	    modified = true;
	    
	    //To give the next event handler unadulterated image data:
		imageMod = new SimpleImage(file);
		
	} else {
        
        alert("Image is not ready!");
        
    }

}


var xAug,
    yAug;


function ranNum(x, y, space) {
    
    var randomAdd = Math.round(Math.random() * space);
    
    if (Math.random() < 1/2) {
        
        xAug = x + randomAdd;
        yAug = y - randomAdd;
        
    } else {
        
        xAug = x - randomAdd;
        yAug = y + randomAdd;
        
    }
    
    if (xAug > imageMod.getWidth()-1) {
        
        xAug = x - randomAdd;
        
    } if (yAug > imageMod.getHeight()-1) {
        
        yAug = y - randomAdd;
        
    } if (xAug < 0) {
        
        xAug = x + randomAdd;
        
    } if (yAug < 0) {
        
        yAug = y + randomAdd;
        
    }
    
    
} 

function makeBlur() {

	var range = document.getElementById("rangeObject"),
		rangeValue = range.value;

	if ( verify(imageMod) ) {
	
		for (var pixel of imageMod.values()) {
        
		    var x = pixel.getX(),
		        y = pixel.getY();
		        
		    ranNum(x, y, rangeValue);
		    
		    var pixelAdj = imageMod.getPixel(xAug, yAug);
		    
		    if (Math.random() >= 1/2) {
		        
		        imageMod.setPixel(x, y, pixelAdj);
		        
		    }
        
    	}
	    
	    imageMod.drawTo(canvas);
	    
	    modified = true;
	    
	    //To give the next event handler unadulterated image data:
		imageMod = new SimpleImage(file);
    
    } else {
        
        alert("Image is not ready!");
        
    }
	
}

function reset() {

    if ( verify(imageOrg) && modified === true) {
        
        //To give the next event handler unadulterated image data:
        imageMod = new SimpleImage(canvas);
        
        imageOrg.drawTo(canvas);
        
        modified = false;
        
        toggle = 0;
    
    } else if ( verify(imageOrg) === false) {
    
        alert("Image is not ready");
    
    } else if (modified === false) {
    
        alert("Image is not modified");
    
    }

}



