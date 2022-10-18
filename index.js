const http=require('http');
const fs=require('fs');
var requests=require('requests');

const homeFile=fs.readFileSync('index.html','utf-8');

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

    //console.log(pres.weather[0].main);
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url=='/')
    {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Bankura&units=metric&appid=4580466da90099b152f2a5bf0ec183c1")
        .on("data",(chunk)=>{
            const objData=JSON.parse(chunk);
            const arrData=[objData];
            const realtimeData = arrData.map((val)=>replaceVal(homeFile,val)).join("");
            res.write(realtimeData);
            // console.log(objData);
        })
        .on("end",(err)=>{
            if(err)
            return console.log("Connection lost !!!",err);
            res.end();
            console.log("end");
        });
    }
});

server.listen(5000,(err)=>{
    if(err)
    console.log("404 error");
    else
    console.log("Server is running on port 5000");
})