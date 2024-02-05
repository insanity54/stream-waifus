<template>
  <div class="grid grid-cols-3 mb-10 mt-5 mr-5 ml-5 gap-10">
    <input type="text" placeholder="Search" class="input input-bordered input-primary w-full max-w-xs mb-2">

    <div class="collapse bg-base-200 col-span-2">
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">
        Add a new Waifu
      </div>
      <div class="collapse-content">
        <input type="file" class="file-input w-full" multiple accept="image/*" @change="uploadFiles" />
        <progress v-if="uploading" class="progress progress-success w-full" :value="uploadProgress" max="100"></progress>
      </div>
    </div>
  </div>

  <!-- waifu uploader -->
  <dialog id="waifuUploader" class="modal" ref="waifuUploader">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Add new Waifu</h3>

      <div class="grid grid-cols-2 gap-2 mt-10">


        <div class="modal-action">
          <div class="grid grid-rows-3 gap-2">
            <button class="btn" id="select-files" color="primary">upload</button>
          </div>
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
        </div>
      </div>

    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>


  <!-- waifu context menu (modal) -->
  <dialog id="waifuContextMenu" class="modal" ref="waifuContextMenu">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ selectedWaifu?.name }}</h3>

      <div class="grid grid-cols-2 gap-2 mt-10">
        <NuxtImg v-if="selectedWaifu?.image" :src="selectedWaifu.image" />

        <div class="modal-action">
          <div class="grid grid-rows-3 gap-2">
            <button class="btn btn-success">Assign to slot</button>
            <button class="btn btn-warning">Remove from slot</button>
            <button class="btn btn-error">Flag</button>
          </div>
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
        </div>
      </div>

    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <!-- waifu cards-->
  <div class="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-5">
    <div class="indicator" v-for="waifu in waifus" :key="waifu.id" @click="openWaifuModal(waifu)">
      <span class="indicator-item indicator-center badge badge-info select-none">
        Slot 1
      </span>
      <div class="card lg:w-64 md:w-56 cursor-pointer select-none bg-base-100 shadow-xl">


        <figure class="px-10 pt-10 h-72">
          <NuxtImg class="relative" :src="waifu.image" width="100%" height="100%" />
        </figure>
        <div class="card-body items-center text-center">
          <h1 class="card-title">{{ waifu.name }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type Waifu = {
  name: string;
  id: string;
  image: string;
}


const waifuContextMenu = ref<HTMLDialogElement | null>(null)
const waifuUploader = ref<HTMLDialogElement | null>(null)
const uploadProgress = ref<number>(0)
const preSignedUploadUrl = useState<string | null>('preSignedUploadUrl')

const files = ref<File[]>([]);
const uploading = ref(false);
const uploadTasksCompleted = ref<number>(0);
const totalUploadTasks = ref<number>(0);

const selectedWaifu = ref<Waifu | null>(null)
const supabase = useSupabaseClient()
const waifus = ref<Waifu[]>([])
async function getWaifus() {
  const { data } = await supabase.from('waifus').select()
  waifus.value = data || []; // Use the empty array if data is null
}



onMounted(() => {
  getWaifus()
})
async function openWaifuModal(waifu: Waifu) {
  selectedWaifu.value = waifu

  const dialogElement = waifuContextMenu.value
  if (!dialogElement) {
    console.error('Waifu context menu ref is null')
  } else {
    dialogElement.showModal()
  }
}
async function openWaifuUploader() {
  const dialogElement = waifuUploader.value
  if (!dialogElement) {
    console.error('Waifu uploader ref is null')
  } else {
    dialogElement.showModal()
  }
}

const uploadFiles = async (evt: Event) => {
  if (!evt) throw new Error('evt arg was missing');
  
  // Assuming evt.target is of type HTMLInputElement
  const inputElement = evt.target as HTMLInputElement;

  if (!inputElement.files) {
    throw new Error('No files selected');
  }

  console.log(inputElement.files);

  
  // one task of getting a pre-signed URL
  // one task of making the upload
  // one task of creating the waifu in supabase
  const totalUploadTasks = inputElement.files.length*2; 
  let uploadTasksCompleted = 0;
  uploadProgress.value = 0;
  uploading.value = true;


  for (const file of inputElement.files) {
    
    console.log(file)

    // Get pre-signed URL based on the filename
    const url = await getPreSignedUploadUrl(file)
    uploadTasksCompleted++;
    uploadProgress.value = Math.floor((uploadTasksCompleted / totalUploadTasks) * 100);

    // Upload the file
    await uploadFile(file, url)
    uploadTasksCompleted++;
    uploadProgress.value = Math.floor((uploadTasksCompleted / totalUploadTasks) * 100);

  }

  window.setTimeout(() => {
    uploading.value = false;
  }, 250)
};


async function uploadFile(file: File, url: string) {
  // Implement logic to upload the file using the pre-signed URL
  // This could be done using fetch, axios, or any other HTTP library
  // Example: await axios.put(url, file.file);
  const res = await $fetch(url, {
    method: 'PUT'
  })
  console.log('here is the result of uploading file');
  console.log(res)
}

async function uploadWaifu(evt: Event) {
  console.log(`uploading waifu`);
  if (!evt) throw new Error('evt arg was missing');

  // Assuming evt.target is of type HTMLInputElement
  const inputElement = evt.target as HTMLInputElement;

  if (!inputElement.files) {
    throw new Error('No files selected');
  }

  console.log(inputElement.files);

  // Assuming getPreSignedUploadUrl is a function that returns a Promise<string>
  const url = await getPreSignedUploadUrl(inputElement.files[0]);
}
async function getPreSignedUploadUrl(file: File): Promise<string> {
  if (!file.name) throw new Error('getPreSignedUploadUrl was called without required filename param')
  const preSignedUploadUrl = await $fetch(`/api/uploads?filename=${file.name}`);
  console.log(`got preSignedUploadUrl=${preSignedUploadUrl}`)
  return preSignedUploadUrl
}



</script>

<style></style>

