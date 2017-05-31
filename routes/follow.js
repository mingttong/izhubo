/**
 * Created by lenovo on 2017/5/30.
 */
const express = require('express');
const router = express.Router();

router.get('/follow', function (req, res, next) {
  res.send('success follow');
});

module.exports = router;
