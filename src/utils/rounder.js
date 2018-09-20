export function roundFloat3(float) {
	return Math.round(parseFloat(float) * 1e3) / 1e3
	// return parseFloat(float).toFixed(3)
}
