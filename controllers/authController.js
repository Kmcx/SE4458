const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
   
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role
    });

    await user.save();

  
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.login = async (req, res) =>{
    const {email, password} = req.body;

    try{
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: 'Invalid credentials'});

        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: 'Invalid credentials'});
        }

        const payload = {user: {id: user.id, role: user.role}};
        const token =jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: '1h'});

        res.json({token});
    }catch (err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
