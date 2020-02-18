const jwt = require ('jsonwebtoken');

module.exports = (req, resp, next) => {
  try {
    const token = req.headers.authorization.split (' ')[1];
    const decodedToken = jwt.verify (token, process.env.SECRET_KEY);
    req.userData = decodedToken.user;
    next ();
  } catch (err) {
    resp.status (401).json ({
      msg: 'you are not authenticated please sign in ',
      err: err.message,
    });
  }
};
