const display=document.getElementById("leaderboard_display");


fetch('api/users/stats').then(x=>x.json())
.then(t=>{
    const {name, points}=JSON.parse(t);
    
});
