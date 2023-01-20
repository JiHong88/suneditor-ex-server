const express = require('express');
const router = express.Router();
const filesService = require('../service/files');

router.post('/:tagId', async (req, res) => {
	const tagId = req.params.tagId;
	const result = await filesService.create(`swagger-files/${tagId}`, Date.now(), JSON.stringify(req.body));
	res.status(result.status).send(result.data);
});

router.get('/:tagId', async (req, res) => {
	const tagId = req.params.tagId;
	const result = await filesService.readFiles(`swagger-files/${tagId}`);
	res.status(result.status).send(result.data.reverse());
});

router.delete('/:tagId/:id', async (req, res) => {
	
})

module.exports = router;
