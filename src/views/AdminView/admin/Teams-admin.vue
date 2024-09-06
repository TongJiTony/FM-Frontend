<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('admin:teams:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('admin:teams:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="TEAM_NAME"
        header-align="center"
        align="center"
        label="球队名称">
      </el-table-column>
      <el-table-column
        prop="ESTABLISHED_DATE"
        header-align="center"
        align="center"
        label="成立时间">
      </el-table-column>
      <el-table-column
        prop="HEAD_COACH"
        header-align="center"
        align="center"
        label="主教练">
      </el-table-column>
      <el-table-column
        prop="CITY"
        header-align="center"
        align="center"
        label="所在城市">
      </el-table-column>
      <el-table-column
        prop="TEAM_ID"
        header-align="center"
        align="center"
        label="球队id">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.TEAM_ID)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.TEAM_ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import axios from 'axios';
import AddOrUpdate from './Teams-add-or-update.vue';
import { isAuth } from "@/utils";

export default {
  name: 'TeamsAdmin',
  data() {
    return {
      dataForm: {
        key: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    };
  },
  created() {
    this.getDataList();
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    isAuth,
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      // 检查如果当前页码为2且带有搜索关键词，则调整为第一页
      if (this.pageIndex > 1 && this.dataForm.key) {
        this.pageIndex = 1;
      }
      axios.get('/api/v1/team/admin/displayall', {
        params: {
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key
        }
      }).then(({ data }) => {
        if (data) {
          this.dataList = data.data;
          this.totalPage = data.total;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => item.TEAM_ID);
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(ids)
        axios.delete('/api/v1/team/admin/delete', {
          data: ids,
          headers: {
            'Content-Type': 'application/json'
          }
        })
            .then(({ data }) => {
              if (data.deletedCount) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList();
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            });
      });
    }
  }
};
</script>