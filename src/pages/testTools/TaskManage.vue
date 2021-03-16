<template>
  <div>
    <el-date-picker
      v-model="datePick"
      type="date"
      @change="(value) => datePickChange(value)"
      placeholder="选择日期"
    ></el-date-picker>

    <div
      :style="{position: 'relative',height: tableHeight + 'px'}"
      v-loading="initLoadding"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#FFFAFA)"
    >
      <el-scrollbar :style="'height:'+tableHeight+'px'" style="margin-top:30px;">
        <div class="div-left">
          <table style="width:100px">
            <thead>
              <tr>
                <th class="th_2">人员</th>
              </tr>
            </thead>
            <tbody id="tbody">
              <template v-for="x in initList">
                <tr :key="x.id" :style="'height:'+(x.height+1)+'px'">
                  <td>
                    <div class="fc-cell-content">{{x.realname}}</div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="div-right" :style="'width:'+tableWidth+'px'">
          <table
            :style="'width:'+tableWidth2+'px'"
            class="dataTable"
            cellpadding="0"
            cellspacing="0"
          >
            <thead>
              <tr>
                <template v-for="x in dateTitles">
                  <th :key="x.id" class="th_1">
                    <div style="height:20px">{{x.date}}</div>
                    <div style="height:20px">{{x.week}}</div>
                  </th>
                </template>
              </tr>
            </thead>
            <tbody>
              <template v-for="x in dataList">
                <tr :key="x.id">
                  <template v-for="x2 in x.date">
                    <td :key="x2.id">
                      <div class="workLine" :style="'height:'+x2.height+'px'">
                        <template v-for="x3 in x2.list">
                          <div
                            :key="x3.id"
                            v-clipboard:copy="x3.projectName"
                            v-clipboard:success="copyProjectName"
                          >
                            <el-popover placement="top-start" width="350" trigger="hover">
                              <el-row>
                                <el-col :span="8">
                                  <span>计划开始时间:</span>
                                </el-col>
                                <el-col :span="14">
                                  <span>{{x3.estStarted}}</span>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="8">
                                  <span>实际开始时间:</span>
                                </el-col>
                                <el-col :span="14">
                                  <span>{{x3.realStarted}}</span>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="8">
                                  <span>计划完成时间:</span>
                                </el-col>
                                <el-col :span="14">
                                  <span>{{x3.deadLine}}</span>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="8">
                                  <span>实际完成时间:</span>
                                </el-col>
                                <el-col :span="14">
                                  <span>{{x3.finishedDate}}</span>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="8">
                                  <span>项目:</span>
                                </el-col>
                                <el-col :span="14">
                                  <span>{{x3.projectName}}</span>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="8">
                                  <span>工作内容:</span>
                                </el-col>
                                <el-col :span="14">
                                  <span>{{x3.taskName}}</span>
                                </el-col>
                              </el-row>
                              <div
                                slot="reference"
                                :class="x3.finishedDate==''?'fc-bg':'fc-bg fc-bg2'"
                                :style="'top:'+x3.top+'px;width:'+(x3.dayCount*cloumWidth)+'px'"
                              >
                                <div class="fc-context">
                                  <i :class="x3.scheduleType == 1?'el-icon-lx-peoplefill':'el-icon-lx-favorfill'"></i>
                                  {{x3.projectName != null ? x3.projectName.length > (x3.width/12) ? x3.projectName.substring(0, (x3.width/12)-1) + "..." : x3.projectName : ""}}
                                  <span style="margin-left: 20px">工作内容: {{x3.taskName}}</span>
                                </div>
                              </div>
                            </el-popover>
                          </div>
                        </template>
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datePick: "",
      initLoadding: true,
      beginDateTime: new Date(),
      endDateTime: new Date().setDate(new Date().getDate() + 14),
      initList: [],
      height: 23,
      tableWidth: 840,
      cloumWidth: 124,
      dateTitles: [],
      weekday: [
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
      ],
      initTimeCount: {},
      top: 24,
      dataList: []
    };
  },
  created() {
    this.hh();
    this.initData();
  },
  mounted() {
    let _this = this;
    window.onresize = function temp() {
      _this.hh();
    };
  },

  methods: {
    // 切换日期选择器
    datePickChange(newDate) {
      this.beginDateTime = newDate;
      this.endDateTime = new Date().setDate(this.beginDateTime.getDate() + 14);
      this.initData();
    },
    initData() {
      this.$service.testGroupTask({
        beginTime: this.$utils.formatDate(this.beginDateTime),
        endTime: this.$utils.formatDate(this.endDateTime)
      }).then(res => {
        this.initList = res.data
        let date = new Date(this.beginDateTime.valueOf())
        this.dateTitles = []
        for (let index = 0; index < 14; index++) {
          let week = this.weekday[date.getDay()]
          this.dateTitles.push({ date: this.$utils.formatDate(date), week: week })
          this.initTimeCount[this.$utils.formatDate(date)] = 0
          date.setDate(date.getDate() + 1)
        }
        if (res.data.length > 0) {
          this.calculate();
          this.createTimeList();
        }
      }).finally(() => {
        this.initLoadding = false
      })
    },
    createTimeList() {
      let dayList = [];
      this.dataList = [];
      this.dateTitles.forEach(element => {
        dayList.push(element.date);
      });
      this.initList.forEach(info => {
        let obj = {};
        obj.name = info.realname;
        obj.date = [];
        dayList.forEach(day => {
          let d = {};
          d.date = day;
          d.height = info.height;
          d.list = [];
          info.taskList.forEach(data => {
            if (data.startDate == day) {
              d.list.push(data);
            }
          });
          obj.date.push(d);
        });
        this.dataList.push(obj);
      });
    },
    calculate() {
      this.initList.forEach(element => {
        let timeCount = JSON.parse(JSON.stringify(this.initTimeCount));
        element.taskList.forEach(t => {
          let days = [];
          let dayCount = this.getDayCount(t, timeCount, days);
          // t.width = dayCount * this.cloumWidth;
          t.dayCount = dayCount;
          t.days = days;
          let top = this.getTop(t, timeCount);
          t.top = top;
        });
        let count = 0;
        Object.keys(timeCount).forEach(function(key) {
          if (timeCount[key] > count) {
            count = timeCount[key];
          }
        });
        if (count == 1) {
          element.height = 35;
        } else {
          element.height = 35 + this.height * (count - 1);
        }
      });
    },
    getTop(task, timeCount) {
      let dateArr = task.days;
      let count = 1;
      dateArr.forEach(element => {
        let c = timeCount[element];
        if (c >= count) {
          count = c;
        }
      });
      dateArr.forEach(element => {
        timeCount[element] = count;
      });
      if (count == 1) {
        return 2;
      } else {
        return 2 + this.top * (count - 1);
      }
    },
    getDayCount(task, timeCount, days) {
      let dayCount = 1;
      let sd =
        task.realStarted == ""
          ? new Date(task.estStarted)
          : new Date(task.realStarted);
      task.startDate =
        sd <= this.beginDateTime
          ? this.$utils.formatDate(this.beginDateTime)
          : this.$utils.formatDate(sd);
      let ed =
        task.finishedDate == ""
          ? new Date(task.deadLine)
          : new Date(task.finishedDate);
      task.endDateTime =
        ed >= this.endDateTime
          ? this.$utils.formatDate(this.endDateTime)
          : this.$utils.formatDate(ed);
      let t1 = task.startDate;
      let t2 = task.endDateTime;
      if (timeCount[t1] != null) {
        timeCount[t1] += 1;
        days.push(t1);
      }
      let max = 0;
      while (t1 != t2) {
        let time = new Date(t1);
        time.setDate(time.getDate() + 1);
        t1 = this.$utils.formatTime(time);
        if (timeCount[t1] != null) {
          timeCount[t1] += 1;
          dayCount++;
          days.push(t1);
        }
        max++;
        if (max >= 20) {
          break;
        }
      }
      return dayCount;
    },
    hh() {
      this.tableHeight = window.innerHeight - 150;
      this.tableWidth = window.innerWidth - 350;
      this.tableWidth2 =
        window.innerWidth - 350 >= 1736 ? window.innerWidth - 350 : 1736;
      this.cloumWidth = (this.tableWidth2 / 1736) * 124;
    },
    copyProjectName() {
      this.$message.success("复制成功");
    }
  }
};
</script>
<style scoped lang="scss">
#custom::-webkit-scrollbar {
  display: none;
}
.bottom_page {
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.common_title {
  height: 32px;
  line-height: 32px;
  float: left;
  margin-left: 10px;
}
.select_detail {
  width: 200px;
  float: left;
  margin-left: 10px;
}
.input_keyword {
  width: 200px;
  float: left;
  margin-left: 10px;
}
table {
  width: 1000px;
  box-sizing: border-box;
  border-collapse: collapse;
  table-layout: fixed;
  border-spacing: 0ch;
  height: 25px;
  font-size: 1em;
  display: table;
  white-space: nowrap;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  direction: ltr;
  text-align: center;
  /* border-right: 1px solid #d8dee6;
  border-bottom: 1px solid #d8dee6; */
}

.th_2 {
  width: 60px;
  height: 40px;
}

tbody {
  border-color: #ddd;
  box-sizing: content-box;
  display: table-row-group;
}

tr {
  border-color: #ddd;
  width: 100%;
}

th {
  text-align: center;
}

td {
  vertical-align: middle;
  height: 35px;
  padding: 0 !important;
  border-left: 1px solid #d8dee6;
  border-top: 1px solid #d8dee6;
  border-right: 1px solid #d8dee6;
  border-bottom: 1px solid #d8dee6;
}

th {
  vertical-align: middle;
  height: 35px;
  padding: 0 !important;
  border-left: 1px solid #d8dee6;
  border-top: 1px solid #d8dee6;
  border-right: 1px solid #d8dee6;
  border-bottom: 1px solid #d8dee6;
  background-color: #edf0f4;
  font-weight: normal;
  background: #f8f8f9;
}

.fc-bg {
  cursor: pointer;
  z-index: 1;
  left: 0;
  position: absolute;
  padding: 0px 5px;
  color: #fff;
  font-size: 0.85em;
  .fc-context {
    background: #e74c3c;
    border: 1px solid #e74c3c;
    border-radius: 10px;
    padding: 1px 0;
  }
}

.fc-bg2 {
  .fc-context {
    background: #0eac51;
    border: 1px solid #0eac51;  
  }
}

.fc-bg3 {
  .fc-context {
    background: #adadad;
    border: 1px solid #848484;
  }
}

.fc-cell-content {
  text-align: center;
  padding-top: 8px;
  // font-weight: bold;
}

.date-title {
  text-align: left;
  width: 500px;
  font-size: 1.4em;
  font-weight: bold;
  color: #5e6d82;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.tip-div {
  height: 25px;
  line-height: 25px;
  text-align: center;
  width: 50px;
  color: #fff;
  border: 1px solid #3a87ad;
  background: #3a87ad;
  border-radius: 3px;
}

.tip-div2 {
  height: 25px;
  line-height: 25px;
  text-align: center;
  width: 50px;
  color: #fff;
  border: 1px solid #ee6363;
  background: #ee8262;
  border-radius: 3px;
}

.tip-div3 {
  height: 25px;
  line-height: 25px;
  text-align: center;
  width: 50px;
  color: #fff;
  border: 1px solid #848484;
  background: #adadad;
  border-radius: 3px;
}

.workLine {
  position: relative;
}

.div-left {
  float: left;
  width: 131px;
}

.div-right {
  float: left;

  margin-left: -30px;
  overflow-x: auto;
}
</style>>