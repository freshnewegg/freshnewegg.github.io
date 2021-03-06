
    var WIDTH=Math.max(1,window.innerWidth);
    var HEIGHT=Math.max(1,window.innerHeight);
    var canvas;
    var firstCanvas;
    var firstContext; 
    var bufferCanvas;
    var bufferContext;
    var con;// con is first Canvas con for legacy reasons
    var g;
    var pxs = new Array();
    var rint = 10;

    
$(document).ready(function(){

    canvassetup();


    //render the buffered canvas onto the original canvas element
        for(var i = 0; i < 75; i++) {
            pxs[i] = new Circle();
            pxs[i].reset();
        }
    //setInterval(draw,rint);
    draw();

    
});

function canvassetup(){

    // resizing will no longer screw up the stars
    WIDTH=Math.max(1,window.innerWidth);
    HEIGHT=Math.max(1,window.innerHeight);
    canvas = document.getElementById('pixie'); //790
    canvas.width=WIDTH;
    canvas.height=HEIGHT;
    con=canvas.getContext('2d');
    // buffer canvas
    firstCanvas = document.createElement('canvas');
    firstCanvas.width = window.innerWidth;
    firstCanvas.height = window.innerHeight;
    bufferContext = firstCanvas.getContext('2d');
}

function draw() {
    setTimeout(function(){

        window.requestAnimationFrame(draw);
        bufferContext.clearRect(0,0,WIDTH,HEIGHT);



        for(var i = 0; i < pxs.length; i++) {
            pxs[i].fade();
            pxs[i].move();
            pxs[i].draw();
        }
        con.clearRect(0,0,WIDTH,HEIGHT);
        con.drawImage(firstCanvas, 0, 0);
    }, rint);
}  
//draw();

function Circle() {
    this.settings = {time_to_live:500, x_maxspeed:5, y_maxspeed:2, radius_max:36, rt:1, x_origin:960, y_origin:540, random:true, blink:true};


    // this generates each individual bubble
    this.reset = function() {

        this.x = (this.settings.random ? WIDTH*Math.random() : this.settings.x_origin);
        this.y = (this.settings.random ? HEIGHT*Math.random() : this.settings.y_origin);
        this.r = ((this.settings.radius_max-1)*Math.random()) + 1;
        this.dx = (Math.random()*this.settings.x_maxspeed) * (Math.random() < .5 ? -1 : 1);
        this.dy = (Math.random()*this.settings.y_maxspeed) * (Math.random() < .5 ? -1 : 1);
        this.hl = (this.settings.time_to_live)*(this.r/this.settings.radius_max);
        this.rt = Math.random()*this.hl;
        this.settings.rt = Math.random()+1;
        this.stop = Math.random()*.2+.4;
        this.settings.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
        this.settings.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
    }

    this.fade = function() {
        this.rt += this.settings.rt;
    }

    // this creates a path and illustrates the stars
    this.draw = function() {
        if(this.settings.blink && (this.rt <= 0 || this.rt >= this.hl)) this.settings.rt = this.settings.rt*-1;
        else if(this.rt >= this.hl) this.reset();
        var new_opacity = 1-(this.rt/this.hl);
        bufferContext.beginPath();
        bufferContext.arc(this.x,this.y,this.r,0,Math.PI*2,true);
        bufferContext.closePath();
        g = bufferContext.createRadialGradient(Math.abs(this.x),Math.abs(this.y),0,Math.abs(this.x),Math.abs(this.y),Math.abs(this.r*new_opacity));
        g.addColorStop(0.0, 'rgba(255,255,255,'+new_opacity+')');
        g.addColorStop(this.stop, 'rgba(77,101,181,'+(new_opacity*.6)+')');
        g.addColorStop(1.0, 'rgba(77,101,181,0)');
        bufferContext.fillStyle = g;
        bufferContext.fill();
    }

    this.move = function() {

        this.x += Math.abs((this.rt/this.hl)*this.dx);

        this.y +=0;// (this.rt/this.hl)*this.dy;
        if(this.x > WIDTH || this.x < 0) this.x = 1;
        if(this.y > HEIGHT || this.y < 0) this.dy *= -1;
    }
}

