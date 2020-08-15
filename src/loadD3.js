const d3 = require("d3");

module.exports = function loadD3(mobileWidth, chartContainer) {
  let height = mobileWidth ? 300 : 500;

  let bubbleWidth = mobileWidth
    ? chartContainer.offsetWidth
    : chartContainer.offsetWidth * 0.4;
  let barWidth = mobileWidth
    ? chartContainer.offsetWidth
    : chartContainer.offsetWidth * 0.6;

  fetch("https://personal-web-a99ce.firebaseio.com/technologies.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      /////////////////

      const originalOpacity = 0.4;
      const hoverOpacity = 0.8;

      const pack = (data) =>
        d3.pack().size([bubbleWidth, height]).padding(5)(
          d3.hierarchy({ children: data }).sum((d) => d.value)
        );

      const root = pack(data);

      const bubbleChart = d3
        .select("#BubbleChart")
        .append("svg")
        .attr("viewBox", [0, 0, bubbleWidth, height])
        .attr("width", bubbleWidth)
        .attr("height", height);

      const leaf = bubbleChart
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

      leaf
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("originalR", (d) => d.r)
        .attr("fill-opacity", originalOpacity)
        .attr("fill", (d) => d.data.color)
        .attr("id", (d, i) => `circle${i}`)
        .on("mouseover", function (d, i) {
          mouseOverSVG(d, i);
        })
        .on("mouseout", function (d, i) {
          mouseOutSVG(d, i);
        });

      leaf
        .append("image")
        .attr("href", (d) => d.data.img)
        .attr("x", (d) => -(d.r / 2))
        .attr("width", (d) => d.r)
        .on("mouseover", function (d, i) {
          mouseOverSVG(d, i);
        })
        .on("mouseout", function (d, i) {
          mouseOutSVG(d, i);
        });

      /////////////////

      const barChart = d3
        .select("#BarChart")
        .append("svg")
        .attr("viewBox", [0, 0, barWidth, height])
        .attr("width", barWidth)
        .attr("height", height);

      let margin;
      let xScale, yScale;
      let xAxis, yAxis;

      if (mobileWidth) {
        margin = { top: 20, right: 20, bottom: 75, left: 65 };
      } else {
        margin = { top: 50, right: 50, bottom: 25, left: 75 };
      }

      let innerWidth = barWidth - margin.left - margin.right;
      let innerHeight = height - margin.top - margin.bottom;

      if (mobileWidth) {
        yScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .range([innerHeight, 0]);

        xScale = d3
          .scaleBand()
          .domain(data.map((d) => d.name))
          .range([0, innerWidth])
          .padding(0.2);
      } else {
        xScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .range([0, innerWidth]);

        yScale = d3
          .scaleBand()
          .domain(data.map((d) => d.name))
          .range([0, innerHeight])
          .padding(0.2);
      }

      const mouseOverSVG = (d, i) => {
        let circle = d3.select(`#circle${i}`);
        let rect = d3.select(`#rect${i}`);

        circle
          .transition()
          .attr("r", circle.attr("originalR") + 3)
          .attr("fill-opacity", hoverOpacity);

        if (mobileWidth) {
          rect
            .transition()
            .attr("x", (d) => xScale(d.name) - 3)
            .attr("width", xScale.bandwidth() + 6)
            .attr("fill-opacity", hoverOpacity);
        } else {
          rect
            .transition()
            .attr("y", (d) => yScale(d.name) - 3)
            .attr("height", yScale.bandwidth() + 6)
            .attr("fill-opacity", hoverOpacity);
        }
      };

      const mouseOutSVG = (d, i) => {
        let circle = d3.select(`#circle${i}`);
        let rect = d3.select(`#rect${i}`);

        circle
          .transition()
          .attr("r", circle.attr("originalR"))
          .attr("fill-opacity", originalOpacity);

        if (mobileWidth) {
          rect
            .transition()
            .attr("x", (d) => xScale(d.name))
            .attr("width", xScale.bandwidth())
            .attr("fill-opacity", originalOpacity);
        } else {
          rect
            .transition()
            .attr("y", (d) => yScale(d.name))
            .attr("height", yScale.bandwidth())
            .attr("fill-opacity", originalOpacity);
        }
      };

      yAxis = d3.axisLeft(yScale);
      xAxis = d3.axisBottom(xScale);

      if (mobileWidth) {
        yAxis.tickFormat((d) => d + "%");
      } else {
        xAxis.tickFormat((d) => d + "%");
      }

      let g = barChart
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("color", "#fff");

      let yGroup = g
        .append("g")
        .call(yAxis)
        .style("font-size", 15)
        .attr("font-family", "Oxygen");

      let xGroup = g
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`)
        .style("font-size", 15)
        .attr("font-family", "Oxygen");

      if (mobileWidth) {
        xGroup
          .selectAll("text")
          .attr("transform", "rotate(90), translate(10, -15)")
          .style("text-anchor", "start");
      }

      if (mobileWidth) {
        g.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d) => xScale(d.name))
          .attr("y", (d) => yScale(d.value))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => innerHeight - yScale(d.value))
          .attr("fill", (d) => d.color)
          .attr("fill-opacity", originalOpacity)
          .attr("id", (d, i) => `rect${i}`)
          .on("mouseover", function (d, i) {
            mouseOverSVG(d, i);
          })
          .on("mouseout", function (d, i) {
            mouseOutSVG(d, i);
          });
      } else {
        g.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("y", (d) => yScale(d.name))
          .attr("height", yScale.bandwidth())
          .attr("width", (d) => xScale(d.value))
          .attr("fill", (d) => d.color)
          .attr("fill-opacity", originalOpacity)
          .attr("id", (d, i) => `rect${i}`)
          .on("mouseover", function (d, i) {
            mouseOverSVG(d, i);
          })
          .on("mouseout", function (d, i) {
            mouseOutSVG(d, i);
          });
      }
    });
};
