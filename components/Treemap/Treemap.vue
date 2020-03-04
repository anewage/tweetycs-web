<template>
    <div>
        <svg
            id="treeMapViz"
            :viewBox='[0, 0, width, height]'
            class="viewBoxStyle" 
            >
            <g 
                v-for="(leaf, index) in this.treeMapLeaves"
                    :key="index"
                    :transform="'translate(' + leaf.x0 + ',' + leaf.y0 +')'"
                    >
                <rect
                    :id="index+'leaf'"
                    :width="rectWidth(leaf)"
                    :height="rectHeight(leaf)"
                    :fill="rectColor(leaf)"
                    class="rectStyle">
                </rect>
                <text class="viewBoxStyle" :transform="'translate(' + textTransform[0] + ',' + textTransform[1] +')'"> 
                    {{ leaf.data.name }}
                </text>
                <circle
                    v-for="(user, index) in leaf.data.value"
                    :key="index"
                    :cx="circleXPos(leaf)(index +1 % totcol(leaf))"
                    :cy="circleYPos(leaf)(Math.ceil(index / totcol(leaf)))"
                    :r=10
                    :transform="'translate(' + textTransform[0] + ',' + (textTransform[1] + 60) +')'">
                </circle>  
            </g>
        </svg>
    </div>    
</template>
<script >
import * as d3 from 'd3'
import * as underscore from 'underscore'
export default {
    data(){
        return {
            colorScale: d3.scaleOrdinal(d3.schemeAccent),
            textTransform: [30, 30]
        }
    },
    props:{
        width: {
            type: Number,
            default: 1000
        },
        height: {
            type: Number,
            default: 1000
        },
        users: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    computed:{
        treeMapData: function(){
            let root = this.treeMapFunc(this.heirarchicalCountries)
            return root
        },
        treeMapLeaves: function(){
            let leaves = this.treeMapData.leaves()
            return leaves
        },
        rectColor: function(){
            return function(d){
                while(d.depth > 1) d=d.parent
                return this.colorScale(d.data.name)
            }
        },
        countries: function() {
            const groupedByCountry = underscore.groupBy(this.users, u => {
                return u.location.country
            })
            for (const index in groupedByCountry) {
                groupedByCountry[index] = underscore.groupBy(groupedByCountry[index], u => {
                    return u.location.state
                })
            }
            return groupedByCountry
        },
        heirarchicalCountries: function() {
            let highLevelChildren = []
            for(const countryName of Object.keys(this.countries)) {
                const country = this.countries[countryName]
                const children = []
                for(const stateName of Object.keys(country)) {
                    children.push({
                        name: stateName,
                        users: country[stateName],
                        value: country[stateName].length
                    })
                }
                highLevelChildren.push({
                    name: countryName,
                    children: children
                })
            }
            return {
                name: 'countries',
                children: highLevelChildren
            }
        },
        
        totcol: function(){
            return function(d){
                return this.rectWidth(d)/40
            }
        },
        //Total rows
        totRow: function(){
            return function(d){
                return this.rectHeight(d)/40
            }
        },
        
        //Calculates the domain for xScale
        xScaleDomain: function(){
            return function(d){
                let xScaleValue = []
                for(let i=1;i<=this.totcol(d);i++)
                    xScaleValue.push(i)
                return xScaleValue
            }
        },
        //Calculates the domain for yScale
        yScaleDomain: function(){
            return function(d){
                let yScaleValue = []
                for(let i=1;i<=this.totRow(d);i++)
                    yScaleValue.push(i)
                return yScaleValue
            }
        },
        //Creates the xScaleBand
        circleXPos: function(){
            return function(d){
                return d3.scaleBand()
                    .domain(this.xScaleDomain(d))
                    .range([0, this.rectWidth(d)])
            }
        },
        //Creates the yScaleBand
        circleYPos: function(d){
            return function(d){
                return d3.scaleBand()
                    .domain(this.yScaleDomain(d))
                    .range([0, this.rectHeight(d)])
            }
        }
    },
    methods: {
        treeMapFunc: function(da){
            const temp = d3.treemap()
                .tile(d3.treemapSquarify)
                .size([this.width,this.height])
                .padding(1)
                .round(true)
            return temp(d3.hierarchy(da)
            .sum(d => d.value))
            .sort((a,b) => a.value - b.value)
        },
        rectWidth: function(d){
            return d.x1-d.x0
        },
        rectHeight: function(d){
            return d.y1-d.y0
        }
    }
}
</script>
<style>
.viewBoxStyle {
    font-size: 20px;
    font: sans-serif    
}
.rectStyle {
    fill-opacity: 0.6;
    stroke: #0000;
    stroke-width: 3px;
}
</style>
