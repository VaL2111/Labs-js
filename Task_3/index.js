async function promiseFilterWithLimitCancellable(array, limit, signal) {
	const results = [];
	const errors = [];
	const executing = [];

	for (const item of array) {
		checkCancellation(signal);

		const promise = isEvenPromise(item, signal).catch(error => {
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

function isEvenPromise(item, signal) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			checkCancellation(signal);

			if (typeof item !== "number") {
				reject(new Error(`"${item}" не є числом`));
			} else {
				const isEven = item % 2 === 0;
				resolve(isEven ? item : null);
			}
		}, 500);
	});
}

function checkCancellation(signal) {
	if (signal?.aborted) {
		throw new Error("Операцію було скасовано.");
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
	const numbers = [1, 2, "hello", 4, "world", 6, 7, 8, 9, 10];
	const abortDelay = 1000;
	const signal = createAbortController(abortDelay);
	const parallelLimit = 2;

	try {
		const { errors, results } = await promiseFilterWithLimitCancellable(numbers, parallelLimit, signal);

		if (errors) {
			console.log("Помилки при фільтруванні: ", errors);
		}
		console.log("Результат фільтрування: ", results);

	} catch (error) {
		if (error.message === "Операцію було скасовано.") {
			console.log("Фільтрування було скасовано.");
		} else {
			console.error("Сталася помилка:", error);
		}
	}
}

demoWithAbort();


/*
async function promiseFilterWithLimitCancellable(array, limit, signal) {
	const results = [];
	const executing = [];

	for (const item of array) {
		checkCancellation(signal);

		const promise = isEvenPromise(item, signal).catch(error => {
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

function isEvenPromise(item, signal) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {

			checkCancellation(signal);

			if (typeof item !== "number") {
				reject(new Error(`"${item}" не є числом`));
			} else {
				const isEven = item % 2 === 0;
				resolve(isEven ? item : null);
			}
		}, 500);
	});
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
	const numbers = [1, 2, "hello", 4, "world", 6, 7, 8, 9, 10];
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
*/