const display=document.getElementById("leaderboard_display");
const forward=document.getElementById("lforward");
const backward=document.getElementById("lbackward");
const side1=document.getElementById("lside1");
const side2=document.getElementById("lside2");
const side3=document.getElementById("lside3");
const search=document.getElementById("lsearch");
const search_user=document.getElementById("sUser");
const search_comm=document.getElementById("sCommunity");
const userPerSide=10; 
var searchUser=0;
var searchCommunity=0;
fetch('/api/users/ip',{method:'POST',headers:{'Content-Type':'application/json'},
body: JSON.stringify({ good:1})}).then(x=>x.json()).then(t=>{  
if(t){

t=JSON.parse(t);

user_el.textContent=t.name;
}
});
fetch('/api/users/points',{method:'POST',headers:{'Content-Type':'application/json'},
body: JSON.stringify({ good:1})}).then(x=>x.json()).then(t=>{  
if(t){
user_points.textContent=t+" points";
}
});
const RequestLeadPage=function(num)
{
    fetch('/api/users/stats',{  
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
         pageNum:num,
         userPerPage:userPerSide,
         sComm:searchCommunity,
         sUser:searchUser
        })
     }).then(x=>x.text()).then(Txt=>{
     display.innerHTML=Txt;
     });
}

RequestLeadPage(1);

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
    RequestLeadPage(side1.textContent);
});
side2.addEventListener('click',()=>{
   RequestLeadPage(side2.textContent);
});
side3.addEventListener('click',()=>{
   RequestLeadPage(side3.textContent);
});
search.addEventListener('click',()=>{
    searchUser=String(search_user.value);
    searchCommunity=String(search_comm.value);

    RequestLeadPage(1);

});
