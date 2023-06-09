require('dotenv').config();
const path = require('path');

let express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();


const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');

const sequelize = require('./utils/database');

app.use(cors(
    {
        origin: "http://127.0.0.1:3000"
    }
));
app.use(bodyParser.json())


const User = require('./models/user');
const Chat = require('./models/chats');
const Group = require('./models/group');
const Admin = require('./models/admin');


User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group , {through : 'usergroup'});
Group.belongsToMany(User , {through : 'usergroup'});

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.hasOne(Admin);
Admin.belongsTo(User);

Admin.belongsToMany(Group , {through : 'admingroup'});
Group.belongsToMany(Admin , {through : 'admingroup'});


app.use(userRoutes);
app.use(chatRoutes);
app.use(groupRoutes);


app.use((req,res)=>{
    res.sendFile(path.join(__dirname , `public/${req.url}`));
})



sequelize.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err => console.log(err));