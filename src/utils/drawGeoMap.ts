import * as d3 from 'd3';
import axios from "axios"
import store from "@/store";
import { packSiblings } from 'd3';

export function drawAQIMap(ymd: any, hour: any): void {
  // 向后台请求数据
  axios.get("api/getdata//getGeoMap", {
  })
    .then(function (resp) {
      Draw(resp.data)
    });


  function Draw(data: any) {
    const divMap = d3.select("#chart")
    const config = {
      width: parseInt(divMap.style("width")) - 2,
      height: parseInt(divMap.style("height")) - 2,
    }
    const svg = divMap.append("svg")
      .attr("width", config.width)
      .attr("height", config.height)

    const mapG = svg.append("g").style("transform", "scale(1,1.07)")
    var projection = d3.geoMercator() //投影
      .center([102, 36])
      .translate([450, 315])
      .scale(750);

    const geopath = d3.geoPath()      //生成地图path
      .projection(projection)

    mapG.selectAll(".province")
      .data(data.features)
      .enter()
      .append("path")
      .attr("class", "province")
      .style("fill", "rgba(0,255,0,0)")
      .attr("d", geopath)

  }
}