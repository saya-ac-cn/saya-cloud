<template>
  <div class="base-content">
    <div class="container">
      <div class="menu-title">
        <div class="menu-name">
          <i class="el-icon-caret-right"></i>接口查询
        </div>
      </div>
      <el-tabs tab-position="left">
        <el-tab-pane label="行政区域查询-1">
            <span>行政区域查询（省/直辖市/自治区、市、县/区）</span>
            <el-form :inline="true" :model="formInline" class="mca-form">
              <el-form-item  size="small" label="审批人">
                <el-input v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item size="small" label="审批人">
                <el-input v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item size="small" label="活动区域">
                <el-select v-model="formInline.region" placeholder="活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item size="small">
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-form>
            <div class="tip">
              <p>
              说明：此接口根据省/直辖市/自治区、市、县/区，三级联动的数据查询方式。数据来源于国家民政部2018年数据，本系统中的数据根据国家民政部每年
                年底汇总后的数据，整理统计好后同步更新。
              </p>
            </div>
        </el-tab-pane>
        <el-tab-pane label="行政区域查询-2">配置管理</el-tab-pane>
        <el-tab-pane label="敬请期待">敬请期待</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {validater} from '../../vars/validater'
  import { writeboard } from '../../api/api';
  export default {
    name: 'query',
    data(){
      return{
        formInline: {
          user: '',
          region: ''
        }
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;
  }
  .mca-form{
    margin-top: 1em;
  }
</style>
