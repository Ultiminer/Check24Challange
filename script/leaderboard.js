const display=document.getElementById("leaderboard_display");
const forward=document.getElementById("lforward");
const backward=document.getElementById("lbackward");
const side1=document.getElementById("lside1");
const side2=document.getElementById("lside2");
const side3=document.getElementById("lside3");
const userPerSide=10; 

forward.addEventListener('click',()=>{
side1.textContent-=-1;
side2.textContent-=-1;
side3.textContent-=-1;
});
backward.addEventListener('click',()=>{
    if(side1.textContent==1)return;
    side1.textContent-=1;
    side2.textContent-=1;
    side3.textContent-=1;
});
side1.addEventListener('click',()=>{
    fetch('api/stats/post',{
       method:'POST' ,
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
        pageNum:side1.textContent,
        userPerPage:userPerSide
       })
    
    });
    
    fetch('api/stats/get').then(x=>x.text()).then(Txt=>{
    display.innerHTML=Txt;
    });
    
});
side2.addEventListener('click',()=>{
    fetch('api/stats/post',{
       method:'POST' ,
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
        pageNum:side2.textContent,
        userPerPage:userPerSide
       })
    
    });
    
    fetch('api/stats/get').then(x=>x.text()).then(Txt=>{
    display.innerHTML=Txt;
    });
    
});
side3.addEventListener('click',()=>{
    fetch('api/stats/post',{
       method:'POST' ,
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
        pageNum:side3.textContent,
        userPerPage:userPerSide
       })
    
    });
    
    fetch('api/stats/get').then(x=>x.text()).then(Txt=>{
    display.innerHTML=Txt;
    });
    
});
