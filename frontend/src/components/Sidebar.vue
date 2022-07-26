<script setup>
const props = defineProps({
    id: String,
    username: String,
    avatar: String,
});
</script>
<template>
    <div className="cursor-pointer" @click="$emit('changeChat', props.id, props.username, props.avatar)">
  <div class="flex items-center space-x-4 mt-2 ml-2 hover:bg-gray-100 rounded-sm py-2 px-2">
  <div class="relative">
    <img class="w-10 h-10 rounded-full" :src="props.avatar" alt="" />
</div>
    <div class="space-y-1 font-medium dark:text-white hidden xl:block">
        <div className="flex justify-between items-center w-[430px]">
        <h2 className="xl:text-lg font-bold">{{props.username}}</h2>
        </div>
</div>
     </div>
    </div>
</template>