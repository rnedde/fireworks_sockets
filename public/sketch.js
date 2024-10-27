//Open and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

//sketch variables
let flowers = [];
const MIN_SIZE = 10;
const MAX_SIZE = 50;
let numFlowers = 6;


function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  //Listen for messages named 'data' from the server
  socket.on('data', function(obj) {
    console.log(obj);
    drawPos(obj);
  });
}

function mousePressed() {
  //Grab mouse position
  let mousePos = { x: mouseX, y: mouseY };
  //Send mouse position object to the server
  socket.emit('data', mousePos);

  //Draw yourself? or Wait for server?
  // fill(0);
  // ellipse(mouseX, mouseY 10, 10);
}

function draw() {
  background(10, 15, 30);
  // Loop through flowers and grow/display them
  for (let i = 0; i < flowers.length; i++) {
    flowers[i].grow(i);
    flowers[i].display();
  }
  // Remove finished flowers
  for (let i = flowers.length - 1; i >= 0; i--) {
    if (flowers[i].isFinished()) {
      flowers.splice(i, 1); // Remove finished flowers
    }
  }
}

//Expects an object with a and y properties
function drawPos(pos) {
  let x = pos.x;
  let y = pos.y;
  for (let i = 0; i < numFlowers; i++) {
    flowers.push(new Flower(x,y));
  }
}


class Flower {
  constructor(x, y) {
    this.position = createVector(x, y);

    this.currentFlowerSize = 0;
    this.currentPetalWidth = 0;
    this.currentPetalHeight = 0;
    this.finalFlowerSize = random(MIN_SIZE, MAX_SIZE);
    this.finalPetalWidth = random(0, MIN_SIZE);
    this.finalPetalHeight = random(0, MIN_SIZE);


    this.growTime = random(10, 30);
    this.flowerGrowthRate = this.finalFlowerSize / this.growTime;
    this.petalWidthGrowthRate = this.finalPetalWidth / this.growTime;
    this.petalHeightGrowthRate = this.finalPetalHeight / this.growTime;


    this.growthDelay = 0; // Counter for delay
    this.wait = random(0, 30);

    this.opacity = 255;
    this.shape = floor(random(0, 7));
    this.numPetals = floor(random(3, 20));
    this.r = random(0, 255);
    this.g = random(0, 255);
    this.b = random(0, 255);
    this.stroke = random(1,20);
    this.blend = floor(random(0,4));

  }

  grow(index) {
    //first flower draws immediately, next 2 wait delay amount.
    if (this.growthDelay < this.wait && index % 3 != 0) {
      this.growthDelay++;
      return; // Skip growth until delay is met
    }
    this.currentFlowerSize += this.flowerGrowthRate;
    this.currentPetalWidth += this.petalWidthGrowthRate;
    this.currentPetalHeight += this.petalHeightGrowthRate;

    if (this.currentFlowerSize >= this.finalFlowerSize) {
      this.opacity -= 5;
    }
  }

  display() {
    
    push();
    strokeWeight(this.stroke);
    print(this.stroke);

    blendMode(SCREEN);
    // For random blend modes 
    // if (this.blend == 0){
    //   blendMode(SCREEN)
    // } else if(this.blend == 1) {
    //   blendMode(ADD);
    // }else if(this.blend == 2) {
    //   blendMode(LIGHTEST);
    // }else if(this.blend == 3) {
    //   blendMode(DIFFERENCE);
    // }
    stroke(this.r, this.g, this.b, this.opacity);
    setCenter(this.position.x, this.position.y);

    if (this.shape == 0) {
      polarPentagons(
        this.numPetals,
        this.currentPetalWidth,
        this.currentFlowerSize
      );
    } else if (this.shape == 1){
      polarEllipses(
        this.numPetals,
        this.currentPetalWidth,
        this.currentPetalHeight,
        this.currentFlowerSize
      );
    } else if (this.shape == 2){
      polarLines(
        this.numPetals,
        this.currentPetalWidth,
        this.currentFlowerSize
      )
    }else if (this.shape == 3){
      polarTriangles(
        this.numPetals,
        this.currentPetalWidth,
        this.currentFlowerSize
      )
    }else if (this.shape == 4){
      polarHexagons(
        this.numPetals,
        this.currentPetalWidth,
        this.currentFlowerSize
      )
    }else if (this.shape == 5){
      polarHeptagons(
        this.numPetals,
        this.currentPetalWidth,
        this.currentFlowerSize
      )
    }else if (this.shape == 6){
      polarOctagons(
        this.numPetals,
        this.currentPetalWidth,
        this.currentFlowerSize
      )
    }
    pop();
  }

  isFinished() {
    if (this.opacity < 0) {
      return true;
    }
  }
}
