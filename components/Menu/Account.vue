<template>
    <div class="card w-96 bg-base-100 shadow-xl">
      <h2 class="card-title"><i class="icon pi pi-user"></i>Account</h2>
    <div class="card-body">
      <button
        v-if="!user"
        class="button"
        @click="supabase.auth.signInWithOAuth({ provider: 'twitch'})"
      >Login via Twitch</button>
      <p v-if="user"><i class="icon pi pi-check"></i>Logged in as {{ user?.user_metadata.nickname }}</p>
      <!-- <div v-if="user">
        <label for="streamerModeSwitch">Streamer Mode</label>
        <InputSwitch v-model="isStreamer" inputId="streamerModeSwitch">Streamer Mode</InputSwitch>
      </div> -->
      {{ JSON.stringify(settings, null, 2) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const isStreamer = ref<boolean>(false)


  const settingsFromServer = ref()
  const loading = ref(false)

  const { data: settings } = await useAsyncData('settings', async () => {
    const { data } = await supabase.from('settings').select('is_streamer').eq('user_id', user.id).order('created_at')
    return data
  })

</script>

<style>
  [class^="icon"] {
    vertical-align: middle;
    margin-right: 1rem;
  }
  .pi-check {
    color: greenyellow;
    font-weight: bold;
  }
</style>