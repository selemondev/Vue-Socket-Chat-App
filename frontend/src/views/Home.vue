<script setup>
import Img from "../assets/Whatsapp-Img/whatsapp-img.png";
import Logo from "../assets/Whatsapp-logo/whatsapp.png";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email, minLength } from '@vuelidate/validators';
import { reactive, computed, ref, watchEffect } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
const authStore = useAuthStore();
const router = useRouter();
const loading = ref("");
const error = ref("");
const token = ref("")
watchEffect(() => {
  token.value = authStore.user;
  if(token.value) {
    router.push("/chat")
  }
});

const formData = reactive({
    username : "",
    email : "",
    password: "",
});

const rules = computed(() => {
    return {
        username: { required: helpers.withMessage("User is required", required)},
        email: { required: helpers.withMessage("Email is required", required), email},
        password: { required: helpers.withMessage("Password is required", required), minLength: minLength(8)},
    }
});

const v$ = useVuelidate(rules, formData);
const handleSubmit = async () => {
    const result = await v$.value.$validate();
    loading.value = true;
    if(result) {
        try {
            authStore.loginUser(formData.email, formData.password);
        } catch(err) {
            error.value = err.message;
            setTimeout(() => {
                error.value = ""
            }, 2000);
        }
    }; 
    loading.value = false;
    setTimeout(() => {
        formData.username = "";
        formData.email = "";
        formData.password = "";
    }, 1000)
}
</script>

<template>
  <main>
     <div class='min-h-screen w-full grid grid-cols-2'>
      <div class='col-span-3 sm:col-span-1 md:w-full md:h-full'>
        <header>
          <nav>
            <ul class='flex justify-between items-center p-3'>
              <li class='li-tag'>Web Version</li>
              <li class='li-tag'>Features</li>
              <li class='li-tag'>Help</li>
              <li class='li-tag'>Security</li>
            </ul>
          </nav>
        </header>

        <div class='grid place-items-center'>
          <div class='max-w-sm w-72 sm:w-80 md:mt-10 mt-4'>
            <form class='bg-white shadow-sm rounded-sm w-full px-6 py-4 border border-gray-200' @submit.prevent="handleSubmit">
              <div class='grid place-items-center'>
                <img :src="Logo" alt="Whatsapp Logo" class='w-14 h-14 mb-3'/>
              </div>
              <div class='sm:pb-4 pb-3'>
                <label htmlFor="User" class='label'>Username</label>
                <input v-model="formData.username" type="text" placeholder='User' id='user' class='input' />
                
              </div>

              <div class='sm:pb-4 pb-3'>
                <label htmlFor="Email" class='label'>Email</label>
                <input v-model="formData.email" type="email" placeholder='Email' id='email' class='input' />
              
              </div>

              <div class='sm:pb-4 pb-3'>
                <label htmlFor="Password" class='label'>Password</label>
                <input v-model="formData.password" type="password" class='input' placeholder="Password"/>
              </div>

              
              <div class='items-center pb-4'>
                <p class='font-bold md:text-base text-sm'>Don't have an account?<span class='ml-2 cursor-pointer text-green-500 font-bold hover:text-green-600'><router-link to="/register">Sign Up</router-link></span></p>
              </div>

              <div>
                <button type='submit' class='w-full bg-green-500 hover:bg-green-600 py-2 px-2 font-bold rounded-md text-white'>
                 {{ loading ? "Signing In..." : "Sign In" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class='bg-[#1F342F] md:w-full md:h-full md:grid md:place-items-center hidden sm:block'>
        <div>
          <img :src="Img" alt="Whatsapp" class='w-80 h-full'/>
        </div>
      </div>
    </div>
  </main>
</template>
