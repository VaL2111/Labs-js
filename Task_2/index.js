function promiseFilter(array, callback) {

	const promises = array.map(item =>
		callback(item).then(result => (result ? item : null))
	);

	return Promise.all(promises).then(results => results.filter(item => item !== null));
}

async function promiseFilterWithLimit(array, callback, limit) {
	const results = [];
	const executing = [];

	for (const item of array) {
		const promise = callback(item).then(result => (result ? item : null));
		results.push(promise);
		executing.push(promise);

		if (executing.length >= limit) {
			const completedPromise = await Promise.race(executing);
			const index = executing.findIndex(p => p === completedPromise);
			executing.splice(index, 1);
		}
	}

	const resolvedResults = await Promise.all(results);
	const filteredResolvedResults = resolvedResults.filter(item => item !== null);
	return filteredResolvedResults;
}

function isEvenPromise(num) {
	return new Promise(resolve => {
		setTimeout(() => resolve(num % 2 === 0), 500);
	});
}

function demoWithPromise() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	promiseFilter(numbers, isEvenPromise).then(filteredNumbers => {
		console.log("Результат фільтрування через Promise:", filteredNumbers);
	});
}

async function demoWithAsyncAwait() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	const filteredNumbers = await promiseFilter(numbers, isEvenPromise);
	console.log("Результат фільтрування через Async/Await:", filteredNumbers);
}

async function demoWithParallelism() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	const filteredNumbers = await promiseFilterWithLimit(numbers, isEvenPromise, 2);
	console.log("Результат фільтрування з паралельністю:", filteredNumbers);
}

demoWithPromise();
demoWithAsyncAwait();
demoWithParallelism()