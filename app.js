const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

const config = require('./config');
const routes = require('./routes');

// database
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('Database connection closed.'))
    .once('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
        // require('./mocks')();
    });
mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// express
const app = express();

// sessions
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    })
);

// sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, config.DESTINATION)));
app.use(
    '/javascripts',
    express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

// routes
app.use('/', routes.archive);
app.use('/api/auth', routes.auth);
app.use('/post', routes.post);
app.use('/comment', routes.comment);
app.use('/upload', routes.upload);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: !config.IS_PRODUCTION ? error : {}
    });
});

app.listen(config.PORT, () =>
    console.log(`Example app listening on port ${config.PORT}!`)
);

// const express = require('express');
// const staticAsset = require('static-asset');
// const path = require('path');
// const mongoose = require('mongoose');
// const session = require('express-session');

// const MongoStore = require('connect-mongo')(session);

// const config = require('./config');
// const routes = require('./routes');

// //database

// mongoose.Promise = global.Promise;
// mongoose.set('debug', config.IS_PRODUCTION);

// console.log(typeof config.MONGO_URL);

// mongoose.connect(config.MONGO_URL, {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// });

// mongoose.connection
//     .on('error', error => console.error(error))
//     .on('close', () => console.log('DB connection closed!'))
//     .once('open', () => {
//         const info = mongoose.connections[0];
//         console.log(`Connect to ${info.host}:${info.port}/${info.name}`);
//         // require('./mocks')();
//     });

// //express
// const app = express();

// // sessions
// app.use(
//     session({
//         secret: config.SESSION_SECRET,
//         resave: true,
//         saveUninitialized: false,
//         store: new MongoStore({
//             mongooseConnection: mongoose.connection
//         })
//     })
// );

// //sets & uses
// app.set('view engine', 'ejs');

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(staticAsset(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static(path.join(__dirname, config.DESTINATION)));
// app.use(
//     '/javascripts',
//     express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
// );

// //routers
// // app.get('/', (req, res) => {
// //     const id = req.session.userId;
// //     const login = req.session.userLogin;

// //     res.render('index', {
// //         user: {
// //             id,
// //             login
// //         }
// //     });
// // });
// app.use('/', routes.archive);
// app.use('/api/auth', routes.auth);
// app.use('/post', routes.post);
// app.use('/comment', routes.comment);
// app.use('/upload', routes.upload);

// app.listen(config.PORT, () =>
//     console.log(`Example app listening on port ${config.PORT}!`)
// );

// //catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     const err = new Error('Not found!');
//     err.status = 404;
//     next(err);
// });

// //error handler
// //eslint-disable-next-line no-unused-vars
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: !config.IS_PRODUCTION ? err : {},
//         title: 'Ooops... Something broke!'
//     });
// });

// module.exports = app;