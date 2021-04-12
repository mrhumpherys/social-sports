const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth')

router.get('/', (req, res) => {
    Comment.findAll({

    })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//DO NOT USE TO GET COMMENTS , WILL DELETE THEM HA HA HA HA HA
router.get(`/:id`, withAuth, (req, res) => {
    let user = req.session.user_id;
    let comment = req.params.id;
    console.log(`++++\n this is the MF user: ${user}`)
    Comment.findAll({
        where: {
            id: comment,
            user_id: user
        }
    })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'No comment found with this id' });
                return;
            } else {
                data = JSON.stringify(dbCommentData)
                let comments = JSON.parse(data)

                if(comments.length===0){
                    res.status(404).json({ message: `You can only delete your own comments ${req.session.username}!` });
                    return;
                }else{
                    return res.status(200).json({ message: `Successfully Deleted your comment ${req.session.username}!` });
                }
                
            }

        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ message: false });
        });
});

router.post('/', withAuth, (req, res) => {
    // check the session
    if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            games_id: req.body.games_id,
            user_id: req.session.user_id
        })
            .then(dbCommentData => res.json(dbCommentData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
});

router.delete('/:id', withAuth, (req, res) => {

    let comment = req.params.id;
    Comment.destroy({
        where: {
            id: comment
        }
    })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'No comment found with this id' });
                return;
            } else {
                return res.status(200).json({ message: `Successfully deleted your comment, ${req.session.username}!` });

            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;

