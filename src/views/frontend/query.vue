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
            <el-form :inline="true" :model="mca.select" class="mca-form">
              <el-form-item  size="small" label="省/直辖市/自治区">
                <el-input v-model="mca.select.province" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item size="small" label="市">
                <el-input v-model="mca.select.city" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item size="small" label="县/区">
                <el-select v-model="mca.select.distinct" placeholder="活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="tip">
              <p>
                说明：此接口根据省/直辖市/自治区、市、县/区，三级联动的数据查询方式。数据来源于国家民政部2018年数据，本系统中的数据根据国家民政部每年
                年底汇总后的数据，整理统计好后同步更新。
              </p>
              <p>
                注意：当前系统中主要维护了中国🇨🇳大陆各省市的行政区域数据，港澳台地区数据暂缺。由于数据接口服务缺乏专人对服务器、网络的7×24小时维护，
                可能会对服务的稳定性造成影响。请勿用于生产环境。
              </p>
            </div>
        </el-tab-pane>
        <el-tab-pane label="行政区域查询-2">
          <span>行政区域查询（省/直辖市/自治区、市、县/区、镇、村）</span>
          <el-form :inline="true" :model="formInline" class="mca-form">
            <el-form-item  size="small" label="省/直辖市/自治区">
              <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item size="small" label="市">
              <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item size="small" label="县/区">
              <el-select v-model="formInline.region" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" label="镇">
              <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item size="small" label="村">
              <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
          </el-form>
          <div class="tip">
            <p>
              说明：此接口根据省/直辖市/自治区、市、县/区、镇、村，五级联动的数据查询方式。数据来源于国家统计局2018年数据，本系统中的数据根据国家统计局每年
              年底汇总后的数据，整理统计好后同步更新。
            </p>
            <p>
              注意：当前系统中主要维护了中国🇨🇳大陆各省市的行政区域数据，港澳台地区数据暂缺。由于数据接口服务缺乏专人对服务器、网络的7×24小时维护，
              可能会对服务的稳定性造成影响。请勿用于生产环境。
            </p>
          </div>
        </el-tab-pane>
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
        },
        mca:{
          api:[],
          select:{
            province:'',
            city:'',
            distinct:''
          },
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
