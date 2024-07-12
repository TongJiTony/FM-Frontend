<template>
    <e1-container>
        <e1-header>
        <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="球队简介" name="first">
        <el-descriptions title="用户信息">
    <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
    <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
    <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
    <el-descriptions-item label="备注">
    </el-descriptions-item>
    <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="球员列表" name="second"></el-tab-pane>
      <el-tab-pane label="财务表" name="third"></el-tab-pane>
    </el-tabs>
    </e1-header>
    <e1-main>
        
    </e1-main>
    </e1-container>
  </template>

  <script>
    export default {
      data() {
        return {
          activeName: 'second'
        };
      },
      methods: {
        handleClick(tab, event) {
          console.log(tab, event);
        }
      }
    };
  </script>