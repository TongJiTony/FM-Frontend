<template>
  <div>
    <h1>Test Page</h1>
    <p v-if="loading">Loading...</p>
    <div v-else>
      <p>Data from api/testexample:</p>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      data: "",
    };
  },
  created() {
    axios.get('/api/v1/testexampleapi')
        .then(response => {
          this.data = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error(error);
          this.loading = false;
        });
  }
};
</script>
