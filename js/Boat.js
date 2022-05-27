class Boat {
    constructor(x,y,w,h,boatPos, boatAnimation){
       
        this.animation=boatAnimation;
        this.speed=0.05;
        this.body=Bodies.rectangle(x,y,w,h);
        this.w=w;
        this.h=h;
        //this.image=loadImage("./assets/boat.png");
        this.boatPosition=boatPos;
        this.isbroken=false;
        World.add(world,this.body);
    }
    animate(){
        this.speed+=0.05;
    }
    remove(index){
        this.animation=brokenAnimation;
        this.speed=0.05;
        this.w=300;
        this.h=300;
        this.isbroken=true;
        setTimeout(()=>{
            Matter.World.remove(world, boats[index].body);
            delete boats[index];
        },1000)
    }
    display(){
        var pos=this.body.position;
        var index=floor(this.speed % this.animation.length);
        push();
        translate(pos.x, pos.y);
        rotate(this.body.angle);
        imageMode(CENTER);
        image(this.animation[index], 0,this.boatPosition, this.w, this.h);
        pop();
    }
}