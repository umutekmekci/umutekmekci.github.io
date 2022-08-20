import * as d3 from "https://cdn.skypack.dev/d3@7";

const ST = performance.now()

const WW = window.innerWidth
const WH = window.innerHeight

const container = d3.select(".container").style("transform", `translate(${WW * 0.3}px,${WH*0.1}px)`)

const imwidth = Number.parseInt(d3.select("#thanos").style("width").slice(0,-2))
const imheight = Number.parseInt(d3.select("#thanos").style("height").slice(0,-2))

const canvas = d3.select("canvas").style("position", "absolute").style("top", "0px").style("left", "0px")
.style("width", imwidth + "px")
.style("height", imheight + "px")
const c = canvas.node()
c.width = imwidth
c.height = imheight

const ctx = c.getContext("2d");
const img = document.getElementById("thanos");
ctx.drawImage(img, 0, 0, imwidth, imheight);
const imgData = ctx.getImageData(0, 0, c.width, c.height);
// {data: Uint8ClampedArray(826000), width: 590, height: 350, colorSpace: 'srgb'}

function getPixel(i, j){
    const index = (i * imwidth + j) * 4
    const r = imgData.data[index]
    const g = imgData.data[index + 1]
    const b = imgData.data[index + 2]
    const a = imgData.data[index + 3]
    return [r,g,b,a]
}

function setblock(buffer, offset_i, offset_j, bsize){
    for(let ii = 0; ii<bsize; ii++){
        for(let jj = 0; jj<bsize; jj++){
            const [r,g,b,a] = getPixel(offset_i + ii, offset_j + jj)
            const index = (ii*bsize + jj) * 4
            buffer[index] = r
            buffer[index + 1] = g
            buffer[index + 2] = b
            buffer[index + 3] = a
        }
    }
}

class MiniCanvas {
    constructor(){
        this.x = 0
        this.y = 0
        this.data = null
        this.i = 0
        this.j = 0
        this.tx = 0
        this.ty = 0
    }
}

// divide buffer into minibuffers
const bsize = 4
const nrow = imheight / bsize
const ncol = imwidth / bsize
let canvas_list = []
for(let i = 0; i < nrow; i++){
    for(let j = 0; j < ncol; j++){
        const tx = 200 + 200*Math.random()
        const ty = -200 + 400*Math.random()
        let minicanvas = new MiniCanvas()
        let d = new Uint8ClampedArray(bsize * bsize * 4)
        setblock(d, i * bsize, j * bsize, bsize)
        //console.log(d)
        minicanvas.i = i
        minicanvas.j = j
        minicanvas.x = j * (bsize)
        minicanvas.y = i * (bsize)
        minicanvas.data = d
        minicanvas.tx = tx
        minicanvas.ty = ty
        canvas_list.push(minicanvas)
    }
}

const delayScale = d3.scaleLinear().range([1000, 5000]).domain([0, nrow * ncol])

container.selectAll(".minicanvas")
.data(canvas_list)
.join("canvas")
.attr("class", "minicanvas")
.attr("width", bsize)
.attr("height", bsize)
.style("width", bsize + "px")
.style("height", bsize + "px")
.style("position", "absolute")
.style("top", "0px")
.style("left", "0px")
//.style("filter", "blur(0px)")
.each(function(d){
    const delay = delayScale(d.i * ncol + d.j)
    const mc = d3.select(this)
    .style("transform",`translate(${d.x}px, ${d.y}px)`)
    .style("transition", `transform 10s ease-in ${delay}ms, opacity 10s ease-in ${delay}ms, width 10s ease-out ${delay}ms, height 10s ease-out ${delay}ms`)
    const ctx = mc.node().getContext("2d");
    ctx.putImageData(new ImageData(d.data, bsize, bsize), 0, 0)
})
d3.select("#thanos").style("opacity", "0")
canvas.style("opacity", "0")


const elapsed = performance.now() - ST
console.log(elapsed)

d3.select("button").on("click", function(){
    const ss = performance.now()
    container.selectAll(".minicanvas")
    .style("transform",d => `translate(${d.x + d.tx}px, ${d.y + d.ty}px)`)
    .style("opacity", 0)
    .style("width", "0px")
    .style("height", "0px")
    const elapsed = performance.now() - ss
    console.log(elapsed)
})