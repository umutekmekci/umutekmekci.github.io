/*
given json
add tx, ty, W, H

{
    txt: ["", ""]
    children:
    [
        {
            txt:[""]
        }
        {
            txt:["","",""]
            {
                txt:[""]
            }
        }
    ]
}
*/

import * as d3 from "https://cdn.skypack.dev/d3@7";
const DefaultW = 60
const DefaultH = 50


class Node {
    constructor(){
        this._W = 0
        this._H = 0
        this._tx = 0
        this._ty = 0
        this._txt = [""]
        this._children = []
    }
    
    
    width(W) {
        this._W = W
        return this
    }
    
    height(H) {
        this._H = H
        return this
    }
    tx(v) {
        this._tx = v
        return this
    }
    
    ty(v) {
        this._ty = v
        return this
    }
    
    txt(v){
        this._txt = v
        return this
    }
    
    children(c) {
        this._children = c
        return this
    }
    append(c){
        this._children.push(c)
        return this
    }
    
    render(parent, index, isroot, render_text = false, EditInput = null, EditButton = null){
        const self = this
        let g_sel = null
        
        const g_list = parent.querySelectorAll(":scope > g")
    
        if(index > g_list.length){
            g_sel =  d3.select(parent).append("g").attr("transform",`translate(${self._tx}, ${self._ty})`)
        } else {
            g_sel = d3.select(g_list[index-1]).attr("transform",`translate(${self._tx}, ${self._ty})`)
        }
    
        let drag = d3.drag()
        .on('drag', function(event, d){
            self._tx += event.dx
            self._ty += event.dy
            self.render(parent, index, isroot, render_text, EditInput, EditButton) 
        })
    
        g_sel.call(drag)
    
        if(g_sel.node().querySelector("text") === null){
    
        const txt = g_sel.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .html(self._txt[0])
        .attr("transform", "translate(0, 3)")
        .on("dblclick", function(ev){
            const value = self._txt.join(",")
            EditInput.value = value
            const width = Math.max(30, value.length)
            EditInput.style.width = width + "ch"
            EditButton.set_node(self, parent, index, isroot)
        })
        .on("contextmenu", function(ev){
            ev.preventDefault();
            const new_node = new Node()
            new_node.tx(50).ty(25).txt(["new title"])
            self._children.push(new_node)
            self.render(parent, index, isroot, render_text, EditInput, EditButton) 
        })
    
        if(self._txt.length > 1){
            for(let i = 1; i<self._txt.length; i++){
            txt.append("tspan")
            .attr("x", 0)
            .attr("y", 15)
            .html(self._txt[i])
            }
        }
        }
    
        if(render_text){
        const txt = g_sel.select("text").html(self._txt[0])
        if(self._txt.length > 1){
            for(let i = 1; i<self._txt.length; i++){
            txt.append("tspan")
            .attr("x", 0)
            .attr("y", 15*i)
            .html(self._txt[i])
            }
        }
        }
    
        // draw the link
        if(!isroot){
        if(g_sel.node().querySelector("path") === null){
            g_sel.append("path")
            .attr("d", `M${0},${-20} C${0} ${-50}, ${-self._tx} ${-self._ty + 50}, ${-self._tx} ${-self._ty+20}`)
            .style("stroke", "black")
            .style("fill", "none")
            .style("stroke-width", 1)
        } else {
            g_sel.select("path")
            .attr("d", `M${0},${-20} C${0} ${-50}, ${-self._tx} ${-self._ty + 50}, ${-self._tx} ${-self._ty+20}`)
        }
        }
    
        for(let i=0; i<self._children.length; i++){
            self._children[i].render(g_sel.node(), i+1, false, false, EditInput, EditButton)
        }
    }
    
}
          
function find_width(txt){
    let L = 0
    for(const line of txt){
        L = Math.max(L, line.length)
    }
    return Math.max(8 * L, DefaultW)
}

function calc_tx(totalW, children){
    const middle = totalW / 2
    let s = 0
    for (let child of children){
        const x = s + child._W / 2
        child._tx = x - middle
        s = s + child._W
    }
}

function createTree(data){
    const node = new Node()
    node.txt(data.txt)
    node.width(find_width(data.txt)).height(data.txt.length * 50).ty(100)
    if(!("children" in data) || data.children.length == 0){
        return node
    }

    let total_width = 0
    for(let i = 0; i<data.children.length; i++){
        const child = createTree(data.children[i]) 
        node.append(child)
        total_width += child._W
    }

    calc_tx(total_width, node._children)

    return node
}

export {createTree}

