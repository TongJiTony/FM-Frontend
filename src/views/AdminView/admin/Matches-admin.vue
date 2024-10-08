<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('admin:matches:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('admin:matches:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="MATCH_ID"
        header-align="center"
        align="center"
        label="比赛ID">
      </el-table-column>
      <el-table-column
        prop="MATCH_DATE"
        header-align="center"
        align="center"
        label="比赛日期">
      </el-table-column>
      <el-table-column
        prop="MATCH_STADIUM"
        header-align="center"
        align="center"
        label="比赛地点">
      </el-table-column>
      <el-table-column
        prop="HOME_TEAM_ID"
        header-align="center"
        align="center"
        label="主场球队ID">
      </el-table-column>
      <el-table-column
        prop="AWAY_TEAM_ID"
        header-align="center"
        align="center"
        label="客场球队ID">
      </el-table-column>
      <el-table-column
        prop="HOME_TEAM_SCORE"
        header-align="center"
        align="center"
        label="主场得分">
      </el-table-column>
      <el-table-column
        prop="AWAY_TEAM_SCORE"
        header-align="center"
        align="center"
        label="客场得分">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.matchId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.matchId)">删除</el-button>
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
import AddOrUpdate from './Matches-add-or-update.vue';
import { isAuth } from "@/utils";

export default {
  name: 'MatchesAdmin',
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
  components: {
    AddOrUpdate
  },
  created() {
    this.getDataList();
  },
  activated() {
    this.getDataList();
  },
  methods: {
    isAuth,
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      axios.get('/api/v1/match/displayall', {
        params: {
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key
        }
      }).then(({ data }) => {
        if (data) {
          this.dataList = data.slice((this.pageIndex-1)*this.pageSize,this.pageIndex*this.pageSize);
          this.totalPage = data.length;
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
      const ids = id ? [id] : this.dataListSelections.map(item => item.matchId);
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/api/admin/matches/delete', ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
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

