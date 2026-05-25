const express=require('express');
const cors=require('cors');
const {initializeDatabase}=require('./database/db');



initializeDatabase();


const app=express();
const PORT=3000;


//Middleware
app.use(cors());
app.use(express.json());

//Mount routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/users',require('./routes/users'));
app.use('/api/posts',require('./routes/posts'));


//Health checck
app.get('/api/health',(req,res)=>{
    res.json({status:'ok',message:'Social Media Hub API is running'});
});


//start server
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    console.log(`Test it: http://localhost:${PORT}/api/health`);
});