let simWidth = 600;
let simHeight = 400;
let humans = []; // An empty waiting room
let numHumans = 100;

// This runs ONCE at the very beginning
function setup() {
  createCanvas(simWidth, simHeight);

  // Create 50 new humans and put them in the waiting room
  for (let i = 0; i < numHumans; i++) {
    humans.push(new simulatedHuman());
  }
  // Setup Patient Zero
  humans[0].status = "SICK";
}

// This runs FOREVER, 60 times a second
function draw() {
  // NEW: Read the slider and set the speed
  let speed = document.getElementById("speedSlider").value;
  frameRate(Number(speed));

  // 10, 25, 47 is a cool dark blue color!
  background(10, 25, 47);

  // Draw every human on the screen
  for (let i = 0; i < numHumans; i++) {
    for (let j = i + 1; j < numHumans; j++) {
      checkCollision(humans[i], humans[j]);
    }
    humans[i].update();
    humans[i].display();
  }
}

// Our Cookie Cutter for a person
class simulatedHuman {
  constructor() {
    // Pick a random starting spot on the canvas
    this.x = random(simWidth);
    this.y = random(simHeight);
    this.radius = 5;
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.status = "HEALTHY";
    this.infectionTime = 0; // Starts at zero
  }

  // NEW: Instructions to move
  update() {
    this.x += this.vx;
    this.y += this.vy;

    let deathSpeed = document.getElementById("deathSlider").value;

    // NEW: Bounce off walls
    if (this.x > simWidth || this.x < 0) {
      this.vx *= -1; // Reverse X direction
    }
    if (this.y > simHeight || this.y < 0) {
      this.vy *= -1; // Reverse Y direction
    }
    // NEW: The Stopwatch
    if (this.status == "SICK") {
      this.infectionTime++; // Add 1 to the timer
    }
    // NEW: Game Over logic
    if (this.status == "SICK" && this.infectionTime > deathSpeed) {
      this.status = "DEAD";
      this.vx = 0; // Cut the engine
      this.vy = 0; // Cut the engine
    }
  }

  // Instructions for how to draw the person
  display() {
    noStroke(); // No outlines
    // NEW: Choose color based on health
    if (this.status == "HEALTHY") {
      fill(255, 255, 255); // Cyan
    } else if (this.status == "SICK") {
      fill(0, 255, 0); // Red
    } else if (this.status == "DEAD") {
      fill(50, 50, 50); // NEW: Gray
    }
    ellipse(this.x, this.y, this.radius * 2);
  }
}

// MAGIC MATH BOX: Checks if two people are touching
function checkCollision(personA, personB) {
  let distX = personA.x - personB.x;
  let distY = personA.y - personB.y;
  // Pythagorean theorem for distance
  let distance = sqrt(distX * distX + distY * distY);

  // If they crash and one is sick, both get sick!
  if (distance <= personA.radius + personB.radius) {
    if (personA.status == "SICK" || personB.status == "SICK") {
      personA.status = "SICK";
      personB.status = "SICK";
    }
  }
}

// NEW: The Reset Button
function resetSim() {
  humans = []; // Empty the waiting room
  for (let i = 0; i < numHumans; i++) {
    humans.push(new simulatedHuman());
  }
  humans[0].status = "SICK"; // Patient Zero returns!
}
