<template>
    <div class="">
      OBS Browser Source
      <a href="https://streamwaifus.chat/s/298349238429348234" class="btn btn-link" @click.prevent>https://streamwaifus.chat/s/298349238429348234</a>

    </div>



    
<!-- 
      <InputGroup>
        <InputText v-model="browserSourceUrl" disabled placeholder="Disabled" />
        <Button v-if="isSupported" @click="copy(browserSourceUrl)">
          <span v-if="!copied">Copy</span>
          <span v-else>Copied!</span>
        </Button>
      </InputGroup> -->


</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
const browserSourceUrl = ref('https://example.com/s/1234556')
const { copy, copied, isSupported } = useClipboard({ source: browserSourceUrl })


</script>

<style></style>