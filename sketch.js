var cities = []; 

var totalCities; 

var Inifinity = Number.MAX_VALUE;

var roadArray = new Array(); 

var permanent = new Set(); 

var tentative = new Set(); 

var source = 0; 

// var prevSource = 0; 

// var counter = 10; 

const frames = 1.4; 

const margin = 40; // pixels 

function setup() {
	start(); 
	// lectureExample(); 
}

function draw() {
	background(255);  

	if(totalCities >= 40) { 
	  	stroke(220); 
	  	strokeWeight(0.4);
	  	noFill(); 
		beginShape();  
	}
	else if (totalCities < 40 && totalCities >= 20) { 
		stroke(220); 
		strokeWeight(0.6);
		noFill(); 
	}
	else { 
		stroke(220); 
		strokeWeight(0.8);
		noFill(); 
	}
	
	beginShape();	
  	
  	for(var i=0; i<roadArray.length; i++) { 
  		for(var j=0; j<roadArray[i].length; j++) { 
  			if(roadArray[i][j] == 0) {
  				continue; 
  			}
  			else if(roadArray[i][j] == Inifinity) {
  				continue; 
  			}
  			else {
  				vertex(cities[i].position.x, cities[i].position.y);
	  			vertex(cities[j].position.x, cities[j].position.y);  
  			}
  		}
  	}
	
	endShape();  


	fill(255); 

  	for (var i = 0; i < cities.length; i++) {
  		if(i === source) { 
			stroke(0, 100, 255);
			strokeWeight(4); 	
  		}
  		else { 
  			stroke(100);
  			strokeWeight(2);  
  		}
  		ellipse(cities[i].position.x, cities[i].position.y, 7, 7); 
	}

	// console.log(cities); 
	// console.log(roadArray); 
	stroke(200, 0, 100); 
	strokeWeight(1.5); 
	
	for(var item of permanent) { 
		if(item.prev === -1) 
			if(tentative.size === 0) break; 
			else continue; 
		line(item.prev.position.x, item.prev.position.y, item.position.x, item.position.y);
	} 
	// if(cities[source].prev != -1) { 
	// 	line(cities[source].prev.position.x, cities[source].prev.position.y, 
	// 		cities[source].position.x, cities[position].position.y); 
	// }
	
	console.log("Source:", source); 

	if(tentative.size !== 0 || source !== -1) {

		permanent.add(cities[source]); 

		// console.log(cities[source]); 		
		tentative.delete(cities[source]); 

		// console.log("source", source); 
		// stroke(0, 0, 255); 
		// strokeWeight(2); 
		
		for (var item of cities[source].neighbors) {	
			if(permanent.has(item)) {
				continue; 
			}
			tentative.add(item); 
			// line(item.prev.position.x, item.prev.position.y, item.position.x, item.position.y); 
		}

		// console.log(tentative); 

		tentative = update(tentative);
		
		// console.log(tentative); 
		
		// prevSource = source; 
		
		source = getMin(tentative);

		permanent.add(cities[source]); 
	} 
	else { 
		stroke(0, 100, 0); 
		strokeWeight(1.3); 
		
		for(var item of permanent) { 
			if(item.prev === -1) continue;
			line(item.prev.position.x, item.prev.position.y, item.position.x, item.position.y);
		} 

		console.log(cities); 

		noLoop(); 
	}	
	// sliderP.html("No. of cities: " + slider.value()); 
}



function start() { 
	createCanvas(windowWidth - margin, windowHeight - margin); 
	
	frameRate(frames); 

	source = 0;  
	
	totalCities = round(random(150));  
	// totalCities = 20; 
	
	for (var i = 0; i < totalCities; i++) {
		var x = round(random(width-margin/2));
		var y = round(random(height-margin/2)); 
		
		if(x >= 0 && x < 20) x = 25; 
		if(y >= 0 && y < 20) y = 25; 

		cities[i] = new City("v"+i, createVector(x, y), -1);

		if(i==source) cities[i].distance = 0; 
	} 
	console.log(cities); 

	roadArray = createMap(cities);

	tentative.add(cities[source]);

	console.log(tentative); 
}



function lectureExample() { 
	/* Doctor slides example. */ 
	createCanvas(600, 500);
	frameRate(frames); 

	cities = [
		new City("v1", {"x": 50, "y": 250}, -1), 
		new City("v2", {"x": 200, "y": 100}, -1), 
		new City("v3", {"x": 450, "y": 100}, -1), 
		new City("v4", {"x": 100, "y": 400}, -1),
		new City("v5", {"x": 300, "y": 400}, -1), 
		new City("v6", {"x": 550, "y": 200}, -1), 
	];

	cities[0].distance = 0; 

	cities[0].neighbors.add(cities[1]).add(cities[3]).add(cities[2]); 
	cities[1].neighbors.add(cities[0]).add(cities[3]).add(cities[2]);
	cities[2].neighbors.add(cities[0]).add(cities[1]).add(cities[3]).add(cities[4]).add(cities[5]); 
	cities[3].neighbors.add(cities[0]).add(cities[1]).add(cities[2]).add(cities[4]); 
	cities[3].neighbors.add(cities[2]).add(cities[3]).add(cities[5]); 
	cities[5].neighbors.add(cities[2]).add(cities[4]); 


	for(var i=0; i<cities.length; i++) { 
		if(i === source) continue; 
		cities[i].prev = cities[source]; 
	} 

	roadArray = [ 
		new Array(0, 2, 5, 1, Inifinity, Inifinity), 
		new Array(3, 0, 3, 2, Inifinity, Inifinity), 
		new Array(8, 6, 0, 3, 1, 5), 
		new Array(7, 2, 3, 0, 1, Inifinity), 
		new Array(Inifinity, Inifinity, 1, 1, 0, 2), 
		new Array(Inifinity, Inifinity, 8, Inifinity, 4, 0), 
	]; 
	tentative.add(cities[source]); 
	console.log(roadArray); 
}



function getMin(tentative) { 
	var min = Inifinity;

	var newsrc = -1; 

	for(var item of tentative) { 
		
		if(permanent.has(item)) continue; 
		
		if(item.distance < min) { 
		
			min = item.distance; 
		
			newsrc = cities.indexOf(item); 
		
		}

	}
	
	return newsrc;  
}

function update(tentative) { 
	var newTent = new Set(); 

	var cityIndex;

	var city;

	var d;	

	for(let item of tentative) { 	
		if(permanent.has(item)) continue; 

		cityIndex = cities.indexOf(item);
		city = cities[cityIndex]; 

		d = roadArray[source][cityIndex] + cities[source].distance;  

		// console.log("city cost", roadArray[source][cityIndex]); 

		// currNeighbors[i].distance = d; 
		stroke(0, 0, 255); 
		strokeWeight(1.5); 
		
		if(d < item.distance) { 
			city.distance = d;
			city.prev = cities[source]; 
			cities[cityIndex] = city;  
			
			line(item.prev.position.x, item.prev.position.y, item.position.x, item.position.y); 

		}
		// console.log(city); 
		newTent.add(city); 
	}	

	return newTent; 
}


function swap(a, i, j) { 
	var temp = a[i]; 
	a[i] = a[j]; 
	a[j] = temp; 
}


function calcDistance(points) { 
	var sum = 0; 
	
	for (var i = 0; i < points.length -1; i++) {
		var d = round(dist(points[i].x, points[i].y, points[i+1].x, points[i+1].y));
		sum += d; 
	}

	return sum; 
}


function createMap(cities) { 
	var citiesMap = twoDimArray(cities.length); 

	for(var i=0; i<cities.length; i++) { 
		for(var j=0; j<cities.length; j++) { 
			var rand = Math.floor(Math.random() * 100);

			if(cities[i] === cities[j]) { 
				citiesMap[i][j] = 0;  
				continue; 
			}
		
			if(totalCities >= 30) { 
				if (rand <= 50) { 
				citiesMap[i][j] = Inifinity; 
				continue; 
		
				}
				if (rand >= 60) { 
					citiesMap[i][j] = Inifinity; 
					continue;	
				}
			}
			else { 
				if (rand <= 50) { 
				citiesMap[i][j] = Inifinity; 
				continue; 
				}
				if (rand >= 85) { 
					citiesMap[i][j] = Inifinity; 
					continue;	
				}
			}

			if( 
				i == 0 && 
				j == round(cities.length - cities.length/2 - cities.length/4) || 
				j == 0
			  ) 
			{ continue; }

			citiesMap[i][j] = 
				round(dist(cities[i].position.x, cities[i].position.y, 
					cities[j].position.x, cities[j].position.y));
			
			cities[i].neighbors.add(cities[j]);
		}
	}
	// console.log(citiesMap); 
	
	return citiesMap; 
}

function twoDimArray(size) { 
	var array = new Array(size); 
	
	for(var i = 0; i<array.length; i++) { 
		array[i] = new Array(size); 
	}
	
	return array; 
}

function City(name, pos, prev) { 
	this.name = name; 
	this.position = pos; 
	this.prev = prev; 
	this.distance = Inifinity; 
	this.neighbors = new Set(); 

	return this;  
}
