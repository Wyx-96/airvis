import * as d3 from 'd3';
import axios from "axios"
import store from "@/store";
import { packSiblings } from 'd3';

export function drawPatternMap(ymd: any): void {
  // 向后台请求数据
  axios.get("api/getdata/getPatternMap", {
    params: {
      ymd: store.getters.selectedYMD
    },
  })
    .then(function (resp) {
      Draw(resp.data.patterndata)
    });


  function Draw(data: any) {
    d3.select('.patternMap').select('.patternmap').remove()

    const divMap = d3.select(".patternMap")
    const config = {
      width: parseInt(divMap.style("width")) - 2,
      height: parseInt(divMap.style("height")) - 2,
    }
    const svg = divMap.append("svg") //select("div").
      .attr("width", config.width)
      .attr("height", config.height)
      .attr("class","patternmap")

    const mapG = svg.append("g")
      .attr("class", "Pattern")

    const projection = d3.geoMercator() //投影
      .center([102, 36])
      .translate([133, 125])
      .scale(280);

    const color = d3.schemeCategory10;

    const location = mapG.selectAll(".location")   //根据经纬度坐标coor的位置添加g元素
      .data(data)
      .join("g")
      .attr("class", "location")
      .attr("transform", function (d: any) {
        //计算标注点的位置
        const coor: any = projection([d["lon"], d["lat"]]);
        return "translate(" + coor[0] + "," + coor[1] + ")";
      });

    location.append("rect")   //在g元素中加一个rect，调整合适的角度位置
      .attr("width", 1.6)
      .attr("height", 1.6)
      .attr("transform", `rotate(${0}) translate(-0.8,-0.8)`)
      .attr("fill", function (d:any) {
        if (d.second_pattern == -1) {
            // 筛掉
            return "rgba(255,255,255,0.1)"
        } else {
            return color[d.second_pattern]
        }
    })
  }

 
}