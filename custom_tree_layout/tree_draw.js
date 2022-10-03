import * as d3 from "https://cdn.skypack.dev/d3@7";
import sample_tree from './sample_tree.json' assert { type: 'json' };
import {createTree} from "./prepare_tree.js";


const SVG = d3.select("svg").append("g").attr("id", "tree_area").attr("transform",`translate(${600}, ${0})`)
const EditInput = document.querySelector("#edit-input")

const RangeX = document.querySelector("#range-x")
const RangeY = document.querySelector("#range-y")
let CurrentRangeX = 1
let CurrentRangeY = 1

RangeX.addEventListener("input", ev => {
  let v = parseInt(RangeX.value)
  CurrentRangeX = 1 + v / 30
  SVG.attr("transform",`translate(${600}, ${100}) scale(${CurrentRangeX}, ${CurrentRangeY})`)
})

RangeY.addEventListener("input", ev => {
  let v = parseInt(RangeY.value)
  CurrentRangeY = 1 + v / 30
  SVG.attr("transform",`translate(${600}, ${100}) scale(${CurrentRangeX}, ${CurrentRangeY})`)
})

const DownloadButton = document.querySelector("#download-button")
DownloadButton.addEventListener("click", ev =>{
  const svg = document.querySelector("svg")
  svg.style.background = "white"
  const data = (new XMLSerializer()).serializeToString(svg);
  const svgBlob = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8'
  });
  // convert the blob object to a dedicated URL
  const url = URL.createObjectURL(svgBlob);

  // load the SVG blob to a flesh image object
  const img = new Image();
  img.addEventListener('load', () => {
    // (Next step: Image to Canvas)
    const bbox = svg.getBBox();

    const canvas = document.createElement('canvas');
    canvas.width = bbox.width;
    canvas.height = bbox.height;
    console.log(bbox.width)
    console.log(bbox.height)
  
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, bbox.width, bbox.height);
  
    URL.revokeObjectURL(url);
  
    // trigger a synthetic download operation with a temporary link
    const a = document.createElement('a');
    a.download = 'image.jpeg';
    document.body.appendChild(a);
    a.href = canvas.toDataURL('image/jpeg', 1)
    a.click();
    a.remove();
  });
  img.src = url;
})

class Button {
  constructor(){
    this.node =null
    this.dom_node = document.querySelector("#edit-button")
    this.dom_node.addEventListener("click", ev => this.edit(ev))
    this.parent = null
    this.index = 0
    this.isroot = false
  }
  set_node(node, parent, index, isroot){
    this.node = node
    this.parent = parent
    this.index = index
    this.isroot = isroot
  }

  edit(ev){
    const value = EditInput.value
    const txt = value.split(",").map(t => t.trim())
    this.node._txt = txt
    this.node.render(this.parent, this.index, this.isroot, true, EditInput, EditButton)
    this.set_node(null, null, 0, false)
    EditInput.value = ""
  }
}

const EditButton = new Button()


function uploadhandler(){
  const root = createTree(sample_tree)
  root.render(SVG.node(), 1, true, false, EditInput, EditButton)
}

uploadhandler()

