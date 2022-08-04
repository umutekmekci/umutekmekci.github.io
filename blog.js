import * as d3 from "https://cdn.skypack.dev/d3@7";

class Article {
    constructor(){
        this.__width = 0;
        this._tx = 0
        this._ty = 0
        this._rot_deg = 0
    }

    ref(r){
        this._ref = r
        return this
    }

    header(h){
        this._header = h
        return this
    }

    meta(m){
        this._meta = m
        return this
    }

    summary(s){
        this._summary = s
        return this
    }

    _width(w){
        this.__width = w
        return this
    }

    _index(i){
        this.__index = i
        return this
    }

    _translate(tx, ty){
        this._tx = tx
        this._ty = ty
        return this
    }

    _rotate(deg){
        this._rot_deg = deg
        return this
    }

    _render(parent){
        const self = this
        const article = parent.selectAll(`.article:nth-of-type(${self.__index})`).data([self]).join("div").attr("class", "article")
        const pointer = article.selectAll("a").data([self._ref]).join("a").attr("href", self._ref)
        pointer.selectAll("h2").data([self._header]).join("h2").attr("class", "post-title").html(self._header)
        article.selectAll("p").data([self._meta]).join("p").attr("class", "post-meta").html(self._meta)
        const summary = article.selectAll("div").data([self._summary]).join("div").attr("class", "post-summary").html(self._summary)
        summary.selectAll("a").data([self._ref]).join("a").attr("href", self._ref).attr("class", "post-read-more").html(" [Read more]")
        article.selectAll(`#hr${self.__index}`).data([""]).join("hr").attr("id", `hr${self.__index}`).style("width", "100%").style("opacity", "0.5")
        article
        .transition()
        .delay(2000)
        .duration(5000)
        .style("transform", `translate(${self._tx}px, ${self._ty}px) rotate(${self._rot_deg}deg)`)
        if(this.__width !== undefined){
            article.style("width", self.__width + "px")
        }
    }
}

class Blog {
    constructor(){
        this._width = 0
        this._height = 0
        this._article_list = []
    }

    width(w){
        this._width = w
        return this
    }

    height(h){
        this._height = h
        return this
    }

    append(article) {
        const self = this
        const index = this._article_list.push(article)
        // we can also set index here ._index(i)
        return this
    }

    render(){
        const self = this
        const container = d3.selectAll(".container").data([self]).join("div").attr("class", "container")
        self._article_list.forEach(function(article, i){
            // article width is %40 percent of parent width
            const w = self._width * 0.4
            const x = self._width * 0.3
            // article height is determined by its content
            article
            ._index(i+1)
            ._width(w)
            ._translate(x, 0)
            ._render(container)
        })
    }
}

const article1 = new Article()
article1
.ref("index_scatter.html")
.header("Scatter Plot")
.meta("Posted on 03.08.2022")
.summary("Here you can find scatter plot")

const article2 = new Article()
article2
.ref("index_scatter.html")
.header("Scatter Plot2")
.meta("Posted on 03.08.2022")
.summary("The Numba library allows you to achieve near C/C++/Fortran performance with your Python code without many code changes. This post will introduce the concept of Numba and compare the actual performance gain.")

const blog = new Blog()
blog
.width(window.innerWidth)
.height(window.innerHeight)
.append(article1)
.append(article2)
.render()

window.addEventListener('resize', (event) => {
    blog.width(window.innerWidth).render()
});