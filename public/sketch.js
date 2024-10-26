//Open and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

//sketch variables
let flowers = [];
const MIN_SIZE = 20;
const MAX_SIZE = 70;
let numFlowers = 4;


function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(10);

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
    this.rate = random(10, 30);

    this.flowerGrowthRate = this.finalFlowerSize / this.rate;
    this.petalWidthGrowthRate = this.finalPetalWidth / this.rate;
    this.petalHeightGrowthRate = this.finalPetalHeight / this.rate;

    this.growthDelay = 0; // Counter for delay
    this.wait = random(0, 30);

    this.opacity = 255;
    this.pentagon = random(0, 1);
    this.numPetals = floor(random(3, 30));
    this.r = random(0, 255);
    this.g = random(0, 255);
    this.b = random(0, 255);
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
    blendMode(SCREEN);
    stroke(this.r, this.g, this.b, this.opacity);
    setCenter(this.position.x, this.position.y);

    if (this.pentagon < 0.5) {
      polarPentagons(
        this.numPetals,
        this.currentPetalWidth,
        this.currentFlowerSize
      );
    } else {
      polarEllipses(
        this.numPetals,
        this.currentPetalWidth,
        this.currentPetalHeight,
        this.currentFlowerSize
      );
    }
    pop();
  }

  isFinished() {
    if (this.opacity < 0) {
      return true;
    }
  }
}
