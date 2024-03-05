require('dotenv').config(); // Dotenv configuration
require('./config/dbConnect');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const UserRouter = require('./routes/users/usersRoute');
const PostsRouter = require('./routes/posts/postsRoute');
const CommentsRouter = require('./routes/comments/commentsRoute');
const globalErrHandler = require('./middlewares/globalHandler');

// ------------
// Middlewares

app.use(express.json()); // Parse incoming JSON data

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, // 1 day
    }),
  })
);

// ------------

// Users route
app.use('/api/v1/users', UserRouter);

// Posts route
app.use('/api/v1/posts', PostsRouter);

// Comments route
app.use('/api/v1/comments', CommentsRouter);

// Error handler middlewares
app.use(globalErrHandler);

const port = process.env.PORT || 9000;

// Server listener
app.listen(port, () => {
  console.log(`Server up and running on PORT ${port}`);
});
