async function shellSort({numbers, setValue, selectIndices, markDone, delay, globalAbortController, stopTimer }) {
    let n = numbers.length;
    let signal = globalAbortController.signal;
    // Start with a big gap, then reduce the gap
    for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2))
    {
        // abort signal check
        if (signal.aborted) {
            console.log("Async function aborted.");
            return; // Terminate function if aborted
        }
        // Do a gapped insertion sort for this gap size.
        // The first gap elements a[0..gap-1] are already
        // in gapped order keep adding one more element
        // until the entire array is gap sorted
        for (let i = gap; i < n; i += 1)
        {
            // abort signal check
            if (signal.aborted) {
                console.log("Async function aborted.");
                return; // Terminate function if aborted
            }
            // add a[i] to the elements that have been gap
            // sorted save a[i] in temp and make a hole at
            // position i
            let temp = numbers[i];

            // shift earlier gap-sorted elements up until
            // the correct location for a[i] is found
            let j;
            for (j = i; j >= gap && numbers[j - gap] > temp; j -= gap) {
                // numbers[j] = numbers[j - gap];
                // abort signal check
                if (signal.aborted) {
                    console.log("Async function aborted.");
                    return; // Terminate function if aborted
                }
                selectIndices(j, j-gap);
                setValue(j, numbers[j-gap]);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            // abort signal check
            if (signal.aborted) {
                console.log("Async function aborted.");
                return; // Terminate function if aborted
            }
            selectIndices(j, j);
            setValue(j, temp);
            await new Promise(resolve => setTimeout(resolve, delay));
            // put temp (the original a[i]) in its correct
            // location
            // numbers[j] = temp;
        }
    }
    // abort signal check
    if (signal.aborted) {
        console.log("Async function aborted.");
        return; // Terminate function if aborted
    }
    markDone();
    stopTimer();
}

