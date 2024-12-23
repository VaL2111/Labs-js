async function promiseFilter(array, delay = 0) {
	const results = [];

	for (const item of array) {
		
		if (delay > 0) {
			await new Promise(resolve => setTimeout(resolve, delay));
		}
      
		const promise = (async () => {
			await new Promise(resolve => setTimeout(resolve, 500));
			const isEven = item % 2 === 0;
			return isEven ? item : null;
		})();

		results.push(promise);
	}

	const resolvedResults = await Promise.all(results);
	const filteredResults = resolvedResults.filter(item => item !== null);

	return filteredResults;
}

async function promiseFilterWithLimit(array, limit) {
	const results = [];
	const executing = [];

	for (const item of array) {
		const promise = (async () => {
			await new Promise(resolve => setTimeout(resolve, 500));
			const isEven = item % 2 === 0;
			return isEven ? item : null;
		})();

		results.push(promise);
		executing.push(promise);

		if (executing.length >= limit) {
			const completedPromise = await Promise.race(executing);
			const index = executing.findIndex(p => p === completedPromise);
			executing.splice(index, 1);
		}
	}

	const resolvedResults = await Promise.all(results);
	const filteredResolvedResult = resolvedResults.filter(item => item !== null);

	return filteredResolvedResult;
}

function demoWithPromise() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const delay = 200;

	promiseFilter(numbers, delay).then(filteredNumbers => {
		console.log("Результат фільтрування через Promise: ", filteredNumbers);
	});
}

async function demoWithAsyncAwait() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const delay = 200;

	const filteredNumbers = await promiseFilter(numbers, delay);
	console.log("Результат фільтрування через Async/Await: ", filteredNumbers);
}

async function demoWithParallelism() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const parallelLimit = 2;

	const filteredNumbers = await promiseFilterWithLimit(numbers, parallelLimit);
	console.log("Результат фільтрування з паралельністю: ", filteredNumbers);
}

demoWithPromise();
demoWithAsyncAwait();
demoWithParallelism();