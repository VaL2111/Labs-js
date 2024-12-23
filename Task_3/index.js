async function promiseFilterWithLimitCancellable(array, limit, signal) {
	const results = [];
	const executing = [];

	for (const item of array) {
		checkCancellation(signal);

		const promise = (async () => {
			await new Promise(resolve => setTimeout(resolve, 500));
			checkCancellation(signal);
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
	const filteredResolvedResults = resolvedResults.filter(item => item !== null);

	return filteredResolvedResults;
}

function checkCancellation(signal) {
	if (signal?.aborted) {
		throw new Error("Операцію було скасовано");
	}
}

function createAbortController(timeout) {
	const controller = new AbortController();
	const { signal } = controller;

	setTimeout(() => {
		controller.abort();
	}, timeout);

	return signal;
}

async function demoWithAbort() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const abortDelay = 1000;
	const signal = createAbortController(abortDelay);
	const parallelLimit = 2;

	try {
		const result = await promiseFilterWithLimitCancellable(numbers, parallelLimit, signal);
		console.log("Результат:", result);
	} catch (error) {
		if (error.message === "Операцію було скасовано") {
			console.log("Фільтрування було скасовано.");
		} else {
			console.error("Сталася помилка:", error);
		}
	}
}

demoWithAbort();
