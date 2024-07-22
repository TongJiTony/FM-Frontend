<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('admin:players:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('admin:players:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="PLAYER_ID"
        header-align="center"
        align="center"
        label="playerId">
      </el-table-column>
      <el-table-column
        prop="PLAYER_NAME"
        header-align="center"
        align="center"
        label="playerName">
      </el-table-column>
      <el-table-column
        prop="BIRTHDAY"
        header-align="center"
        align="center"
        label="birthday">
      </el-table-column>
      <el-table-column
        prop="TEAM_ID"
        header-align="center"
        align="center"
        label="teamId">
      </el-table-column>
      <el-table-column
        prop="ROLE"
        header-align="center"
        align="center"
        label="role">
      </el-table-column>
      <el-table-column
        prop="USED_FOOT"
        header-align="center"
        align="center"
        label="usedFoot">
      </el-table-column>
      <el-table-column
        prop="HEALTH_STATE"
        header-align="center"
        align="center"
        label="healthState">
      </el-table-column>
      <el-table-column
        prop="RANK"
        header-align="center"
        align="center"
        label="rank">
      </el-table-column>
      <el-table-column
        prop="GAME_STATE"
        header-align="center"
        align="center"
        label="gameState">
      </el-table-column>
      <el-table-column
        prop="TRANS_STATE"
        header-align="center"
        align="center"
        label="transState">
      </el-table-column>
      <el-table-column
        prop="IS_SHOW"
        header-align="center"
        align="center"
        label="isShow">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.PLAYER_ID)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.PLAYER_ID)">删除</el-button>
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
import AddOrUpdate from './Players-add-or-update.vue';
import { isAuth } from "@/utils";

export default {
  name: 'PlayersAdmin',
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
      axios.get('/api/v1/player/admin/displayall', {
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
      const ids = id ? [id] : this.dataListSelections.map(item => item.playerId);
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/api/v1/admin/player/delete', ids)
            .then(({ data }) => {
              if (data && data.code === 200) {
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
