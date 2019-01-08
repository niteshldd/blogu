/** require dependencies */
const express = require("express")
const routes = require('./routes/')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const path = require('path')
const cloudinary = require('cloudinary')
const fs = require('fs')
const http = require('http')
const https = require('https')

const app = express()
const router = express.Router()
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/medium"
// const url ="mongodb://alc:alc@ds237855.mlab.com:37855/alc"

/** configure cloudinary */
cloudinary.config({
    cloud_name: 'uruvekaa-com',
    api_key: '297161754644549',
    api_secret: '7Ez4eAxT98X4-ZOLtyPPVd4gpYs',
    secure: true
})

cloudinary.image("sample.jpg", {secure: true})

/** connect to MongoDB datastore */
try {
    mongoose.connect(url, {
        //useMongoClient: true
    })    
} catch (error) {
    
}

// let port = process.env.PORT || 80

const port = process.env.NODE_PORT ||  15000;
let server = http.createServer(app).listen(port);


/** set up routes {API Endpoints} */
routes(router)

/** set up middlewares */
app.use(cors())
app.use(bodyParser.json())
app.use(helmet())
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});
app.use('/static',express.static(path.join(__dirname,'static')))
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use('/assets',express.static(path.join(__dirname,'assets')))

app.use('/api', router)
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

/** start server */
// app.listen(port, () => {
//     console.log(`Server started at port: ${port}`);
// });
let sslOptions = {
    key: fs.readFileSync('cert.pem', 'utf8'),
    cert: fs.readFileSync('key.pem', 'utf8' )
 };
 
 let serverHttps = https.createServer(sslOptions, app).listen(443)