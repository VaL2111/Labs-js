function promiseFilter(array, callback) {

	const promises = array.map(item =>
		callback(item).then(result => (result ? item : null))
	);

	return Promise.all(promises).then(results => results.filter(item => item !== null));
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

demoWithPromise();
demoWithAsyncAwait();