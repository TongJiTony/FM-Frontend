<template>
  <div class="admin-layout">
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>管理员页面</h2>
      </div>
      <ul>
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.path" :class="{ active: $route.path === item.path }">
            <i :class="item.icon"></i>
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { isAuth } from '@/utils';
export default {
  data() {
    return {
      menuItems: [
        { name: '用户页面', path: '/' },
        { name: '用户管理', path: '/admin/users' },
        { name: '队伍管理', path: '/admin/teams' },
        { name: '球员管理', path: '/admin/players'  },
        { name: '比赛管理', path: '/admin/matches'},
        { name: '场馆管理', path: '/admin/stadiums' },
        { name: '财务记录', path: '/admin/records'  },
      ]
    }
  },
  methods: {
    isAuth,
    navigateTo(routePath) {
      const currentRoute = this.$route.path;
      if (currentRoute !== routePath) {
        this.$router.push(routePath);
      }
    }
  }
}
</script>

<style>
.admin-layout {
  display: flex;
}

.sidebar {
  width: 200px;
  height: 100vh;
  background-color: #333;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  background-color: #444;
  text-align: center;
  font-size: 1.2em;
  border-bottom: 1px solid #555;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
}

.sidebar li {
  padding: 10px 20px;
}

.sidebar a {
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.sidebar a .fas {
  margin-right: 10px;
}

.sidebar a:hover {
  background-color: #444;
}

.sidebar a.active {
  background-color: #555;
}

.sidebar a.active:hover {
  background-color: #666;
}

.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #666;
}

.content {
  margin-left: 200px;
  padding: 20px;
  width: calc(100% - 200px);
  background-color: #f4f4f4;
  min-height: 100vh;
}
</style>
