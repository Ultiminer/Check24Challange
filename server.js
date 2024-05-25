const express = require('express');
const app = express();
const port=5500;
const hostname='127.0.0.1';
const fs=require('fs');
const crypto =require('crypto');
const userPath=__dirname+'/user_data.txt';
const statPath=__dirname+'/user_stats.txt';
var msg_json;

app.use(express.static('public'));
app.use(express.static(userPath));
app.use(express.static(__dirname+'/icons'));
app.use(express.static(__dirname+'/script'));
app.use(express.json());



//Declaring hash, with salt=SeedMe
function hashMe(word)
{
    const SeedMe='hw9ie32$%&/90kvkr!"§eoce';
    return crypto.createHash('md5').update(SeedMe+word).digest('hex');
}


app.post('/api/users/update',(req,res)=>{
if(req.body)
{
    const {user,pw}=req.body;
    fs.writeFile(userPath,'\n '+String(user)+' : '+String(hashMe(pw)),{flag:'a'},(err)=>{if(err){console.log(err);}});
    fs.writeFile(statPath,JSON.stringify({name:String(user),points:0}),(err)=>{if(err){console.log(err);}});
}

});

app.post('/api/users/request',(req,res)=>{
    if(req.body)
    {
        const {user,pw}=req.body;

        fs.readFile(__dirname+'/user_data.txt','utf8',(err,data)=>{
        if(err){console.log(err);return;}
        const id=data.indexOf(String(user));
        if(id>= 0)
        {
        const pwId=data.indexOf(String(hashMe(String(pw))),id);

        if(pwId-id===String(user).length+3){
            msg_json={msg:'Verified',id:1};
        return;}
        msg_json={msg:'Wrong Password',id:-2};
        }else{
        msg_json={msg:'UserNotFound',id:-1};
        }
        });
    }
    });
app.get('/api/users/verify',(req,res)=>{
    res.json(JSON.stringify(msg_json));
});


app.listen(port,hostname);