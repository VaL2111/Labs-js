async function asyncFilter(array, callback, delay = 0) {
	const result = [];

	for (let i = 0; i < array.length; i++) {
		const shouldInclude = await callback(array[i]);

		if (delay > 0) {
			await new Promise(resolve => setTimeout(resolve, delay));
		}

		if (shouldInclude) {
			result.push(array[i]);
		}
	}

	return result;
}

async function isEvenAsync(num) {
	await new Promise(resolve => setTimeout(resolve, 500));
	return num % 2 === 0;
}
 
async function demo() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	console.log("Фільтруємо парні числа асинхронно.");
	const evenNumbers = await asyncFilter(numbers, isEvenAsync, 200);
	console.log("Результат: ", evenNumbers);
}

demo();