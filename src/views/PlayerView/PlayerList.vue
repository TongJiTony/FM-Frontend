<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      fixed
      prop="date"
      label="日期"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="province"
      label="省份"
      width="120">
    </el-table-column>
    <el-table-column
      prop="city"
      label="市区"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      width="300">
    </el-table-column>
    <el-table-column
      prop="zip"
      label="邮编"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    methods: {
      handleClick(row) {
        console.log(row);
        this.$router.push("player-display")
      }
    },

    data() {
      return {
        tableData: [{
          date: '1',
          name: 'a',
          province: '上海',
          city: 'x',
          address: 'ad1',
          zip: 200331
        }, {
          date: '2',
          name: 'b',
          province: '上海',
          city: 'y',
          address: 'ad2',
          zip: 200332
        }, {
          date: '3',
          name: 'c',
          province: '上海',
          city: 'z',
          address: 'ad3',
          zip: 200333
        }, {
          date: '4',
          name: 'd',
          province: '上海',
          city: 'e',
          address: 'ad4',
          zip: 200334
        }]
      }
    }
  }
</script>