import dotenv from "dotenv";
import express from "express";
import {supabase} from "./hooks/supabase.js";
import {User} from "./classes/user.js";
import {Group} from "./classes/group.js";
import {Bill} from "./classes/bill.js";

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

app.get('/getBalanceBasedOnGroup', async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.getBalanceBasedOnGroup();
    response.send(result);
})

app.get('/getPreviousMessagesBasedOnGroup', async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.getPreviousMessagesBasedOnGroup();
    response.send(result);
})

app.post('/postMessageInGroup',async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.postMessageInGroup(request.body);
    response.send(result);
})

// BILL CLASS
app.get('/getBillDetails', async (request, response) => {
    var billClass = new Bill(request.body.billID);
    var result = await billClass.getBillDetails();
    response.send(result)
})

app.get('/getBillOwnerNameViaBillID', async (request, response) => {
    var billClass = new Bill(request.body.billID);
    var result = await billClass.getBillOwnerNameViaBillID();
    response.send(result)
})

app.get('/getBillParticipantsNames', async (request, response) => {
    var billClass = new Bill(request.body.billID);
    var result = await billClass.getBillParticipantsNames();
    response.send(result)
})

app.post('/createBill',async (request, response) => {
    var result = false;
    const {error} = await supabase
        .from('bill')
        .insert({
            amount : request.body.inputAmount,
            name : request.body.inputName,
            date : request.body.inputDate,
            user_id : request.body.inputUserID,
            group_id : request.body.inputGroupID
        });
    if (!error){
        result = true;
    }
    response.send(result);
})

app.put('/updateBillUsingBillID', async (request, response) => {
    var billClass = new Bill(request.body.billID);
    var result = await billClass.updateBillUsingBillID(request.body);
    response.send(result)
})

app.delete('/deleteBillParticipants', async (request, response) => {
    var billClass = new Bill(request.body.billID);
    var result = await billClass.deleteBillParticipants();
    response.send(result)

})

// accountService
app.get('/signInEmail', async (request, response) => {
    const { error } = await supabase.auth.signInWithPassword({
        email: request.body.inputEmail,
        password: request.body.inputPassword,
    })
    response.send(!error);
})

app.post('/signUpEmail', async (request, response) => {
    var inputEmail = request.body.inputEmail;
    var inputPassword = request.body.inputPassword;
    var inputUsername = request.body.inputUsername;
    const {
        data: {session},
        error,
    } = await supabase.auth.signUp({email: inputEmail, password: inputPassword,
        options:{
            data: {
                userName: inputUsername
            }
        }});

    if (error) {
        response.send(false);
    }
    // This will be used if email verification is enabled
    else if (!session) {
        console.log('Please check your inbox for email verification!');
    }
    else{
        response.send(true);
    }
})

// joinGroupService
app.get('/checkInvCodeValid', async (request, response) => {
    var result = false;
    const {data,error} = await supabase
        .from('group')
        .select()
        .eq('invite_code',request.body.inputInviteCode);

    if (!error) {
        if (data.length === 1){
            result = true;
        }
        else{
            console.log("Group not found");
        }
    }
    response.send(result);
})

app.get('/getGroupIDBasedOnInvCode', async (request, response) => {
    const {data,error} = await supabase
        .from('group')
        .select('group_id')
        .eq('invite_code',request.body.inputInviteCode);
    if (error){
        console.log(error.message);
        response.send(null);
    }
    else {
        response.send(data);
    }
})

app.post('/insertUserGroup', async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.postUserGroup(request.body);
    response.send(result);
})

app.get('/checkUserNotInGroup', async (request, response) => {
    var grpClass = new Group(request.body.groupID);
    var result = await grpClass.checkUserNotInGroup(request.body);
    response.send(result);
})

// newgroup.tsx

app.post('/createGroup', async (request, response) => {
    // Creates then returns back the data
    var inputGroupName = request.body.inputGroupName;
    var inputDescription = request.body.inputDescription;
    var inputCurrency = request.body.inputCurrency;
    const { data, error } = await supabase  // supabase's way of sanitising and paramterising the input data to protect from sql injections
        .from('group')
        .insert([
            { group_name: inputGroupName, description: inputDescription, no_of_people: 1, currency: inputCurrency }
        ])
        .select(); // After creating entry, returns the data to the 'groupData' variable.
    if (!error){
        response.send(data);
    }
    else {
        console.log(error);
        response.send(null);
    }
})