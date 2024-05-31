const express = require('express');
const app = express();
const port=5500;
const hostname='127.0.0.1';
const fs=require('fs');
const crypto =require('crypto');
const { stat } = require('fs/promises');
const userPath=__dirname+'/user_data.txt';
const matchPath=__dirname+'/match_data.txt';
const betPath=__dirname+'/bet_data.txt';


//Declaring hash, with salt=SeedMe
function hashMe(word)
{
    const SeedMe='hw9ie32$%&/90kvkr!"§eoce';
    return crypto.createHash('md5').update(SeedMe+word).digest('hex');
}
const writeUserLikeRank=function(userJson)
{
    fs.readFile(userPath,(err,data)=>{
        if(err){console.log(err);return}
        if(data.length!==0){
        data=JSON.parse(data);
        for(let i=0; i<data.length;i++)
        {
            if(data.at(i).points<=userJson.points)
            {
                data.splice(i,0,userJson);
                break;
            }
        }}else data=JSON.parse("["+JSON.stringify(userJson)+"]");
        
        fs.writeFile(userPath,JSON.stringify(data),(err)=>{if(err){console.log(err);return;}});
    });
}
const register=function(req)
{
    const {user,pw}=req.body;
    let ip_addr = req.headers['x-forwarded-for'] ||req.socket.remoteAddress || null;
    
    writeUserLikeRank({name:String(user),ip:ip_addr,hash:String(hashMe(pw)),
    community:'NULL',points:0});
}
const makeJsonLeaderboard=function(pageNum,UserPerPage,json)
{ 
 let retVal="";
 for(let i=(pageNum-1)*UserPerPage; i<UserPerPage*pageNum;i++)
 {
    if(json.at(i))
    retVal+=`<tr><td>${i+1}</td><td>${json.at(i).points}</td><td>${json.at(i).name}</td><td>${json.at(i).community}</td></tr>`;
 }
 
 return retVal;
}
function CalcPoints(guessA,guessB,realA,realB)
{
if(guessA===realA&&guessB===realB)return 8;
if((realA-realB!==0)&&(guessA-guessB)===(realA-realB))return 6;
if(((realA-realB)>0&&(guessA-guessB)>0)||((realA-realB)<0&&(guessA-guessB)<0))return 4;

return 0
}


app.use(express.static('public'));
app.use(express.static(userPath));
app.use(express.static(matchPath));
app.use(express.static(betPath));
app.use(express.static(__dirname+'/icons'));
app.use(express.static(__dirname+'/script'));
app.use(express.json());





app.post('/api/users/ip',(req,res)=>{
    if(req.body)fs.readFile(userPath,(err,data)=>{
        if(err){console.log(err);return;}
        let ip_addr = req.headers['x-forwarded-for'] ||req.socket.remoteAddress || null;
        data=JSON.parse(data);
        const user=data.filter(t=>t.ip==ip_addr)[0];
        if(user)
        {
            res.json(JSON.stringify(user));
        }else
        res.sendStatus(422);

    });
    else
    res.sendStatus(422);

});

app.post('/api/users/request',(req,res)=>{
    if(req.body)
    {
        const {user,pw}=req.body; 
        fs.readFile(userPath,(err,data)=>{
        if(err){console.log(err);return;}
        if(data.length)
        data=JSON.parse(data);
        const contain=data.filter(data=>data.name==String(user))[0];
        if(contain)
        { 
        const {hash}=contain;
        if(hash===hashMe(String(pw))){
        res.json(JSON.stringify({msg:'Verified',id:1}));
        }else
        res.json(JSON.stringify({msg:'Wrong Password',id:-2}));
        }else{        
        register(req);
        res.json(JSON.stringify({msg:'UserRegistered',id:-1}));
        }
        });   
    }
    else res.sendStatus(422);
});

app.post('/api/users/stats',(req,res)=>{
    if(req.body){
    const {pageNum,userPerPage,sUser,sComm}=req.body;
    fs.readFile(userPath,(err,data)=>{
    if(err){console.log(err);return;}
    if(data.length)
    data=JSON.parse(data);
    if(!data){console.log("bad json at leaderboard request");res.sendStatus(422);return;}
    if(sComm==0&&sUser==0)
    res.send(makeJsonLeaderboard(pageNum,userPerPage,data));
    else{
    res.send(makeJsonLeaderboard(pageNum,userPerPage,data.filter((el)=>(!sUser||el.name.includes(sUser))&&(!sComm||el.community.includes(sComm)))));   
    }
    });
    }
    else res.sendStatus(422);

});

app.post('/api/users/preview',(req,res)=>{
    if(req.body)
    {
        const user=req.body;
        fs.readFile(userPath,(err,data)=>{
            if(err){console.log(err);return;}
            if(data.length){
            data=JSON.parse(data);
            const TopLead=data.filter((val,id)=>val.name==user.name||id<4||(data.length>id+1&&data.at(id+1).name==user.name)||(id>0&&data.at(id-1).name==user.name)||id==data.length-1);
            data=data.filter((val)=>val.community==user.community);
            const TopComm=data.filter((val,id)=>val.name==user.name||id<4||(data.length>id+1&&data.at(id+1).name==user.name)||(id>0&&data.at(id-1).name==user.name)||id==data.length-1);
            
            res.send("<div>Global Preview</div>"
            +"<table>"+makeJsonLeaderboard(1,7,TopLead)+"</table>"
            +"<div>Community Preview</div>"
            +"<table>"+makeJsonLeaderboard(1,7,TopComm)+"</table>"
            );
        }
        });
    }else
    res.sendStatus(422);
});

app.post('/api/matches/all',(req,res)=>{
if(req.body)
{
    fs.readFile(matchPath,(err,data)=>{
        if(err){console.log(err);return;}
        const {date}=req.body;

        data=JSON.parse("["+data+"]");
        data=data.sort((a,b)=>(a.date.substr(0,2)-b.date.substr(0,2))+(a.date.substr(3,2)-b.date.substr(3,2))*30);
        data=data.filter(el=>(el.date.substr(0,2)-date.substr(0,2))+(el.date.substr(3,2)-date.substr(3,2))*30);
        data=data.filter((el,id)=>id<2);
        res.send(JSON.stringify(data));
    });
}else 
res.sendStatus(422);

});

app.post('/api/set_bet',(req,res)=>{
if(req.body)
{
let ip_addr = req.headers['x-forwarded-for'] ||req.socket.remoteAddress || null;

fs.readFile(betPath,(err,data)=>{
if(err){console.log(err);return;}
data=JSON.parse("["+data+"]"); 
req.body.ip=ip_addr;
data=data.filter(el=>el.ip!=ip_addr||el.countryA!=req.body.countryA);

if(data.length){
str=JSON.stringify(data);
str=str.substring(1,str.length-1);
data=JSON.parse("["+str+","+JSON.stringify(req.body)+"]");
fs.writeFile(betPath,str+","+JSON.stringify(req.body),(err)=>{if(err)console.log(err);})

data.filter(el=>el.ip==ip_addr);
let retStr="<table>"; 
for(let i=0; i<data.length;i++)
{
retStr+=`<tr><td>${data.at(i).countryA}</td><td>${data.at(i).countryB}</td><td>${data.at(i).pointA}</td><td>${data.at(i).pointB}</td></tr>`;
}
retStr+="</table>";
res.send(retStr);
}
else
{fs.writeFile(betPath,JSON.stringify(req.body),(err)=>{if(err)console.log(err);})
res.send("<table></table>")
}



     
});

}else
res.sendStatus(422);
});
app.post('/api/users/points',(req,res)=>{
if(req.body)
{
let ip_addr = req.headers['x-forwarded-for'] ||req.socket.remoteAddress || null;
fs.readFile(userPath,(err,data)=>{
if(err){console.log(err);return;}
data=JSON.parse(data);
data=data.filter(el=>el.ip==ip_addr);
if(data.length)
{
data=data[0];
fs.readFile(betPath,(err,bdat)=>{
if(err){console.log(err);return;}
bdat=JSON.parse("["+bdat+"]");
bdat=bdat.filter(el=>el.ip==ip_addr);
if(bdat.length){
bdat=bdat[0];
fs.readFile(matchPath,(err,mdat)=>{
if(err){console.log(err);return;}
mdat=JSON.parse("["+mdat+"]");
mdat=mdat.filter(el=>el.countryA.localeCompare(bdat.countryA)===0&&el.countryB.localeCompare(bdat.countryB)===0);
if(mdat.length)
{
    mdat=mdat[0];
    const calc=String(Number(data.points)+CalcPoints(Number(bdat.pointA),Number(bdat.pointB),Number(mdat.pointA),Number(mdat.pointB)));
    res.send(calc);
}else res.send("UserNotFound");
});


}else res.send("UserNotFound");
});
}
else res.send("UserNotFound");


});

}else
res.sendStatus(422);

});
app.post('/api/communities',(req,res)=>{
if(req.body)
{
    let ip_addr = req.headers['x-forwarded-for'] ||req.socket.remoteAddress || null;
fs.readFile(userPath,(err,data)=>{
    if(err){console.log(err);return;}
    data=JSON.parse(data);
    let user=data.filter(el=>el.ip==ip_addr)[0];
    let comms=data.filter(el=>el.community==user.community);
    let retStr="";
    for(let i=0; i<comms.length; i++)
    {
        retStr+=`<tr><td>${comms.at(i).name}</td><td>${comms.at(i).community}</td></tr>`;
    }
    res.send(retStr);
});

}else
res.sendStatus(422);

});
app.post('/api/communities/create',(req,res)=>{
if(req.body)
{
    const {name}=req.body;
    let ip_addr = req.headers['x-forwarded-for'] ||req.socket.remoteAddress || null;
    fs.readFile(userPath,(err,data)=>{
        if(err){console.log(err);return;}
        data=JSON.parse(data);
        for(let i=0; i<data.length; i++)
        {
            if(data.at(i).ip==ip_addr)
                {
                    data.at(i).community=name;
                    break;
                }
        }
        fs.writeFile(userPath,JSON.stringify(data),(err)=>{if(err)console.log(err);});
    });

}else
res.sendStatus(422);

});

app.listen(port,hostname);