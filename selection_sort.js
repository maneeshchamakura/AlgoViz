async function selectionSort({numbers, swapElements, selectIndices, markDone, delay, globalAbortController, stopTimer  }) {
    let length = numbers.length;
    let comparisions = 0;
    let swaps = 0;
    let signal = globalAbortController.signal;
    for(let i=0; i<length; i++) {
        let min_index = i;
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        for(let j=i+1; j < length; j++) {
            // abort signal check
            if (signal.aborted) {
                console.log("Async function aborted.");
                return; // Terminate function if aborted
            }
            selectIndices(j, min_index);
            await new Promise(resolve => setTimeout(resolve, delay));
            if (numbers[j] < numbers[min_index]) {
                min_index = j;
            }
        }
        swapElements(min_index, i);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    markDone();
    stopTimer();
    console.log("comparisions: " + comparisions + "swaps:" + swaps);
}
