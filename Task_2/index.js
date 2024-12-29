async function promiseFilter(array, filterFunc, delay = 0) {
	const results = [];
	const errors = [];

	for (const item of array) {
		if (delay > 0) {
			await new Promise(resolve => setTimeout(resolve, delay));
		}

		const promise = filterFunc(item).catch(error => {
			errors.push({ item, error });
			return null;
		});

		results.push(promise);
	}

	const resolvedResults = await Promise.all(results);

	return {
		errors: errors.length > 0 ? errors : null,
		results: resolvedResults.filter(item => item !== null),
	};
}

async function promiseFilterWithLimit(array, filterFunc, limit) {
	const results = [];
	const errors = [];
	const executing = [];

	for (const item of array) {
		const promise = filterFunc(item).catch(error => {
			errors.push({ item, error });
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

	return {
		errors: errors.length > 0 ? errors : null,
		results: resolvedResults.filter(item => item !== null),
	};
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

	promiseFilter(numbers, isEvenPromise, delay).then(({ errors, results }) => {
		if (errors) {
			console.log("Помилки при фільтруванні: ", errors);
		}

		console.log("Результат фільтрування через Promise: ", results);
	});
}

async function demoWithAsyncAwait() {
	const numbers = [1, 2, "hello", 4, "world", 6, 7, 8, 9, 10];
	const delay = 200;

	const { errors, results } = await promiseFilter(numbers, isEvenPromise, delay);

	if (errors) {
		console.log("Помилки при фільтруванні: ", errors);
	}

	console.log("Результат фільтрування через Async/Await: ", results);
}

async function demoWithParallelism() {
	const numbers = [1, 2, "hello", 4, "world", 6, 7, 8, 9, 10];
	const parallelLimit = 2;

	const { errors, results } = await promiseFilterWithLimit(numbers, isEvenPromise, parallelLimit);

	if (errors) {
		console.log("Помилки при фільтруванні: ", errors);
	}

	console.log("Результат фільтрування з паралельністю:", results);
}

demoWithPromise();
demoWithAsyncAwait();
demoWithParallelism();
