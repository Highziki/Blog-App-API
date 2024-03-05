const express = require('express');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const isLoggedIn = require('../../middlewares/isLoggedIn');
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverPhotoCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require('../../controllers/users/userCtrl');

const UserRouter = express.Router();

// Create new instance of multer
const upload = multer({ storage });

// Register
UserRouter.post('/register', registerCtrl);

// POST api/v1/users/login
UserRouter.post('/login', loginCtrl);

// GET api/v1/users/profile
UserRouter.get('/profile', isLoggedIn, profileCtrl);

// GET api/v1/users/logout
UserRouter.get('/logout', isLoggedIn, logoutCtrl);

// PUT api/v1/users/profile-photo-upload
UserRouter.put(
  '/profile-photo-upload',
  isLoggedIn,
  upload.single('profile'),
  uploadProfilePhotoCtrl
);

// PUT api/v1/users/cover-photo-upload
UserRouter.put(
  '/cover-photo-upload',
  isLoggedIn,
  upload.single('cover'),
  uploadCoverPhotoCtrl
);

// PUT api/v1/users/update-password/:id
UserRouter.put('/update-password/:id', updatePasswordCtrl);

// PUT api/v1/users/update/:id
UserRouter.put('/update/:id', updateUserCtrl);

// GET api/v1/users/:id
UserRouter.get('/:id', userDetailsCtrl);

module.exports = UserRouter;
