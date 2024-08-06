import dotenv from "dotenv";
import express from "express";
import {supabase} from "./hooks/supabase.js";
import {User} from "./classes/user.js";
import {Group} from "./classes/group.js";

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
        response.send(error);
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

// USER CLASS
app.get('/getUserDetails',async (request, response) => {
    var userClass = new User(request.body.userID);
    var result = await userClass.getUserDetails();

    response.send(result);
})

app.get('/getUserName',async (request, response) => {
    var userClass = new User(request.body.userID);
    var result = await userClass.getUserName();

    response.send(result);

})

app.get('/getGroupDetailsBasedOnUserID',async (request, response) => {
    var userClass = new User(request.body.userID);
    var result = await userClass.getGroupDetailsBasedOnUserID();

    response.send(result);
})

// GROUP CLASS
app.get('/getGroupDetails', async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.getGroupDetails();
    response.send(result);
})

app.get('/getBillsBasedOnGroup',async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.getBillsBasedOnGroup();
    response.send(result);
})

app.put('/updateOccupancyBy1',async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.updateOccupancyBy1();
    response.send(result);
})

app.post('/createBillUsingGroupID', async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.createBillUsingGroupID(request.body);
    response.send(result);
})

app.get('/getUsersBasedOnGroup', async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.getUsersBasedOnGroup();
    response.send(result);
})

app.put('/updateGroupDetails', async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.updateGroupDetails(request.body);
    response.send(result);
})