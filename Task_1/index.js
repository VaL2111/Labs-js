function asyncFilter(array, asyncCallback, finalCallback, delay = 0) {
	const results = [];
	const errors = [];
	let processed = 0;

	array.forEach((item, index) => {
		asyncCallback(item, (error, include) => {
			if (error) {
				errors.push({ item, error });
				results[index] = null;
			} else if (include) {
				results[index] = item;
			} else {
				results[index] = null;
			}

			setTimeout(() => {
				processed++;

				if (processed === array.length) {
					finalCallback(
						errors.length > 0 ? errors : null, 
						results.filter((item) => item !== null)
					);
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
	const numbers = [1, 2, "hello", 4, "world", 6, 7, 8, 9, 10];
	const delayBetweenItems = 200;

	console.log("Фільтруємо парні числа асинхронно.");

	asyncFilter(
		numbers,
		isEvenCallback,
		(errors, filteredNumbers) => {
			if (errors) {
				console.log("Помилки при фільтруванні: ", errors);
			}

			console.log("Результат фільтрування: ", filteredNumbers);
		},
		delayBetweenItems
	);
}

demo();
