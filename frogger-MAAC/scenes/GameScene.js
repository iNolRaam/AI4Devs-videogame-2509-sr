class GameScene extends Phaser.Scene{
  constructor(initials){ super("GameScene"); this.initials=initials; }

  preload(){
    this.load.image("frog","img/frog.png");
    this.load.image("car","img/car.webp");
  }

  create(){
    this.startTime=this.time.now;

    this.frog=this.physics.add.sprite(300,550,"frog").setScale(0.1);

    this.cursors=this.input.keyboard.createCursorKeys();
    this.wasd=this.input.keyboard.addKeys("W,A,S,D");

    this.cars=this.physics.add.group();

    for(let i=0;i<4;i++){
      for(let j=0;j<3;j++){
        let c=this.cars.create(100*j, 150+i*80, "car").setScale(0.3);
        c.speed=50+Math.random()*150;
      }
    }

    this.physics.add.collider(this.frog,this.cars,()=>this.lose());
  }

  update(){
    const f=this.frog.body;

    f.setVelocity(0);
    if(this.cursors.left.isDown||this.wasd.A.isDown) f.setVelocityX(-150);
    if(this.cursors.right.isDown||this.wasd.D.isDown) f.setVelocityX(150);
    if(this.cursors.up.isDown||this.wasd.W.isDown) f.setVelocityY(-150);
    if(this.cursors.down.isDown||this.wasd.S.isDown) f.setVelocityY(150);

    this.cars.children.iterate(c=>{
      c.x += c.speed * this.game.loop.delta/1000;
      if(c.x>650) c.x=-50;
    });

    if(this.frog.y<50) this.win();
  }

  win(){
    const t=((this.time.now-this.startTime)/1000).toFixed(2);
    this.scene.start("UIScene",{state:"win", initials:this.initials, time:t});
  }

  lose(){
    this.scene.start("UIScene",{state:"lose", initials:this.initials});
  }
}
