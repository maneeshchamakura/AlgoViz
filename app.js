let numbers;
let globalAbortController = new AbortController();


var sec = 0;
var intervalId;

function pad(val) { 
  return val > 9 ? val : "0" + val; 
}

function startTimer() {
  intervalId = setInterval(function() {
    $("#seconds").html(pad(++sec % 60));
    $("#minutes").html(pad(parseInt(sec / 60, 10)));
  }, 1000);
}

function resetTimer() {
    sec = 0;
    $("#seconds").html("00");
    $("#minutes").html("00");
}

function stopTimer() {
  clearInterval(intervalId);
}

resetTimer();

function getRandomArray(length) {
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    return Array.from({ length }, () => getRandomInt(1, 100));
}

function initializeCanvas() {
    // Retrieve the width and height of the screen
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Define margin for your chart
    const margin = { top: 20, right: 20, bottom: 30, left: 20 };

    numbers = getRandomArray(100);
    // numbers =  [19, 48, 40, 66, 89, 81, 11, 12, 69, 91, 75, 80, 74];

    // Calculate width and height of the chart area
    const width = screenWidth - margin.left - margin.right;
    const height = screenHeight - margin.top - margin.bottom;    

    // add this svg to the div
    const svg = d3.select("#dataviz")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g");

    // create the xScale
    const x = d3.scaleBand()
                .domain(d3.range(numbers.length))
                .range([0, width])
                .padding(0.2);            

    // create the yScale
    const y = d3.scaleLinear()
                .domain([0, d3.max(numbers)])
                .range([height, 0]);


    // add the bars to the svg
    svg.selectAll(".bar")
        .data(numbers)
        .enter()
        .append("rect")
        .attr("fill", "#69b3a2")
        .classed("bar", true)
        .attr("x", (d, i) => x(i))  // Sets the x-coordinate of each bar based on the index of the data point
        .attr("y", d => y(d))  // Sets the y-coordinate of each bar based on the data value
        .attr("width", x.bandwidth())  // Sets the width of each bar to the bandwidth of the x-scale
        .attr("height", d => height - y(d))
        .text(d => d);

    function swapElements(index1, index2) {
        [numbers[index1], numbers[index2]] = [numbers[index2], numbers[index1]];
        // Update the data bound to the bars
        svg.selectAll(".bar")
            .data(numbers)
            .transition()
            .duration(5) // Set the duration of the transition in milliseconds
            .attr("y", d => y(d))  // Update the y-coordinate of each bar based on the new data value
            .attr("height", d => height - y(d));
    }

    function setValue(index, value) {
        numbers[index] = value;
        // Update the data bound to the bars
        svg.selectAll(".bar")
            .data(numbers)
            .transition()
            .duration(5) // Set the duration of the transition in milliseconds
            .attr("y", d => y(d))  // Update the y-coordinate of each bar based on the new data value
            .attr("height", d => height - y(d));
    }

    function selectIndices(index1, index2) {
        svg.selectAll(".bar")
            .data(numbers)
            .attr("fill", (d, i) => {
                if (i == index1) {
                    return "blue";
                } else if (i == index2) {
                    return "red";
                }
                return "#69b3a2";
            });
    }


    function markToDefault() {
        svg.selectAll(".bar")
            .data(numbers)
            .attr("fill", "#69b3a2");
    }

    function markDone() {
        svg.selectAll(".bar")
            .data(numbers)
            .transition()
            .duration(100)
            .delay((d, i) => i * 30)
            .attr("fill", "green");
    }
    let base_delay = 500;
    let speedToDelay = {
        "0.1x": 2*base_delay,
        "0.25x": 1.75*base_delay,
        "0.5x": 1.5*base_delay,
        "0.75x": 1.25*base_delay,
        "1x": base_delay,
        "1.25x": base_delay*0.75,
        "1.5x": base_delay*0.5,
        "1.75x": base_delay*0.25,
        "2x": base_delay*0.1,
    };
    let default_speed = "2x";
    let canvas_obj = {
        numbers,
        markDone,
        markToDefault,
        selectIndices,
        setValue,
        swapElements,
        "delay": speedToDelay[default_speed],
        bubbleSort,
        insertionSort,
        selectionSort,
        shellSort,
        mergeSort,
        quickSort,
        heapSort,
        globalAbortController,
        stopTimer
    }
    
    return canvas_obj;
}

let canvas_obj = initializeCanvas();
self.markDone = canvas_obj.markDone;
self.selectIndices = canvas_obj.selectIndices;
self.swapElements = canvas_obj.swapElements;
self.setValue = canvas_obj.setValue;

let current_algo = canvas_obj.bubbleSort;

function handleAlgorithmButtonClick(button) {
    stopTimer();
    resetTimer();
    // abort the running async function
    globalAbortController.abort();
    globalAbortController = new AbortController();
    // update the abort controller
    canvas_obj["globalAbortController"] = globalAbortController;
    // remove all the items from #dataviz
    let algo_name = button.name;
    // Select the container by its ID using D3
    var datavizContainer = d3.select("#dataviz");
    // Remove all child elements from the container
    datavizContainer.selectAll("*").remove();
    canvas_obj = initializeCanvas();
    current_algo = canvas_obj[algo_name];
}

function startSorting() {
    startTimer();
    current_algo(canvas_obj);
    // const worker = new Worker('bubbleWorker.js');
    // worker.postMessage({numbers});
}

document.addEventListener('DOMContentLoaded', function() {
    const sortButton = document.querySelector('[name="sort"]');
    sortButton.addEventListener('click', startSorting);
});