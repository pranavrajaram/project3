const bioimpedanceData = {
    0: { 'trunk': 400, 'right-arm': 380, 'left-arm': 390, 'right-leg': 410, 'left-leg': 420 },
    1: { 'trunk': 420, 'right-arm': 390, 'left-arm': 400, 'right-leg': 430, 'left-leg': 440 },
    2: { 'trunk': 440, 'right-arm': 410, 'left-arm': 420, 'right-leg': 450, 'left-leg': 460 },
    3: { 'trunk': 460, 'right-arm': 430, 'left-arm': 440, 'right-leg': 470, 'left-leg': 480 },
    4: { 'trunk': 480, 'right-arm': 450, 'left-arm': 460, 'right-leg': 490, 'left-leg': 500 },
    5: { 'trunk': 500, 'right-arm': 470, 'left-arm': 480, 'right-leg': 510, 'left-leg': 520 },
    6: { 'trunk': 520, 'right-arm': 490, 'left-arm': 500, 'right-leg': 530, 'left-leg': 540 },
    7: { 'trunk': 540, 'right-arm': 510, 'left-arm': 520, 'right-leg': 550, 'left-leg': 560 },
    8: { 'trunk': 560, 'right-arm': 530, 'left-arm': 540, 'right-leg': 570, 'left-leg': 580 }
};

const colors = value => {
    if (value <= 400) return "rgb(100, 180, 255)";
    if (value <= 450) return "rgb(180, 255, 180)";
    if (value <= 500) return "rgb(255, 180, 100)";
    return "rgb(255, 100, 100)";
};

const svg = d3.select("#visualization");
const bodyParts = [
    { id: "trunk", x: 80, y: 100, width: 40, height: 80 },
    { id: "right-arm", x: 130, y: 110, width: 20, height: 60 },
    { id: "left-arm", x: 50, y: 110, width: 20, height: 60 },
    { id: "right-leg", x: 100, y: 190, width: 20, height: 80 },
    { id: "left-leg", x: 80, y: 190, width: 20, height: 80 }
];

const tooltip = d3.select("#tooltip");
const intervalValue = d3.select("#interval-value");
const slider = d3.select("#interval-slider");

svg.selectAll(".body-part")
    .data(bodyParts)
    .enter().append("rect")
    .attr("class", "body-part")
    .attr("id", d => d.id)
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("width", d => d.width)
    .attr("height", d => d.height)
    .attr("fill", d => colors(bioimpedanceData[0][d.id]))
    .on("mouseover", function(event, d) {
        const value = bioimpedanceData[slider.node().value][d.id];
        tooltip.style("display", "block")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 30) + "px")
            .text(`${d.id.replace('-', ' ')}: ${value} Ohm`);
    })
    .on("mouseout", function() { tooltip.style("display", "none"); });

function updateColors(interval) {
    intervalValue.text(interval);
    svg.selectAll(".body-part")
        .transition()
        .duration(300)
        .attr("fill", d => colors(bioimpedanceData[interval][d.id]));
}

slider.on("input", function() { updateColors(this.value); });
updateColors(0);
