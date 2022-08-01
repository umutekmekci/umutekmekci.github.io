import * as d3 from "https://cdn.skypack.dev/d3@7";


class Figure{
    constructor() {
        this._xaxis = null
        this._yaxis = null
        this._legend =null
        this._x = 0
        this._y = 0
        this._width = 0
        this._height = 0
        self._grid = true
        this._id = ""
        this._dragable = false
        this._dimx = []
        this._dimy = []
        this._dimr = []
        this._dimc = []
        this._dimtt = []
    }

    width(w) {
        this._width = w
        return this
    }

    height(h){
        this._height = h
        return this
    }

    grid(g){
        this._grid = g
        return this
    }

    translate(x,y){
        this._x = x
        this._y = y
        return this
    }

    id(name){
        this._id = name
        return this
    }

    xaxis(o) {
        this._xaxis = o
        return this
    }

    yaxis(o){
        this._yaxis = o
        return this
    }

    legend(o){
        this._legend = o
        return this
    }

    dimx(d) {
        this._dimx = d
        return this
    }

    dimy(d) {
        this._dimy = d
        return this
    }

    dimr(d) {
        this._dimr = d
        return this
    }

    dimc(d) {
        this._dimc = d
        return this
    }

    dimtt(d){
        this._dimtt = d
        return this
    }

    draw(){
        let self = this
        let figure = d3.select("svg").selectAll(`#${self._id}`).data([self._id]).join("g").attr("id", self._id)
        figure.attr("transform", `translate(${self._x}, ${self._y})`)

        const padding = Math.max(self._yaxis._margin, self._xaxis._margin)
        const xaxis_length = self._width - 2*padding
        const yaxis_length = self._height - 2*padding
        let xtick = null
        let ytick = null
        if(self._grid){
            xtick = {
                length: yaxis_length,
                tx: padding,
                ty: padding,
            }
            ytick = {
                length: xaxis_length,
                tx: padding,
                ty:padding,
            }
        } else {
            xtick = {
                length: 6,
                tx: padding,
                ty: yaxis_length - 3,
            }
            ytick = {
                length: 6,
                tx: padding - 3,
                ty: padding,
            }
        }
        self._xaxis._length(xaxis_length)._translate(padding, padding + yaxis_length)._draw(figure, xtick)
        self._yaxis._length(yaxis_length)._translate(padding, padding)._draw(figure, ytick)
        self._legend._draw(figure)

        const scalerx = d3.scaleLinear().domain(d3.extent(self._dimx)).range([0, xaxis_length])
        const scalery = d3.scaleLinear().domain(d3.extent(self._dimy)).range([yaxis_length, 0])
        const scalerr = d3.scaleSqrt().range([2,15]).domain(d3.extent(self._dimr))
        self._draw_data(figure, scalerx, scalery, scalerr, padding)


        
        let dragx = d3.drag()
        .on('drag', function(event, d){
            const dx = event.dx
            self._width += dx
            self.draw()
        })


        let triangle = d3.symbol().type(d3.symbolTriangle).size(60)
        figure.selectAll(".scalex_button").data([null]).join("path").attr("class", "scalex_button")
        .attr("d", triangle)
        .attr("transform", `translate(${padding + xaxis_length + 15}, ${padding + yaxis_length/2}) rotate(90)`)
        .call(dragx)

        
        let dragy = d3.drag()
        .on('drag', function(event, d){
            const dy = event.dy
            self._height += dy
            self.draw()
        })

        figure.selectAll(".scaley_button").data([null]).join("path").attr("class", "scaley_button")
        .attr("d", triangle)
        .attr("transform", `translate(${padding + xaxis_length/2}, ${padding + yaxis_length + 70}) rotate(180)`)
        .call(dragy)

    }

    scalexy(xlabels, ylabels, dimx, dimy, dimz, dimz_scaler, dim_color, color_map, dx, dy, data_names){
        let self = this
        self.width += dx
        self.height += dy
        //console.log(self.width)
        self.draw(xlabels, ylabels, dimx, dimy, dimz, dimz_scaler, dim_color, color_map, data_names)

    }

    _draw_data(parent, scalerx, scalery, scalerr, padding) {
        let self = this
        let content = parent.selectAll(".content").data(["temp"]).join("g").attr("class", "content")
        content.attr("transform", `translate(${padding}, ${padding})`)
        if(self._dimc.length !== self._dimx.length){
            self._dimc = new Array(self._dimx.length).fill("red");
        }
        if(self._dimr.length !== self._dimx.length){
            self._dimr = new Array(self._dimx.length).fill(2);
        }
        if(self._dimtt.length !== self._dimx.length){
            self._dimtt = new Array(self._dimx.length).fill("");
        }
        let data = d3.zip(self._dimx, self._dimy, self._dimc, self._dimr, self._dimtt).map(function(d){
            return {
                dimx: d[0],
                dimy: d[1],
                dimc: d[2],
                dimr: d[3],
                dimtt: d[4],
            }
        })
        content.selectAll(".datapoint").data(data).join("circle").attr("class", "datapoint")
        .each(function(d,i){
            const x = scalerx(d.dimx)
            const y = scalery(d.dimy)
            d3.select(this)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", scalerr(d.dimr))
            .attr("fill", d.dimc)
            .attr("transform", `translate(${x}, ${y})`)
            .on("mouseenter", (ev, dd) => self.showtolltip(content, ev, dd, x, y))
            .on("mouseleave", self.hidetooltip)
        })
    }

    showtolltip(parent, event, d, x,y) {
        let tooltip = parent.selectAll(".tooltip").data(["temp"]).join("g").attr("class", "tooltip")
        tooltip.attr("transform", `translate(${x}, ${y})`)
        tooltip.selectAll("text").data(["temp"]).join("text").text(d.dimtt)
        tooltip.attr("opacity", "1")

    }

    hidetooltip(){
        d3.select(".tooltip").attr("opacity", 0)
    }

}

class Legend {
    constructor(){
        this._labels = null
        this._colors = null
        this._initx = 50
        this._inity = 50
    }

    labels(l){
        this._labels = l
        return this
    }

    colors(c){
        this._colors = c
        return this
    }

    _draw(parent){
        let self = this

        let drag = d3.drag()
        .on('drag', function(event, d){
            self._initx += event.dx
            self._inity += event.dy
            d3.select(this).attr("transform", `translate(${self._initx},${self._inity})`)    
        })

        
        let legend = parent.selectAll(".legend").data(["temp"]).join("g").attr("class", "legend")
        legend.attr("transform", `translate(${self._initx},${self._inity})`).call(drag)
        legend.selectAll(".legend_colors").data(self._colors).join("rect").attr("class", "legend_colors")
        .each(function(d, i){
            d3.select(this)
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "25")
            .attr("height", "10")
            .attr("fill", d)
            .attr("transform", `translate(10, ${i*15})`)
            .on("mouseenter", ev => self.fade(ev, parent, d, i))
            .on("mouseleave", ev => self.unfade(parent))
        })

        legend.selectAll(".legend_labels").data(self._labels).join("text").attr("class", "legend_labels")
        .each(function(d, i){
            d3.select(this)
            .attr("x", "0")
            .attr("y", "0")
            .text(d)
            .attr("transform", `translate(40, ${i*15 + 10})`)
        })
    }

    fade(ev, parent, selected_color, i){
        let self = this
        parent.select(".content").selectAll(".datapoint").classed("fade", el=>el.dimc != selected_color)
        parent.select(".legend").selectAll(".legend_colors").classed("fade_legend", c => c != self._colors[i])

    }

    unfade(parent){
        parent.select(".content").selectAll(".datapoint.fade").classed("fade", false)
        parent.select(".legend").selectAll(".legend_colors.fade_legend").classed("fade_legend", false)
    }
}

class XAxis {
    constructor() {
        this._header = ""
        this._range = null
        this._show_domain = true
        this.__length = 0
        this.__tx = 0
        this.__ty = 0
        this._margin = 0
        this._initx = 0
        this._inity = 0
    }

    header(h) {
        this._header = h
        return this
    }

    range(r) {
        this._range = r
        return this
    }

    show_domain(s) {
        this._show_domain = s
        return this
    }

    margin(m){
        this._margin = m
        return this
    }

    _length(l) {
        this.__length = l
        return this
    }

    _translate(tx, ty) {
        this.__tx = tx
        this.__ty = ty
        return this
    }

    _draw(parent, tick_ob){
        const self = this
        let axis = parent.selectAll(".x-axis").data(["temp"]).join("g").attr("class", "x-axis")

        // draw domain line
        axis.selectAll(".domain").data(["temp"]).join("line").attr("class", "domain")
        .attr("x1", 0)
        .attr("x2", self.__length)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("transform", `translate(${self.__tx}, ${self.__ty})`)
        if(!self._show_domain){
            axis.select(".domain").attr("opacity", 0)
        }

         //draw ticks line
        let space = self.__length / (self._range.length-1)
        axis.selectAll(".xtick").data(self._range).join("line").attr("class", "xtick")
        .each(function(d, i){
         d3.select(this)
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", tick_ob.length)
        .attr("stroke", "red")
        .attr("transform", `translate(${tick_ob.tx + i*space}, ${tick_ob.ty})`)
        })

        axis.selectAll(".xlabel").data(self._range).join("text").attr("class", "xlabel")
        .each(function(d, i){
            d3.select(this)
            .attr("x", 0)
            .attr("y", 0)
            .text(d)
            const textLength = d3.select(this).node().getComputedTextLength()
            d3.select(this)
            .attr("transform", `translate(${tick_ob.tx + i*space}, ${tick_ob.ty + tick_ob.length + 5}) rotate(90) translate(0, 5)`)  //center the text
        })


        let drag = d3.drag()
        .on('drag', function(event, d){
            self._initx += event.dx
            self._inity += event.dy
            d3.select(this)
            .attr("transform", `translate(${self._initx}, ${self._inity})`)
        })

        self._initx = tick_ob.tx + self.__length/2 - self._header.length*3
        self._inity = tick_ob.ty + tick_ob.length + 50
        parent.selectAll(".xheader").data([self._header]).join("text").attr("class", "xheader")
        .attr("x", 0)
        .attr("y", 0)
        .text(d => d)
        .attr("transform", `translate(${self._initx}, ${self._inity})`)
        .call(drag)
    }
}

class YAxis {
    constructor() {
        this._header = ""
        this._range = null
        this._show_domain = true
        this.__length = 0
        this.__tx = 0
        this.__ty = 0
        this._margin = 0
        this._initx = 0
        this._inity = 0
    }

    header(h) {
        this._header = h
        return this
    }

    range(r) {
        this._range = r
        return this
    }

    show_domain(s) {
        this._show_domain = s
        return this
    }

    margin(m){
        this._margin = m
        return this
    }

    _length(l) {
        this.__length = l
        return this
    }

    _translate(tx, ty) {
        this.__tx = tx
        this.__ty = ty
        return this
    }

    _draw(parent, tick_ob){
        const self = this
        let axis = parent.selectAll(".y-axis").data(["temp"]).join("g").attr("class", "y-axis")
        axis.selectAll(".domain").data(["temp"]).join("line").attr("class", "domain")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", self.__length)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("transform", `translate(${self.__tx}, ${self.__ty})`)
    
        if(!self._show_domain){
            axis.select(".domain").attr("opacity", 0)
        }
        
        //draw ticks line
        let space = self.__length / (self._range.length-1)
        axis.selectAll(".ytick").data(self._range).join("line").attr("class", "ytick")
        .each(function(d, i){
            d3.select(this)
            .attr("x1", 0)
            .attr("x2", tick_ob.length)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke", "red")
            .attr("transform", `translate(${tick_ob.tx}, ${tick_ob.ty + i*space})`)
        })

        let textLength = 0
        axis.selectAll(".ylabel").data(self._range).join("text").attr("class", "ylabel")
        .each(function(d, i){
            d3.select(this)
            .attr("x", 0)
            .attr("y", 0)
            .text(d)

            textLength = d3.select(this).node().getComputedTextLength()
            d3.select(this)
            .attr("transform", `translate(${tick_ob.tx - textLength - 5}, ${tick_ob.ty + i*space + 5})`)  //center the text
        })

        let drag = d3.drag()
        .on('drag', function(event, d){
            self._initx += event.dx
            self._inity += event.dy
            d3.select(this)
            .attr("transform", `translate(${self._initx}, ${self._inity}) rotate(90)`)
        })

        self._initx = tick_ob.tx - textLength - 35
        self._inity = tick_ob.ty + self.__length/2 - self._header.length*3
        parent.selectAll(".yheader").data([self._header]).join("text").attr("class", "yheader")
        .attr("x", 0)
        .attr("y", 0)
        .text(d=>d)
        .attr("transform", `translate(${self._initx}, ${self._inity}) rotate(90)`)
        .call(drag)
    }
}

d3.csv("../scatter_plot/data/un_data.csv", function(row) {
    if(row.HDI_2017 >0 && row.GDP_2017 >0) {
        return {
            name: row.Country,
            code: row.Code,
            continent: row.Continent,
            population: +row.Pop_2016,
            hdi: +row.HDI_2017,
            gdp: +row.GDP_2017
        }
    }
})
.then(function(dataset) {

    let [gdp_min, gdp_max] = d3.extent(dataset, d => d.gdp)
    let [hdi_min, hdi_max] = d3.extent(dataset, d => d.hdi)
    //let [pop_min, pop_max] = d3.extent(dataset, d => d.population)
    let xrange = d3.ticks(hdi_min, hdi_max, 20)
    let yrange = d3.ticks(gdp_max, gdp_min, 20)

    let xaxis = new XAxis()
    xaxis
    .header("Human Development Index(HDI)")
    .range(xrange)
    .show_domain(false)
    .margin(20)

    let yaxis = new YAxis()
    yaxis
    .header("Annual GDP per capita(USD)")
    .range(yrange)
    .show_domain(true)
    .margin(20)


    let continent = dataset.map(d => d.continent)
    let legend_labels = [...new Set(continent)];
    const color_map = d3.scaleOrdinal(d3.schemeDark2);
    let legend_colors = legend_labels.map(c => color_map(c))

    let legend = new Legend()
    .labels(legend_labels)
    .colors(legend_colors)

    let figure = new Figure()
    figure
    .id("hdi")
    .width(400)
    .height(400)
    .xaxis(xaxis)
    .yaxis(yaxis)
    .grid(true)
    .legend(legend)
    .dimx(dataset.map(d => d.hdi))
    .dimy(dataset.map(d => d.gdp))
    .dimr(dataset.map(d => d.population))
    .dimc(dataset.map(d => d.continent).map(d => color_map(d)))
    .dimtt(dataset.map(d => d.name))
    .translate(50, 50)
    .draw()

});

