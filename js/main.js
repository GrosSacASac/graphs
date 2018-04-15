/*
todo validate user input
*/
import d from "../node_modules/dom99/built/dom99Module.js";
import Chart from "../node_modules/frappe-charts/dist/frappe-charts.min.esm.js";
import {initialData} from "./settings/data.js";

window.d = d;
let chart;

const calculate = function () {
  const start = Number(d.variables.start);
  const stop = Number(d.variables.stop);
  const step = Number(d.variables.step);
  const equationString = d.variables.equation;

  const errorMessage = validateInput(start, stop, step, equationString);
  d.feed(`errorHelp`, errorMessage);
  if (errorMessage) {
    return;
  }
  const resolveEquation = new Function("x", "before", `return ${equationString};`);



  const [results, xLabels] = getResultsAndLabels(start, stop, step, resolveEquation)
  // results are f(x)
  // and xLabels are x
  // the y axis adjusts automatically
  updateChart(xLabels, results);
};

const validateInput  = function (start, stop, step, equationString) {

  if (!Number.isFinite(start)) {
    return `Start is not a finite number`;
  }
  if (!Number.isFinite(stop)) {
    return `Stop is not a finite number`;
  }
  if (!Number.isFinite(step)) {
    return `Step is not a finite number`;
  }
  if (step === 0) {
    return `Step must not be 0`;
  }
  if ((step > 0 && start > stop) || (step < 0 && start < stop)) {
    return `Step added to Start should bring us to Stop`;
  }
  if (start === stop) {
    return `Stop must be different than Start`;
  }
  if (Math.abs(step) >= (Math.abs(stop) - Math.abs(start))) {
    return `Step's absolute value must be smaller`;
  }
  if (equationString.length === 0) {
    return `Equation must not be empty`;
  }

  // todo validate equationString from a whitelist of acceptable operators

  // no problems
  return "";
};

const getResultsAndLabels = function (start, stop, step, resolveEquation) {
  const results = [];
  const xLabels = [];

  let currentValue = start;
  let previousValue = start;
  let i = 0; // use a multiplier for enhanced precision
  // todo stop using floats for even better precision

  while (currentValue < stop) {
    const result = resolveEquation(currentValue, previousValue)
    results.push(result);
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

const updateChart = function (xLabels, results) {
  /* updates the chart where xLabels is an array with labels (String) that are displayed
  along the x axis,
  and results is an array of Number with the same length and in the same order.
  These are represented as points in the chart type line
  */
  chart.update_values(
    [
      {values: results},
    ],
    xLabels
  );
};




// here executes before dom99 went through
// here you cannot use d.elements

d.start(
    {
        calculate
    }, // functions
    {
        step: "1",
        start: "0",
        stop: "20",
        equation: "x ** 2"
    }, // initial feed
    document.body, // start Element
    function () {
        // function executes after dom99 went through
        // here you can use d.elements

        d.elements.loadingHint.remove();

        chart = new Chart({
            parent: d.elements.chart,
            data: initialData,
            type: "line", // or 'line', 'scatter', 'pie', 'percentage'
            height: 380,

            colors: ['#7cd6fd'],
            // hex-codes or these preset colors;
            // defaults (in order):
            // ['light-blue', 'blue', 'violet', 'red',
            // 'orange', 'yellow', 'green', 'light-green',
            // 'purple', 'magenta', 'grey', 'dark-grey']

            format_tooltip_x: d => `f(${d})= `,
            format_tooltip_y: d => String(d)
        });
});
