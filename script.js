document.getElementById("info-object").style.display = "none";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = window.innerWidth;
const HEIGHT = window.outerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;
//faz o desenho do triângulo

var objects = []; //lista de objetos
var objectSelected = null;
var flag = 0;
function drawCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (var i = 0; i < objects.length; i++) {
        objects[i].draw();
    }
    drawAxis();
}

function drawAxis() {
    ctx.strokeStyle = "#f3c1c6";
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.setLineDash([1, 1]);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);


}
function updateName(){
  var name = document.getElementById("name").value;
  objectSelected.setName(name);
  drawCanvas();
}

window.addEventListener("load", drawCanvas);

function pushBox() {
    var obj = new Box();
    objects.push(obj);
    objectSelected = objects[objects.length - 1];
    updateDisplay(objectSelected);
    document.getElementById("info-object").style.display = "block";
    drawCanvas();

}

function pushCircle() {
    var obj = new Circle();
    objects.push(obj);
    objectSelected = objects[objects.length - 1];
    updateDisplay(objectSelected);
    document.getElementById("info-object").style.display = "block";
    drawCanvas();
}

function updateDisplay(objectSelected) {
    document.getElementById("posx").value = objectSelected.getTranslate()[0];
    document.getElementById("posy").value = objectSelected.getTranslate()[1];
}

function updatePosition() {
    if (objectSelected != null) {
        try {
            var posx = parseFloat(document.getElementById("posx").value);
            var posy = parseFloat(document.getElementById("posy").value);
            objectSelected.setTranslate(posx, posy);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}


function scaleObject() {
    if (objectSelected != null) {
        try {
            var posx = parseFloat(document.getElementById("scalex").value);
            var posy = parseFloat(document.getElementById("scaley").value);
            objectSelected.setScale(posx, posy);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}




function rotateObject() {
    if (objectSelected != null) {
        try {
            var angle = parseFloat(document.getElementById("angle").value);
            objectSelected.setRotate(angle);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}
function colorFillObject() {
    if (objectSelected != null) {
        try {
            var colorFillObject = document.getElementById("colorObject").value;
            objectSelected.setFill(colorFillObject);
            drawCanvas();
        } catch (error) {
            alert(error);
        }function inverseRotate(mat){
            return[
                [mat[0][0],mat[1][0],0],
                [mat[0][1],mat[1][1],0],
                [0,0,1]
            ];
        }
    }
}
function colorStrokeObject() {
    if (objectSelected != null) {
        try {
            var colorStrokeObject = document.getElementById("colorObjectStroke").value;
            objectSelected.setStroke(colorStrokeObject);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}
/*** Tip (Dica) ***/
function onClickMouse(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    objectSelected=null;
    var coor = multVec(transformUsual(WIDTH,HEIGHT),[x,y,1]);
    console.log("x coords: " + x + ", y coords: " + y);
    console.log("x usualcoords: " + coor[0] + ", y usualcoords: " + coor[1]);

    for(var i=0; i<objects.length; i++){
        if(objects[i].tryIntersection(coor)){
            console.log("Houve interseção!")
            objectSelected=objects[i];
        } else {
            console.log("Não houve interseção")
        }
    }
}
 function overClick(event){
     flag = 0;
 }
 

 function setToMoveObject(){
     flag = 1;
 }

 canvas.addEventListener("dblclick", setToMoveObject);
 canvas.addEventListener("mousemove", moveObject);
 canvas.addEventListener("click", overClick);


function moveObject(event){
    if(flag==1){
        if(objectSelected != null){
            var x = event.offsetX;
            var y = event.offsetY;

            var m = transformUsual(WIDTH, HEIGHT);

            var click = [x,y,1];
            var pos = multVec(m, click);
            objectSelected.setTranslate(pos[0], pos[1]);
            drawCanvas();
        }
    }
}