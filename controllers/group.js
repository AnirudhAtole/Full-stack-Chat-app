const sequelize = require('../utils/database');
const Group = require('../models/group');
const Admin = require('../models/admin');
const User = require('../models/user');

exports.creategroup = async(req,res) =>{
    console.log("im innnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
    const groupName = req.body.name;
    const group = await req.user.createGroup({
        groupName : groupName
    })

    const admin = await req.user.createAdmin({
        adminName : req.user.name
    })

    group.addAdmin(admin);

    console.log(group);
    const members = req.body.users;
    console.log(...members);
    await group.addUsers([...members])

    res.status(200).json({groupName : group.groupName , id: group.id , createdAt : group.createdAt});
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

exports.addAdmin = async(req,res) =>{
    const group = await Group.findByPk(req.groupId);
    const user = await User.findByPk(req.userId);

    const admin = user.createAdmin({
        adminName : user.name
    })

    group.addAdmin(admin);

}

exports.getAdmins = async(req,res) =>{
    const group = await Group.findByPk(req.groupId);
    const adminList = await group.getAdmins();
    res.json(adminList);
}
