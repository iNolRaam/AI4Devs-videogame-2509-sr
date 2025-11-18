class UIScene extends Phaser.Scene{
  constructor(){ super("UIScene"); }

  create(data){
    const {state, initials, time}=data;

    let text= state==="win" ? `¡COMPLETO!\nTiempo: ${time}s` : "PERDISTE";
    this.add.text(150,200,text,{fontSize:"32px", fill:"#fff"});

    if(state==="win"){
      let records=JSON.parse(localStorage.getItem("frogger_scores")||"[]");
      records.push({initials,time});
      records.sort((a,b)=>a.time-b.time);
      localStorage.setItem("frogger_scores",JSON.stringify(records.slice(0,3)));
    }

    this.add.text(150,350,"Refresca para volver al menú",{fontSize:"20px", fill:"#fff"});
  }
}
