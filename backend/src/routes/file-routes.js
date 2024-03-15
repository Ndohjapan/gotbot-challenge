const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { FileService } = require('../services/file-services');
const { businessAuth } = require('../middlewares/protect');

const service = new FileService();

router.post(
    '/',
    rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
    businessAuth,
    catchAsync(async(req, res) => {
        const business = req.user._id;
        const result = await service.UploadFile(req, business);
        res.send(result);
    })
);

module.exports = router;