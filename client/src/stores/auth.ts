import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  permissions: any,
  info: any;
  token: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.token);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
  }

  async function login(credentials: User) {
    try {
      const response = await ApiService.post("auth/login", credentials)
      setAuth({
        permissions: response.data.data.user.permissions,
        info: response.data.data.user,
        token: response.data.data.tokens.access.token
      });

    } catch (err: any) {
      setError(err.response.data.message);
      throw new Error(err.response.data.message)
    }
  }

  function logout() {
    return ApiService.post("auth/logout", { id: user.value.info.id })
      .then(({ data }) => {
        purgeAuth();
      })
      .catch(({ response }) => {
        purgeAuth();
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  async function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.post("auth/session", {})
        .then(({ data }) => { })
        .catch(({ response }) => {
          setError(response.data.errors);
          purgeAuth();
          throw new Error('Session Expired')
        });
    } else {
      purgeAuth();
      throw new Error('Session Expired')
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    forgotPassword,
    verifyAuth
  };
}, {
  persist: true
});
