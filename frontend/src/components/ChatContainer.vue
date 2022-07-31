<script setup>
import axios from "axios";
import { watchEffect, ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { io } from "socket.io-client";
const authStore = useAuthStore();
const text = ref("")
const socket = ref(null);
const props = defineProps({
    id: String,
    username: String,
    avatar: String,
    chatId: String
});
const currentUser = ref("");
const receivedMessage = ref([])
const host = "http://localhost:8800";
const addMessage = "http://localhost:5000/api/messages/addMessage";
const messages = ref([]);
watchEffect( async () => {
  currentUser.value = authStore.user?.data?._id;
  console.log(authStore.user?.data?.username);
    socket.current = io(host);
});
watchEffect( async () => {
    const getMessages = `http://localhost:5000/api/messages/getMessages/${props.chatId}`;
    const fetchMessages = await axios.get(getMessages);
    messages.value = fetchMessages.data;
})

const handleSubmit = async () => {
    const message = {
        senderId: currentUser.value,
        text: text.value,
        chatId: props.chatId
    };
    const response = await axios.post(addMessage, {
        ...message
    });
    // const responseData = response.data;
    // messages.value.push(responseData)
    const receiverId = props.id;
    const sendEmit = {
        message,
        receiverId
    };
    socket.current = io(host);
    socket.current.emit("send-message", sendEmit);
};

watchEffect(() => {
    socket.current = io(host);
    socket.current.on("receive-message", (data) => {
    receivedMessage.value = data.message;
    });
    messages.value.push(receivedMessage.value);
    console.log("AllMessages: ", messages.value)
})
</script>
<template>
    <div>
     <div class="messages_user bg-[#FFFFFF]">
             <div class="flex ml-2">
             <img :src="props.username" class="w-10 h-10 rounded-full ml-2" />
              <div>
              <h3 class="font-bold ml-2">{{props.avatar}}</h3>
              </div>
    </div>
    </div>

    <div v-for="message in messages" :key="message._id">
    <p class="text-xl">{{message.text}}</p>
    </div>

     <div class="w-80">
        <form class="absolute bottom-0 flex items-center xl:ml-2 md:ml-10 sm:ml-6 ml-2 md:bg-[#eee]" @submit.prevent="handleSubmit">
       <div class="flex justify-center items-center md:-ml-15 ml-4">
       <div>
          <input
            type="text"
            v-model="text"
            placeholder="Enter message"
            class="xl:w-[550px] md:w-[300px] w-[200px] sm:w-[180px] md:py-3 md:px-3 py-2 px-2  appearance-none focus:ring-1 focus:ring-green-500 border border-green-500 focus:outline-none rounded-md md:text-md text-sm"
          />
        </div>
        <div>
          <button class="xl:py-4 xl:px-4 ml-2 md:py-2 md:px-2 md:bg-green-500 hover:bg-green-600 rounded-full">Send</button>
        </div>
       </div>
      </form>
      </div>
    </div>
</template>