let game;
document.getElementById("startBtn").onclick = ()=>{
  const init=document.getElementById("initials").value.toUpperCase();
  if(init.length!==3) { alert("3 letras"); return;}
  startGame(init);
};
document.getElementById("scoresBtn").onclick=showScores;

function showScores(){
  const s=JSON.parse(localStorage.getItem("frogger_scores")||"[]");
  let html="<h2 class='text-xl mb-2'>High Scores</h2>";
  s.slice(0,3).forEach(r=> html+=`<p>${r.initials} - ${r.time}s</p>`);
  document.getElementById("scores").innerHTML=html;
  document.getElementById("scores").classList.remove("hidden");
}

function startGame(initials){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");

  const config={
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    parent: "game",
    backgroundColor: "#222",
    physics:{ default:"arcade" },
    scene:[new GameScene(initials), UIScene]
  };
  game=new Phaser.Game(config);
}
