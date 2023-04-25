require('dotenv').config();
const path = require('path');

let express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();

const userRoutes = require('./routes/user');

const sequelize = require('./utils/database');

app.use(cors(
    {
        origin: "http://127.0.0.1:3000"
    }
));
app.use(bodyParser.json())

app.use(userRoutes);


app.use((req,res)=>{
    res.sendFile(path.join(__dirname , `public/${req.url}`));
})



sequelize.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err => console.log(err));