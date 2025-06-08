const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = [
  { id: 1, username: 'admin', password: 'toheeb1', role: 'admin' },
  { id: 2, username: 'staff', password: 'warehouse123', role: 'staff' }
];

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const loginUser = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = generateToken(user);
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
};

module.exports = {
  loginUser
};
