<script setup>
import Logo from "../assets/Whatsapp-logo/whatsapp.png";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
import { watchEffect, ref } from "vue";
const authStore = useAuthStore();
const router = useRouter();
const token = ref("");
watchEffect(() => {
    token.value = authStore?.user;
})
const handleLogOut = async () => {
    authStore.logOut();
    router.push("/")
}
</script>
<template>
    <div v-if="token">
        <header>
            <nav className='flex justify-between items-center p-2 bg-white border-b border-gray-200'>
                <div>
                    <img :src="Logo" alt="Whatsapp Logo" className='w-10 h-10' />
                </div>

                <div>
                <button @click="handleLogOut()" type="button" class="button">Log Out</button>
                </div>
            </nav>
        </header>
    </div>
</template>