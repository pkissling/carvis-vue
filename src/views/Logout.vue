<template>
  <div>
    <h1>Logout</h1>
  </div>
</template>

<script>
export default {
  name: 'Logout',
  created () {
    this.$auth.logout();
  }
}
</script>