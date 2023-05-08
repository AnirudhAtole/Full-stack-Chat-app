const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async(req,res,next)=>{
    try{
        const token = req.header("Authorization");
        console.log(token)
        const id = jwt.verify(token , process.env.TOKEN_SECRET);
        console.log(id)
        const user = await User.findByPk(id.id);
        req.user = user;
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({success : false});
    }
}