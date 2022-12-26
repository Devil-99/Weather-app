const http=require('http');
const fs=require('fs');
var requests=require('requests');

var homeFile;
try{
homeFile = fs.readFileSync('./landingPage.html','utf-8');}
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

function weatherapi(city){
    return "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid=4580466da90099b152f2a5bf0ec183c1";
}

const server = http.createServer((req,res)=>{
    if(req.url=='/')
    {
        let url = weatherapi("bankura");
        requests(url)
        .on("data",(chunk)=>{
            const objData=JSON.parse(chunk);
            const realtimeData = replaceVal(homeFile,objData);
            res.write(realtimeData);
        })
        .on("end",(err)=>{
            if(err)
            return console.log("Connection lost !!!",err);
            res.end();
            console.log("end");
        });
    }
});

server.listen(process.env.PORT || 5000,(err)=>{
    if(err)
    console.log("404 error");
    else
    console.log("Server is running on port 5000");
})
