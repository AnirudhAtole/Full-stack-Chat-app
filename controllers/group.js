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

    const check = await Admin.findOne(
        {
            where:{
                userId : req.user.id
            }
        }
    )
    if(check){
        group.addAdmin(check);
        const members = req.body.users;
        await group.addUsers([...members])
    }
    else{
        const admin = await req.user.createAdmin({
            adminName : req.user.name
        })
    
        group.addAdmin(admin);
        const members = req.body.users;
        await group.addUsers([...members])
    }
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

exports.getUsersAndAdmins = async(req,res) =>{
    const groups = await req.user.getGroups();
    let members = [];
    let adminNames = [];
    for(let i=0 ; i < groups.length ; i++){
        const group = groups[i]
        const member = await group.getUsers(
            {
                attributes:['id','name']
            }
        );
       
        const admin = await group.getAdmins(
            {
                attributes:['adminName','userId']
            }
        );
        members.push(...member);
        adminNames.push(...admin);
    }
    res.status(200).json({members : members , adminNames : adminNames});
};


exports.getUsersAndAdminofGroup = async(req,res) =>{
    const group = await Group.findByPk(req.params.id);
  
        const member = await group.getUsers(
            {
                attributes:['id','name']
            }
        );
       
        const admin = await group.getAdmins(
            {
                attributes:['adminName','userId']
            }
        );

        res.status(200).json({members : member , adminNames : admin});
    }



exports.addAdmin = async(req,res) =>{
    const group = await Group.findByPk(req.body.groupId);
    const user = await User.findByPk(req.body.userId);

    const check = await Admin.findOne(
        {
            where:{
                userId : user.id
            }
        }
    )
    if(check){
        group.addAdmin(check);
        res.json({success:"true"});
    }
    else{
        const admin = await user.createAdmin({
            adminName : user.name
        })
    
        group.addAdmin(admin);
        res.json({success:"true"});
    }
}

exports.removeMember = async(req,res)=>{
    const group = await Group.findByPk(req.body.groupId);
    const user = await User.findByPk(req.body.userId);
    const admin = await Admin.findOne(
        {
            where:{
                userId : user.id
            }
        }
    )
    if(admin){
        await group.removeAdmin(admin);
        await group.removeUser(user);
    }
    else{
        await group.removeUser(user);
    }
    
    res.status(200).json({success:true})
}

exports.addMember = async(req,res) =>{
    const group = await Group.findByPk(req.body.groupId);
    const admin = await Admin.findOne(
        {
            where:{
                userId : req.user.id
            }
        }
    )
    if(admin){
        const member = User.findByPk(req.body.userId);
        group.addUser(member)
        res.status(200).json({success:true , result : member})
    }
    else{
        res.json({success:false})
    }
}