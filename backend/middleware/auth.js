const jwt=require('jsonwebtoken');


const JWT_SECRET = "HELLO1212";

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        //decoded={userId:5, username:"vaibhav"} <-what we put in at login

        req.user=decoded;
        next();
        
    } catch (error) {
        return res.status(401).json({message:"Invalid token OR EXPIRED"});
    }
}

module.exports=authenticate;