require('dotenv').config();
const express = require('express');
/**
 * express-ejs-layouts is layout template solution for Express.js applications that use EJS as the templating engine
 */
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

/**
 * connect-flash and express-session are commonly used together in Express.js applications to handle session-based messaging,
 * often for displaying temporary notifications or messages to users (like success or error messages)
 */
const flash = require('connect-flash');
const session = require('express-session');

const router = require('./server/routes/customerRoutes');
const connectDB = require('./server/config/db');

const app = express();
const port = 4321 | process.env.PORT;

connectDB();

/**
 * URL Encoding is the process of converting string into valid URL format.
 * built-in middleware function to parse the incoming requests with URL-encoded payloads
 */
app.use(express.urlencoded({ extended: true }));

// Returns a middleware that only parses JSON
app.use(express.json());

app.use(methodOverride('_method'));

// Static Files
app.use(express.static('public'));
// Built in function to serve Static Files

// Flash Messages
app.use(flash({ sessionKeyName: 'flashMessage' }));

// Express Session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        },
    })
);

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', router);

app.get('*', (req, res) => {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`App listening on @${port}`);
});
