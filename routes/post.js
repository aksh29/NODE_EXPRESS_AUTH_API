const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/',verify,(req,res) => {
    req.send(user.user);
});

module.exports = router;