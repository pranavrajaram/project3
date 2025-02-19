const svg = d3.select("#visualization");

const bodyParts = [
    { id: "head", type: "ellipse", cx: 100, cy: 60, rx: 30, ry: 37.5, staticColor: "rgb(210, 180, 140)" }, // Light dark brown
    
    { id: "trunk", type: "rect", x: 70, y: 105, width: 60, height: 120 },
    
    { id: "right arm", type: "path", d: "M145,105 Q175,135 145,195" },
    
    { id: "left arm", type: "path", d: "M55,105 Q25,135 55,195" },
    
    { id: "left leg", type: "path", d: "M85,225 Q100,300 85,345" },
    
    { id: "right leg", type: "path", d: "M115,225 Q130,300 115,345" },
    
    { id: "right-foot", type: "ellipse", cx: 85, cy: 360, rx: 15, ry: 7.5, staticColor: "rgb(210, 180, 140)" },
    
    { id: "left-foot", type: "ellipse", cx: 115, cy: 360, rx: 15, ry: 7.5, staticColor: "rgb(210, 180, 140)"}
];

const tooltip = d3.select("#tooltip");
const intervalValue = d3.select("#interval-value");
const slider = d3.select("#interval-slider");

d3.csv("impedance_means.csv").then(data => {
    const bioimpedanceData = {};
    const minValues = {};
    const maxValues = {};

    // Process data and determine min/max for each body part (except head)
    data.forEach(row => {
        const interval = +row['running interval'];
        bioimpedanceData[interval] = {};

        bodyParts.forEach(part => {
            if (!part.staticColor) { // Skip static-colored body parts (head)
                const value = +row[`impedance ${part.id} at 1000kHz [Ohm]`];
                bioimpedanceData[interval][part.id] = value;

                if (!minValues[part.id] || value < minValues[part.id]) {
                    minValues[part.id] = value;
                }
                if (!maxValues[part.id] || value > maxValues[part.id]) {
                    maxValues[part.id] = value;
                }
            }
        });
    });

    // Updated color mapping: High Impedance (Red) → Low Impedance (Blue)
    const getColor = (value, min, max) => {
        const normalized = (value - min) / (max - min);
    
        if (normalized >= 0.75) return "#FF4C4C";  // 🔴 High Impedance (Low Water Content)
        if (normalized >= 0.50) return "#FFCC4C";  // 🟡 Moderate Impedance (Moderate Water Loss)
        if (normalized >= 0.25) return "#87CEEB";  // 🌊 Light Sky Blue (Moderate Hydration)
        return "#00008B";                          // 🔵 Dark Blue (High Water Content)
    };
    

    // Append body parts
    bodyParts.forEach(part => {
        let element;

        if (part.type === "ellipse") {
            element = svg.append("ellipse")
                .attr("cx", part.cx)
                .attr("cy", part.cy)
                .attr("rx", part.rx)
                .attr("ry", part.ry);
        } else if (part.type === "rect") {
            element = svg.append("rect")
                .attr("x", part.x)
                .attr("y", part.y)
                .attr("width", part.width)
                .attr("height", part.height);
        } else if (part.type === "path") {
            element = svg.append("path")
                .attr("d", part.d)
                .attr("fill", "none"); // Removed stroke to eliminate outlines
        }

        // Apply static or dynamic colors
        if (element) {
            element
                .attr("id", part.id)
                .attr("class", "body-part")
                .attr("fill", part.staticColor ? part.staticColor : getColor(bioimpedanceData[0][part.id], minValues[part.id], maxValues[part.id]));


            if (!part.staticColor) {
                element
                    .on("mouseover", function(event) {
                        const value = bioimpedanceData[slider.node().value][part.id];
                        tooltip.style("display", "block")
                            .style("left", (event.pageX) + "px")
                            .style("top", (event.pageY - 30) + "px")
                            .text(`${part.id.replace('-', ' ')}: ${value} Ohm`);
                    })
                    .on("mouseout", function() { tooltip.style("display", "none"); });
            }
        }
    });

    // Function to update colors dynamically
    function updateColors(interval) {
        intervalValue.text(interval);
        svg.selectAll(".body-part")
            .transition()
            .duration(300)
            .attr("fill", function() {
                const id = d3.select(this).attr("id");
                return bioimpedanceData[interval][id] !== undefined
                    ? getColor(bioimpedanceData[interval][id], minValues[id], maxValues[id])
                    : d3.select(this).attr("fill"); // Keep static color for head
            });
    }

    slider.on("input", function() { updateColors(this.value); });
    updateColors(0);
});
