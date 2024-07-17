<template>
  <div class="admin-layout">
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>Admin Panel</h2>
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
        { name: 'Home', path: '/', icon: 'fas fa-home' },
        { name: 'Matches', path: '/admin/matches', icon: 'fas fa-futbol' },
        { name: 'Players', path: '/admin/players', icon: 'fas fa-users' },
        { name: 'Records', path: '/admin/records', icon: 'fas fa-file-alt' },
        { name: 'Stadiums', path: '/admin/stadiums', icon: 'fas fa-warehouse' },
        { name: 'Teams', path: '/admin/teams', icon: 'fas fa-shield-alt' },
        { name: 'Users', path: '/admin/users', icon: 'fas fa-user-cog' },
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
