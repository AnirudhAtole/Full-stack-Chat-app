const { QueryTypes } = require('sequelize');
const Chat = require('../models/chats');
const sequelize = require('../utils/database');
const Group = require('../models/group');
const User = require('../models/user');

exports.creategroup = async(req,res) =>{
    console.log("im innnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
    const groupName = req.body.name;
    const group = await req.user.createGroup({
        groupName : groupName
    })
    console.log(group);
    const members = req.body.users;
    console.log(...members);
    await group.addUsers([...members])

    res.status(200).json({groupName : group.groupName , id: group.id , timeCreated : group.createdAt});
}


exports.getGroups = async(req , res) =>{
    const groups = await req.user.getGroups(
    {
        attributes:['id','groupName','createdAt']
    }
    
    );
    res.status(200).json(groups);
}

exports.getUsers = async(req,res) =>{
    const groupId = req.body.id;
    const group = await Group.findByPk(groupId);
    const result = await group.getUsers();

    for(let user of result){
        console.log(user.id ,user.name)
    }
    res.status(200).json(result);
}

exports.getGroupChats = async(req,res) =>{
    const groupId = req.body.id;
    const chats = await Chat.findAll({
        where:{
            groupId:groupId
        }
    })
    console.log(chats);
    res.status(200).json(chats);
}