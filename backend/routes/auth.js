// │   ├── auth.js       <-- Login & Register
const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')

const {getOne,run} =require('../database/db');

const router=express.Router();


const JWT_SECRET='HELLO1212';



//Register-Create a new Account

router.post('/register',async(req,res)=>{
    try{
        const {username,email,password}=req.body;

        if(!username || !email || !password)
        {
            return res.status(400).json({error:"All fields are required"});
        }


        if(password.length < 6)
        {
            return res.status(400).json({error:"Password should be atleast 6 charcter"});

        }


        //check if user already exists
        const existing = getOne('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);

        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        //hash the password
        const hashedpassword = await bcrypt.hash(password, 10);

        const result=run(
            'INSERT INTO users (username,email,password) VALUES (?,?,?)',
            [username,email,hashedpassword]
        );


        //generate login token
        const token=jwt.sign(
            {userId:result.lastInsertRowid,username},
            JWT_SECRET,
            {expiresIn:'7d'}
        );

        res.status(201)
   .json({
    message:"User Created",
    token,
    user:{id:result.lastInsertRowid,username,email}
   });
    }catch(error)
    {
        console.error('Register error:',error);
        res.status(500).json({error:'Registeration failed'});
    }

});



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = getOne('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar_url: user.avatar_url
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;