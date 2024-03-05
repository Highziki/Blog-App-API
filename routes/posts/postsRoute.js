const express = require('express');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
} = require('../../controllers/posts/postsCtrl');
const PostsRouter = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn');

// Instance of multer
const upload = multer({ storage });

// POST api/v1/posts
PostsRouter.post('/', isLoggedIn, upload.single('file'), createPostCtrl);

// GET api/v1/posts
PostsRouter.get('/', isLoggedIn, fetchPostsCtrl);

// GET api/v1/posts/:id
PostsRouter.get('/:id', isLoggedIn, fetchPostCtrl);

// DELETE api/v1/posts/:id
PostsRouter.delete('/:id', isLoggedIn, deletePostCtrl);

// PUT api/v1/posts/:id
PostsRouter.put('/:id', isLoggedIn, upload.single('file'), updatePostCtrl);

module.exports = PostsRouter;
