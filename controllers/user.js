const User = require('../models/user');
const Bcrypt  = require('bcrypt');
const sequelize = require('../utils/database');

exports.addUser = async(req,res) =>{
    // const t = await sequelize.transaction();

    try{
        console.log("req body is " + req.body)
        const email = req.body.email;
        let result = await User.findOne({ 
            where:{
                email : email
            }
        })
        if(result){
            res.status(200).json({success :false , message : "Email is already registered with another user plz try different email or login with existing email and password"})
        }
        else{
            try{
            const email = req.body.email;
            const name  = req.body.name;
            const password = req.body.password;

            Bcrypt.hash(password , 10 , async(err,hash)=>{
                console.log(err);
                await User.create({
                    name:name,
                    email : email,
                    password : hash
                },
                // {transaction : t}
                )

                // await t.commit();
                res.status(201).json({success:true , message : "User created succesfull .. May the Force be with you"});
            })

            }
            catch(err){
                await t.rollback();
                throw new Error(err);
            }
        }
    }
    catch(err){
        console.log(err)
        res.status(403).json({success:false , message : "Unable to create user"});
    }
    
}

exports.validateUser = async(req,res) =>{
    const email = req.body.email;

    try{
        let user = await User.findOne({
            where:{
                email : email
            }
        });
        if(user){
            Bcrypt.compare(req.body.password , user.password , (err,result)=>{
                if(result){
                    res.status(200).json({success : true , message : "User signed in... Welcome young jedi"});
                }
                else{
                    res.status(200).json({success:false , message : "Your password is incorrect may be you should take a look first"});
                }
            })
        }
        else{
            res.status(200).json({success:false , message : "No records of any user found with that email."});
        }
    }
    catch(err){
        res.status(400).json({success:false , message :"Unable to signIn"})
        console.log(err)
    }
}