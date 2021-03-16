<style lang="scss">
.page-plan-execute {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f5f5f5;
  .split-line {
    display: inline-block;
    width: 1px;
    height: 18px;
    background: rgba(0, 0, 0, 0.2);
    margin: 0 10px;
    vertical-align: sub;
  }
  &-header {
    height: 50px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    box-shadow: 0 0 8px 0 rgba(0,0,0,.1);
    .left {
      display: flex;
      align-items: center;
      .back-icon {
        padding: 2px;
        border: 1px solid #ccc;
        border-radius: 50%;
        cursor: pointer;
        text-align: center;
        line-height: 1;
        .el-icon-back {
          font-size: 20px;
          font-weight: bold;
          color: #409EFF;
        }
      }
      .plan-name {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .right {
      .iconguihua {
        margin-right: 4px;
        position: relative;
        top: 1px;
      }
    }
  }
  &-main {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 10px;
    .plan-info-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      margin-bottom: 10px;
      font-size: 15px;
      background: #fff;
      .item {
        display: inline-block;
        margin-right: 40px;
        .status {
          width: max-content;
          padding: 3px 10px;
          border: 1px solid;
          border-radius: 3px;
          font-size: 12px;
        }
        .status1 { // 未开始
          color: #ff7575;
          border-color: #ff7575;
        }
        .status2 { // 进行中
          color: #5dcfff;
          border-color: #5dcfff;
        }
        .status3 { // 已延期
          color: #ffcd5d;
          border-color: #ffcd5d;
        }
        .status4 { // 已完成
          color: #73d897;
          border-color: #73d897;
        }
      }
      .label {
        color: #aaa;
        margin-right: 10px;
      }
      .iconfont {
        color: #409EFF;
        margin-right: 4px;
      }
      &-right {
        .label {
          cursor: pointer;
          margin-right: 0;
        }
      }
    }
    .main-box {
      flex: 1;
      overflow: hidden;
      display: flex;
      &-left {
        flex: 2;
        overflow: hidden;
        min-width: 430px;
        display: flex;
        flex-direction: column;
        height: 100%;
        margin-right: 20px;
        .search-bar {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 12px 0 4px;
          background: #fff;
          margin-bottom: 10px;
          .status-filter-popover-reference {
            height: 32px;
            line-height: 32px;
            padding: 0 8px;
            cursor: pointer;
            outline: none;
            .el-icon-caret-bottom {
              transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
            }
            &:hover {
              background-color: rgba(16, 113, 211, 0.08);
              .el-icon-caret-bottom {
                color: #2970d3;
              }
            }
          }
          .status-filter-popover-reference.actived {
            color: #babcbe;
            background: #f3f4f6;
            .el-icon-caret-bottom {
              transform: rotateX(180deg);
              color: #babcbe;
            }
          }
          .el-input.focused {
            .el-input__prefix {
              color: #409EFF;
              font-weight: bold;
            }
          }
          .el-input {
            flex: 1;
            .el-input__inner {
              border: none;
              caret-color: #409EFF;
            }
            .el-input__suffix i {
              font-size: 18px !important;
            }
          }
          .only-my {
            .el-switch {
              .el-switch__core {
                height: 8px;
                background: #e4e7ec;
                &::after {
                  top: -5px;
                  left: -1px;
                  background: #a3acb8;
                }
              }
            }
            .el-switch.is-checked {
              .el-switch__core {
                background: #409eff4d;
                &::after {
                  margin-left: 12px;
                  background: #409EFF;
                }
              }
            }
          }
        }
        .tree-box {
          flex: 1;
          overflow-y: auto;
          background: #fff;
          .el-tree-node__content {
            position: relative;
            .custom-tree-node {
              width: 100%;
              overflow: hidden;
              padding-right: 90px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .node-label {
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .case-count {
                  display: inline-block;
                  margin-left: 8px;
                  padding: 0px 8px;
                  min-width: 24px;
                  height: 16px;
                  line-height: 16px;
                  font-size: 12px;
                  text-align: center;
                  white-space: nowrap;
                  color: #fff;
                  background-color: #d4d8de;
                  border-radius: 8px;
                }
              }
            }
            .select-comply {
              display: flex;
              align-items: center;
              .label {
                color: #aaa;
                margin-right: 5px;
              }
              .popover-reference {
                height: 30px;
                line-height: 30px;
                padding: 0 7px;
                border-radius: 2px;
                cursor: pointer;
                &:hover {
                  background-color: rgba(16, 113, 211, 0.08);
                  .el-icon-caret-bottom {
                    color: #2970d3;
                  }
                }
                &:focus {
                  outline: none;
                }
                .el-icon-caret-bottom {
                  margin-left: 5px;
                  color: #babcbf;
                }
              }
            .popover-reference.actived {
              background-color: rgba(16, 113, 211, 0.08);
              .el-icon-caret-bottom {
                color: #2970d3;
              }
            }
            }
            .handle-box {
              position: absolute;
              top: 6px;
              right: 16px;
              display: flex;
              align-items: center;
              .comply {
                margin-right: 5px;
              }
            }
            .el-icon-success {
              font-size: 20px;
              color: #21ca64;
            }
            .el-icon-remove {
              font-size: 20px;
              color: #6d7694;
            }
            .el-icon-error {
              font-size: 20px;
              color: #ff553e;
            }
            .el-icon-question {
              font-size: 20px;
              color: #e5e8ed;
            }
          }
        }
      }
      &-right {
        flex: 3;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #fff;
        .header {
          padding: 12px 16px 0;
          border-bottom: 1px solid #dcdfe6;
          .title {
            font-size: 18px;
            font-weight: bold;
            -webkit-font-smoothing: antialiased;
          }
          .item-box {
            display: flex;
            margin: 12px 0;
            .item {
              display: flex;
              line-height: 32px;
              &:not(:last-child) {
                margin-right: 16px;
              }
              .label {
                color: #aaa;
                margin-right: 10px;
              }
              .popover-reference {
                height: 32px;
                line-height: 32px;
                padding: 0 7px;
                border-radius: 2px;
                cursor: pointer;
                &:hover {
                  background-color: rgba(16, 113, 211, 0.08);
                  .el-icon-caret-bottom {
                    color: #2970d3;
                  }
                }
                &:focus {
                  outline: none;
                }
                .el-icon-caret-bottom {
                  margin-left: 5px;
                  color: #babcbf;
                }
              }
              .popover-reference.actived {
                background-color: rgba(16, 113, 211, 0.08);
                .el-icon-caret-bottom {
                  color: #2970d3;
                }
              }
            }
          }
        }
        .main {
          flex: 1;
          overflow-y: auto;
          margin-top: 16px;
          padding: 0 16px;
          .step-edit-btn {
            float: right;
            .el-button {
              padding: 0;
            }
          }
          .step-box {
            .step-box-row {
              display: flex;
              padding: 10px 0;
              border-bottom: 1px solid rgba(0, 0, 0, 0.07);
              .step-box-column1 {
                width: 18px;
                text-align: center;
              }
              .step-box-column2 {
                flex: 1;
                padding: 0 15px;
              }
            }
            .step-box-header {
              margin-top: 5px;
              font-size: 12px;
              color: #9199a3;
            }
            .step-item {
              position: relative;
              .step-box-column1 {
                text-align: center;
                span {
                  display: inline-block;
                  width: 18px;
                  height: 18px;
                  line-height: 18px;
                  text-align: center;
                  font-size: 12px;
                  border-radius: 50%;
                  background: #ccc;
                  color: #fff;
                }
              }
              .step-box-column2 {
                .el-textarea__inner {
                  padding: 0;
                  border: none
                }
              }
              .handle-btn {
                position: absolute;
                top: 11px;
                right: 0;
                .el-icon-remove {
                  font-size: 20px;
                  color: #f56c6c;
                  cursor: pointer;
                }
              }
            }
            .step-box-footer {
              color: #409EFF;
              .step-box-column2 {
                cursor: pointer;
              }
            }
          }
        }
        .footer {
          position: relative;
          .result-box {
            height: 200px;
            box-shadow: rgba(0, 0, 0, 0.02) 0px -1px 6px 0px, rgba(10, 36, 70, 0.05) 0px -4px 24px 0px;
            .el-tabs {
              height: 100%;
              display: flex;
              flex-direction: column;
              .el-tabs__header {
                .el-tabs__nav-wrap {
                  padding: 0 16px;
                  &::after {
                    height: 1px;
                  }
                  .el-tabs__item {
                    font-size: 16px;
                    color: #9199a3;
                    -webkit-font-smoothing: antialiased;
                  }
                  .el-tabs__item.is-active {
                    color: #202d40;
                  }
                }
              }
              .el-tabs__content {
                flex: 1;
                overflow-y: auto;
                padding: 0 16px;
                position: relative;
                .no-result {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                }
                .result-item {
                  position: relative;
                  padding-left: 30px;
                  padding-bottom: 24px;
                  &::before {
                    content: "";
                    display: block;
                    position: absolute;
                    top: 0px;
                    left: 8px;
                    width: 2px;
                    height: 100%;
                    background-color: #f3f4f5;
                  }
                  &-status {
                    position: absolute;
                    left: -1px;
                    top: 0px;
                    i {
                      font-size: 20px;
                    }
                    .el-icon-success {
                      color: #21ca64;
                    }
                    .el-icon-remove {
                      color: #6d7694;
                    }
                    .el-icon-error {
                      color: #ff553e;
                    }
                    .el-icon-chat-dot-round {
                      background: #fff;
                      color: #3186ec;
                    }
                  }
                  &-title {
                    color: #202d40;
                    font-size: 13px;
                    line-height: 20px;
                  }
                  &-steps {
                    margin-top: 8px;
                    padding: 12px 16px;
                    border-radius: 3px;
                    background-color: #f7f8fa;
                    .s-title {
                      margin-bottom: 12px;
                      font-weight: bold;
                      font-size: 12px;
                      line-height: 16px;
                      color: #202d40;
                    }
                    &-step {
                      position: relative;
                      padding-left: 26px;
                      padding-bottom: 16px;
                      color: #202d40;
                      font-size: 13px;
                      line-height: 20px;
                      &::before {
                        content: "";
                        display: block;
                        position: absolute;
                        top: 0px;
                        left: 8px;
                        width: 2px;
                        height: 100%;
                        background-color: #f3f4f5;
                      }
                      &-index {
                        position: absolute;
                        left: 0px;
                        top: 0px;
                        width: 18px;
                        height: 18px;
                        border-radius: 18px;
                        text-align: center;
                        color: #fff;
                        font-size: 12px;
                        line-height: 18px;
                        background-color: #c9cfd7;
                      }
                      &-index2 {
                        background: #73d897;
                      }
                      &-index3 {
                        background: #f56c6c;
                      }
                      &-index4 {
                        background: #6d7694;
                      }
                      .except, .actual {
                        margin-top: 8px;
                        font-size: 12px;
                        color: #9199a3;
                      }
                      .except span {
                        color: #21ca64;
                      }
                      .actual span {
                        color: #fa5b45;
                      }
                    }
                  }
                  &-footer {
                    display: flex;
                    -webkit-box-align: center;
                    align-items: center;
                    margin-top: 8px;
                    font-size: 12px;
                    line-height: 16px;
                    color: #9199a3;
                    .split {
                      width: 1px;
                      height: 12px;
                      background-color: #00000012;
                      margin: 0px 8px;
                    }
                  }
                }
              }
            }
          }
          .handle-bar {
            height: 50px;
            padding: 0 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: rgba(0, 0, 0, 0.08) 0px -2px 12px 0px;
            position: relative;
            z-index: 10;
            background: #fff;
            .left {
              span {
                cursor: pointer;
                i {
                  font-size: 18px;
                  color: #409EFF;
                  position: relative;
                  top: 2px;
                }
                &:hover {
                  color: #409EFF;
                }
              }
              span.actived {
                color: #409EFF;
              }
            }
            .right {
              display: flex;
              align-items: center;
              .next-case-drop {
                margin-right: 15px;
                .el-button-group {
                  .el-button {
                    height: 36px;
                    background: #21ca64;
                    border: none;
                    vertical-align: bottom;
                    span {
                      display: flex;
                      align-items: center;
                    }
                  }
                  .el-icon-success {
                    font-size: 18px;
                    margin-right: 6px;
                    position: relative;
                  }
                }
              }
              .change-case-btns {
                .el-button {
                  &:hover {
                    background: #f3f4f6;
                    border-color: #DCDFE6;
                    color: #606266;
                  }
                }
              }
            }
          }
          .drawer {
            width: 100%;
            position: absolute;
            bottom: 50px;
            z-index: 9;
            background: #fff;
            box-shadow: rgba(0, 0, 0, 0.08) 0px -2px 12px 0px;
            border-bottom: 1px solid #dcdfe6;
            &-title {
              font-size: 17px;
              font-weight: bold;
              margin-bottom: 16px;
            }
            &-save-btns {
              margin-top: 14px;
              .el-button {
                border-radius: 3px;
                font-size: 12px;
                -webkit-font-smoothing: antialiased;
              }
              .el-button--info {
                background: #202d40;
                &:hover {
                  background: #2f4463;
                }
              }
              .el-button--default {
                background: #fff;
                &:hover {
                  background: #f3f4f6;
                  border-color: #DCDFE6;
                  color: #606266;
                }
              }
            }
            .el-textarea__inner {
              border-radius: 0;
              resize: none;
            }
          }
          .drawer1 {
            display: flex;
            height: 540px;
            &-left {
              flex: 2;
              padding: 16px;
              .drawer1-result-btns{
                display: flex;
                margin-bottom: 24px;
                &-btn {
                  width: 95px;
                  height: 36px;
                  line-height: 36px;
                  text-align: center;
                  background: #f7f8f9;
                  border-radius: 3px;
                  cursor: pointer;
                  &:not(:last-child) {
                    margin-right: 8px;
                  }
                  &:hover {
                    background: #edeff0;
                  }
                  i {
                    margin-right: 8px;
                    font-size: 18px;
                    vertical-align: text-top;
                  }
                  .el-icon-success {
                    color: #21ca64;
                  }
                  .el-icon-remove {
                    color: #6d7694;
                  }
                  .el-icon-error {
                    color: #ff553e;
                  }
                }
                .actived2, .actived3, .actived4 {
                  color: #fff;
                  i {
                    color: #fff;
                  }
                }
                .actived2 {
                  background: #21ca64;
                }
                .actived4 {
                  background: #6d7694;
                }
                .actived3 {
                  background: #ff553e;
                }
              }
              .drawer1-step-box {
                &-title {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  .all-success {
                    display: flex;
                    -webkit-box-align: center;
                    align-items: center;
                    padding: 8px;
                    border-radius: 3px;
                    font-size: 13px;
                    line-height: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
                    &:hover {
                      background-color: #0066ff14;
                    }
                    .el-icon-success {
                      font-size: 18px;
                      color: #c9cfd7;
                      margin-right: 5px;
                    }
                    .el-icon-success.actived {
                      color: #73d897;
                    }
                  }
                }
                &-contener {
                  height: 260px;
                  overflow-y: auto;
                  padding-top:16px;
                  margin-bottom: 16px;
                  .step {
                    position: relative;
                    padding: 8px 8px 8px 34px;
                    font-size: 13px;
                    line-height: 16px;
                    color: #202d40;
                    &::before {
                      content: "";
                      position: absolute;
                      top: 0px;
                      left: 16px;
                      width: 2px;
                      height: 100%;
                      background-color: #f3f4f5;
                    }
                    &:hover {
                      background-color: #1071d314;
                      .step-btns {
                        display: block;
                      }
                    }
                    .index {
                      position: absolute;
                      top: 7px;
                      left: 8px;
                      width: 18px;
                      height: 18px;
                      border-radius: 18px;
                      color: #fff;
                      text-align: center;
                      font-size: 12px;
                      line-height: 18px;
                      background-color: #c9cfd7;
                    }
                    .index.success {
                      background-color: #73d897;
                    }
                    .index.error {
                      background-color: #f56c6c;
                    }
                    .expect,
                    .actual {
                      .label {
                        color: #9199a3;
                      }
                      .el-icon-caret-right {
                        font-size: 12px;
                        margin: 0 5px 0 2px;
                      }
                    }
                    .expect .el-icon-caret-right {
                      color: #3eca64;
                    }
                    .actual {
                      display: flex;
                      align-items: center;
                      margin-top: 5px;
                      .el-icon-caret-right {
                        color: #f56c6c;
                      }
                      .el-textarea {
                        flex: 1;
                        .el-textarea__inner {
                          padding: 4;
                          font-size: 12px;
                        }
                      }
                    }
                    &-btns {
                      display: none;
                      position: absolute;
                      top: -10px;
                      right: 4px;
                      padding: 3px 5px;
                      background: #fff;
                      i {
                        font-size: 20px;
                        color: #c9cfd7;
                        cursor: pointer;
                      }
                      .el-icon-success {
                        margin-right: 3px;
                      }
                      .el-icon-success.actived {
                        color: #73d897;
                      }
                      .el-icon-error.actived {
                        color: #f56c6c;
                      }
                    }
                  }
                }
              }
              .drawer1-remark {
                .el-textarea__inner {
                  background: #f7f8f9;
                  border: none;
                }
              }
            }
            &-right {
              flex: 1;
              padding: 16px;
              position: relative;
              &::before {
                content: "";
                position: absolute;
                top: 16px;
                left: 0px;
                width: 1px;
                height: calc(100% - 32px);
                background-image: linear-gradient(#00000014 0%, #0000 100%);
              }
            }
          }
          .drawer2 {
            height: 300px;
            padding: 16px;
          }
          .fade-enter-active, .fade-leave-active {
            transition: all .5s;
          }
          .fade-enter, .fade-leave-to {
            bottom: -540px;
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-plan-execute" v-loading="loading">
    <header class="page-plan-execute-header">
      <div class="left">
        <span class="back-icon" @click="goBack"><i class="el-icon-back"></i></span>
        <span class="split-line"></span>
        <span class="plan-name">{{planInfo.name}}</span>
      </div>
      <div class="right">
        <el-button v-if="planInfo.status !== 4" type="primary" @click="showCheckCaseDialogHandle">
          <i class="iconfont iconguihua"></i>规划用例
        </el-button>
        <CheckCase
          :loading="btnLoadings.selectCase"
          :initData="checkCaseCaseList"
          :visible="showCheckCaseDialog"
          @on-ok="checkCaseOk"
          @on-close="showCheckCaseDialog = false"></CheckCase>
      </div>
    </header>
    <main class="page-plan-execute-main" v-if="JSON.stringify(planInfo) !== '{}'">
      <section class="plan-info-bar">
        <div>
          <div class="item">
            <span class="label">状态</span>
            <span class="status" :class="`status${planInfo.status}`">{{planInfo.statusName}}</span>
          </div>
          <div class="item">
            <span class="label">负责人</span>
            <span>{{planInfo.principal}}</span>
          </div>
          <div class="item">
            <span class="label">通过率</span>
            <span>{{planInfo.result.successCount === 0 ? '0%' :((planInfo.result.successCount / planInfo.result.totalCount) * 100).toFixed(2) + '%'}}</span>
          </div>
          <div class="item">
            <span class="label">已测</span>
            <span>{{planInfo.result.totalCount - planInfo.result.pendingCount}}</span>
            <span class="label">/{{planInfo.result.totalCount}}</span>
            <ResultBar :result="planInfo.result" style="width: 240px;display: inline-block"></ResultBar>
          </div>
        </div>
        <div class="plan-info-bar-right">
          <span class="label" v-if="planInfo.status === 1" @click="handleStart">
            <i class="iconfont iconkaishi"></i>开始测试
          </span>
          <span class="label" v-if="planInfo.status !== 1 && planInfo.status !== 4" @click="handleEnd">
            <i class="iconfont iconjieshu"></i>结束测试
          </span>
          <span v-if="planInfo.status === 4">
            <span class="split-line"></span>
            <span class="label" @click="goViewPlanPage">
              <i class="iconfont iconfenxi"></i>测试报告
            </span>
          </span>
        </div>
      </section>
      <section class="main-box">
        <section class="main-box-left">
          <div class="search-bar">
            <el-popover
              popper-class="status-filter-popover"
              placement="bottom-start"
              trigger="click"
              @show="statusFilterActived = true"
              @hide="statusFilterActived = false">
              <div>
                <div
                  v-if="searchData.status.length"
                  class="header"
                  style="color: #409EFF"
                  @click="clearStatus">清除过滤条件</div>
                <div v-else class="header">全部状态</div>
                <el-checkbox-group v-model="searchData.status" @change="statusChange">
                  <el-checkbox v-for="item in caseResult" :key="item.id" :label="item">{{item.value}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div
                slot="reference"
                :class="{actived: statusFilterActived}"
                class="status-filter-popover-reference">
                <span v-if="searchData.status.length">
                  <span v-for="(item, index) in searchData.status" :key="item.id">
                    {{item.value}}<span v-if="searchData.status.length - 1 !== index">.</span>
                  </span>
                </span>
                <span v-else>全部状态</span>
                <i class="el-icon-caret-bottom"></i>
              </div>
            </el-popover>
            <span class="split-line" style="margin-left:2px"></span>
            <el-input
              v-model="searchData.keyword"
              prefix-icon="iconfont iconsearch"
              placeholder="搜索"
              clearable
              :class="{'focused': searchInputFocus}"
              @focus="searchInputFocus = true"
              @blur="searchInputFocus = false"
              @keyup.enter.native="getCaseListByPlanId"
              @clear="getCaseListByPlanId"></el-input>
            <span class="split-line"></span>
            <div class="only-my">
              只测我的
              <el-switch v-model="searchData.onlyMy" :width="28" @change="onlyMyChange"></el-switch>
            </div>
          </div>
          <div class="tree-box">
            <el-tree
              v-loading="treeLoading"
              ref="caseTree"
              class="case-tree"
              node-key="virtualId"
              :data="treeData"
              :props="defaultProps"
              :show-checkbox="planInfo.status !== 4"
              default-expand-all
              @node-click="treeNodeClick"
              @check="treeCheck">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <div class="node-label">
                  {{ node.label }}
                  <span class="case-count" v-if="data.cardType !== 6">{{data.caseCount}}</span>
                </div>
                <div class="select-comply" v-if="data.name === '全部用例' && checkedCaseIdList.length" @click.stop="1">
                  <span class="label">批量指派</span>
                  <el-popover
                    popper-class="plan-setting-popover"
                    placement="bottom-start"
                    width="200"
                    trigger="click"
                    @show="popoverShow.batchComply = true"
                    @hide="popoverShow.batchComply = false">
                    <el-input v-model="batchComplyKeyword" prefix-icon="el-icon-search" placeholder="搜索..." @keyup.enter.native="searchBatchComply"></el-input>
                    <ul v-if="batchComplyList.length">
                      <li v-for="item in batchComplyList" :key="item.id" @click="selectBatchComplyListComply(item.name)">{{item.name}}</li>
                    </ul>
                    <div v-else style="text-align:center;line-height:50px">暂无筛选人员</div>
                    <div
                      :class="popoverShow.batchComply ? 'popover-reference actived' : 'popover-reference'"
                      slot="reference">
                      请选择负责人<i class="el-icon-caret-bottom"></i>
                    </div>
                  </el-popover>
                </div>
                <span class="handle-box">
                  <span class="comply">{{data.comply}}</span>
                  <i v-if="data.result === 2" class="el-icon-success"></i>
                  <i v-if="data.result === 4" class="el-icon-remove"></i>
                  <i v-if="data.result === 1" class="el-icon-question"></i>
                  <i v-if="data.result === 3" class="el-icon-error"></i>
                </span>
              </span>
            </el-tree>
          </div>
        </section>
        <section class="main-box-right" v-loading="caseInfoLoading">
          <section class="header">
            <div class="title">{{caseInfo.name}}</div>
            <div class="item-box">
              <div class="item">
                <span class="label">等级</span>
                <span class="value">P{{caseInfo.priority}}</span>
              </div>
              <div class="item">
                <span class="label" style="margin-right:5px;">分配给</span>
                <el-popover
                  popper-class="plan-setting-popover"
                  placement="bottom-start"
                  width="200"
                  trigger="click"
                  :disabled="planInfo.status === 4"
                  @show="popoverShow.comply = true"
                  @hide="popoverShow.comply = false">
                  <el-input v-model="complyKeyword" prefix-icon="el-icon-search" placeholder="搜索..." @keyup.enter.native="searchComply"></el-input>
                  <ul v-if="complyList.length">
                    <li v-for="item in complyList" :key="item.id" @click="selectComply(item.name)">{{item.name}}</li>
                  </ul>
                  <div v-else style="text-align:center;line-height:50px">暂无筛选人员</div>
                  <div
                    :class="popoverShow.comply ? 'popover-reference actived' : 'popover-reference'"
                    slot="reference">
                    {{caseInfo.comply || ''}}<i class="el-icon-caret-bottom"></i>
                  </div>
                </el-popover>
              </div>
              <div class="item">
                <span class="label">分组</span>
                <span class="value">{{caseInfo.pathName}}</span>
              </div>
            </div>
          </section>
          <section class="main">
            <div>
              <div>前置条件</div>
              <p style="color: #606266">{{caseInfo.premise || '无'}}</p>
            </div>
            <div>
              <div>
                <span>步骤描述</span>
                <span class="step-edit-btn" v-if="!canEditStep">
                  <el-button v-if="planInfo.status !== 4" type="text" icon="el-icon-edit" @click="canEditStep = true">修改步骤</el-button>
                </span>
                <span class="step-edit-btn" v-else>
                  <el-button :loading="btnLoadings.editStep" type="text" icon="el-icon-circle-check" @click="saveEditStep">保存</el-button>
                  <el-button type="text" icon="el-icon-circle-close" @click="cancelEditStep">取消</el-button>
                </span>
              </div>
              <div v-if="!canEditStep" class="step-box">
                <div class="step-box-row step-box-header">
                  <div class="step-box-column1">#</div>
                  <div class="step-box-column2">步骤</div>
                  <div class="step-box-column2">预期</div>
                </div>
                <div class="step-box-row step-item" v-for="(step, index) in caseInfo.stepList" :key="step.id">
                  <div class="step-box-column1">
                    <span>{{index + 1}}</span>
                  </div>
                  <div class="step-box-column2">{{step.operatorContent}}</div>
                  <div class="step-box-column2">{{step.exceptionResult}}</div>
                </div>
              </div>
              <div v-else class="step-box">
                <div class="step-box-row step-box-header">
                  <div class="step-box-column1">#</div>
                  <div class="step-box-column2">步骤</div>
                  <div class="step-box-column2">预期</div>
                </div>
                <div class="step-box-row step-item" v-for="(step, index) in stepListCopy" :key="step.id">
                  <div class="step-box-column1">
                    <span>{{index + 1}}</span>
                  </div>
                  <div class="step-box-column2">
                    <el-input type="textarea" :rows="1" autosize v-model="step.operatorContent" placeholder="请输入步骤"></el-input>
                  </div>
                  <div class="step-box-column2">
                    <el-input type="textarea" :rows="1" autosize v-model="step.exceptionResult" placeholder="请输入预期"></el-input>
                  </div>
                  <div class="handle-btn">
                    <i class="el-icon-remove" @click="delStep(index)"></i>
                  </div>
                </div>
                <div class="step-box-row step-box-footer">
                  <div class="step-box-column1">+</div>
                  <div class="step-box-column2" @click="addStep">增加步骤</div>
                </div>
              </div>
            </div>
          </section>
          <section class="footer">
            <div class="result-box">
              <el-tabs v-model="activeTab">
                <el-tab-pane label="测试结果&注释" name="1">
                  <div v-if="!executionRecord.length" class="no-result">暂无测试结果&注释</div>
                  <div v-else class="result-item" v-for="item in executionRecord" :key="item.id">
                    <div class="result-item-status">
                      <span v-if="item.type === 1">
                        <i v-if="item.result === 2" class="el-icon-success"></i>
                        <i v-if="item.result === 3" class="el-icon-error"></i>
                        <i v-if="item.result === 4" class="el-icon-remove"></i>
                      </span>
                      <span v-if="item.type === 2">
                        <i class="el-icon-chat-dot-round"></i>
                      </span>
                    </div>
                    <div class="result-item-title">
                      <div v-if="item.type === 1">
                        <div v-if="item.comment">{{item.comment}}</div>
                        <div v-else>
                          标记测试结果为
                          <span v-if="item.result === 2">“通过”</span>
                          <span v-if="item.result === 3">“失败”</span>
                          <span v-if="item.result === 4">“受阻”</span>
                        </div>
                      </div>
                      <div v-if="item.type === 2">
                        {{item.comment}}
                      </div>
                    </div>
                    <div class="result-item-steps" v-if="item.type === 1">
                      <div class="s-title">步骤结果</div>
                      <div class="result-item-steps-step" v-for="(step, index) in item.stepResult" :key="index">
                        <span class="result-item-steps-step-index"
                          :class="'result-item-steps-step-index' + step.status">
                          {{index + 1}}
                        </span>
                        <div>{{step.content}}</div>
                        <div v-if="step.actual">
                          <div class="except">预期：<span>{{step.exception}}</span></div>
                          <div class="actual">实际：<span>{{step.actual}}</span></div>
                        </div>
                      </div>
                    </div>
                    <div class="result-item-footer">
                      {{item.operator}}
                      <div class="split"></div>
                      {{item.createTime}}
                    </div>
                  </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="缺陷" name="2">2222</el-tab-pane> -->
              </el-tabs>
            </div>
            <div class="handle-bar">
              <div class="left" v-if="planInfo.status !== 4">
                <span :class="{'actived': resultDrawerShow}" @click="handleShowDrawer('result')" style="margin-right:10px">
                  <i :class="resultDrawerShow ? 'el-icon-circle-plus' : 'el-icon-circle-plus-outline'"></i>
                  记录结果
                </span>
                <span :class="{'actived': noteDrawerShow}" @click="handleShowDrawer('note')">
                  <i :class="noteDrawerShow? 'iconfont iconxiaoxi1' : 'iconfont iconxiaoxi'"></i>
                  发表注释
                </span>
              </div>
              <div class="right">
                <el-dropdown v-if="planInfo.status !== 4" class="next-case-drop" trigger="click" split-button type="primary" @click="changeStatusAndNext(2)">
                  <i class="el-icon-success"></i>通过并下一条
                  <el-dropdown-menu class="next-case" slot="dropdown">
                    <el-dropdown-item @click.native="changeStatusAndNext(3)"><i class="el-icon-error"></i>失败并下一条</el-dropdown-item>
                    <el-dropdown-item @click.native="changeStatusAndNext(4)"><i class="el-icon-remove"></i>受阻并下一条</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button-group class="change-case-btns">
                  <el-button icon="el-icon-arrow-up" @click="prevCase"></el-button>
                  <el-button icon="el-icon-arrow-down" @click="nextCase"></el-button>
                </el-button-group>
              </div>
            </div>
            <transition name="fade">
              <div class="drawer drawer1" v-if="resultDrawerShow">
                <div class="drawer1-left">
                  <div class="drawer-title">记录测试结果</div>
                  <div class="drawer1-result-btns">
                    <div
                      class="drawer1-result-btns-btn"
                      :class="{'actived2': activedStatusBtn === 2}"
                      @click="activedStatusBtn = 2">
                      <i class="el-icon-success"></i>通过
                    </div>
                    <div
                      class="drawer1-result-btns-btn"
                      :class="{'actived4': activedStatusBtn === 4}"
                      @click="activedStatusBtn = 4">
                      <i class="el-icon-remove"></i>受阻
                    </div>
                    <div
                      class="drawer1-result-btns-btn"
                      :class="{'actived3': activedStatusBtn === 3}"
                      @click="activedStatusBtn = 3">
                      <i class="el-icon-error"></i>失败
                    </div>
                  </div>
                  <div class="drawer1-step-box">
                    <div class="drawer1-step-box-title">
                      <span>按步骤测试</span>
                      <span class="all-success" @click="allSucessHandle">
                        <i class="el-icon-success" :class="{'actived': drawerStepAllSucess}"></i>
                        全部通过
                      </span>
                    </div>
                    <div class="drawer1-step-box-contener">
                      <div class="step" v-for="(step, index) in drawerStepList" :key="step.id">
                        <div class="index" :class="{'success': step.status === 2, 'error': step.status === 3}">{{index + 1}}</div>
                        <div style="margin-bottom:8px">{{step.content}}</div>
                        <div class="expect">
                          <span class="label">预期<i class="el-icon-caret-right"></i></span>
                          <span>{{step.exception}}</span>
                        </div>
                        <div class="actual" v-if="step.status === 3">
                          <span class="label">实际<i class="el-icon-caret-right"></i></span>
                          <el-input v-model="step.actual" :autosize="{minRows: 1}" type="textarea" placeholder="输入实际结果"></el-input>
                        </div>
                        <div class="step-btns">
                          <i
                            class="el-icon-success"
                            :class="{'actived': step.status === 2}"
                            @click="step.status = 2"></i>
                          <i
                            class="el-icon-error"
                            :class="{'actived': step.status === 3}"
                            @click="step.status = 3;activedStatusBtn = 3"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="drawer1-remark">
                    <el-input v-model="drawerComment" type="textarea" placeholder="添加备注"></el-input>
                  </div>
                  <div class="drawer-save-btns">
                    <el-button type="info" @click="recordExecutionCaseSave(false)">添加结果</el-button>
                    <el-button @click="recordExecutionCaseSave(true)">添加结果并下一条</el-button>
                  </div>
                </div>
                <div class="drawer1-right"></div>
              </div>
            </transition>
            <transition name="fade">
              <div class="drawer drawer2" v-if="noteDrawerShow">
                <div class="drawer-title">发表注释</div>
                <el-input v-model="drawerComment" :rows="8" type="textarea" placeholder="请输入注释"></el-input>
                <div class="drawer-save-btns">
                  <el-button type="info" @click="noteSave(false)">发表</el-button>
                  <el-button @click="noteSave(true)">发表并下一条</el-button>
                </div>
              </div>
            </transition>
          </section>
        </section>
      </section>
    </main>
  </div>
</template>
<script>
import CheckCase from './components/CheckCase'
import ResultBar from './components/ResultBar'
export default {
  components: { CheckCase, ResultBar },
  data () {
    return {
      planId: this.$route.params.id,
      loading: false,
      btnLoadings: {
        selectCase: false,
        editStep: false
      },
      checkCaseCaseList: [],
      showCheckCaseDialog: false,
      planInfo: {},
      searchData: {
        status: [],
        keyword: '',
        onlyMy: false
      },
      statusFilterActived: false,
      searchInputFocus: false,
      treeLoading: false,
      treeData: [],
      allCase: [],
      activedCaseIndex: null,
      checkedCaseIdList: [],
      defaultProps: {
        children: 'children',
        label: function (data) {
          return data.name
        }
      },
      caseInfo: {},
      caseInfoLoading: false,
      popoverShow: {
        comply: false,
        batchComply: false
      },
      complyKeyword: '',
      batchComplyKeyword: '',
      complyList: [],
      batchComplyList: [],
      canEditStep: false,
      stepListCopy: [],
      activeTab: '1',
      executionRecord: [],
      resultDrawerShow: false,
      activedStatusBtn: 2,
      drawerStepList: [],
      drawerStepAllSucess: false,
      drawerComment: '',
      noteDrawerShow: false
    }
  },
  computed: {
    planStatus () {
      return this.$store.state.allEnum.planStatus
    },
    caseResult () {
      return this.$store.state.allEnum.caseResult
    }
  },
  watch: {
    'drawerStepList': {
      handler (value) {
        this.drawerStepAllSucess = !value.find(step => step.status !== 2)
      },
      deep: true
    },
    'drawerStepAllSucess' (value) {
      if (value) {
        this.activedStatusBtn = 2
      }
    }
  },
  mounted () {
    this.getInfoById()
  },
  methods: {
    showCheckCaseDialogHandle () {
      this.$service.getPlanInfo({ id: this.planId }).then(res => {
        this.checkCaseCaseList = res.data.caseList
        this.showCheckCaseDialog = true
      })
    },
    checkCaseOk (data) {
      this.btnLoadings.selectCase = true
      this.$service.updatePlan({caseList: data, id: this.planId}).then(() => {
        this.showCheckCaseDialog = false
        this.getInfoById()
      }).finally(() => {
        this.btnLoadings.selectCase = false
      })
    },
    allSucessHandle () {
      this.drawerStepList.forEach(step => {
        step.status = 2
      })
    },
    // 发表注释
    noteSave (next) {
      let params = {
        type: 2,
        executionPlanId: this.planId,
        cardId: this.caseInfo.id,
        comment: this.drawerComment
      }
      this.recordExecutionCase(params, next)
    },
    // 记录结果保存
    recordExecutionCaseSave (next) {
      if (this.planInfo.status === 1) {
        this.$msgbox.confirm('此计划未开始，继续操作将自动开始?', '提示', {
          type: 'warning',
          center: true
        }).then(() => {
          this.$service.updatePlan({
            id: this.planId,
            status: 2
          }).then(() => {
            this.$message.success('计划已开始')
            this.planInfo.status = 2
            this.recordExecutionCaseSaveReq(next)
          })
        })
      } else {
        this.recordExecutionCaseSaveReq(next)
      }
    },
    recordExecutionCaseSaveReq (next) {
      let params = {
        type: 1,
        executionPlanId: this.planId,
        cardId: this.caseInfo.id,
        result: this.activedStatusBtn,
        stepResultList: this.drawerStepList,
        comment: this.drawerComment
      }
      this.recordExecutionCase(params, next)
    },
    // 改变状态并下一条
    changeStatusAndNext (status) {
      if (this.planInfo.status === 1) {
        this.$msgbox.confirm('此计划未开始，继续操作将自动开始?', '提示', {
          type: 'warning',
          center: true
        }).then(() => {
          this.$service.updatePlan({
            id: this.planId,
            status: 2
          }).then(() => {
            this.$message.success('计划已开始')
            this.planInfo.status = 2
            this.changeStatusAndNextReq (status)
          })
        })
      } else {
        this.changeStatusAndNextReq (status)
      }
    },
    changeStatusAndNextReq (status) {
      this.$service.updateExecutionCase({ result: status, id: this.caseInfo.id }).then(() => {
        this.updateCaseStatus(this.treeData, status)
        let stepResultList = []
        this.caseInfo.stepList.forEach(step => {
          stepResultList.push({
            content: step.operatorContent,
            exception: step.exceptionResult,
            status: 1
          })
        })
        this.recordExecutionCase({
          type: 1,
          executionPlanId: this.planId,
          cardId: this.caseInfo.id,
          result: status,
          stepResultList: stepResultList
        }, true)
      })
    },
    // 更新左侧tree中状态
    updateCaseStatus (data, status) {
      data.forEach(item => {
        if (item.cardType === 6) {
          if (item.id === this.caseInfo.id) {
            item.result = status
          }
        } else {
          this.updateCaseStatus(item.children, status)
        }
      })
    },
    // 记录
    recordExecutionCase (params, next) {
      this.$service.recordExecutionCase(params).then(() => {
        this.resultDrawerShow = false
        this.noteDrawerShow = false
        this.updateCaseStatus(this.treeData, params.result)
        this.$service.getInfoById({ id: this.planId }).then(res => {
          this.planInfo.result = res.data.result
        })
        if (next) {
          this.nextCase()
        } else {
          this.getExecutionRecord(this.caseInfo.id)
        }
      })
    },
    // 获取用例的结果记录
    getExecutionRecord (id) {
      this.$service.getExecutionRecord({id}).then(res => {
        this.executionRecord = res.data
      })
    },
    handleShowDrawer (type) {
      if (type === 'result') {
        this.noteDrawerShow = false
        this.resultDrawerShow = !this.resultDrawerShow
      } else {
        this.resultDrawerShow = false
        this.noteDrawerShow = !this.noteDrawerShow
      }
    },
    saveEditStep () {
      this.btnLoadings.editStep = true
      this.$service.updateStep({ stepList: this.stepListCopy, id: this.caseInfo.id }).then(() => {
        this.$message.success('修改成功')
        this.caseInfo.stepList = JSON.parse(JSON.stringify(this.stepListCopy))
        this.canEditStep = false
      }).finally(() => {
        this.btnLoadings.editStep = false
      })
    },
    cancelEditStep () {
      this.canEditStep = false
      this.stepListCopy = JSON.parse(JSON.stringify(this.caseInfo.stepList))
    },
    addStep () {
      this.stepListCopy.push({ operatorContent: '', exceptionResult: '' })
    },
    delStep (index) {
      this.stepListCopy.splice(index, 1)
    },
    // 搜索测试执行人
    searchComply () {
      this.$service.getUserByName({ name: this.complyKeyword }).then(res => {
        this.complyList = res.data
      })
    },
    searchBatchComply () {
      this.$service.getUserByName({ name: this.batchComplyKeyword }).then(res => {
        this.batchComplyList = res.data
      })
    },
    // 选择测试负责人
    selectComply (name) {
      this.$service.updateExecutionCase({ comply: name, id: this.caseInfo.id }).then(() => {
        document.querySelector('#app').click()
        this.complyKeyword = ''
        this.caseInfo.comply = name
        this.changeTreeNodeComply(name, this.treeData, [this.caseInfo.id])
      })
    },
    selectBatchComplyListComply (name) {
      this.$service.bathUpdateCaseComply({ comply: name, caseIdList: this.checkedCaseIdList }).then(() => {
        this.$message.success('批量指派成功')
        document.querySelector('#app').click()
        this.batchComplyKeyword = ''
        this.changeTreeNodeComply(name, this.treeData, this.checkedCaseIdList)
      })
    },
    changeTreeNodeComply (name, data, list) {
      data.forEach(item => {
        if (item.cardType === 6) {
          if (list.includes(item.id)) {
            item.comply = name
          }
        } else {
          this.changeTreeNodeComply(name, item.children, list)
        }
      })
    },
    // 开始计划
    handleStart () {
      this.$service.updatePlan({
        id: this.planId,
        status: 2
      }).then(() => {
        this.$message.success('计划已开始')
        this.planInfo.status = 2
      })
    },
    // 结束计划
    handleEnd () {
      let message = ''
      if (this.planInfo.result.pendingCount) {
        message = '该计划有未测用例，确认结束吗？'
      } else {
        message = '确认结束此计划?'
      }
      this.$msgbox.confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.updatePlan({
          id: this.planId,
          status: 4
        }).then(() => {
          this.$message.success('计划已结束')
          this.planInfo.status = 4
        })
      })
    },
    // 前往查看测试报告页面
    goViewPlanPage () {
      this.$router.push(`/planReportDetail/${this.planId}`)
    },
    // 获取计划信息
    getInfoById () {
      this.loading = true
      this.$service.getInfoById({ id: this.planId }).then(res => {
        this.planStatus.forEach(item => {
          if (item.id === res.data.status) {
            res.data.statusName = item.value
          }
        })
        this.planInfo = res.data
        this.getCaseListByPlanId()
      }).finally(() => {
        this.loading = false
      })
    },
    // 获取计划用例
    getCaseListByPlanId () {
      this.treeLoading = true
      let params = {
        executionPlanId: this.planId,
        title: this.searchData.keyword
      }
      if (this.searchData.onlyMy) {
        params.complyList = [this.$store.state.userInfo.name]
      }
      if (this.searchData.status.length) {
        let list = []
        this.searchData.status.forEach(item => {
          list.push(item.id)
        })
        params.statusList = list
      }
      this.$service.getCaseListByPlanId(params).then((res) => {
        this.treeData = [{
          id: '0',
          virtualId: '0',
          name: '全部用例',
          path: '0',
          pathName: '全部用例',
          caseCount: 0,
          children: res.data
        }]
        this.$nextTick(() => {
          this.allCase = []
          this.getAllCase(res.data)
          this.treeData[0].caseCount = this.allCase.length
          if (this.allCase.length) {
            this.activedCaseIndex = 0
            this.treeNodeClick(this.allCase[0])
            this.$refs.caseTree.setCurrentKey(this.allCase[0].virtualId)
          }
        })
      }).finally(() => {
        this.treeLoading = false
      })
    },
    // 提取全部case
    getAllCase (data) {
      data.forEach(item => {
        if (item.cardType === 6) {
          this.allCase.push(item)
        } else {
          this.getAllCase(item.children)
        }
      })
    },
    // 上一条
    prevCase () {
      if (!this.activedCaseIndex) return
      this.activedCaseIndex -= 1
      this.treeNodeClick(this.allCase[this.activedCaseIndex])
      this.$refs.caseTree.setCurrentKey(this.allCase[this.activedCaseIndex].virtualId)
    },
    // 下一条
    nextCase () {
      if (this.activedCaseIndex !== null  && (this.activedCaseIndex === this.allCase.length - 1)) return
      this.activedCaseIndex += 1
      this.treeNodeClick(this.allCase[this.activedCaseIndex])
      this.$refs.caseTree.setCurrentKey(this.allCase[this.activedCaseIndex].virtualId)
    },
    statusChange () {
      this.getCaseListByPlanId()
    },
    clearStatus () {
      this.searchData.status = []
      document.querySelector('#app').click()
      this.getCaseListByPlanId()
    },
    onlyMyChange () {
      this.getCaseListByPlanId()
    },
    // 点击tree中case
    treeNodeClick (data) {
      if (data.cardType === 6) {
        this.activedCaseIndex = this.allCase.findIndex(item => item.virtualId === data.virtualId)
        this.caseInfoLoading = true
        this.$service.getExecutionCaseDetail({ id: data.id }).then((res) => {
          this.caseInfo = res.data
          this.getExecutionRecord(res.data.id)
          this.stepListCopy = JSON.parse(JSON.stringify(res.data.stepList))
          this.drawerStepList = []
          res.data.stepList.forEach(step => {
            this.drawerStepList.push({
              actual: '',
              content: step.operatorContent,
              exception: step.exceptionResult,
              status: null
            })
          })
        }).finally(() => {
          this.caseInfoLoading = false
        })
      }
    },
    treeCheck (node, data) {
      this.checkedCaseIdList = []
      data.checkedNodes.forEach(item => {
        if (item.cardType === 6) {
          this.checkedCaseIdList.push(item.id)
        }
      })
    },
    goBack () {
      this.$router.push('/planList')
    }
  }
}
</script>