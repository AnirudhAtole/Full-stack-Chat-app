const { QueryTypes } = require('sequelize');
const Chat = require('../models/chats');
const sequelize = require('../utils/database');


exports.addChat = async(req,res)=>{
    try{
        const chatmessages = req.body.chat;

        await Chat.create(
            {
                chatmessages:chatmessages,
                userId : req.user.dataValues.id
            }
        )
        res.status(201).json({success:true , message : "chat submmitted"});
    }
    catch(err){
        console.log(err);
        res.status(400).json({success:false , message : "Unable to create"});
    }
}

exports.getChats = async(req,res) =>{
    try{
        const result = await sequelize.query(`SELECT chatmessages , chats.createdAt , name , userId 
        FROM chatapp.chats
        LEFT outer join chatapp.users
        ON chats.userId = users.id
        order by chats.createdAt ASC; `, {type: QueryTypes.SELECT});

        console.log(result);
        res.status(200).json({success:true , result : result});

    }
    catch(err){
        console.log(err);
    }
}

exports.getUpdatedChats = async(req,res) =>{
    try{
        const offset = +req.query.updation;
        const result = await sequelize.query(`SELECT chatmessages , chats.createdAt , name , userId 
        FROM chatapp.chats
        LEFT outer join chatapp.users
        ON chats.userId = users.id
        order by chats.createdAt ASC
        LIMIT 18446744073709551610 offset ${offset}; `, {type: QueryTypes.SELECT});

        console.log(result);
        res.status(200).json({success:true , result : result});

    }
    catch(err){
        console.log(err);
    }
}