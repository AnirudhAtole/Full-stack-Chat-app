const { QueryTypes, Op } = require('sequelize');
const Chat = require('../models/chats');
const sequelize = require('../utils/database');
const Group = require('../models/group');


exports.addChat = async(req,res)=>{
    try{
        const chatmessages = req.body.chat;
        const groupId = req.body.id;

        await req.user.createChat({
            chatmessages : chatmessages,
            groupId : groupId
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
        const groups = await req.user.getGroups();
        const groupIds = [];
        groups.forEach(element => {
            groupIds.push(element.id);
        });
        const result = await sequelize.query(`SELECT chatmessages , chats.createdAt , chats.id ,name , userId ,groupId
        FROM chatapp.chats
        LEFT outer join chatapp.users
        ON chats.userId = users.id
        WHERE chats.groupId IN (${groupIds})
        order by chats.createdAt ASC; `, {type: QueryTypes.SELECT});
        res.status(200).json({success:true , result : result});

    }
    catch(err){
        console.log(err);
    }
}

exports.getUpdatedChats = async(req,res) =>{
    try{
        const chatId = +req.query.updation || 1;
        const groups = await req.user.getGroups();
        const groupIds = [];
        groups.forEach(element => {
            groupIds.push(element.id);
        });
        const result = await sequelize.query(`SELECT chatmessages , chats.createdAt , chats.id ,name , userId ,groupId
        FROM chatapp.chats
        LEFT outer join chatapp.users
        ON chats.userId = users.id
        where chats.id > ${chatId} AND chats.groupId IN (${groupIds})
        order by chats.createdAt ASC; `, {type: QueryTypes.SELECT});

        console.log(result);
        res.status(200).json({success:true , result : result});

    }
    catch(err){
        console.log(err);
    }
}

