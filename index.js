const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.urlencoded({extended:true}));

try{
var homeFile = fs.readFileSync('./landingPage.html','utf-8');}
catch(err){
    console.log(err);
}

const replaceVal =(prev,pres)=>{
    let temperature=prev.replace("{%tempval%}",pres.main.temp);
    temperature=temperature.replace("{%location%}",pres.name);
    temperature=temperature.replace("{%country%}",pres.sys.country);
    temperature=temperature.replace("{%status%}",pres.weather[0].main);
    temperature=temperature.replace("{%cond%}",pres.weather[0].description);
    temperature=temperature.replace("{%humid%}",pres.main.humidity);
    temperature=temperature.replace("{%tempmin%}",pres.main.temp_min);
    temperature=temperature.replace("{%tempmax%}",pres.main.temp_max);
    temperature=temperature.replace("{%wind%}",pres.wind.speed);

    return temperature;
}

app.get('/',(req,res)=>{
    const location = 'bankura';
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&units=metric&appid=4580466da90099b152f2a5bf0ec183c1";
    https.get(url, (response)=>{
        response.on('data',(data)=>{
            const weatherdata = JSON.parse(data);
            const realtimeData = replaceVal(homeFile,weatherdata);
            res.send(realtimeData);
        })
    });
});

app.post('/',(req,res)=>{
    const location = req.body.location;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&units=metric&appid=4580466da90099b152f2a5bf0ec183c1";
    https.get(url, (response)=>{
        response.on('data',(data)=>{
            const weatherdata = JSON.parse(data);
            const realtimeData = replaceVal(homeFile,weatherdata);
            res.send(realtimeData);
        })
    });
})

app.listen(3000, (err)=>{
    if(err)
        console.log("404 error !");
    else
        console.log("server is running on port 3000");
})