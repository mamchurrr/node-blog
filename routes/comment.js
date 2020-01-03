const { Router } = require('express');
const router = Router();

const { Comment } = require('../models');

//COMMENT add
router.post('/add', async(req, res) => {
    const userId = req.session.userId,
        userLogin = req.session.userLogin;

    if (!userId || !userLogin) {
        res.json({
            ok: false
        });
    } else {
        const { post, body, parent } = req.body;
        if (!body) {
            res.json({
                ok: false,
                error: 'Пустой комментарий'
            });
        }

        try {
            if (!parent) {
                await Comment.create({
                    post,
                    body,
                    owner: userId
                });
                res.json({
                    ok: true,
                    body,
                    login: userLogin
                });
            } else {
                const parentComment = await Comment.findById(parent);
                console.log(parentComment);

                if (!parentComment) {
                    res.json({
                        ok: false
                    });
                }

                const comment = await Comment.create({
                    post,
                    body,
                    parent,
                    owner: userId
                });
                const children = parentComment.children;
                children.push(comment.id);
                parentComment.children = children;
                await parentComment.save();
                res.json({
                    ok: true,
                    body,
                    login: userLogin
                });
            }
        } catch (error) {
            res.json({
                ok: false
            });
        }
    }
});

module.exports = router;