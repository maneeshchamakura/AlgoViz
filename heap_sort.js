async function heapify(array, index, length = array.length, swapElements, selectIndices, delay, signal) {
    let largest = index,
        left = index * 2 + 1,
        right = index * 2 + 2;

    // compare element to its left and right child 
    if (left < length && array[left] > array[largest]) {
        largest = left;
    }
    if (right < length && array[right] > array[largest]) {
        largest = right;
    }

    // if the parent node isn't the largest element, swap it with the largest child
    if (largest !== index) {
        selectIndices(index, largest);
        swapElements(index, largest);
        await new Promise(resolve => setTimeout(resolve, delay));
        // continue to heapify down the heap
        await heapify(array, largest, length, swapElements, selectIndices, delay, signal);
    }
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    return array;
}

async function sort(array, swapElements, selectIndices, delay, signal) {
    // max heapify the array
    for (let i = Math.floor(array.length / 2); i >= 0; i--) {
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        await heapify(array, i, array.length, swapElements, selectIndices, delay, signal)
    }

    // work backwards, moving max elements to the end of the array
    for(let i = array.length - 1; i > 0; i--){
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        // max element of unsorted section of array is at index 0, swap with element at last index in unsorted array
        selectIndices(0, i);
        swapElements(0, i);
        await new Promise(resolve => setTimeout(resolve, delay));
        // re-heapify array, from beginning to the end of the unsorted section
        await heapify(array, 0, i, swapElements, selectIndices, delay, signal);
    }
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    return array;
}

async function heapSort({numbers, swapElements, selectIndices, markDone, delay, globalAbortController, stopTimer  }) {
    let signal = globalAbortController.signal;
    await sort(numbers, swapElements, selectIndices, delay, signal);    
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    markDone();
    stopTimer();
}
