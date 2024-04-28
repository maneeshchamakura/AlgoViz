async function merge(arr, l, m, r, setValue, selectIndices, delay, signal)
{
    var n1 = m - l + 1;
    var n2 = r - m;

    // Create temp arrays
    var L = new Array(n1); 
    var R = new Array(n2);

    // Copy data to temp arrays L[] and R[]
    for (var i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (var j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];

    // Merge the temp arrays back into arr[l..r]

    // Initial index of first subarray
    var i = 0;

    // Initial index of second subarray
    var j = 0;

    // Initial index of merged subarray
    var k = l;

    while (i < n1 && j < n2) {
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        selectIndices(l + i, m + 1 + j);
        if (L[i] <= R[j]) {            
            // arr[k] = L[i];
            setValue(k, L[i]);
            await sleep(delay);
            i++;
        }
        else {
            // arr[k] = R[j];
            setValue(k, R[j]);
            await sleep(delay);
            j++;
        }
        k++;
    }

    // Copy the remaining elements of
    // L[], if there are any
    while (i < n1) {
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        // arr[k] = L[i];
        selectIndices(l + i, l + i);
        // arr[k] = L[i];
        setValue(k, L[i]);
        await sleep(delay);
        i++;
        k++;
    }

    // Copy the remaining elements of
    // R[], if there are any
    while (j < n2) {
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        selectIndices(m + 1 + j, m + 1 + j);
        // arr[k] = L[i];
        setValue(k, R[j]);
        await sleep(delay);
        j++;
        k++;
    }
}

async function sleep(delay){
    await new Promise(resolve => setTimeout(resolve, delay));
}

// l is for left index and r is
// right index of the sub-array
// of arr to be sorted
async function mergeSortHelper(arr,l, r, setValue, selectIndices, delay, signal){
    if(l>=r){
        return;
    }
    var m =l+ parseInt((r-l)/2);
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    await mergeSortHelper(arr,l,m, setValue, selectIndices, delay, signal);
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    await mergeSortHelper(arr,m+1,r, setValue, selectIndices, delay, signal);
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    await merge(arr,l,m,r, setValue, selectIndices, delay, signal);
}


async function mergeSort({numbers, setValue, selectIndices, markDone, delay, globalAbortController, stopTimer  }) {
    let length = numbers.length;
    let signal = globalAbortController.signal;
    await mergeSortHelper(numbers, 0, length - 1, setValue, selectIndices, delay, signal);
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    markDone();
    stopTimer();
}
