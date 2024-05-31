const community=document.getElementById('community');
const create=document.getElementById('create');
const comm_name=document.getElementById('comm_name');


create.addEventListener('click',()=>{
    fetch('/api/communities/create',{method:'POST',headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name:comm_name.value})});
});
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

fetch('/api/communities',{method:'POST',headers:{'Content-Type':'application/json'},
body: JSON.stringify({ good:1})}).then(x=>x.text()).then(t=>{  
if(t){
community.innerHTML=t; 
}
});
