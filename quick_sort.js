async function partition(arr, low, high, swapElements, selectIndices, delay, signal) 
{
    let temp; 
    let pivot = arr[high];
    let i = (low - 1);
    for (let j = low; j <= high - 1; j++) {
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        selectIndices(j, high);
        if (arr[j] <= pivot) {
            i++;
            swapElements(i, j);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    selectIndices(i+1, high);
    swapElements(i+1, high);
    await new Promise(resolve => setTimeout(resolve, delay));
    return i + 1; 
}

async function qSort(arr, low, high, swapElements, selectIndices, delay, signal) 
{
    if (low < high) {
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        let pi = await partition(arr, low, high, swapElements, selectIndices, delay, signal); 
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        await qSort(arr, low, pi - 1, swapElements, selectIndices, delay, signal); 
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        await qSort(arr, pi + 1, high, swapElements, selectIndices, delay, signal); 
    }
}

async function quickSort({numbers, swapElements, selectIndices, markDone, delay, globalAbortController, stopTimer }) {
    let length = numbers.length;
    let signal = globalAbortController.signal;
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    await qSort(numbers, 0, length - 1, swapElements, selectIndices, delay, signal);
    markDone();
    stopTimer();
}
