var express = require('express');
var router = express.Router();

/* GET admin listing. */
router.get('/', function (req, res, next) {
    res.render('admin/admin', { title: 'admin' });
});

module.exports = router;
