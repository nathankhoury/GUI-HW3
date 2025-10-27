/*
File:           script.js
Class:          COMP 4610 GUI Programming I
Assignment:     HW3, "Creating an Interactive Dynamic Table"
Name:           Nathan Khoury
Created:        10/22/2025
Last Modified:  10/27/2025

All dynamic interactivity on the page is handled here. Constant MIN/MAX bounds
are defined and constant document references are also defined. All code begins
execution when the "Generate" button is clicked by the user, which calls the "generate()"
function which serves at the main program driver. If the user has already generated
a table, it is not deleted until the new table specifications are verified as to not
trample the user's table without anything to replace it with. After using helper functions
to verify valid input parameters, genTable() is called which serves as the actual
implementation of generating the table.
*/

/* global variables */
// const globals
const MIN = -50;
const MAX = 50;
const COL_COLOR = "#bbf";
const ROW_COLOR = "#fbb";


// document references
const errors = document.getElementById("errors");
const table = document.getElementById("result");

// misc variables
let hasErrors = false;

/* main table generation driver, called from "Generate" button */
function generate() {
    // reset error log for new process
    errors.innerHTML = "";
    errors.style.borderStyle = "none";
    hasErrors = false;

    // get user inputs from form
    let colMin = document.getElementById("colMin").value;
    let colMax = document.getElementById("colMax").value;
    let rowMin = document.getElementById("rowMin").value;
    let rowMax = document.getElementById("rowMax").value;

    // debug message to terminal
    console.log("got inputs: " + colMin + ", " + colMax + ", " + rowMin + ", " + rowMax);

    // verify numeric input
    const verificationStatus = verify(colMin, colMax, rowMin, rowMax);
    console.log("input verified: " + verificationStatus);

    if (verificationStatus) {
        // cast to integers for remaining processes
        colMin = Number(colMin);
        colMax = Number(colMax);
        rowMin = Number(rowMin);
        rowMax = Number(rowMax);

        // generate table
        genTable(colMin, colMax, rowMin, rowMax);
    }
}

/* generate the table post-validation */
function genTable(cmin, cmax, rmin, rmax) {
    // https://www.w3schools.com/jsref/met_table_insertrow.asp
    // clear table if any
    table.innerHTML = "";

    // get ranges
    const xRange = cmax - cmin;
    const yRange = rmax - rmin;

    // fill in table
    for (let i = 0; i < yRange + 1; i++) {
        // insert a new ith row
        let row = table.insertRow(i);
        for (let j = 0; j < xRange + 1; j++) {
            // insert a new jth cell
            let cell = row.insertCell(j);
            cell.innerHTML = String((j + cmin)*(i + rmin));
            if ((j + 1) % 2 == 0) {
                // give every other col a darker background for contrast
                cell.style.backgroundColor = COL_COLOR;
            }
        }
        if ((i + 1) % 2 == 0) {
            // give every other row a darker background for contrast
            row.style.backgroundColor = ROW_COLOR;
        }
    
        // manually insert the row label
        let cell = row.insertCell(0);
        cell.innerHTML = i + rmin;
        cell.style.backgroundColor = "black";
        cell.style.color = "white";
    }

    // add the table header at the end
    let header = table.insertRow(0);
    let corner = header.insertCell(0);

    // do not have any content in the corner cell, for aesthetics
    corner.innerHTML = "";
    corner.style.borderStyle = "none";

    // add the column headers
    for (let j = 0; j < xRange + 1; j++) {
        let cell = header.insertCell(j + 1);
        cell.innerHTML =  j + cmin;
        cell.style.backgroundColor = "black";
        cell.style.color = "white";
    }
}

/* return true if x is integer, false otherwise (empty string) */
function isInt(x) {
    if (x === "") {
        return false
    } else {
        return Number.isInteger(Number(x));
    }
}

/* is MIN <= x <= MAX true */
function withinMinMax(x) {
    return (x >= MIN && x <= MAX);
}

/* verify the four key input fields are integer, in range, and in order */
function verify(cmin, cmax, rmin, rmax) {
    // maintain success status, use object to "pass by reference"
    let errorLog = {count: 0};

    // using chained "if" to show all errors, not just the first one
    // verify valid integer input first
    if (verifyInt(cmin, cmax, rmin, rmax, errorLog)) {
        // if they are integers, continue checking for errors
        // cast to numbers first
        cmin = Number(cmin);
        cmax = Number(cmax);
        rmin = Number(rmin);
        rmax = Number(rmax);

        // verify numbers are in range
        if (verifyRange(cmin, cmax, rmin, rmax, errorLog)) {
            return true;
        }
    } 
    // must've been errors
    return false;
}

/* assure that all inputs are in the range MIN <= x <= MAX, and that lower bounds of table are <= upper bounds */
function verifyRange(cmin, cmax, rmin, rmax, e) {
    // assert MIN <= x <= MAX
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
        console.log(cmin +" not lte " + cmax);
        appendError("Column minimum value must be less than or equal to column maximum value");
        e.count++;
    } if (!(rmin <= rmax)) {
        console.log(rmin +" not lte " + rmax);
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

/* check if all form inputs were integer values */
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

/* allow for easier error message generation, append given message to ongoing log */
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
