'use strict';


const signIn=document.querySelector('.button_left');
const signUp=document.querySelector('.button_right');
const UserName=document.getElementById('lname');
const Password=document.getElementById('lpw');
const InputFields=document.getElementById('log_in_form');
const HomeField=document.getElementById('home_screen');

const checkUser=function(username, password){
    if(username==='admin'&&password==='123')return true;
    return false; 
}
const registerUser=function(username, password){
    return 0;
}
const userExists=function(username){
    return 0;
}

let userState=0;
signIn.addEventListener('click',function(){
    signIn.textContent='clicked:)';
    if(checkUser(UserName.value,Password.value))
        {
            userState=1; 
            signIn.textContent='logged in :)';
            InputFields.style='display:none';
            HomeField.style='display:initial';
        }
});
signUp.addEventListener('click',function(){
    signUp.textContent='clicked:)';
    if(userExists(UserName.value))registerUser(UserName.value,Password.value);
});


