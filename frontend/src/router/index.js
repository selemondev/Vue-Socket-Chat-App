import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "../stores/authStore";
import Home from '../views/Home.vue';
import Chat from "../views/Chat.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        auth: false
      }
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/Register.vue"),
      meta: {
        auth: false
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      meta: {
        auth: true
      }
    }
  ]
});

const currentUser = () => {
  return new Promise(( resolve, reject ) => {
    const authStore = useAuthStore();
    const token = authStore.user;
    resolve(token);
    reject
  })
}

router.beforeEach( async (to, from, next) => {
  if(to.matched.some((record) => record.meta.auth)) {
    if(await currentUser()) {
      next();
    } else {
      next("/")
    }
  } else {
    next();
  }
})

export default router
