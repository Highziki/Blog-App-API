const User = require('../../model/user/User');
const Post = require('../../model/post/Post');
const appErr = require('../../utils/appErr');

// Create post controller
const createPostCtrl = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category || !req.file)
      return next(appErr('All fields are required'));

    // Find the user
    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);

    // Create the post
    const post = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });

    // Push post created into the array of user's post
    userFound.posts.push(post._id);

    // Resave user
    userFound.save();

    res.json({ status: 'Success', data: post });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Fetch all posts controller
const fetchPostsCtrl = async (_, res, next) => {
  try {
    // Retrieve all posts
    const posts = await Post.find().populate('comments');
    if (!posts)
      return next(appErr('Please login or register first to access posts'));

    res.json({ status: 'Success', data: posts });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Fetch single post controller
const fetchPostCtrl = async (req, res, next) => {
  try {
    const postID = req.params.id;
    const postFound = await Post.findById(postID).populate('comments');
    if (!postFound)
      return next(appErr('Please login or register first to access posts'));

    res.json({ status: 'Success', data: postFound });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Delete post controller
const deletePostCtrl = async (req, res, next) => {
  try {
    const postID = req.params.id;
    const userID = req.session.userAuth;

    // Find the post
    const post = await Post.findById(postID);

    // Check if post belongs to user
    if (post.user.toString() !== userID.toString())
      return next(appErr('You are not allowed to delete this post', 403));

    const deletedPost = await Post.findByIdAndDelete(postID);
    if (!deletedPost) return next(appErr('Post does not exist'));

    res.json({ status: 'Success', user: 'Post deleted successfully' });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Update post controller
const updatePostCtrl = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const postID = req.params.id;
    const userID = req.session.userAuth;

    // Find the post
    const post = await Post.findById(postID);

    // Check if post belongs to user
    if (post.user.toString() !== userID.toString())
      return next(appErr('You are not allowed to update this post', 403));

    // Update
    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      { title, description, category, image: req.file.path },
      { new: true }
    );

    res.json({ status: 'Success', data: updatedPost });
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
