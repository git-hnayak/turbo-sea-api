const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const viewData = {
        appTitle: 'TurboSea',
        appMessage: 'Welcome to Turbo Sea'
    }
    res.render('index', viewData);
});

module.exports = router;