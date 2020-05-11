import * as d from "../node_modules/dom99/source/dom99.js";
import { Chart } from "../node_modules/frappe-charts/dist/frappe-charts.min.esm.js";
import { validateInput } from "./validateInput.js";
import { initialData } from "./settings/data.js";


const calculate = function (event) {
    // prevent form submit
    if (event) {
        event.preventDefault();
    }
    const start = Number(d.variables.start);
    const stop = Number(d.variables.stop);
    const step = Number(d.variables.step);
    const equationString = d.variables.equation;

    const errorMessage = validateInput(start, stop, step, equationString);
    d.feed(`errorHelp`, errorMessage);
    if (errorMessage) {
        return;
    }
    let resolveEquation;
    try {
        resolveEquation = new Function(`x`, `before`, `return ${equationString};`);
    } catch (error) {
        // most likely a syntax error
        d.feed(`errorHelp`, String(error));
        return;
    }



    const [results, xLabels] = getResultsAndLabels(start, stop, step, resolveEquation);
    // results are f(x)
    // and xLabels are x
    // the y axis adjusts automatically
    updateChart(xLabels, results);
};



const getResultsAndLabels = function (start, stop, step, resolveEquation) {
    const results = [];
    const xLabels = [];

    let currentValue = start;
    let previousValue = start;
    let i = 0; // use a multiplier for enhanced precision
    // todo stop using floats for even better precision

    while (currentValue < stop) {
        const result = resolveEquation(currentValue, previousValue);
        if (Number.isFinite(result)) {
            results.push(result);
        } else {
            results.push(1);
        }

        xLabels.push(String(currentValue));
        i += 1;
        previousValue = result;
        currentValue = start + (i * step);
    }

    // results are f(x)
    // and xLabels are x
    // the y axis adjusts automatically
    return [results, xLabels];
};

const updateChart = function (labels, results) {
    /* updates the chart where labels is an array with labels (String) that are displayed
    along the x axis,
    and results is an array of Number with the same length and in the same order.
    These are represented as points in the chart type line
    */
    chart.update({
        labels,
        datasets: [
            {
                title: `Graph`,
                values: results,
            },
        ],

    });
};




// here executes before dom99 went through
// here you cannot use d.elements

d.functions.calculate = calculate;
d.start({
    startElement: document.body,
    initialFeed: {
        step: `1`,
        start: `0`,
        stop: `20`,
        equation: `x ** 2`,
    },
});

// executes after dom99 went through
// here you can use d.elements

d.elements.loadingHint.remove();

const chart = new Chart(d.elements.chart, {
    data: initialData,
    type: `line`, // or 'line', 'scatter', 'pie', 'percentage'
    height: 380,

    colors: [`#7cd6fd`],

    format_tooltip_x: label => {
        return `f(${label})= `;
    },
    format_tooltip_y: value => {
        return String(value);
    },
});

