exports.sanitizeUser = function (user) {
  return {
    id: user._id,
    userName: user.userName,
    email: user.email,
  };
};
