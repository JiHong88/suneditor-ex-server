const fs = require('fs');
const FILE_PATH = 'public';

function READ_FILES(dirname, onFileContent, onError) {
	try {
		const files = fs.readdirSync(dirname);
		files.forEach((filename) => {
			onFileContent(filename, fs.readFileSync(dirname + filename, 'utf-8'));
		});
	} catch (err) {
		onError(err);
	}
}

module.exports.create = async (folder, fileName, content) => {
	try {
		await fs.promises.mkdir(`public/${folder}`, { recursive: true });
		await fs.promises.appendFile(`public/${folder}/${fileName}.json`, content).then(async (err) => {
			if (err) throw err;
			console.log(`Saved : ${folder}/${fileName}`);
		});
	} catch (err) {
		return {
			status: 500,
			message: err.message,
		};
	}

	return {
		status: 200,
	};
};

module.exports.readFiles = async (folder) => {
	let status = 200;
	const data = [];

	READ_FILES(
		`${FILE_PATH}/${folder}/`,
		(filename, content) => {
			data.push(JSON.parse(content));
		},
		(err) => {
			console.log('read files fail', err);
			status = 500;
		}
	);

	return {
		status,
		data,
	};
};

module.exports.upload = async (files, path, prefixPath) => {
	const uploads = [];
	let error = '';
	let promise;

	try {
		for (let key in files) {
			f = files[key];
			p = `${FILE_PATH}/${path}/${f.md5}.${f.name.split('.').pop()}`;
			promise = (err) => {
				return new Promise((resolve, reject) => {
					if (err) {
						reject(err);
					} else {
						resolve({
							url: prefixPath + p,
							name: f.name,
							size: f.size,
						});
					}
				});
			};

			f.mv(
				p,
				promise().then((result) => {
					uploads.push(result);
				})
			);
		}
	} catch (err) {
		error = err.toString();
	}

	console.log('uploads', uploads.length);

	return {
		status: error ? 500 : 200,
		data: {
			errorMessage: error,
			result: uploads,
		},
	};
};
