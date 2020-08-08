const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');

//register
router.post('/register', async (req,res)=>{

    //Validate
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //check if already present
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    //create user
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    });

    try{
        const savedUser = await user.save();
        res.send({user:user._id});
    }
    catch(err){
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async (req,res)=>{

    //Validate
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if already present
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('E-mail or password is incorrect!!');

    //check if password correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('E-mail or password is incorrect!!');

    //create token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
    
    res.send('Logged In');



});

module.exports = router;