// global variables
// const globals
const MIN = -50;
const MAX = 50;
// document references
const errors = document.getElementById("errors");
// misc variables
let hasErrors = false;

// main table generation driver, called from "Generate" button
function generate() {
    // reset error log for new process
    errors.innerHTML = "";
    errors.style.borderStyle = "none";
    hasErrors = false;
    // get user inputs from form
    const colMin = document.getElementById("colMin").value;
    const colMax = document.getElementById("colMax").value;
    const rowMin = document.getElementById("rowMin").value;
    const rowMax = document.getElementById("rowMax").value;
    // debug message to terminal
    console.log("got inputs: " + colMin + ", " + colMax + ", " + rowMin + ", " + rowMax);
    // verify numeric input
    const verificationStatus = verify(colMin, colMax, rowMin, rowMax);
    console.log("input verified: " + verificationStatus);
    // generate table
}

// return true if x is integer, false otherwise (empty string)
function isInt(x) {
    if (x === "") {
        return false
    } else {
        return Number.isInteger(Number(x));
    }
}

function withinMinMax(x) {
    return (x >= MIN && x <= MAX);
}

// verify the four key input fields are integer, in range, and in order
function verify(cmin, cmax, rmin, rmax) {
    // maintain success status
    let errorLog = {count: 0};
    // using chained "if" to show all errors, not just the first one
    // verify valid integer input first
    if (verifyInt(cmin, cmax, rmin, rmax, errorLog)) {
        // if they are integers, continue checking for errors
        // verify numbers are in range
        if (verifyRange(cmin, cmax, rmin, rmax, errorLog)) {
            return true;
        }
    } 
    // must've been errors
    return false;
}

function verifyRange(cmin, cmax, rmin, rmax, e) {
    // assert MIN < x < MAX
    if (!withinMinMax(cmin)) {
        console.log("colMin is not valid");
        appendError("Minimum column value must be between " + MIN + " and " + MAX);
        e.count++;
    } if (!withinMinMax(cmax)) {
        console.log("colMax is not valid");
        appendError("Maximum column value must be between " + MIN + " and " + MAX);
        e.count++;
    } if (!withinMinMax(rmin)) {
        console.log("rowMin is not valid");
        appendError("Minimum row value must be between " + MIN + " and " + MAX);
        e.count++;
    } if (!withinMinMax(rmax)) {
        console.log("rowMax is not valid");
        appendError("Maximum row value must be between " + MIN + " and " + MAX);
        e.count++;
    }
    // assert lower bounds are less than or equal to upper bounds
    if (!(cmin <= cmax)) {
        console.log("cmin not lte cmax");
        appendError("Column minimum value must be less than or equal to column maximum value");
        e.count++;
    } if (!(rmin <= rmax)) {
        console.log("rmin not lte rmax");
        appendError("Row minimum value must be less than or equal to row maximum value");
        e.count++;
    }
    // return a status
    if (e.count != 0) {
        // nonzero errors
        return false;
    } else {
        // no errors so far
        return true;
    }
}

function verifyInt(cmin, cmax, rmin, rmax, e) {
    if (!isInt(cmin)) {
        console.log("colMin is not valid");
        appendError("Please enter a valid minimum column value, it should be an integer between " + MIN + " and " + MAX + " (inclusive)");
        e.count++;
    } if (!isInt(cmax)) {
        console.log("colMax is not valid");
        appendError("Please enter a valid maximum column value, it should be an integer between " + MIN + " and " + MAX + " (inclusive)");
        e.count++;
    } if (!isInt(rmin)) {
        console.log("rowMin is not valid");
        appendError("Please enter a valid minimum row value, it should be an integer between " + MIN + " and " + MAX + " (inclusive)");
        e.count++;
    } if (!isInt(rmax)) {
        console.log("rowMax is not valid");
        appendError("Please enter a valid maximum row value, it should be an integer between " + MIN + " and " + MAX + " (inclusive)");
        e.count++;
    }
    // return a status
    if (e.count != 0) {
        // nonzero errors
        return false;
    } else {
        // no errors so far
        return true;
    }
}

// allow for easier error message generation, append given message to ongoing log
function appendError(msg) {
    if (!hasErrors) {
        // first error of current generation
        // header
        errors.innerHTML += "<h4 style=\"font-weight: bold;\">ERRORS:</h4>";
        errors.innerHTML += "<p>" + msg + "</p>";
        errors.style.borderStyle = "solid";
        hasErrors = true;
    } else {
        // not first error
        errors.innerHTML += "<p>" + msg + "</p>";
    }
}