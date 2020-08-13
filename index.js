function drawSvg(dataset) {
  let colors = [
    "#002a7f",
    "#2d4790",
    "#4865a0",
    "#6185b0",
    "#7ba5bf",
    "#99c5cd",
    "#bde5da",
    "#ffffe0",
    "#ffd3bf",
    "#fea59c",
    "#ee7b7d",
    "#d65461",
    "#b63046",
    "#90102e",
    "#640018",
  ];
  console.log(colors);

  let minTemperature =
    dataset.baseTemperature +
    d3.min(dataset.monthlyVariance, (d) => d.variance);
  let maxTemperature =
    dataset.baseTemperature +
    d3.max(dataset.monthlyVariance, (d) => d.variance);
  console.log("Minimum Temperature: " + minTemperature);
  console.log("Maximum Temperature: " + maxTemperature);

  let width = 5 * Math.ceil(dataset.monthlyVariance.length / 12); //1315
  let height = 420; // Each month have 35px height
  let padding = 60;

  let years = dataset.monthlyVariance.map((d) => d.year);

  let month = dataset.monthlyVariance.map(function (d) {
    return (d.month -= 1);
  });

  console.log(month);
  let variance = dataset.monthlyVariance.map((d) => d.variance);
  console.log(years);
  console.log(variance);

  let xScale = d3
    .scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([0, width]);

  let yScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .rangeRound([height, 0]);

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  let yAxis = d3.axisLeft(yScale).tickFormat(function (month) {
    var date = new Date();
    date.setUTCMonth(month);
    return d3.timeFormat("%B")(date);
  });

  let tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + padding * 2)
    .attr("height", height + padding * 2);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(" + padding + "," + (height + padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + "," + padding + ")");

  svg
    .selectAll("rect")
    .attr("map", true)
    .data(dataset.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => dataset.baseTemperature + d.variance)
    .attr("x", function (d, i) {
      return xScale(d.year) + padding + 1;
    })
    .attr("y", function (d) {
      return yScale(d.month) + padding;
    })
    .attr("width", 5)
    .attr("height", 35)
    .attr("fill", function (d) {
      let temp = dataset.baseTemperature + d.variance;
      console.log("temp: ", temp);

      switch (true) {
        case temp < 2.4976:
          return colors[0];
          break;
        case temp <= 3.3112:
          return colors[1];
          break;
        case temp <= 4.1248:
          return colors[2];
          break;
        case temp <= 4.9384:
          return colors[3];
          break;
        case temp <= 5.752:
          return colors[4];
          break;
        case temp <= 6.5656:
          return colors[5];
          break;
        case temp <= 7.3792:
          return colors[6];
          break;
        case temp <= 8.1928:
          return colors[7];
          break;
        case temp <= 9.0064:
          return colors[8];
          break;
        case temp <= 9.82:
          return colors[9];
          break;
        case temp <= 10.6336:
          return colors[10];
          break;
        case temp <= 11.4472:
          return colors[11];
          break;
        case temp <= 12.2608:
          return colors[12];
          break;
        case temp <= 13.0744:
          return colors[13];
          break;
        case temp <= 13.888:
          return colors[14];
          break;
        default:
          return "";
      }
    })
    
    .on("mouseover", function (d, i) {
      var date = new Date(d.year, d.month)
      d3.select(this).attr("border", 1).attr("stroke", "black");
      tooltip.style("opacity", 1);
      tooltip.attr("data-year", d.year);
      tooltip.html(
          d3.timeFormat("%Y - %B")(date) +
          "<br/>" + 
          d3.format(".1f")(dataset.baseTemperature + d.variance) + " &#8451;" + 
          "<br/>" +
          d3.format(".1f")(d.variance)+ " &#8451;"
      );
      tooltip
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("border", "").attr("stroke", "")
      tooltip.style("opacity", 0);
    });

  var tempBreak = [
    2.4976,
    3.311,
    4.1248,
    4.9384,
    5.752,
    6.5656,
    7.3792,
    8.1928,
    9.0064,
    9.82,
    10.6336,
    11.4472,
    12.2608,
    13.0744,
    13.888,
  ];

  let legendXScale = d3
    .scaleLinear()
    .domain([minTemperature, maxTemperature])
    .range([0, tempBreak.length * 30]);

  let legendXAxis = d3
    .axisBottom(legendXScale)
    .tickValues(tempBreak)
    .tickFormat(d3.format(".1f"));

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", 650)
    .attr("height", 60);

  let legend = svg.append("g").attr("id", "legend");

  legend
    .selectAll("rect")
    .data(tempBreak)
    .enter()
    .append("rect")
    .attr("x", (d) => legendXScale(d))
    .attr("width", 30)
    .attr("height", 30)
    .attr("fill", (d, i) => colors[i])
    .attr("transform", "translate(150, 0)");

  legend.append("g").call(legendXAxis).attr("transform", "translate(180, 30)");
}

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
  function (error, data) {
    let dataset = data;
    drawSvg(dataset);
    console.log(data);
  }
);
