export {chart, approximateLinear};


const drawLine = (context, x1, y1, x2, y2, strokeStyle) => {
    context.lineWidth = 3;
    context.strokeStyle = strokeStyle;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
};

const drawDot = (context, x, y, fillStyle) => {
    context.beginPath(x, y);
    const radius = 6; // Arc radius
    const startAngle = 1.2*Math.PI; // Starting point on circle
    const endAngle = 1.8*Math.PI 
    context.arc(x, y, radius, startAngle, endAngle);
    context.fillStyle = fillStyle;
    context.fill();
};

const writeText = (context, text, x, y, c="#ffffff", font="16px sans") => {
    context.font = font;
    context.fillStyle = c;
    context.fillText(text, x, y);
};

const clear = function(context, xMax, yMax, fillStyle) {
    context.fillStyle = fillStyle;
    context.fillRect(0, 0, xMax, yMax);
};


const getBaseAndRange = (values) => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    return [min, max-min];
};

// todo handle divide by zero
const getRelativeValue = (base, range, absolute) => {
    // for numbers that go from 1 to 1K 20 needs to be shown at the bottom of the chart
    return (absolute - base) / range;

};

let chart = ({
    xValues,
    yValues,
    getLabelX = String,
    getLabelY = String,
    frequencyXLabel=4,
    canvas,
    context,
    colorScheme = {
        bg: "#000000",
        graph: `#0906ee`,
        dot: "#18c62c",
        labelX: "#ffffff",
        labelY: "#ffffaf",
    },
    animate = false,
}) => {
    if (!context) { 
        context = canvas.getContext("2d");
    }
    if (!canvas) {
        canvas = context.canvas;
    }

    const xMax=canvas.width;
    const yMax=canvas.height;
    // clear(context, xMax, yMax, colorScheme.bg);
    const margin = 0.1;
    const contentSpace = 1 - (2 * margin);
    const previous = [undefined, undefined];
    const [xBase, xRange] = getBaseAndRange(xValues);
    const [yBase, yRange] = getBaseAndRange(yValues);

    for (let i = 4; i >= 0 ; i-=1) {
        writeText(context, getLabelY(yBase + yRange * (i/4)), 1, yMax -((margin * yMax) + (i/4)* yMax * contentSpace), colorScheme.labelY);
    }
    let i = 0;
    const drawNext = (x) => {
        const y = yValues[i];
        const xOnTheGraph = (margin * xMax) + getRelativeValue(xBase, xRange, x) * xMax * contentSpace;
        const yOnTheGraph = yMax - ((margin * yMax) + getRelativeValue(yBase, yRange, y) * yMax * contentSpace);

        drawDot(context, xOnTheGraph, yOnTheGraph, colorScheme.dot);
      
        if (previous[0] !== undefined) {
            drawLine(context, ...previous, xOnTheGraph, yOnTheGraph, colorScheme.graph);
        }
        if (i%frequencyXLabel === 0) {            
            writeText(context, getLabelX(x), xOnTheGraph, yMax-margin, colorScheme.labelX);
        }
        previous[0] = xOnTheGraph;
        previous[1] = yOnTheGraph;
        i += 1;
    };
    if (!animate) {
        xValues.forEach(drawNext);
        return context;
    }
    const animatedDrawNext = (x) => {
        if (i === xValues.length) {
            return;
        }
        drawNext(x);
        requestAnimationFrame(()=> {
            animatedDrawNext(xValues[i]);
        });
    };
    animatedDrawNext(xValues[i]);
    return context;
};

const closestIndex = (array, exactIndex) => {
    Math.round(exactIndex)
};

const approximateLinear = (context, xValues, yValues) => {
    let totala=0;
    let totalb=0;
    const dataPoints = yValues.length;

    yValues.forEach((y, i) => {
        if (i < (dataPoints/2)) {
            totala += y;
        } else {
            totalb += y;
        }
    });
    let averageA = totala / (dataPoints/2)
    let averageB = totalb / (dataPoints/2)
    let variationY = averageB - averageA;
    let variationX = xValues[Math.round(xValues.length*3/4)] - xValues[Math.round(xValues.length*1/4)]
    let multiplier = variationY / variationX;
    let base = averageA;
    const x1 = xValues[0];
    const y1 = yValues[0]//base + multiplier * xValues[0];
    
    const x2 = xValues[xValues.length-1];
    const y2 = -0.00+yValues[yValues.length-1];//base + multiplier * xValues[xValues.length-1] 
    console.log(y2);
    chart({
        xValues:[
            x1,
            xValues[Math.round(xValues.length*1/4)],
            xValues[Math.round(xValues.length*3/4)],
            x2,
        ],
        yValues: [
            y1,
            averageA,
            averageB,
            y2,
        ],
        context,
    });
};