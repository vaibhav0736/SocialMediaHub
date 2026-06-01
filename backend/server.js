const express=require('express');
const cors=require('cors');
const {initializeDatabase}=require('./database/db');
const authenticate=require('./middleware/auth');


initializeDatabase();


const fs = require('fs');

const app=express();
const PORT=3000;
const path=require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

//Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads",express.static(path.join(__dirname, 'uploads')));


//Mount routes
// Public routes (no auth needed)
app.use('/api/auth',require('./routes/auth'));


// Protected routes (must be logged in)
app.use('/api/users', authenticate, require('./routes/users'));
app.use('/api/posts', authenticate, require('./routes/posts'));
app.use('/api/notifications', authenticate, require('./routes/notifications'));

//Health checck
app.get('/api/health',(req,res)=>{
    res.json({status:'ok',message:'Social Media Hub API is running'});
});


//start server
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    console.log(`Test it: http://localhost:${PORT}/api/health`);
});