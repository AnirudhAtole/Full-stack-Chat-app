const sib = require("sib-api-v3-sdk");
const Uuid = require('uuid');
const inviterequest = require('../models/inviterequest');
const User = require('../models/user');
const Admin = require('../models/admin');
const Group = require('../models/group');

exports.sendInvite = async(req,res) =>{
    try{
    const email = req.body.email;
    const group = await Group.findByPk(req.body.groupId);
    const checkEntry = await inviterequest.findOne({
        where:{
            email:email,
            groupId : group.id
        }
    })
    if(checkEntry){
        res.json({success:true , message : "Already sent an email to the user"});
    }
    else{
        const user = User.findOne(
            {
                where:{
                    email:email
                }
            }
        );
        if(user){
            const admin  = await Admin.findOne({
                where:{
                    userId : req.user.id
                }
            })
            const check = await group.hasUser(user);
            console.log(group)
            if(check){
                res.json({success:true , message : "User with this email is already in this group huhhh sussy...."})
            }
            else{
            const uuid = Uuid.v4();
            await inviterequest.create({
                id : uuid,
                status : true,
                senderName : req.user.name,
                groupName : group.groupName,
                email : email,
                groupId : group.id,
                adminId : admin.id
            })
    
            //sending mail
            const client = sib.ApiClient.instance;
            const apiKey = client.authentications['api-key']
            apiKey.apiKey = process.env.SEND_IN_BLUE;
    
            const transEmailApi = new sib.TransactionalEmailsApi();
    
            const sender = {
                email : process.env.EMAIL
            }
    
            const receiver = [
                {
                    email : user.email
                },
            ];
    
            const result = await transEmailApi.sendTransacEmail({
                sender,
                to :receiver,
                subject : 'Regarding password failure',
                htmlContent : `<a href="http://localhost:3000/user/accept-invite/${uuid}">Accept invite by ${req.user.name} to join ${req.body.groupName} group on chat app</a>`
            })
            res.json({success:true , message : "Email sent sucessfully , if user will acccept he will be made a user of this group"})
            }
        }
    }
    }
    catch(err){
        console.log(err)
        res.status(400).json({success:false})
    }
    
}

exports.AcceptInvite = async (req,res) => {
    const id = req.params.uuid;
    const validReq = await inviterequest.findOne(
        {
            where:{
                id:id,
                status : true
            }
        }
    )
    if(validReq){
        const groupName = validReq.groupName;
        const senderName = validReq.senderName;
        res.status(200).send(`
        <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forgot Password</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
            </head>
            <body>
            <section class=" gradient-form text-center" style="background-color: rgb(29, 25, 25);">
                <div class="container py-5">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-xl-10">
                    <div class="card rounded-3 text-black">
                        <div >
                        <div >
                            <div class="card-body p-md-5 mx-md-4">
            
                            <div class="text-center">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToh1HBvZO4U3AV1fc6HI-tLlmCDwKlki8D7g&usqp=CAU"
                                style="width: 185px;" alt="logo">
                                <h4 class="mt-1 mb-5 pb-1">Accept the invite</h4>
                            </div>
            
                            <form id="my-form" class="text-center">
                                <div class="form-outline mb-4">
                                <input type="password" id="email" class="form-control"
                                    placeholder="Enter new password" />
                                <label class="form-label" for="email">Enter your email</label>
                                </div>
                                <div class="form-outline mb-4">
                                    <input type="password" id="password" class="form-control"
                                    placeholder="Confirm Password" />
                                    <label class="form-label" for="password">password</label>
                                </div>

                                <div class="form-group row">
                                  <label for="staticEmail" class="col-sm-2 col-form-label">Invited by </label>
                                  <div class="col-sm-10">
                                    <input type="text" readonly class="form-control-plaintext" id="user" value="${senderName}">
                                  </div>

                                  <label for="staticEmail" class="col-sm-2 col-form-label">To group</label>
                                  <div class="col-sm-10">
                                    <input type="text" readonly class="form-control-plaintext" id="group" value="${groupName}">
                                  </div>
                                  
                                </div>

                                <div class="row">
                                <div class="col-sm-12 text-center pt-1 mb-5 pb-1">
                                    <button class="btn btn-info btn-block fa-lg gradient-custom-2 mb-3" type="submit">Confirm</button>
                                </div>

                                <div class="d-flex justify-content-center  mx-4 mb-3 mb-lg-4">
                                  <a href="../signup/signup.html">Not a User still  .....</a>
                                </div>
                                </div>
            
                            </form>
            
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            <script>
                const form = document.getElementById("my-form");
                form.addEventListener("submit",formSubmit);
                async function formSubmit(e){
                  e.preventDefault();
                  const email = document.getElementById("email").value;
                  const password = document.getElementById("password").value;
                  let result = await axios.post('http://localhost:3000/user/checkUser',{email,password});
                  if(result.data.success){
                    const validate = result.data.success;
                    await axios.post('http://localhost:3000/user/addMember/:${id}',{validate})
                    alert("You will be added in group");
                  }
                  else{
                    alert(result.data.message)
                  }
                }
                
            </script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.4/axios.min.js"></script>
            </body>
            </html>`)
        res.end()
    }
    else{
        res.status(201).send(`Request expired`)
    }
}


exports.addMember = async(req,res) =>{
    const requestId = req.params.uuid;
    const validate = req.body.validate;
    if(validate){
        const ValidReq = await inviterequest.findByPk(requestId);
        const admin = await Admin.findByPk(ValidReq.adminId);
        const group = await Group.findByPk(ValidReq.groupId);
        const check = await group.has(admin);
    if(check){
        const member = User.findOne({
            where:{
                email : ValidReq.email
            }
        });
        group.addUser(member)
        await ValidReq.update({status:false});
        res.status(200).json({success:true , result : member})
    }
    else{
        res.json({success:false})
    }
    }
}