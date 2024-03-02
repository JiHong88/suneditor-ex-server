const express = require('express');
const router = express.Router();
const filesService = require('../service/files')
const mentionService = require('../service/mention')
const path = require('path');
const fs = require('fs');

router.post('/upload', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*')
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({errorMessage: 'No files were uploaded.'});
    }

    const result = await filesService.upload(req.files, 'files', 'http://localhost:3000/')
    console.log('upload-result', result.data.result)

    res.status(result.status).send(result.data);
})

router.post('/files/upload', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*')
    console.log('req.files', req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({errorMessage: 'No files were uploaded.'});
    }

    const result = await filesService.upload(req.files, 'files','http://localhost:3000/editor/files/download/');
    console.log('files/upload-result', result.data.result);

    res.status(result.status).send(result.data);
})

router.get('/files/download/*', (req, res) => {
    const filePath = req.params[0];
    const fileLocation = path.join(__dirname, '../..', filePath);
    console.log('fileLocation', fileLocation);

    // file check
    fs.access(fileLocation, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        res.download(fileLocation, path.basename(fileLocation), (err) => {
            if (err) {
                return res.status(500).send('Error downloading the file');
            }
        });
    });
});

router.get('/mention/info/*', (req, res) => {
    const name = req.params[0];
    const result = mentionService.get(name, 1);
    res.status(200).send(result[0]);
});

router.get('/mention/*', (req, res) => {
    const name = req.params[0];
    const limit = req.query.limit;
    console.log('mention-name', name);
    
    const result = mentionService.get(name, limit);
    console.log('mention-result', result);

    res.status(200).send(result.map(({ key, name, desc }) => ({
        key: key,
        name: `${name} (${desc})`,
        url: `http://localhost:3000/editor/mention/info/${key}`
    })));
});

module.exports = router;