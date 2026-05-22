export { initialData };


const d = {
}

/* eslint-disable no-magic-numbers */
const initialData = {
    labels: Object.keys(d),

    datasets: [
        {
            title: `Graph`,
            values: Object.values(d),
        },
    ],
};

