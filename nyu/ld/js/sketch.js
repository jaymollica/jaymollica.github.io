let c = "black";
let mousePos;
let myCanvas;
let getSketches;
let sketchObj;


function setup() {
    console.log("setup")
    myCanvas = createCanvas(500, 500);
    console.log(myCanvas);

    // make input button
    let x = document.createElement("Button");
    x.setAttribute("id", "click-me");
    let t = document.createTextNode("Input");
    x.appendChild(t);
    document.getElementById("sketch-buttons").appendChild(x);

    //make get sketches button
    let y = document.createElement("Button");
    y.setAttribute("id", "get-sketches");
    let s = document.createTextNode("Show sketches");
    y.appendChild(s);
    document.getElementById("sketch-buttons").appendChild(y);


    // capture ids of buttons
    getSketches = document.getElementById("get-sketches");
    let clickMe = document.getElementById("click-me");

    //click input when drawing finished
    clickMe.addEventListener('click', function () {


    })

    // click Get Sketches when you want to reveal everything 
    clickMe.addEventListener('click', function () {
        console.log("clicked")

        // whatever you draw in the canvas becomes a unique uri 
        let dataURL = document.getElementById('defaultCanvas0').toDataURL();
        console.log(dataURL);
    })



    background(225);
    noStroke();
    fill("#ba1e68");
    rect(0, 0, 40, 40);

    //draw the second color button
    fill("#191970");
    rect(40, 0, 40, 40);
    //draw the third color button
    fill("#145051");
    rect(80, 0, 40, 40);
    print(mouseX, mouseY);

    //draw the fourth color button
    fill("#7649fe");
    rect(120, 0, 40, 40);
    print(mouseX, mouseY);
    //draw the fifth color button

    fill("#FF7700");
    rect(160, 0, 40, 40);
    print(mouseX, mouseY);

}
function mouseDragged() {
    if (mouseIsPressed) {
        strokeWeight(5);
        stroke(c);
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}
function mousePressed() {
    if (mouseX > 0 && mouseX < 40 && mouseY > 0 && mouseY < 40) {
        //set the variables to random values
        c = "#ba1e68";
    }
    if (mouseX > 40 && mouseX < 80 && mouseY > 0 && mouseY < 40) {
        //set the variables to random values
        c = "#191970";
    }
    if (mouseX > 80 && mouseX < 120 && mouseY > 0 && mouseY < 40) {
        //set the variables to random values
        c = "#145051";
    }
    if (mouseX > 120 && mouseX < 160 && mouseY > 0 && mouseY < 40) {
        //set the variables to random values
        c = "#7649fe";
    }
    if (mouseX > 160 && mouseX < 200 && mouseY > 0 && mouseY < 40) {
        //set the variables to random values
        c = "#FF7700";
    }
}