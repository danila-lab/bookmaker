import jwt from 'jsonwebtoken';
import userService from './../service/userService.js';

const jwtSecret = process.env.JWT_SECRET;

function _getTokenFromHeaders(headers) {
  const authHeader = headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  return token;
};

export function authenticateToken(req, res, next) {
  const token = _getTokenFromHeaders(req.headers);

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, jwtSecret, async (error, data) => {
    // console.log(err)

    if (error) {
      console.log(error);
      return res.sendStatus(403)
    }

    const user = await userService.getUserByEmail(data.email);

    if(user.is_locked) {
      return res.status(403).json({ error: 'User is locked' });
    }
    

    req.user = user;

    next()
  });
};

export function hasRole(requiredRoles) {
  return function(req, res, next) {
    const token = _getTokenFromHeaders(req.headers);
    const { email } = jwt.decode(token); 
    userService.getUserByEmail(email)
      .then((user) => {
        if(!user) {
          return res.sendStatus(403);
        }

        const { role } = user;
        const { name: roleName } = role;
        
        if (!requiredRoles.includes(roleName)) {
          return res.status(403).json({ error: 'User has no access' });
        }

        next();
      }).catch((error) => {
        console.log(error);
        const { statusCode, message } = error;
        return res.sendStatus(statusCode);
      });
  }
};

export default {
  authenticateToken,
  hasRole,
};