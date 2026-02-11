const cookieParser = require('cookie-parser');
const express= require('express');
const app =express();
const path = require('path');
const bcrypt = require('bcrypt');

const userModel = require('./models/user')


app.set('view engine' , 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname ,'public')));
app.use(cookieParser());

app.get('/', function(req,res){
    res.render('index');

})

app.post('/create', async function(req,res){
    let {username , email , password , age } = req.body
   bcrypt.genSalt(10, function(er,salt){
    bcrypt.hash(password , salt , async function(err,hash){

 
    let userCreated = await userModel.create({
        username,
        email,
        password: hash,
        age,
    })
    res.send(userCreated);

    })

   })


   
})


app.listen(4000, function(req,res){
    console.log('server is running on port 4000');
})