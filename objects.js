//predefined colors
white = "#ffffff65"; //com transparencia
black = "#000000"

SEGMENTS_CIRCLE = 30;

function Box(center = [0, 0, 1], height = 50, width = 50) {
    this.center = center;
    this.height = height;
    this.width = width;
    this.T = identity(); //matriz 3x3 de translação 
    this.R = identity(); //matriz 3x3 de rotação
    this.S = identity(); //matriz 3x3 de escala
    this.fill = white; //cor de preenchimento -> aceita cor hex, ex.: this.fill = "#4592af"
    this.stroke = black; //cor da borda -> aceita cor hex, ex.: this.stroke = "#a34a28"
    this.name = "";
}

Box.prototype.setName = function(name) {
    this.name = name;
}


Box.prototype.setTranslate = function(x, y) {
    this.T = translate(x, y);
}

Box.prototype.getTranslate = function() {
    return [this.T[0][2], this.T[1][2], 1];
}

Box.prototype.setRotate = function(theta) {
    this.R = rotate(theta);
}


Box.prototype.setScale = function(x, y) {
    this.S = scale(x, y);
}
Box.prototype.setFill = function(x) {
    this.fill = x;
}
Box.prototype.setStroke = function(x) {
    this.stroke = x;
}

Box.prototype.getInverseScale = function(){
    return inverseScale(this.S);
}
Box.prototype.getInverseRotation = function(){
    return inverseRotate(this.R);
}
Box.prototype.getInverseTranslate = function(){
    return inverseTranslate(this.T);
}

Box.prototype.tryIntersection = function(coordenadas){
    console.log("Tenta interseção com caixa")

    var inverse_scale = this.getInverseScale();
    var inverse_rotate = this.getInverseRotation();
    var inverse_translate = this.getInverseTranslate();

    var inverse_m = mult(mult(inverse_scale, inverse_rotate), inverse_translate);
    var coords_1 = multVec(inverse_m, coordenadas);

    var points = [];
    points.push([this.center[0] + this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] - this.height / 2, 1]);
    points.push([this.center[0] + this.width / 2, this.center[1] - this.height / 2, 1]);

    if(coords_1[0] >= points[1][0] && coords_1[0] <= points[0][0]) {
        if(coords_1[1] >= points[2][1] && coords_1[1] <= points[1][1]){
            return true;
        }
    }
    return false;
}




Box.prototype.draw = function(canv = ctx) { //requer o contexto de desenho
    //pega matriz de tranformação de coordenadas canônicas para coordenadas do canvas
    var M = transformCanvas(WIDTH, HEIGHT);
    var Mg = mult(M, mult(mult(this.T, this.R), this.S));
    canv.lineWidth = 2; //largura da borda
    canv.strokeStyle = this.stroke;
    canv.fillStyle = this.fill;
    //criação dos pontos do retângulo de acordo com o centro, largura e altura
    var points = [];
    points.push([this.center[0] + this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] - this.height / 2, 1]);
    points.push([this.center[0] + this.width / 2, this.center[1] - this.height / 2, 1]);

    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
        points[i] = multVec(Mg, points[i]); //transformando o ponto em coordenadas canonicas em coordenadas do canvas
        if (i == 0) canv.moveTo(points[i][0], points[i][1]);
        else canv.lineTo(points[i][0], points[i][1]);
    }
    canv.lineTo(points[0][0], points[0][1]); //fechando o retângulo
    canv.fill(); //aplica cor de preenchimento
    canv.strokeStyle = this.stroke;
    canv.stroke(); //aplica cor de contorno

    //desenho do nome
    canv.beginPath();
    canv.fillStyle = this.stroke;
    canv.font = "16px Courier";
    var center = multVec(Mg, this.center);
    canv.fillText(this.name, center[0] - this.name.length * 16 / 3, center[1] + 3); //deixa o texto mais ou menos centralizado no meio da caixa
}


function Circle(center = [0, 0, 1], radius = 50) {
    this.center = center;
    this.radius = radius;
    this.T = identity(); //matriz 3x3 de translação 
    this.R = identity(); //matriz 3x3 de rotação
    this.S = identity(); //matriz 3x3 de escala
    this.fill = white; //cor de preenchimento -> aceita cor hex, ex.: this.fill = "#4592af"
    this.stroke = black; //cor da borda -> aceita cor hex, ex.: this.stroke = "#a34a28"
    this.name = "";
}

Circle.prototype.tryIntersection = function(coordenadas){
    console.log("Tenta interseção com circulo")
    var ir = this.getInverseRotation();
    var it = this.getInverseTranslate();
    var is = this.getInverseScale();

    var mg = mult(mult(is, ir), it);

    var pl = multVec(mg, coordenadas);

    var x = Math.pow(pl[0] - this.center[0], 2);
    var y = Math.pow(pl[1] - this.center[1], 2);

    var d = Math.sqrt(x+y);

    if(d<= this.radius){
        return true;
    }else{
        return false;
    }
}

Circle.prototype.setName = function(name) {
    this.name = name;
}

Circle.prototype.setTranslate = function(x, y) {
    this.T = translate(x, y);
}

Circle.prototype.getTranslate = function() {
    return [this.T[0][2], this.T[1][2], 1];
}

Circle.prototype.setRotate = function(theta) {
    this.R = rotate(theta);
}


Circle.prototype.setScale = function(x, y) {
    this.S = scale(x, y);
}

Circle.prototype.setRadius = function(r) {
    this.radius = r;
}

Circle.prototype.setFill = function(fill) {
    this.fill = fill;
}
Circle.prototype.setStroke = function(x) {
    this.stroke = x;
}
Circle.prototype.getInverseTranslate = function(){
    return inverseTranslate(this.T);
}
Circle.prototype.getInverseRotation= function(){
    return inverseRotate(this.R);
}
Circle.prototype.getInverseScale = function(){
    return inverseScale(this.S);
}


Circle.prototype.draw = function(canv = ctx) { //requer o contexto de desenho
    //pega matriz de tranformação de coordenadas canônicas para coordenadas do canvas
    var M = transformCanvas(WIDTH, HEIGHT);
    var Mg = mult(M, mult(mult(this.T, this.R), this.S));
    canv.lineWidth = 2; //largura da borda
    canv.strokeStyle = this.stroke;
    canv.fillStyle = this.fill;
    //criação dos pontos do retângulo de acordo com o centro, largura e altura
    var points = [];
    var alpha = 2 * Math.PI / SEGMENTS_CIRCLE;
    for (i = 0; i < SEGMENTS_CIRCLE; i++) {
        points.push([Math.cos(alpha * i) * this.radius + this.center[0], Math.sin(alpha * i) * this.radius + this.center[1], 1]);
    }
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
        points[i] = multVec(Mg, points[i]); //transformando o ponto em coordenadas canonicas em coordenadas do canvas
        if (i == 0) canv.moveTo(points[i][0], points[i][1]);
        else canv.lineTo(points[i][0], points[i][1]);
    }
    canv.lineTo(points[0][0], points[0][1]); //fechando o retângulo
    canv.fill(); //aplica cor de preenchimento
    canv.strokeStyle = this.stroke;
    canv.stroke(); //aplica cor de contorno

    //desenho do nome
    canv.beginPath();
    canv.fillStyle = this.stroke;
    canv.font = "16px Courier";
    var center = multVec(Mg, this.center);
    canv.fillText(this.name, center[0] - this.name.length * 16 / 3, center[1] + 3); //deixa o texto mais ou menos centralizado no meio da caixa
}