import dotenv from "dotenv";
import express from "express";
import {supabase} from "./hooks/supabase.js";
import res from "express/lib/response.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); //Auto parse json data

app.listen(PORT, (error) => {
    if(!error){
        console.log(`Listening on port ${PORT}`);
    }
    else {
        console.log(`ERROR: ${error}`);
    }
});

// Test if the server works
app.get("/", (req, res) => {
    res.status(200);
    res.send("Success");
})

// Testing passing variables
app.post('/hehe',(request, response) => {
    var q1 = request.body.query1;
    var q2 = request.body.query2;
    response.send(`First Query: ${q1}, Second Query: ${q2}`);
})

// Testing basic CRUD with supabase
app.post('/basicCreate',async (request, response) => {
    var insertName = request.body.name;
    var insertOccupation = request.body.occupation;
    var insertAge = request.body.age;

    const {error} = await supabase
        .from("testTable")
        .insert({
            "name": insertName,
            "occupation": insertOccupation,
            "age": insertAge
        })
    if(!error){
        response.status(200);
        response.send("Success");
    }
})

app.get('/basicRead', async (request, response) => {
    const {data,error} = await supabase
        .from("user")
        .select()
    if(!error){
        response.send(data);
    }
    else{
        console.log(error);
    }
})

app.put('/basicUpdate',async (request, response) => {
    var updateID = request.body.id;
    var newName=request.body.name;
    const {error} = await supabase
        .from("testTable")
        .update({
            "name": newName,
        })
        .eq('id',updateID)
    if(!error){
        response.status(200);
        response.send("Success Update");
    }
})

app.delete('/basicDelete',async (request, response) => {
    var deleteID = request.body.id;
    const result = await supabase
        .from("testTable")
        .delete()
        .eq("id",deleteID)
    if (result.status === 204){
        response.status(204);
        response.send("Success Delete");
    }
})

