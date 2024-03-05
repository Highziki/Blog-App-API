const Post = require('../../model/post/Post');
const User = require('../../model/user/User');
const Comment = require('../../model/comment/Comment');
const appErr = require('../../utils/appErr');

const createCommentCtrl = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userID = req.session.userAuth;
    const postID = req.params.id;

    // Find the post
    const post = await Post.findById(postID);
    if (!post) next(appErr('Post does not exist', 404));

    // Create comment
    const comment = await Comment.create({ user: userID, message });

    // Push comment into post
    post.comments.push(comment._id);

    // Find the user
    const user = await User.findById(userID);

    // Push comment into user
    user.comments.push(comment._id);

    // Save
    await post.save();
    await user.save();

    res.json({ status: 'Success', data: comment });
  } catch (error) {
    next(appErr(error.message));
  }
};

const commmentDetailsCtrl = async (req, res, next) => {
  try {
    const commentID = req.params.id;

    const commentFound = await Comment.findById(commentID);

    res.json({ status: 'Success', data: commentFound });
  } catch (error) {
    next(appErr(error.message));
  }
};

const deleteCommentCtrl = async (req, res, next) => {
  try {
    const postID = req.params.id;
    const userID = req.session.userAuth;

    // Find the comment
    const comment = await Comment.findById(postID);

    // Check if comment belongs to user
    if (comment.user.toString() !== userID.toString())
      return next(appErr('You are not allowed to delete this comment', 403));

    const deletedComment = await Comment.findByIdAndDelete(postID);
    // Check if comment exists
    if (!deletedComment) return next(appErr('Comment does not exist'));

    res.json({ status: 'Success', user: 'Comment deleted successfully' });
  } catch (error) {
    next(appErr(error.message));
  }
};

const updateCommentCtrl = async (req, res, next) => {
  try {
    const commentID = req.params.id;
    const userID = req.session.userAuth;
    const { message } = req.body;

    // Find the comment
    const comment = await Comment.findById(commentID);
    if (!comment) return next(appErr('Comment does not exist', 404));

    // Check if comment belongs to user
    if (comment.user.toString() !== userID.toString())
      return next(appErr('You are not allowed to update this comment', 403));

    // Update
    const updatedComment = await Comment.findByIdAndUpdate(
      commentID,
      { message },
      { new: true }
    );

    res.json({ status: 'Success', data: updatedComment });
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  createCommentCtrl,
  commmentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};
