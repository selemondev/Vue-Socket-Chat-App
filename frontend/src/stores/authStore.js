import { defineStore, acceptHMRUpdate } from "pinia"
import { register, login } from "../utils/url";
import axios from "axios";
export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")),
    loading: false
  }),

  getters: {

  },

  actions: {
    async registerUser(username, email, password) {
      this.loading = true;
      const response = await axios.post(register, { username, email, password });
      this.loading = false;
      this.user = response.data;
      localStorage.setItem('user', JSON.stringify(response));
    },

    async loginUser(email, password ) {
      const response = await axios.post(login, {email, password});
      this.user = response.data;
      localStorage.setItem('user', JSON.stringify(response));
    },

    async logOut() {
      this.loading = true;
      this.user = null;
      this.loading = false;
      localStorage.removeItem("user");
    }
  }
});

if(import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}