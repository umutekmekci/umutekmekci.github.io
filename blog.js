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
        //.transition()
        //.delay(2000)
        //.duration(5000)
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
.ref("../scatter/index_scatter.html")
.header("Interactive Scatter Plot")
.meta("Posted on 07.08.2022")
.summary("Through interaction we will see how a two-dimensional plot can represent four-dimensional data.")

const article2 = new Article()
article2
.ref("../snap/index.html")
.header("Finger Snap")
.meta("Posted on 21.08.2022")
.summary("Implemantation of thanos finger snap")

const article3 = new Article()
article3
.ref("../tree_layout/index.html")
.header("Tree Layout Algorithm (Part1)")
.meta("Posted on 11.09.2022")
.summary("How to layout and draw a tree given as a json format (Part1)")

const article4 = new Article()
article4
.ref("../custom_tree_layout/index.html")
.header("Tree Layout Algorithm (Part2)")
.meta("Posted on 18.09.2022")
.summary("Customize the Tree (Drag, Change, Add node and Download)")

const article5 = new Article()
article5
.ref("../linear_regression/index.html")
.header("Two Perspecives of Linear Regression")
.meta("Posted on 08.10.2022")
.summary("Two complementary approaches for linear regression")

const article6 = new Article()
article6
.ref("../length_of_vector/index.html")
.header("Geometric Product of Two Vectors")
.meta("Posted on 16.10.2022")
.summary("Do you wonder why |a|<sup>2</sup> + |b|<sup>2</sup> = |c|<sup>2</sup> in case a ,b and c are vectors with a and b orthogonal to each other")

const blog = new Blog()
blog
.width(window.innerWidth)
.height(window.innerHeight)
.append(article1)
.append(article2)
.append(article3)
.append(article4)
.append(article5)
.append(article6)
.render()

window.addEventListener('resize', (event) => {
    blog.width(window.innerWidth).render()
});