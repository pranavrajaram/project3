const svg = d3.select("#visualization");

const bodyParts = {
    trunk: { x: 130, y: 100, width: 40, height: 80 },
    "right-arm": { x: 180, y: 110, width: 20, height: 60 },
    "left-arm": { x: 80, y: 110, width: 20, height: 60 },
    "right-leg": { x: 150, y: 190, width: 20, height: 80 },
    "left-leg": { x: 130, y: 190, width: 20, height: 80 }
};

// Bioimpedance Data
const bioimpedanceData = {
    0: { "trunk": 400, "right-arm": 380, "left-arm": 390, "right-leg": 410, "left-leg": 420 },
    1: { "trunk": 420, "right-arm": 390, "left-arm": 400, "right-leg": 430, "left-leg": 440 },
    2: { "trunk": 440, "right-arm": 410, "left-arm": 420, "right-leg": 450, "left-leg": 460 },
    3: { "trunk": 460, "right-arm": 430, "left-arm": 440, "right-leg": 470, "left-leg": 480 },
    4: { "trunk": 480, "right-arm": 450, "left-arm": 460, "right-leg": 490, "left-leg": 500 },
    5: { "trunk": 500, "right-arm": 470, "left-arm": 480, "right-leg": 510, "left-leg": 520 },
    6: { "trunk": 520, "right-arm": 490, "left-arm": 500, "right-leg": 530, "left-leg": 540 },
    7: { "trunk": 540, "right-arm": 510, "left-arm": 520, "right-leg": 550, "left-leg": 560 },
    8: { "trunk": 560, "right-arm": 530, "left-arm": 540, "right-leg": 570, "left-leg": 580 }
};

// Color Scale (Low = Blue, High = Red)
const colorScale = d3.scaleLinear()
    .domain([350, 600]) // Adjust range to bioimpedance values
    .range(["blue", "red"]);

// Draw Body Parts
Object.entries(bodyParts).forEach(([id, { x, y, width, height }]) => {
    svg.append("rect")
        .attr("id", id)
        .attr("class", "body-part")
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", colorScale(bioimpedanceData[0][id]))
        .on("mouseover", function (event) {
            const value = bioimpedanceData[slider.value][id];
            tooltip.style("display", "block")
                   .style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 30) + "px")
                   .text(`${id.replace('-', ' ')}: ${value} Ohm`);
        })
        .on("mouseout", function () {
            tooltip.style("display", "none");
        });
});

// Update Function
function updateColors(interval) {
    d3.select("#interval-value").text(interval);
    Object.entries(bioimpedanceData[interval]).forEach(([id, value]) => {
        d3.select(`#${id}`).attr("fill", colorScale(value));
    });
}

// Tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "#fff")
    .style("padding", "5px 10px")
    .style("border-radius", "5px")
    .style("font-size", "14px")
    .style("display", "none");

// Slider Event Listener
const slider = document.getElementById("interval-slider");
slider.addEventListener("input", function () {
    updateColors(this.value);
});

// Initialize
updateColors(0);
