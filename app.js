const cookieParser = require('cookie-parser');
const express= require('express');
const app =express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
     let token = jwt.sign({email}, "shhhhhhhh");
     res.cookie('token' , token);
    res.send(userCreated);

   })
  })
})
app.get('/login', function(req,res){
    res.render('login');
})

app.get('/logout', function(req,res){
    res.cookie('token' , "");
    res.redirect('/');
})
app.post('/login', async function(req,res){
    let {email, password} = req.body; 
    let user = await userModel.findOne({email});
    if(!user){ return res.send('something is wrong')}

bcrypt.compare(password , user.password , function(err , result){
    if(result){ 
    let token = jwt.sign({email}, "shhhhhhhh");
        res.cookie('token' , token);
        res.send('user logged in successfully')}
    else{res.send('something is wrong')}
})

})

app.listen(4000, function(req,res){
    console.log('server is running on port 4000');
})