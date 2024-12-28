function asyncFilter(array, asyncCallback, finalCallback, delay = 0) {
	const results = [];
	let processed = 0;

	array.forEach((item, index) => {
		asyncCallback(item, (error, include) => {
			if (error) {
				console.error(`Помилка обробки елемента ${item}:`, error);
				results[index] = null;
			} else if (include) {
				results[index] = item;
			} else {
				results[index] = null;
			}

			setTimeout(() => {
				processed++;

				if (processed === array.length) {
					finalCallback(results.filter((item) => item !== null));
				}
			}, delay);
		});
	});
}

function isEvenCallback(num, callback) {
	const processingDelay = 500;

	setTimeout(() => {
		if (typeof num !== "number") {
			callback(new Error(`"${num}" не є числом`));
		} else {
			callback(null, num % 2 === 0);
		}
	}, processingDelay);
}

function demo() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const delayBetweenItems = 200;

	console.log("Фільтруємо парні числа асинхронно.");

	asyncFilter(
		numbers,
		isEvenCallback,
		(filteredNumbers) => {
			console.log("Результат фільтрування:", filteredNumbers);
		},
		delayBetweenItems
	);
}

demo();
