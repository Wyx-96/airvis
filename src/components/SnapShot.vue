<template>
  <div class="SnapShot">
    <div class="Header">
      <p>AirPuVis</p>
    </div>
    <div class="information">




      <div class="info">
        <el-row style="    font-weight: 600;">
          <el-col :span="8"><div>空气质量</div></el-col>
          <el-col :span="8"><div>污染指数分级</div></el-col>
        </el-row>
        <el-row v-for="data in tableData" :key="data.date">
          <el-col :span="8"><div>{{data.date}}</div></el-col>
          <el-col :span="8"><div>{{data.address}}</div></el-col>
          <el-col :span="8">
            <div style="height: 100%;    display: flex;    align-items: center;    justify-content: center;"> 
              <div :style="'height: 12px;    width: 12px;    background: '+data.color+';    border-radius: 2px;'"></div> 
            </div>
          </el-col>
        </el-row>
      </div>






      <div class="selectWind">
        <p>是否显示风向</p>
        <el-switch
          v-model="value"
          style="margin-top: 11px"
          active-color="#13ce66"
          inactive-color="#969292"
        >
        </el-switch>
      </div>
      <div class="selecTime">
        <p>{{ selectYMD }}</p>
      </div>
    </div>
    <div class="patternMap"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, ref } from "vue";
import * as d3 from "d3";
import store from "@/store";
import { drawPatternMap } from "@/utils/patternMap";
export default defineComponent({
  name: "SnapShot",
  setup() {
    const selectYMD = ref("");
    const value = ref(true);
    const ymd: any = computed(() => store.getters.selectedYMD);
    watch(ymd, () => {
      if (ymd != null) {
        selectYMD.value =
          ymd.value.substring(0, 4) +
          "年" +
          ymd.value.substring(4, 6) +
          "月" +
          ymd.value.substring(6, 8) +
          "日";
        drawPatternMap(store.getters.selectedYMD);
      }
    });

    watch(value, () => {
      if (value.value == true) d3.select("canvas").style("opacity", "1");
      else d3.select("canvas").style("opacity", "0");
    });


    const tableData = [{
            date: '优',
            address: 'AQI < 50 ',
            color: '#5BD665'
          }, {
            date: '良',
            address: 'AQI < 100 ',
            color: '#F7F452'
          }, {
            date: '轻度污染',
            address: 'AQI < 150 ',
            color: '#FD9813'
          }, {
            date: '中度污染',
            address: 'AQI < 200 ',
            color: '#F5461A'
          }, {
            date: '重度污染',
            address: 'AQI < 300 ',
            color: '#A00101'
          }, {
            date: '严重污染',
            address: 'AQI < 500 ',
            color: '#680000'
          }]
    return {
      selectYMD,
      value,
      tableData
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.SnapShot {
  width: 300px;
  height: 100%;
  border: 1px solid #333333;
  float: left;
}

.Header {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #2F6FC4;
  text-align: left;
}

.Header p {
  margin: 0px;
  margin-left: 10px;
  color: #ffffff;
  font-weight: bold;
}

.information {
  width: 100%;
  height: 55%;
}

.patternMap {
  width: 100%;
  height: 40%;
}

.selectWind {
  width: 100%;
  height: 30px;
}

.selectWind p {
  float: left;
  font: 1em sans-serif;
  margin-top: 10px;
  margin-left: 40px;
  color: #C0BFBF;
}

.info {
  width: 100%;
  height: 250px;
}
.selecTime{
  marrgin 0
}
.selecTime p {
  color: #C0BFBF;
  float: left;
  margin-top: 10px;
  margin-left: 40px;
  font: 1.5em sans-serif;
}
.info {
  width: 100%;
  height: 250px;
  color: #CFCCCC
  text-align: left;
  font-size: 15px;
  line-height: 32px;

  .el-row{
    border-bottom: 1px solid #EBEEF5;
    padding 0 10px
  }
  
}

>>>.el-avatar{
  background: red
}
</style>