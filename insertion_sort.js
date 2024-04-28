async function insertionSort({numbers, setValue, selectIndices, markDone, delay, globalAbortController, stopTimer }) {
    let length = numbers.length;
    let comparisions = 0;
    let signal = globalAbortController.signal;
    let swaps = 0;
    console.log("current delay is" + delay);
    for(let i=1; i<length; i++) {
        let currentElement = numbers[i];
        let j=0;
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        for(j=i-1; j >= 0 && numbers[j] > currentElement; j--) {
            // abort signal
            if (signal.aborted) {
                console.log("Async function aborted.");
                return; // Terminate function if aborted
            }
            selectIndices(j, j+1);
            setValue(j+1, numbers[j]);            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        setValue(j+1, currentElement);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    // abort signal
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    markDone();
    stopTimer();
    console.log("comparisions: " + comparisions + "swaps:" + swaps);
}
