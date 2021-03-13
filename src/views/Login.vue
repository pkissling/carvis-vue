<template>
  <div>
    <h1>Login</h1>
  </div>
</template>

<script>
import { getInstance } from "../auth";

export default {
  name: 'Login',
  async created () {
    const i = await getInstance()
    i.loginWithRedirect()
  }
}
</script>