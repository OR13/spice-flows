
import jsdom from 'jsdom'

import * as d3 from "d3";

const { JSDOM } = jsdom;


const layout = (parsed, width, height) => {
  let graph = { nodes:[], links: [] }
  const spacer = width / parsed.points.length

  for (const p of parsed.points){
    graph.nodes.push({
      ...p,
      // position nodes diagonally
      x: (graph.nodes.length + 1) * spacer,
      y: (graph.nodes.length + 1) * spacer,
    })
  }
  for (const p of parsed.paths){
    if (p.path.length > 1){
      for (let i = 0; i<p.path.length-1; i++){
        let j = i+1;
        let start = p.path[i]
        let end = p.path[j]
        let {path, ...rest} = p
        graph.links.push({
          ...rest,
          source: start,
          target: end,
          distance: spacer,
        })
      }
    } else {
      // handle self edge later.
    }
  }
  
  return new Promise((resolve) => {
    const sim = d3.forceSimulation(graph.nodes)
      .force("center", d3.forceCenter(width/2, height/2))
      .force("link", d3.forceLink(graph.links).id((d) => d.id).strength(1).distance((d) => d.distance).iterations(1))
    sim.on('end', () => {
      resolve(graph)
    })
  
  })
}

const append = (svg, graph) => {

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function (d) { return Math.sqrt(d.value); })
    .attr("stroke", "#000")
    .attr("x1", function (d) { return d.source.x; })
    .attr("y1", function (d) { return d.source.y; })
    .attr("x2", function (d) { return d.target.x; })
    .attr("y2", function (d) { return d.target.y; });

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g")

  node.append("circle")
    .attr("r", 10)
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; })
    .attr("fill", "#fff")
    .attr("stroke", "#000")
  

  node.append("text")
    .attr("dx", function (d) { return d.x + 15; })
    .attr("dy", function (d) { return d.y + 5})
    .attr("style", "font-family:monospace; font-size:12px;")
    .text(function(d) { return d.title });

  
}



export const draw = async (parsed) => {
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
  let body = d3.select(dom.window.document.querySelector("body"))
  const height = 500
  const width = 500

  let svg = body.append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr("viewBox", [-10, -10, width, height])
    .attr("style", "max-width: 100%; height: auto;")
    .attr('xmlns', 'http://www.w3.org/2000/svg');

  let graph = await layout(parsed, width, height)
  // console.log(JSON.stringify(graph, null, 2))
  append(svg, graph)

  return body.html()

}

