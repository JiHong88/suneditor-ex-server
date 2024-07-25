const puppeteer = require('puppeteer');
const express = require('express');

module.exports.downloadPdf = async (htmlContent) => {
	if (!htmlContent) {
		return res.status(400).send('No HTML content provided.');
	}

	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	page.on('console', (consoleObj) => console.log(consoleObj.text()));
	await page.goto('about:blank');
	await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

	// Apply print media emulation
	await page.emulateMediaType('print');

	const pdf = await page.pdf({
		format: 'A4',
		printBackground: true,
		margin: {
			top: '20px',
			right: '20px',
			bottom: '20px',
			left: '20px'
		}
	});

	await browser.close();

	return pdf;
};
