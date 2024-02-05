<template>

  <div class="navbar bg-base-100">
    <div class="flex-1">
      <h1 class="text-4xl m-3 font-extrabold">Stream Waifus</h1>
    </div>
    <div class="flex-none">
      
      
      <!-- <p>{{ JSON.stringify(user, null, 2) }}</p> -->
      <div v-if="user?.user_metadata" class="avatar">
        <div class="w-14 rounded-full">
          <NuxtImg :src="user.user_metadata.picture"></NuxtImg>
        </div>
      </div>

      <div v-else>
        <button class="btn">Login</button>
      </div>
    </div>
    

    


  </div>


  <div class="flex flex-col w-full border-opacity-50">
    <div class="grid h-20 card bg-base-300 rounded-box place-items-center">
      <MenuBrowserSource/>
    </div>
    <div class="divider"><PhosphorIconHeart size="2rem"/></div>
    <div class="grid card bg-base-300 rounded-box place-items-center">
      <MenuWaifus/>
    </div>
  </div>

  <div class="divider"><PhosphorIconHeart size="2rem"/></div>

  <footer class="footer footer-center p-4 bg-neutral text-base-content">
    <aside>
      <p>Stream Waifus by <a class="link" target="blank" href="https://x.com/cj_clippy">CJ_Clippy</a></p>
    </aside>
  </footer>

</template>

<script lang="ts" setup>
const user = useSupabaseUser()
</script>

<style>

</style>