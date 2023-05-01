const { QueryTypes } = require('sequelize');
const Chat = require('../models/chats');
const sequelize = require('../utils/database');


exports.addChat = async(req,res)=>{
    try{
        const chatmessages = req.body.chat;
        // const groupId = req.body.id;

        await req.user.createChat({
            chatmessages : chatmessages,
        })
        res.status(201).json({success:true , message : "chat submmitted"});
    }
    catch(err){
        console.log(err);
        res.status(400).json({success:false , message : "Unable to create"});
    }
}

exports.getChats = async(req,res) =>{
    try{
        const result = await sequelize.query(`SELECT chatmessages , chats.createdAt , chats.id ,name , userId 
        FROM chatapp.chats
        LEFT outer join chatapp.users
        ON chats.userId = users.id
        order by chats.createdAt ASC; `, {type: QueryTypes.SELECT});
        res.status(200).json({success:true , result : result});

    }
    catch(err){
        console.log(err);
    }
}

exports.getUpdatedChats = async(req,res) =>{
    try{
        const id = +req.query.updation || 1;
        const result = await sequelize.query(`SELECT chatmessages , chats.createdAt , chats.id ,name , userId 
        FROM chatapp.chats
        LEFT outer join chatapp.users
        ON chats.userId = users.id
        where chats.id > ${id}
        order by chats.createdAt ASC; `, {type: QueryTypes.SELECT});

        console.log(result);
        res.status(200).json({success:true , result : result});

    }
    catch(err){
        console.log(err);
    }
}

