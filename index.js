const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
// const cors = require('cors');

// const corsOptions = {
//     origin: "http://localhost:3000",
//     optionsSuccessStatus:200
// }

// app.use(cors(corsOptions));
app.use(express.json());

const pathToFile = path.resolve("./data.json");
console.log(pathToFile);

const resources = () => JSON.parse(fs.readFileSync(pathToFile));

const PORT = process.env.PORT || 3001;

app.get("/", (req,res)=>{
   res.send("<h1>Hello World</h1>")
})

app.get("/api/resources", (req,res)=>{
    const resourcess = resources();
    res.send(resourcess)
 })

 app.get("/api/resources/:id", (req,res)=>{
    const resourcess = resources();
    const {id} = req.params;
    const resource = resourcess.find(resource => resource.id === id);
    res.send(resource)
 })

 app.post("/api/resources", (req,res)=>{
    const resourcess = resources();
    const resource = req.body;
    resource.createdAt = new Date();
    resource.status = "inactive";
    resource.id = Date.now().toString();
    resourcess.unshift(resource);

    fs.writeFile(pathToFile,JSON.stringify(resourcess,null,2),(err)=>{
        if(err){
            return res.status(422).send("data cannot be added");
        }    
        console.log("data has been saved successfully")
        return res.send("data has been saved successfully");
    })
 })

 app.patch("/api/resources/:id", (req,res)=>{
    const resourcess = resources();
    const id = req.params.id;
    const index = resourcess.findIndex(resource => resource.id === id);
    const activeResource = resourcess.find(resource=> resource.status === "active");    
    if(resourcess[index].status === "completed"){
        console.log("Completed")
        return res.status(422).send("already completed");
    }
    resourcess[index] = req.body;

    if(req.body.status === "active" ){
        
        if(activeResource){
            
            return res.status(422).send("there is active resource already");
        }
        
        resourcess[index].status = "active";
        resourcess[index].activationTime = new Date();

    }
    
    


    fs.writeFile(pathToFile,JSON.stringify(resourcess,null,2),(err)=>{
        if(err){
            return res.status(422).send("data cannot be added");
        }    
        console.log("data has been saved successfully")
        return res.send("data has been saved successfully");
    })
 })


 app.get("/api/activeresource",(req,res)=>{
     const resourcess = resources();
     const activeResource = resourcess.find(resource=> resource.status === "active");

     if(activeResource){
         console.log("in here")
         return res.send(activeResource);         
     }

     return res.send({});


 })

app.listen(PORT,()=>{
    console.log("server is running on port " + PORT);
})