const express = require('express');
const router = express.Router();
const filesService = require('../service/files')

router.post('/upload', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*')
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({errorMessage: 'No files were uploaded.'});
    }

    const result = await filesService.upload(req.files, 'files')
    console.log('result', result.data.result.length)

    res.status(result.status).send(result.data);
})

router.get('/download', function (req, res) {
    res.download(filepath + '/test.txt')
})

module.exports = router;