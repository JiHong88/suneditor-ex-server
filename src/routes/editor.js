const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const filesService = require('../service/files');
const mentionService = require('../service/mention');
const pdfService = require('../service/pdf');
const path = require('path');
const fs = require('fs');
const { type } = require('os');

// files
router.post('/upload', async (req, res) => {
	// res.setHeader('Access-Control-Allow-Origin', '*')
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send({ errorMessage: 'No files were uploaded.' });
	}

	const result = await filesService.upload(req.files, 'files', 'http://localhost:3000/');
	console.log('upload-result', result.data.result);

	res.status(result.status).send(result.data);
});

router.post('/files/upload', async (req, res) => {
	// res.setHeader('Access-Control-Allow-Origin', '*')
	console.log('req.files', req.files);
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send({ errorMessage: 'No files were uploaded.' });
	}

	const result = await filesService.upload(req.files, 'files', 'http://localhost:3000/editor/files/download/');
	console.log('files/upload-result', result.data.result);

	res.status(result.status).send(result.data);
});

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

// mention
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

	res.status(200).send(
		result.map(({ key, name, desc }) => ({
			key: key,
			name: `${name} (${desc})`,
			url: `http://localhost:3000/editor/mention/info/${key}`
		}))
	);
});

// pdf
router.post('/download-pdf', async (req, res) => {
	console.log('download-pdf');
	const { htmlContent, fileName } = req.body;
	console.log(htmlContent);

	if (!htmlContent) {
		return res.status(400).send('No HTML content provided.');
	}

	const pdf = await pdfService.downloadPDF(htmlContent);

	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
	res.send(pdf);
});

// gallery
router.get('/gallery/image', async (req, res) => {
	const result = [
		{
			src: 'http://suneditor.com/docs/cat.jpg',
			name: 'Tabby',
			alt: 'Tabby',
			tag: ['Cat', 'Dog']
		},
		{
			src: 'http://suneditor.com/docs/cat1.jpg',
			name: 'Cat paw',
			alt: 'Cat paw',
			tag: 'Cat, Tiger'
		},
		{
			src: 'http://suneditor.com/docs/cat2.jpg',
			name: 'Cat',
			alt: 'Cat',
			tag: 'Cat'
		},
		{
			src: 'http://suneditor.com/docs/dog.jpg',
			name: 'Dog',
			alt: 'Dog',
			tag: 'Dog'
		},
		{
			src: 'http://suneditor.com/docs/welsh Corgi.jpg',
			name: 'Welsh Corgi',
			alt: 'Welsh Corgi',
			tag: 'Dog'
		},
		{
			src: 'http://suneditor.com/docs/retriever.jpg',
			name: 'Retriever',
			alt: 'Retriever',
			tag: 'Dog'
		},
		{
			src: 'http://suneditor.com/docs/tiger1.jpg',
			name: 'Tiger-1',
			alt: 'Tiger',
			tag: 'Tiger'
		},
		{
			src: 'http://suneditor.com/docs/tiger2.jpg',
			name: 'Tiger-2',
			alt: 'Tiger',
			tag: 'Tiger'
		},
		{
			src: 'http://suneditor.com/docs/tiger3.jpg',
			name: 'Tiger-3',
			alt: 'Tiger',
			tag: 'Tiger'
		},
		{
			src: 'http://suneditor.com/docs/white-eagle.jpg',
			name: 'White eagle',
			alt: 'Bird-White eagle',
			tag: 'Bird'
		},
		{
			src: 'http://suneditor.com/docs/ara.jpg',
			name: 'Ara',
			alt: 'Bird-Ara',
			tag: 'Bird'
		},
		{
			src: 'http://suneditor.com/docs/dove.jpg',
			name: 'Dove',
			alt: 'Bird-Dove',
			tag: 'Bird'
		},
		{
			src: 'http://suneditor.com/docs/big-whale.jpg',
			name: 'Big whale',
			alt: 'Big whale',
			tag: 'Whale'
		},
		{
			src: 'http://suneditor.com/docs/sea-whale.jpg',
			name: 'Whale of the sea',
			alt: 'Whale of the sea',
			tag: 'Whale'
		},
		{
			src: 'http://suneditor.com/docs/blue-whale.jpg',
			name: 'Blue whale',
			alt: 'Blue whale',
			tag: 'Whale'
		}
	];

	res.status(200).send(result);
});

router.get('/gallery/video', async (req, res) => {
	const data = {
		result: [
			{
				src: 'https://youtu.be/jWQx2f-CErU?list=RDjWQx2f-CErU',
				name: 'aespa Whiplash',
				thumbnail: 'http://suneditor.com/docs/aespa_whiplash.jpg',
				tag: ['vi1', 'avi'],
				frame: 'iframe'
			},
			{
				src: 'http://suneditor.com/docs/sample_video_1.mp4',
				name: 'Sample video 1',
				// thumbnail: 'http://suneditor.com/docs/thumbnail_1.webp',
				tag: ['vi1', 'avi'],
				frame: 'video'
			},
			{
				src: 'http://suneditor.com/docs/sample_video_2.mp4',
				name: 'Sample video 2',
				thumbnail: 'http://suneditor.com/docs/thumbnail_2.jpg',
				tag: 'a1, vi1'
			},
			{
				src: 'http://suneditor.com/docs/sample_video_3.mp4',
				name: 'Sample video 3',
				thumbnail: 'http://suneditor.com/docs/thumbnail_3.jpg',
				tag: 'avi'
			}
		]
	};

	res.status(200).send(data);
});

router.get('/gallery/audio', async (req, res) => {
	const data = {
		result: [
			{
				src: 'http://suneditor.com/docs/sample_audio_1.mp3',
				name: 'Sample audio 1',
				tag: ['vi1', 'avi']
			},
			{
				src: 'http://suneditor.com/docs/sample_audio_1.mp3',
				name: 'Sample audio 2',
				thumbnail: 'http://suneditor.com/docs/thumbnail_2.jpg',
				tag: 'a1, vi1'
			},
			{
				src: 'http://suneditor.com/docs/sample_audio_1.mp3',
				name: 'Sample audio 3',
				tag: 'avi'
			}
		]
	};

	res.status(200).send(data);
});

router.get('/gallery/file', async (req, res) => {
	const data = {
		result: [
			{
				src: 'http://suneditor.com/docs/sample_file_1.docx',
				name: 'Sample file 1',
				tag: ['vi1', 'avi']
			},
			{
				src: 'http://suneditor.com/docs/sample_file_2.docx',
				name: 'Sample file 2',
				tag: 'a1, vi1'
			},
			{
				src: 'http://suneditor.com/docs/sample_file_3.pdf',
				name: 'Sample file 3',
				tag: 'avi'
			}
		]
	};

	res.status(200).send(data);
});

router.get('/filebrowser', async (req, res) => {
	const data = {
		result: [
			{
				src: 'http://suneditor.com/docs/cat.jpg',
				name: 'Tabby',
				alt: 'Tabby',
				tag: ['Cat', 'Dog'],
				type: 'image'
			},
			{
				src: 'http://suneditor.com/docs/sample_audio_1.mp3',
				name: 'Sample audio 1',
				tag: ['vi1', 'avi'],
				type: 'audio'
			},
			{
				src: 'http://suneditor.com/docs/sample_file_1.docx',
				name: 'Sample file 1',
				tag: ['vi1', 'avi'],
				type: 'file'
			},
			{
				src: 'https://youtu.be/jWQx2f-CErU?list=RDjWQx2f-CErU',
				name: 'aespa Whiplash',
				thumbnail: 'http://suneditor.com/docs/aespa_whiplash.jpg',
				tag: ['vi1', 'avi'],
				frame: 'iframe',
				type: 'video'
			},
			{
				src: 'http://suneditor.com/docs/sample_video_1.mp4',
				name: 'Sample video 1',
				tag: ['vi1', 'avi'],
				frame: 'video',
				type: 'video'
			},
			{
				src: 'http://suneditor.com/docs/sample_video_2.mp4',
				name: 'Sample video 2',
				thumbnail: 'http://suneditor.com/docs/thumbnail_2.jpg',
				tag: 'a1, vi1',
				type: 'video'
			}
		]
	};

	res.status(200).send(data);
});

module.exports = router;
