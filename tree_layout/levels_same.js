import * as d3 from "https://cdn.skypack.dev/d3@7";
import data_same_level from './data/same_level.json' assert { type: 'json' };
import data_same_leaf from './data/same_leaf.json' assert { type: 'json' };

function draw(tree, parent, pcx, pcy, P){

    const gxs = 50
    const gys = 100
    const g = parent.append("g")
    .attr("transform",`translate(${tree.tx * gxs}, ${tree.ty * gys})`)

    const r = 20
    const circ = g.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", r)
    .attr("stroke", "red")
    .attr("fill", "rgba(0,0,0,0)")

    let cx = 0
    let cy = 0

    // draw the link
    if(pcx !== null){
      
      cx = pcx + tree.tx * gxs
      cy = pcy + tree.ty * gys

      P.append("path").attr("d", `M${pcx},${pcy+r} C${pcx} ${pcy + 50}, ${cx} ${cy-50}, ${cx} ${cy-r}`)
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", 1)

    }

    let i = 0;
    for(i = 0; i<tree.children.length; i++){
        draw(tree.children[i], g, cx, cy, P)
    }
}


function draw_same_level(){
    const SVG = d3.select("#same-level").append("g").attr("transform",`translate(${250}, ${20}) scale(0.9)`)
    const P = SVG.append("g").attr("id", "Path")
    draw(data_same_level, SVG, null, null, P)
}


function draw_same_leaf(){
    const SVG = d3.select("#same-leaf").append("g").attr("transform",`translate(${250}, ${20})scale(0.9)`)
    const P = SVG.append("g").attr("id", "Path")
    draw(data_same_leaf, SVG, null, null, P)
}

draw_same_leaf()
draw_same_level()


function draw_small_tree(svg, tx, ty, Y2){
    
    const g = svg.append("g").attr("transform", `translate(${tx}, ${ty})`)
    const C = 5
    const W1 = 20 * C
    const H1 = 30 * C
    const W2 = 30 * C
    const H2 = 20 * C
    const W3 = 20 * C
    const H3 = 30 * C
    const T1 = -(W2/2 + 10 + W1)
    const T3 = W2/2 + 10
    g.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 20)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 1)

    g.append("rect")
    .attr("x", 0).attr("y", 0)
    .attr("width", W1).attr("height", H1)
    .attr("transform", `translate(${T1},50)`)
    .attr("fill", "rgb(0,0,0,0)")
    .attr("stroke", "black")

    g.append("rect")
    .attr("x", 0).attr("y", 0)
    .attr("width", W2).attr("height", H2)
    .attr("transform", `translate(${-W2/2},${Y2})`)
    .attr("fill", "rgb(0,0,0,0)")
    .attr("stroke", "black")

    g.append("rect")
    .attr("x", 0).attr("y", 0)
    .attr("width", W3).attr("height", H3)
    .attr("transform", `translate(${T3},50)`)
    .attr("fill", "rgb(0,0,0,0)")
    .attr("stroke", "black")

    g.append("path").attr("d",`M${0},${20} C${0} ${30}, ${T1 + W1/2} ${20}, ${T1 + W1/2} ${50}`)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 1)

    g.append("path").attr("d",`M${0},${20} C${0} ${30}, ${0} ${20}, ${0} ${Y2}`)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 1)

    g.append("path").attr("d",`M${0},${20} C${0} ${30}, ${T3 + W3/2} ${20}, ${T3 + W3/2} ${50}`)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 1)
}

const small_tree_svg = d3.select("#small-tree-svg")
draw_small_tree(small_tree_svg, 200, 20, 100)
draw_small_tree(small_tree_svg, 700, 20, 50)