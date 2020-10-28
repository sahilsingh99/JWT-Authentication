var express         = require('express'),
    bodyParser      = require('body-parser'),
    helmet          = require('helmet'),
    morgan          = require('morgan'),
    mongoose        = require('mongoose'),
    cookieParser    = require("cookie-parser");
    env             = require('dotenv'),


env.config();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
//app.use(helmet());

// Connecting to Database
const URI = 'mongodb+srv://Sahil:' + process.env.DBPASS + '@cluster0.3zl0l.mongodb.net/MananWeb?retryWrites=true&w=majority';
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
    .then(res => {
            console.log('connected to db');
    })
    .catch(err => {console.log(err);})

// loading routes
var auth = require('./routes/auth');

//handling cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",'*');
    res.header(
        "Access-Control-Allow-Headers",
        "origin, X-Requested-With, Accept, Authorization, Content-type"
    );
    
    if(req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH , GET , DELETE");
        return res.status(200).json({});
    }

    next();
})

//Home page
app.get('/',(req, res, next) => {
    res.status(200).json({
        message: 'Working fine'
    })
})

//Routes
app.use('/auth', auth);

// error for invalid route
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// error handler
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;


