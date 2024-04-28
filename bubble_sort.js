async function bubbleSort({ numbers, swapElements, selectIndices, markDone, delay, globalAbortController, stopTimer }) {
    let length = numbers.length;
    let comparisons = 0;
    let swaps = 0;
    const signal = globalAbortController.signal;
    for (let i = 0; i < length; i++) {        
        for (let j = 0; j + 1 < length - i; j++) {
            if (signal.aborted) {
                console.log("Async function aborted.");
                return; // Terminate function if aborted
            }
            comparisons += 1;
            selectIndices(j, j + 1);
            if (numbers[j] > numbers[j + 1]) {
                swaps += 1;
                swapElements(j, j + 1);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    markDone();
    console.log("Comparisons: " + comparisons + ", Swaps: " + swaps);
    stopTimer();
}
