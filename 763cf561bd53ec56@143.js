// https://observablehq.com/d/763cf561bd53ec56@143
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Fan Chart

This variation of a line chart switches to an area chart to show projected uncertainty in the future. Data: [IHME](https://covid19.healthdata.org/)`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","yAxis","grid","area","data","line"], function(d3,width,height,xAxis,yAxis,grid,area,data,line)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("stroke-miterlimit", 1);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("g")
      .call(grid);

  svg.append("path")
      .attr("fill", "steelblue")
      .attr("fill-opacity", 0.2)
      .attr("d", area(data));

  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line(data.slice(0, 1)));

  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3,3")
      .attr("d", line(data.slice(1)));

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
    Object.assign(await d3.csv("https://gist.githubusercontent.com/Jefersonalves/faf4f6ec1cb39b37ccadc4394db5c994/raw/5fa48a3ed5a49555f943e8220dc2d9672b1be124/rt-sp.csv", d3.autoType), {y: "↑ Deaths per day"})
)});
  main.variable(observer("line")).define("line", ["d3","x","y"], function(d3,x,y){return(
d3.line()
    .x(d => x(d.date))
    .y(d => y(d.mean))
)});
  main.variable(observer("area")).define("area", ["d3","x","y"], function(d3,x,y){return(
d3.area()
    .x(d => x(d.date))
    .y0(d => y(d.lower))
    .y1(d => y(d.upper))
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .rangeRound([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLog()
    .domain([1, d3.max(data, d => d.upper)])
    .rangeRound([height - margin.bottom, margin.top])
    .clamp(true)
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","data"], function(margin,d3,y,data){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, ",d"))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y))
)});
  main.variable(observer("grid")).define("grid", ["x","margin","height","y","width"], function(x,margin,height,y,width){return(
g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)
    .call(g => g.append("g")
      .selectAll("line")
      .data(x.ticks())
      .join("line")
        .attr("x1", d => 0.5 + x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom))
    .call(g => g.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right))
)});
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 30, bottom: 30, left: 40}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
