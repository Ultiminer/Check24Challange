'use strict';

//General decl
let userState=0;
const signIn=document.querySelector('.button_left');
const signUp=document.querySelector('.button_right');
const UserName=document.getElementById('lname');
const Password=document.getElementById('lpw');
const InputFields=document.getElementById('log_in_form');
const HomeField=document.getElementById('home_screen');
const LoginResponse=document.getElementById('resp_form');
const UserFile="../../temp_data/user_data.txt";


const sendMsg=function(msg,path)
{
    const xhr = new XMLHttpRequest();
xhr.open("POST", path);

xhr.setRequestHeader("Content-Type", "text/plain");


xhr.onload = () => {
  if (xhr.readyState == 4 && xhr.status == 201) {
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.log(`Error: ${xhr.status}`);
  }
};
xhr.send(msg);

}

const registerUser=function(username, password){
    fetch('/api/users/update', {
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ 
            user:username,
            pw:password
        })
      });
}

//HTML DOM interactions

signIn.addEventListener('click',function(){
    fetch('/api/users/request', {
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ 
            user:UserName.value,
            pw:Password.value
        })
      });
    fetch('/api/users/verify').then(x=>x.json())
    .then(t=>{
        const {msg,id}=JSON.parse(t);
        LoginResponse.textContent=String(msg);
       if(Number(id)===1)
        {
            signIn.textContent='logged in :)';
            InputFields.style='display:none';
            HomeField.style='display:initial';
        } });
});
signUp.addEventListener('click',function(){
    fetch('/api/users/request', {
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ 
            user:UserName.value,
            pw:Password.value
        })
      });
    fetch('/api/users/verify').then(x=>x.json())
    .then(t=>{
        const {msg,id}=JSON.parse(t);
        LoginResponse.textContent=String(msg);
        if(id===-1){
        userState=1;
        registerUser(UserName.value,Password.value);
        signUp.textContent='registered:)';
        }
    });
});

