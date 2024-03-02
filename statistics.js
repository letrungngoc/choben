// Calculate the mean (average) of an array of values
function calculateMean(data) {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
}

// Calculate the median of an array of values
function calculateMedian(data) {
    const sortedData = data.slice().sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedData.length / 2);
    return sortedData.length % 2 === 0
        ? (sortedData[middleIndex - 1] + sortedData[middleIndex]) / 2
        : sortedData[middleIndex];
}

// Calculate the mode (most frequent value) of an array of values
function calculateMode(data) {
    const valueCountMap = new Map();
    data.forEach(value => {
        valueCountMap.set(value, (valueCountMap.get(value) || 0) + 1);
    });
    let maxCount = 0;
    let modeValue;
    for (const [value, count] of valueCountMap.entries()) {
        if (count > maxCount) {
            maxCount = count;
            modeValue = value;
        }
    }
    return modeValue;
}

// Calculate the range (difference between max and min) of an array of values
function calculateRange(data) {
    return Math.max(...data) - Math.min(...data);
}

// Calculate the standard deviation of an array of values
function calculateStandardDeviation(data) {
    const mean = calculateMean(data);
    const squaredDifferencesSum = data.reduce((acc, value) => acc + (value - mean) ** 2, 0);
    const variance = squaredDifferencesSum / data.length;
    return Math.sqrt(variance);
}

// Export the functions to make them accessible in other files
export { calculateMean, calculateMedian, calculateMode, calculateRange, calculateStandardDeviation };
