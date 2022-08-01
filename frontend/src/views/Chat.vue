<script setup>
import { useAuthStore } from "../stores/authStore";
import { watchEffect, ref } from "vue";
import axios from "axios";
import Sidebar from "../components/Sidebar.vue";
import ChatContainer from "../components/ChatContainer.vue";
import { io } from "socket.io-client";
const authStore = useAuthStore();
const currentUser = ref("");
const socket = ref(null);
const contacts = ref([]);
const onlineUsers = ref([])
const chats = ref([]);
const chatId = ref(null)
const userId = ref(null);
const userUsername = ref("");
const userAvatar = ref("");
watchEffect( async () => {
  currentUser.value = authStore.user?.data?._id;
  console.log(currentUser.value);
  console.log(authStore.user?.data?.username)
});

watchEffect( async () => {
  const response = await axios.get(`http://localhost:5000/api/auth/allUsers/${currentUser.value}`);
  contacts.value = response.data;
  console.log(contacts.value)
})

watchEffect(() => {
  socket.current = io("http://localhost:8800");
  socket.current.emit("new-user-add", currentUser.value);
  socket.current.on('get-users', (users) => {
    onlineUsers.value = users
  });
})

const Chat = async (id, avatar, username) => {
  userId.value = id;
  userUsername.value = username;
  userAvatar.value = avatar;
};
</script>
<template>
    <div className="min-h-screen w-full grid grid-cols-5 relative">
      <div className="xl:col-span-2 w-full h-full bg-white">
        <div className="flex items-center m-2 pl-2 cursor-pointer hover:text-green-600">
          <h3 className="font-bold ml-2  xl:block hidden"><router-link to="/profile">Profile </router-link></h3>
        </div>
  <form className="xl:grid xl:place-items-center hidden">   
    <div class="relative">
        <div class="flex absolute inset-y-0 left-0 items-center pl-3 mt-3 pointer-events-none">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input type="search" class="appearance-none block py-2 px-2 pl-10 mt-3  xl:w-96 w-48 text-sm bg-gray-50 rounded-lg border border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 " placeholder="Search or start a new Chat"/>
    </div>
</form>
         <div v-for="contact in contacts" :key="contact._id">
           <Sidebar
          :id="contact._id"
          :username="contact.username"
          :avatar="contact.avatar"
          @changeChat = Chat
          />
         </div>
      </div>

      <div className="xl:col-span-3 md:col-span-4 col-span-4 h-full w-full bg-[#F5F2EC]">
      <div className="relative min-h-screen w-full">
        <div v-if="userId === null">
        <div className="flex justify-center items-center mt-64 md:mt-72">
             <h3 className="font-bold text-sm md:text-lg">Select a user to start conversation</h3>
          </div>
        </div>
        <div v-else>
        <ChatContainer
        :id="userId"
        :avatar="userAvatar"
        :username="userUsername"
        :chatId="chatId"
        :socket="socket"
        />
        </div>
      </div>
      </div>
    </div>
</template>
