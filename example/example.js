import {chart, approximateLinear} from "../chart-sac.js";

const data = {
    "2024-02-23": 0.030303030303030304,
    "2024-04-19": 0.07407407407407407,
    "2024-06-14": 0.04929577464788732,
    "2024-07-05": 0.0380952380952381,
    "2024-08-02": 0.09124087591240876,
    "2024-09-27": 0.0149812734082397,
    "2024-11-15": 0.026607538802660754,
    "2025-01-24": 0.018867924528301886,
    "2025-02-14": 0.023166023166023165,
    "2025-04-11": 0.02631578947368421,
    "2025-06-13": 0.02287581699346405,
    "2025-08-01": 0.007722007722007722,
    "2025-09-26": 0.0330188679245283,
    "2025-11-21": 0.0215311004784689,
    "2026-01-23": 0.04868913857677903,
    "2026-03-06": 0.03180212014134275,
    "2026-04-24": 0.04560260586319218,
};
const x = [];
const y = []; 
Object.entries(data).map(([dateString, value]) => {
    y.push(value);
    const asDate = new Date(dateString);
    x.push(asDate.getTime())
});

const getLabelY = (yValue) => {
    return String((yValue).toFixed(3));
};

const getLabelX = (xValue) => {
    const label = new Date(xValue);            
    return String(label.getFullYear());
};

const frequencyXLabel = 9;

const canvas = document.getElementById("c");
const {width, height} = document.body.getBoundingClientRect();
canvas.width = width;
canvas.height = height;

const context = chart({
    canvas,
    xValues: x,
    yValues: y,
    getLabelX, getLabelY, frequencyXLabel,
    animate: true,
});

// approximateLinear(context, x, y) //todo use same scaling (yvalues) as chart