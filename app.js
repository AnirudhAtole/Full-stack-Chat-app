require('dotenv').config();
const path = require('path');

let express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();


const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');

const sequelize = require('./utils/database');

app.use(cors(
    {
        origin: "http://127.0.0.1:3000"
    }
));
app.use(bodyParser.json())


const User = require('./models/user');
const Chat = require('./models/chats');

User.hasMany(Chat);
Chat.belongsTo(User);



app.use(userRoutes);
app.use(chatRoutes);


app.use((req,res)=>{
    res.sendFile(path.join(__dirname , `public/${req.url}`));
})



sequelize.sync({force:true})
.then(()=>{
    app.listen(3000);
})
.catch(err => console.log(err));