'use strict';

const signIn=document.querySelector('.button');

const UserName=document.getElementById('lname');
const Password=document.getElementById('lpw');
const InputFields=document.getElementById('log_in_form');
const HomeField=document.getElementById('home_screen');
const LoginResponse=document.getElementById('resp_form');
const community_preview=document.getElementById('community_preview');
const bet=document.getElementById('bet');
const bet_num_a=document.getElementById('bet_num_a'); 
const bet_num_b=document.getElementById('bet_num_b'); 
const bet_num_a_inc=document.getElementById('bet_num_a_inc'); 
const bet_num_a_dec=document.getElementById('bet_num_a_dec'); 
const bet_num_b_inc=document.getElementById('bet_num_b_inc'); 
const bet_num_b_dec=document.getElementById('bet_num_b_dec'); 
const upcoming_match_teamsA=document.getElementById('upcoming_match_teamsA'); 
const upcoming_match_teamsB=document.getElementById('upcoming_match_teamsB'); 
const upcoming_match_time=document.getElementById('upcoming_match_time'); 
const prev_bet=document.getElementById("prev_bet");
const user_points=document.getElementById("user_points");
const user_el=document.getElementById("user_el");
 
let gen_date=new Date();
const currentDate = gen_date.toLocaleDateString();



var myUser;
var myMatches=0; 

const loadPreview=function()
{
    fetch('/api/users/preview',{  
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:myUser
     }).then(x=>x.text()).then(Txt=>{
    community_preview.innerHTML=Txt;
     });
}
const updateUpMatchTime=function()
{
gen_date= new Date();
let currentHour=gen_date.getHours();
let currentMinute=gen_date.getMinutes();
let currentSecond=gen_date.getSeconds();
let resDay=(myMatches[0].date.substring(3,5)-currentDate.substring(3,5))*31+(myMatches[0].date.substring(0,2)-currentDate.substring(0,2));
let resHour=(myMatches[0].time.substring(0,2)-currentHour-1);
if(resHour<0){resHour-=-24;resDay-=1;}
        upcoming_match_time.textContent=resDay
        +":"
        +resHour
        +":"
        +(60-currentMinute)
        +":"
        +(60-currentSecond);
window.requestAnimationFrame(updateUpMatchTime);
}



fetch('/api/users/ip',{method:'POST',headers:{'Content-Type':'application/json'},
body: JSON.stringify({ good:1})}).then(x=>x.json()).then(t=>{  
if(t){
myUser=t;
t=JSON.parse(t);

user_el.textContent=t.name;
InputFields.style='display:none';
HomeField.style='display:initial';loadPreview(); 
}
});

fetch('/api/users/points',{method:'POST',headers:{'Content-Type':'application/json'},
body: JSON.stringify({ good:1})}).then(x=>x.json()).then(t=>{  
if(t){
user_points.textContent=t+" points";
}
});

fetch('/api/matches/all',{method:'POST',headers:{'Content-Type':'application/json'},
body: JSON.stringify({ date:currentDate})}).then(x=>x.json()).then(async t=>{  
if(t){
myMatches=t;
upcoming_match_teamsA.textContent=myMatches[0].countryA+":"+myMatches[0].countryB;
upcoming_match_teamsB.textContent=myMatches[1].countryA+":"+myMatches[1].countryB;
window.requestAnimationFrame(updateUpMatchTime);
}});


//HTML DOM interactions
signIn.addEventListener('click',function(){
    fetch('/api/users/request', {
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ 
            user:UserName.value,
            pw:Password.value,
        })
      }).then(x=>x.json()).then(t=>{
        const {msg,id}=JSON.parse(t);
        LoginResponse.textContent=String(msg);
        if(Number(id)===1)
        {
            InputFields.style='display:none';
            HomeField.style='display:initial'; 
            loadPreview();
        }
    });
});

bet_num_a_inc.addEventListener('click',()=>{
if(bet_num_a.textContent<9)
bet_num_a.textContent-=-1;
});
bet_num_a_dec.addEventListener('click',()=>{
if(bet_num_a.textContent>0)
bet_num_a.textContent-=1;
});
bet_num_b_inc.addEventListener('click',()=>{
if(bet_num_b.textContent<9)
bet_num_b.textContent-=-1;
});
bet_num_b_dec.addEventListener('click',()=>{
if(bet_num_b.textContent>0)
bet_num_b.textContent-=1;
});
upcoming_match_teamsB.addEventListener('click',()=>{
const Switcheroo=upcoming_match_teamsB.textContent;
upcoming_match_teamsB.textContent=upcoming_match_teamsA.textContent;
upcoming_match_teamsA.textContent=Switcheroo;
const mSwitcheroo=myMatches[0];
myMatches[0]=myMatches[1];
myMatches[1]=mSwitcheroo;
});

bet.addEventListener('click',()=>{
fetch('/api/set_bet',{method:'POST',headers:{'Content-Type':'application/json'},
body: JSON.stringify({ ip:0,pointA:bet_num_a.textContent,
    pointB:bet_num_b.textContent,countryA:myMatches[0].countryA,countryB:myMatches[0].countryB
})}).then(x=>x.text()).then(Txt=>{
prev_bet.innerHTML=Txt;
});

});
