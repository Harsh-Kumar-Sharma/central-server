<template>
  <div class="d-flex flex-center flex-column flex-column-fluid px-lg-10 pb-15 pb-lg-20">
    <VForm id="kt_login_signin_form" @submit="onSubmitLogin" :validation-schema="login"
      :initial-values="{ username: '', password: '' }" class="form w-100">
      <div class="text-center mb-11">
        <h1 class="text-dark fw-bolder mb-3 sajag-login-text">AFS Admin</h1>
        <div class="text-white-500 fw-semibold fs-2">Account Login</div>
      </div>
      <div class="separator separator-content my-14">
        <span class="w-125px text-white-500 fw-semibold fs-7">SIGN IN</span>
      </div>
      <div class="fv-row mb-8">
        <Field tabindex="1" class="form-control form-control-signin-inp bg-transparent" type="text" name="username"
          autocomplete="off" placeholder="Username" />

        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>
      <div class="fv-row mb-3">
        <Field tabindex="2" class="form-control form-control-signin-inp bg-transparent text-dark" type="password"
          name="password" autocomplete="off" placeholder="Password" />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <div class="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
        <div></div>
        <router-link to="/password-reset">Forgot Password ?</router-link>
      </div>
      <div class="d-grid mb-10">
        <button type="submit" id="kt_sign_in_submit" class="btn btn-primary">
          <span class="indicator-label">Sign In</span>
          <span class="indicator-progress">Please wait...
            <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
        </button>
      </div>
    </VForm>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";

export default defineComponent({
  name: "sign-in",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();

    const submitButton = ref<HTMLButtonElement | null>(null);

    //Create form validation object
    const login = Yup.object().shape({
      username: Yup.string().required().label("Username"),
      password: Yup.string().min(4).required().label("Password"),
    });

    //Form submit function
    const onSubmitLogin = async (values: any) => {
      try {
        values = values as User;

        if (submitButton.value) {
          // eslint-disable-next-line
          submitButton.value!.disabled = true;
          // Activate indicator
          submitButton.value.setAttribute("data-kt-indicator", "on");
        }

        // Send login request
        //await store.login(values);

        if (values.username == 'admin' && values.password == 'admin@123') {

          Swal.fire({
            title: 'Login Successful',
            text: "",
            icon: "success",
            showConfirmButton: false,
            timer: 1000
          }).then(() => {
            router.push({ name: "dashboard" });
          });

          Swal.fire({
            title: "Login Successful!",
            text: "Redirecting to dashboard...",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            router.push({ name: "dashboard" });
          });
        }
      } catch (error: any) {
        store.errors = {};
        Swal.fire({
          title: "Login Failed!",
          text: error as string,
          showConfirmButton: false,
          icon: "error",
          timer: 3000,
        });
      }

      //Deactivate indicator
      submitButton.value?.removeAttribute("data-kt-indicator");
    };

    return {
      onSubmitLogin,
      login,
      submitButton,
      getAssetPath,
    };
  },
});
</script>
<style>
.form-control-signin-inp {
  border: 1px solid #6c6c86 !important;
}
</style>
