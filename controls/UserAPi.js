const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { genToken, verifyToken } = require('../configs/Auth');
const { hashPass } = require('../configs/Hashing');

// GET users

router.get('/users', async (req, res) => {
    await User.find()
        .then((users) => {
            res.send(users).status(200);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
});

// POST user
router.post('/create', async (req, res) => {

    const { name, email, password, phone, domain } = req.body;
    const hash = await hashPass(password);

    await User.create({
        Name: name,
        Email: email,
        Password: hash,
        Phone: phone,
        Domain: domain
    })
        .then((users) => {
            res.send({ message: "user created", data: users }).status(200);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
})

//update mark

router.put('/update/:id', async (req, res) => {
    const { mark,app } = req.body;
    console.log(mark,app);


    await User.findByIdAndUpdate(req.params.id, {
        Mark: mark,
        Aptti:app
    }, { new: true })
        .then((user) => {
            console.log(user)
            res.send(user).status(200);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
});

// DELETE user
router.delete('/delete/:id', async (req, res) => {
    const isAdmin = await User.findById(req.params.id)
        .then((admin) => {
            if (admin.Role === 'admin') {
                return true;
            }
        })
    if (!isAdmin) {
        await User.findByIdAndDelete(req.params.id)
            .then(() => {
                res.send({ message: "user deleted" }).status(200);
            })
            .catch((err) => {
                res.status(400).json({ message: err.message });
            });
    }
});

//login

router.post('/log', async (req, res) => {
    const { email, password } = req.body;

    await User.findOne({ Email: email })
        .then(async (user) => {
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const auth = await bcrypt.compare(password, user.Password)

            if (!auth) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = genToken(user);

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: 'none'
            });

            if (user.Role === 'admin') {
                res.cookie('role', 'admin',{
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: 'none'
                }).send(user);
            }

            if (user.Role === 'user') {
                res.cookie('role', 'user',{
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: 'none'
                }).send(user);
            }

        })
        .catch((err) => {
            res.status(500).json({ message: err.message });
        });
});
router.get('/verify', verifyToken, function (req, res) {
    try {
        res.status(200).send({ user: req.user });
    }
    catch (err) {
        res.status(500).send(err);
    }
})


module.exports = router;