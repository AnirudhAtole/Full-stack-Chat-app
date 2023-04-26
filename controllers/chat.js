const Chat = require('../models/chats');


exports.addChat = async(req,res)=>{
    try{
        const chatmessages = req.body.chat;

        const result = await Chat.create(
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