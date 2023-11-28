const
    app = require('express')(),
    fs = require('fs'),
    path = require('path'),
    options = {
        key: fs.readFileSync('private.key'),
        cert: fs.readFileSync('certificate.crt'),
        ca: fs.readFileSync('ca_bundle.crt'),
        requestCert: true,
        rejectUnauthorized: false
    },
    http = require('http').createServer(app),
    io = require('socket.io')(http, {  cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }}),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    socket = require('./Modules/Socket'),
    Users = require('./Routes/Users'),
    Api = require('./Routes/Api'),
    Admin = require('./Routes/Admin'),
    Reborn = require('./Routes/Reborn'),
    Merchant = require('./Routes/Merchant'),
    port = 7790;

process.env.SECRET_KEY = "tirgoserverkey";
process.env.FILES_PATCH = "/var/www/html/";
process.env.SERVER_URL = "https://tirgo.io/";
app.get('/', function(req, res){
    res.send('<h1>tirgo glad you!!!</h1>');
});
const corsOptions = {
    origin: '*', // Replace with the address of your Ionic app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: true, // Handle preflight requests
};
app.use(cors(corsOptions));
// Enable CORS for all routes
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));
http.on('request', (req, res) => {
    //console.log(req)
});
app.get('/download/:filename', (req, res) => {
    console.log('/downloadImage')
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
  
    res.download(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(404).send('File not found');
      }
    });
  });
app.use('/users', Users);
app.use('/api', Api);
app.use('/admin', Admin);
app.use('/reborn', Reborn);
app.use('/merchant', Merchant);
socket.init(io);
http.on('listening',function(){
    console.log('ok, server is running');
});
http.listen(port, function(){
    console.log('tirgo server listening on port ' + port);
});
