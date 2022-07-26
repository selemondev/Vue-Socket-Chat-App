<script setup>
import { CameraIcon } from '@heroicons/vue/outline';
import { storage } from "../firebaseConfig.js";
import {createAvatar} from "../utils/url";
import { reactive, computed, ref , watchEffect} from "vue";
import useVuelidate from "@vuelidate/core";
import { required,helpers } from "@vuelidate/validators";
import { ref as storageRef, uploadBytes, getDownloadURL} from "firebase/storage";
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const token = ref("")
const profileData = reactive({
    username: "",
    selectedImage: "",
    blob: "",
    id: "",
    avatar: ""
});
watchEffect(() => {
    token.value = authStore.user?.data?.token;
    profileData.username = authStore.user?.data?.username;
    profileData.id = authStore.user?.data?._id;
});

const config = {
    headers: {
        Authorization: `Bearer ${token.value}`
    }
};

watchEffect( async () => {
    const response = await axios.get("http://localhost:5000/api/auth/credentials", config);
    profileData.avatar = response.data.avatar
})
const fileUpload = () => {
    const target = event.target;
    const file = target.files[0];
    profileData.selectedImage = file;
    profileData.blob = URL.createObjectURL(file);
}
const rules = computed(() => {
    return {
        username: { required: helpers.withMessage(" Username is required", required)},
        selectedImage: { required: helpers.withMessage("Profile Image is required", required)}
    }
});
const v$ = useVuelidate(rules, profileData);
const handleSubmit = async () => {
    const result = await v$.value.$validate();
    if( result ) {
        loading.value = true;
        let profileImage;
        const imageReference = storageRef( storage, `images/${new Date().getTime()}`);
        const snap = await uploadBytes(imageReference, profileData.selectedImage);
        const downloadImageUrl = await getDownloadURL(storageRef(storage, snap.ref.fullPath));
        profileImage = downloadImageUrl;
        await axios.put(`http://localhost:5000/api/auth/createAvatar/${profileData.id}`, {
            avatar: profileImage,
        }, config);
        loading.value = false;
        setTimeout(() => {
            profileData.blob = ""
        }, 1000);
        router.push("/chat")
    }
};
const removeSelectedImage = () => {
    return profileData.blob = ""
}
</script>
<template>
<main class="grid-center md:pt-14">
          <div class="max-w-sm w-72 mt-14 mb-4 md:w-96 md:mt-6 md:mb-6">
        <form class="w-full px-6 py-4 bg-white border border-gray-200 rounded-sm shadow-sm" @submit.prevent="handleSubmit">
            <div class="grid-center pb-4">
                <h3 class="font-bold text-green-500 text-xl md:text-2xl">Create Profile</h3>
            </div>
            <div class="grid-center">
               <div v-if="!profileData.blob">
                 <label for="fileUpload" class="grid-center">
                 <CameraIcon class="w-10 h-10 text-black cursor-pointer"/>
               </label>
               <input type="file" hidden name="fileUpload" id="fileUpload" @change="fileUpload">
                 <p class="error" v-if="v$.selectedImage.$error">{{ v$.selectedImage.$errors[0].$message}}</p>
               </div>
               <div v-if="profileData.blob">
                <img :src="profileData.blob" alt="blob" class="w-48 h-48 rounded-sm">
                <div class="grid-center" @click="removeSelectedImage()">
                    <p class="text-red-500 hover:text-red-600 cursor-pointer py-2">Remove selected image</p>
                </div>
               </div>

               <div v-else>
                   <img :src="profileData.avatar" alt="blob" class="w-48 h-48 rounded-sm">
               </div>
            </div>
            <div class="pb-4">
                <label for="username" class="label">Username</label>
                <input type="text" placeholder="Username" class="input" v-model="profileData.username">
            </div>
            <div>
                 <button type="submit" class="w-full py-2.5 bg-green-800 hover:bg-green-900 text-white rounded-md">{{ loading ? "Creating Profile ...." : "Create Profile"}}</button>
            </div>
        </form>
    </div>
</main>
</template>