const express = require('express')
const env = require('dotenv')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const user = require('./routes/User');
const provider = require('./routes/provider');
const food = require ('./routes/foods')
const order = require('./routes/order')
const address = require('./routes/address');
const review  = require('./routes/review')

const CronJob = require('cron').CronJob;
const initialData = require('./routes/initialData')
const foodModel = require('./models/food')

const app = express()

// <<<<<<< HEAD
env.config();
// =======
app.use(cors({
    origin: ['http://localhost:4000','http://localhost:3000'], 
    methods: ['GET', 'PUT', 'POST','DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'], 
    credentials: true
}))
// >>>>>>> caa9e46c53c46e4201cdf7408d499e5c0380425d
//'https://tiffin-managment-client.vercel.app'
app.use(express.json())
app.use(cookieParser())

var originsWhitelist = [
    'http://localhost:4000',
    'http://localhost:3000'
 ];
 var corsOptions = {
     origin: function(origin, callback){
         var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
         callback(null, isWhitelisted);
     },
     credentials:true
  }
app.use(cors(corsOptions))

mongoose.connect(process.env.MONGODB_CONNECTION,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DataBase Connected")
})
const updateFood = async() =>{
    const foods = await foodModel.find()
    for(let i = 0;i<foods.length;i++){
        await foodModel.findByIdAndUpdate(foods[i]._id,{$set:{quantity:foods[i].enteredQuantity}});
    }
}
new CronJob('0 0 * * *', async () => {
    await updateFood()
  }, null, true, 'Asia/Kolkata');

app.get('/',(req,res) =>{
    console.log("Server Is Running")
    }
)
app.use('/user', user);
app.use('/provider',provider)
app.use('/food',food)
app.use('/order',order)
app.use('/address',address);
app.use('/review',review);
app.use('/initialData',initialData)

app.listen(process.env.PORT,()=>{
    console.log("Server is Running on port " + process.env.PORT)
})
