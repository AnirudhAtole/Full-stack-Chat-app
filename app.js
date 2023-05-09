require('dotenv').config();
const path = require('path');

let express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express()

const server = require('http').Server(app);
const io = require('socket.io')(server);

const cron = require('cron');

io.on("connection",socket=>{
    socket.on("send-message",(data , group)=>{
        socket.to(group).emit("receive-message",data)
        console.log(socket.rooms)
    })

    socket.on("join-groups",groups=>{
        socket.join(groups);
        console.log(groups)
        });
    
    // socket.on("leave-group",group =>{
    //     if(group !== undefined){
    //         socket.leave(group);
    //     }
    // })


})

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');
const requestRoutes = require('./routes/inviteusers');

const sequelize = require('./utils/database');

app.use(cors(
    {
        origin: ["http://127.0.0.1:3000"]
    }
));
app.use(bodyParser.json())


const User = require('./models/user');
const Chat = require('./models/chats');
const Group = require('./models/group');
const Admin = require('./models/admin');
const inviterequest = require('./models/inviterequest');
const mediafile = require('./models/mediafiles');
const Archeivedchats = require('./models/chatsarcheived');


User.hasMany(Chat);
Chat.belongsTo(User);

Admin.hasMany(inviterequest);
inviterequest.belongsTo(Admin);

User.belongsToMany(Group , {through : 'usergroup'});
Group.belongsToMany(User , {through : 'usergroup'});

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.hasOne(Admin);
Admin.belongsTo(User);

Admin.belongsToMany(Group , {through : 'admingroup'});
Group.belongsToMany(Admin , {through : 'admingroup'});

User.hasMany(mediafile);
mediafile.belongsTo(User);

User.hasMany(Archeivedchats);
Archeivedchats.belongsTo(User);



app.use(userRoutes);
app.use(chatRoutes);
app.use(groupRoutes);
app.use(requestRoutes);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname , `public/${req.url}`));
})


sequelize.sync()
.then(()=>{
    server.listen(3000);
})
.catch(err => console.log(err));

