const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');

const { User } = require('../models');

//POST signup
router.post('/signup', (req, res) => {
    const { login, password, passwordConfirm } = req.body;

    if (!login || !password || !passwordConfirm) {
        let fields = [];
        if (!login) fields.push('login');
        if (!password) fields.push('password');
        if (!passwordConfirm) fields.push('passwordConfirm');

        res.json({
            ok: false,
            error: 'Все поля должны быть заполнены',
            fields
        });
    } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
        res.json({
            ok: false,
            error: 'Только латинские буквы и цифры!',
            fields: ['login']
        });
    } else if (login.length < 3 || login.length > 16) {
        res.json({
            ok: false,
            error: 'Длина логина от 3 до 16 символов',
            fields: ['login']
        });
    } else if (password !== passwordConfirm) {
        res.json({
            ok: false,
            error: 'Пароли не совпадают!',
            fields: ['password', 'passwordConfirm']
        });
    } else if (password.length < 5) {
        res.json({
            ok: false,
            error: 'Минимальная длина пароля 5 символов',
            fields: ['password']
        });
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                // Store hash in your password DB.
                User.create({
                        login,
                        password: hash
                    })
                    .then(user => {
                        req.session.userId = user.id;
                        req.session.userLogin = user.login;
                        res.json({
                            ok: true
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.json({
                            ok: false,
                            error: 'Ошибка! Попробуйте позже!'
                        });
                    });
            });
        });
    }
});

//POST signin
router.post('/signin', (req, res) => {
    const { login, password } = req.body;

    console.log('login', login, password);

    if (!login || !password) {
        let fields = [];
        if (!login) fields.push('login');
        if (!password) fields.push('password');

        res.json({
            ok: false,
            error: 'Все поля должны быть заполнены',
            fields
        });
    } else {
        User.findOne({
                login
            })
            .then(user => {
                if (!user) {
                    res.json({
                        ok: false,
                        error: 'Логин или пароль не верны!',
                        fields: ['login', 'password']
                    });
                } else {
                    console.log('user', user);
                    // Load hash from your password DB.
                    bcrypt.compare(password, user.password, function(
                        err,
                        result
                    ) {
                        // res === true
                        console.log('result', result);
                        if (!result) {
                            res.json({
                                ok: false,
                                error: 'Логин или пароль не верны!',
                                fields: ['login', 'password']
                            });
                        } else {
                            req.session.userId = user.id;
                            req.session.userLogin = user.login;
                            res.json({
                                ok: true
                            });
                        }
                    });
                }
            })
            .catch(err => {
                console.error(err);
                res.json({
                    ok: false,
                    error: 'Ошибка! Попробуйте позже!'
                });
            });
    }
});

// GET for logout
router.get('/logout', (req, res) => {
    if (req.session) {
        // delete session object
        req.session.destroy(() => {
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;