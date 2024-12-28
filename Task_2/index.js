async function promiseFilter(array, filterFunc, delay = 0) {
	const results = [];

	for (const item of array) {
		if (delay > 0) {
			await new Promise(resolve => setTimeout(resolve, delay));
		}

		const promise = filterFunc(item).catch(error => {
			console.error(`Помилка обробки елемента "${item}":`, error.message);
			return null;
		});

		results.push(promise);
	}

	const resolvedResults = await Promise.all(results);

	return resolvedResults.filter(item => item !== null);
}

async function promiseFilterWithLimit(array, filterFunc, limit) {
	const results = [];
	const executing = [];

	for (const item of array) {
		const promise = filterFunc(item).catch(error => {
			console.error(`Помилка обробки елемента "${item}":`, error.message);
			return null;
		});

		results.push(promise);
		executing.push(promise);

		if (executing.length >= limit) {
			const completedPromise = await Promise.race(executing);
			const index = executing.findIndex(p => p === completedPromise);
			executing.splice(index, 1);
		}
	}

	const resolvedResults = await Promise.all(results);

	return resolvedResults.filter(item => item !== null);
}

function isEvenPromise(item) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (typeof item !== "number") {
				reject(new Error(`"${item}" не є числом`));
			} else {
				const isEven = item % 2 === 0;
				resolve(isEven ? item : null);
			}
		}, 500);
	});
}

function demoWithPromise() {
	const numbers = [1, 2, "hello", 4, "world", 6, 7, 8, 9, 10];
	const delay = 200;

	promiseFilter(numbers, isEvenPromise, delay).then(filteredNumbers => {
		console.log("Результат фільтрування через Promise: ", filteredNumbers);
	});
}

async function demoWithAsyncAwait() {
	const numbers = [1, 2, "hello", 4, "world", 6, 7, 8, 9, 10];
	const delay = 200;

	const filteredNumbers = await promiseFilter(numbers, isEvenPromise, delay);
	console.log("Результат фільтрування через Async/Await: ", filteredNumbers);
}

async function demoWithParallelism() {
	const numbers = [1, 2, "hello", 4, "world", 6, 7, 8, 9, 10];
	const parallelLimit = 2;

	const filteredNumbers = await promiseFilterWithLimit(numbers, isEvenPromise, parallelLimit);
	console.log("Результат фільтрування з паралельністю: ", filteredNumbers);
}

demoWithPromise();
demoWithAsyncAwait();
demoWithParallelism();
