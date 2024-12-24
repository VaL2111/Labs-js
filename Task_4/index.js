const fs = require("fs");
const path = require("path");
const readline = require("readline");


async function* readFile(fileName) {
	const filePath = path.join(__dirname, fileName);
	const stream = fs.createReadStream(filePath, { encoding: "utf8" });
	const reader = readline.createInterface({ input: stream });

	for await (const line of reader) {
		yield line;
	}
}

async function findWordInFile(fileName, wordToFind) {
	try {
		let lineCount = 0;
		let foundCount = 0;

		console.log(`Шукаємо слово "${wordToFind}" у файлі "${fileName}".`);

		for await (const line of readFile(fileName)) {
			lineCount++;

			if (line.includes(wordToFind)) {
				foundCount++;
				console.log(`Знайдено у рядку ${lineCount}:`, line);
			}
		}

		if (foundCount === 0) {
			console.log(`Слово "${wordToFind}" не знайдено у файлі.`);
		}
	} catch (error) {
		console.error("Сталася помилка під час обробки файлу:", error.message);
	}
}

const executeFile = "file.txt";
const searchWord = "book";

findWordInFile(executeFile, searchWord);
