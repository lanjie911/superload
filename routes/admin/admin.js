var express = require('express');
var router = express.Router();

/* GET admin listing. */
router.get('/', function (req, res, next) {
    let login = req.session.login;
    if(!login){
        res.send("You haven't login the system!");
        return;
    }
    res.render('admin/admin', { title: 'admin' });
});

router.get('/login', function (req, res, next) {
    req.session.login = true;
    res.redirect("/admin");
});

router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        console.info("Session Destroied");
    });
    res.redirect("../");
});

module.exports = router;
