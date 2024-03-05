const bcrypt = require('bcryptjs');
const User = require('../../model/user/User');
const appErr = require('../../utils/appErr');

// Register user controller
const registerCtrl = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return next(appErr('All fields are required'));

    // Check if user exists(email)
    const userFound = await User.findOne({ email });

    // Throw an error if there is not user
    if (userFound) return next(appErr('User already exists'));

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Register user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.json({ status: 'Success', data: user });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Login user controller
const loginCtrl = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      next(appErr('Email and password fields are required'));

    // Check if email exists
    const userFound = await User.findOne({ email });
    if (!userFound) return next(appErr('Invalid login credentials'));

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userFound.password);
    if (!isValidPassword) return next(appErr('Invalid login credentials'));

    // Save user into session
    req.session.userAuth = userFound._id;

    res.json({ status: 'Success', data: userFound });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Fetch single user datails controller
const userDetailsCtrl = async (req, res, next) => {
  try {
    // Get user ID from params
    const userID = req.params.id;

    // Find the user
    const user = await User.findById(userID);

    res.json({ status: 'Success', data: user });
  } catch (error) {
    next(appErr(error.message));
  }
};

// User profile controller
const profileCtrl = async (req, res, next) => {
  try {
    // Get the logged in user
    const userID = req.session.userAuth;

    // Find the user and populate posts and comments
    const user = await User.findById(userID)
      .populate('posts')
      .populate('comments');

    res.json({ status: 'Success', data: user });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Profile photo upload controller
const uploadProfilePhotoCtrl = async (req, res, next) => {
  try {
    // Find the user to be updated
    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);

    // Check if user does not exists
    if (!userFound) return next(appErr('User not found', 403));

    // Update profile photo
    await User.findByIdAndUpdate(
      userID,
      { profileImage: req.file.path },
      { new: true }
    );

    res.json({
      status: 'Success',
      user: 'You have successfully updated your profile photo',
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Cover photo upload controller
const uploadCoverPhotoCtrl = async (req, res, next) => {
  try {
    // Find the user to be updated
    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);

    // Check if user does not exists
    if (!userFound) return next(appErr('User not found', 403));

    // Update cover photo
    await User.findByIdAndUpdate(
      userID,
      { coverImage: req.file.path },
      { new: true }
    );
    res.json({
      status: 'Success',
      user: 'You have successfully updated your cover photo',
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Update password controller
const updatePasswordCtrl = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userID = req.params.id;

    // Check if user is updating the password
    if (!password) return next(appErr('Please provide a password field'));
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    await User.findByIdAndUpdate(
      userID,
      { password: hashedPassword },
      { new: true }
    );

    res.json({
      status: 'Success',
      user: 'Password has been changed successfully',
    });
  } catch (err) {
    return next(appErr(err));
  }
};

// Update user controller
const updateUserCtrl = async (req, res, next) => {
  try {
    const { fullName, email } = req.body;

    // Check if email is already taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken)
        return next(appErr('Email is in use by another user', 400));
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
      },
      { new: true }
    );
    res.json({ status: 'Success', data: user });
  } catch (error) {
    return next(appErr(error));
  }
};

// Logout user controller
const logoutCtrl = async (req, res, next) => {
  try {
    const userID = req.session.userAuth;

    const userFound = await User.findById(userID);
    // Check user exists
    if (!userFound) next(appErr('User does not exist'));
    else req.session.destroy();

    res.json({ status: 'Success', user: 'User logged out' });
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverPhotoCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
