<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="PLAYER_ID"
        label="Player ID"
        width="150">
      </el-table-column>
      <el-table-column
        prop="PLAYER_NAME"
        label="Player Name"
        width="150">
      </el-table-column>
      <el-table-column
        prop="BIRTHDAY"
        label="Birthday"
        width="150">
      </el-table-column>
      <el-table-column
        prop="TEAM_ID"
        label="Team ID"
        width="150">
      </el-table-column>
      <el-table-column
        prop="ROLE"
        label="Role"
        width="150">
      </el-table-column>
      <el-table-column
        prop="USED_FOOT"
        label="Used Foot"
        width="150">
      </el-table-column>
      <el-table-column
        prop="HEALTH_STATE"
        label="Health State"
        width="150">
      </el-table-column>
      <el-table-column
        prop="RANK"
        label="Rank"
        width="150">
      </el-table-column>
      <el-table-column
        prop="GAME_STATE"
        label="Game State"
        width="150">
      </el-table-column>
      <el-table-column
        prop="TRANS_STATE"
        label="Transfer State"
        width="150">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Actions"
        width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">View</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.fetchPlayers();
  },
  methods: {
    fetchPlayers() {
      axios.get('/api/v1/player/all')
        .then(response => {
          this.tableData = response.data;
        })
        .catch(error => {
          console.error('Failed to fetch player list:', error);
        });
    },
    handleClick(row) {
      this.$router.push(`/player-display/${row.PLAYER_ID}`);
    }
  }
};
</script>

<style scoped>
.player-list {
  padding: 1rem;
}
</style>
