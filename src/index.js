import connectDB from './db/index.js'
import app from './app.js'
//const dotenv = require('dotenv').config()
//dotenv.config()
//import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config({
    path: './env'
});

connectDB()
.then(() => {
    app.on('error', (error) => {
            console.log('ERROR: ', error)
            throw error
        })},
    app.listen(process.env.PORT || 8000, () => {
        console.log(`App listening on port ${process.env.PORT}`)
    })
    )
.catch((error) => {
    console.log('MONGO DB Connection Failed: ', error);
})



//const app = express();
/*( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on('error', (error) => {
            console.log('ERROR: ', error)
            throw error
        })
        app.listen(process.env.PORT, () => {
        console.log(`App listening on port ${process.env.PORT}`)
    })
    } catch (error) {
        console.error('MONGODB Connection Failed : ', error);
        throw error
    }
    
})()*/