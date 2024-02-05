<template>
  <div>
    <p>Waiting for login...</p>
  </div>
</template>

<script lang="ts" setup>
  const user = useSupabaseUser()
  watch(user, () => {
    if (user.value) {
      return navigateTo('/')
    }
  }, { immediate: true })
</script>

<style>

</style>