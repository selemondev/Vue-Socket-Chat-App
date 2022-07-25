<script setup>
import Img from "../assets/Whatsapp-Img/whatsapp-img.png";
import Logo from "../assets/Whatsapp-logo/whatsapp.png";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email, minLength, sameAs } from '@vuelidate/validators';
import { reactive, computed, ref, watchEffect } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
const authStore = useAuthStore();
const loading = ref(false);
const token = ref("");
const router = useRouter();
watchEffect(() => {
  loading.value = authStore.loading
  token.value = authStore.user;
  if( token.value ) {
    router.push("/chat")
  }
})
const formData = reactive({
    username : "",
    email : "",
    password: "",
    confirmPassword: "",
});
const rules = computed(() => {
    return {
        username: { required: helpers.withMessage("Username is required", required)},
        email: { required: helpers.withMessage("Email is required", required), email},
        password: { required: helpers.withMessage("Password is required", required), minLength: minLength(8)},
        confirmPassword: { required: helpers.withMessage("Passwords do not match", required), sameAs: sameAs(formData.password)}
    }
});
const v$ = useVuelidate(rules, formData);

const handleSubmit = () => {
    const result = v$.value.$validate();
    if( result ) {
        authStore.registerUser(formData.username, formData.email, formData.password)
    }
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
          <div class='max-w-sm sm:w-80 w-72 md:mt-10 mt-4'>
            <form class='bg-white shadow-sm rounded-sm w-full px-6 py-4 border border-gray-200' @submit.prevent="handleSubmit">
              <div class='grid place-items-center'>
                <img :src="Logo" alt="Whatsapp Logo" class='w-14 h-14 mb-3'/>
              </div>
              <div class='sm:pb-4 pb-3'>
                <label htmlFor="User" class='label'>Username</label>
                <input v-model="formData.username" type="text" placeholder='Username' id='user' class='input' />
                
              </div>

              <div class='sm:pb-4 pb-3'>
                <label htmlFor="Email" class='label'>Email</label>
                <input v-model="formData.email" type="email" placeholder='Email' id='email' class='input' />
              
              </div>

              <div class='sm:pb-4 pb-3'>
                <label htmlFor="Password" class='label'>Password</label>
                <input v-model="formData.password" type="password" class='input' placeholder="Password"/>
              </div>

              
              <div class='sm:pb-4 pb-3'>
                <label htmlFor="Password" class='label'>ConfirmPassword</label>
                <input v-model="formData.confirmPassword" type="password" class='input' placeholder="ConfirmPassword"/>
              </div>

              <div>
                <button type='submit' class='w-full bg-green-500 hover:bg-green-600 py-2 px-2 font-bold rounded-md text-white'>
                 {{ loading ? "Signing Up..." :  "Sign Up"}}
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
