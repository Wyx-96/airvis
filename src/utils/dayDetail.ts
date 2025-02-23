import * as d3 from 'd3';
import axios from "axios"
import store from "@/store";

export function drawDayDetail(): void {
  console.log(store.getters.selectedYMD)
  axios.get("api/getdata/getdayDetailData", {
    params: {
      ymd: store.getters.selectedYMD
    },
  })
    .then(function (resp) {
      Draw(resp.data)
    });

  function Draw(data: any) {
    const dayDetailData = data.dayDetailData

    d3.selectAll(".DetailG").remove()
    const svg = d3.select(".dayDetailSVG")
    const config = {
      width: parseInt(svg.style("width")) - 2,
      height: parseInt(svg.style("height")) - 2,
    }

    drawDetail()


    function drawDetail() {
      var root = (d: any) => {
        const root = d3.hierarchy(d);
        return d3.tree()(root);
      }
      var dataLength = dayDetailData.length
      var linktest = d3.linkHorizontal()
        .x((d: any) => (d.data.start_time) * hour_x)
        .y((d: any) => d.y * 12 + d.x * 19)

      var color = d3.schemeCategory10;
      var hour_x = config.width / 24;

      dayDetailData.forEach((element: any) => {
        let key = Object.keys(element)
        if (key.includes("children") == true) {
          dataLength += element["children"].length
        }
      });

      var treeMap = svg.append("g")
        .attr("class", "DetailG")
        .selectAll("g")
        .data(dayDetailData)
        .join("g")
        .attr("class", (d: any, i) => "g" + d.id)
        .attr("stroke", "white")
        .attr("transform", (d, i) => `translate(${hour_x / 2},${(config.height / dataLength) * i * 1.5})`);

      var link = treeMap.selectAll("path")
        .data((d) => root(d).links())
        .join("path")
        .attr("class", "link")
        .attr("d", (d: any) => {
          return linktest(d)
        })
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.9);

      var node = treeMap.selectAll("g")
        .data((d) => root(d).descendants())
        .join("g")
        .attr("class", "node")
        .attr("transform", (d: any) => {
          return `translate(${(d.data.start_time) * hour_x},${d.y * 12 + d.x * 19})`
        });

      node.append("circle")
        .attr("fill", (d: any) => d.data.pattern == -1 ? "#999" : color[d.data.pattern])
        .attr("r", 2.5);

      node.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d: any) => d.data.duration * hour_x)
        .attr("y2", 0)
        .attr("stroke", (d: any) => d.data.pattern == -1 ? "#999" : color[d.data.pattern])
        .attr("stroke-width", "1.5px")
        .attr("transform", (d, i) => `translate(0,${0})`)

      var hour = []
      for (let i = 0; i <= 23; i++) {
        hour[i] = pad(i,2);
      }
      d3.select(".DetailG").selectAll("rect")
        .data(hour)
        .join("rect")
        .attr("class", "rect")
        .attr("height", config.height)
        .attr("width", config.width / 24)
        .attr("x", (d, i) => config.width / 24 * i)
        .attr("fill", "#A1CCE9")
        .attr("opacity",0.05)
        .on("click", function (d, i) {
          RemovehightLight()
          d3.select(this).attr("class", "dayDetail_active").attr("opacity", 0.3)
          // 保存选择的具体小时
          store.commit("timeLineData/SET_SELECTED_TIME",d3.select(this).data())

        }).on("mouseover", function (d, i) {
          d3.select(this).attr("opacity", 0.2);
        })
        .on("mouseout", function (d, i) {
          d3.select(this).attr("opacity", 0.05);
          var series = d3.selectAll('.dayDetail_active')
          if (series != null) series.attr("opacity", 0.3)
        })

        function RemovehightLight() {
          var series = d3.selectAll('.dayDetail_active')
          if (series != null) series.attr("class", 'rect').attr("opacity", 0.05)
        }

        // 整数 按n位补0
        function pad(num:any, n:any) {
          return Array(n>num?(n-(''+num).length+1):0).join("0")+num;
         }
    }
  }
}