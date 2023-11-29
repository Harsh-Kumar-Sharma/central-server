<template>
  <div class="modal fade" id="kt_modal_create_user" ref="addDeviceModalRef" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_add_device_header">
          <h2 class="fw-bold">Create New User</h2>

          <div id="kt_modal_add_device_close" data-bs-dismiss="modal" class="btn btn-icon btn-sm btn-active-icon-primary">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>
        <el-form @submit.prevent="submit()">
          <div class="modal-body py-10 px-lg-17">
            <div class="scroll-y me-n7 pe-7" id="kt_modal_add_device_scroll" data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_vsds" data-kt-scroll-wrappers="#kt_modal_add_device_scroll"
              data-kt-scroll-offset="300px">
              <div class="row">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">First Name</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="firstname" v-model="createUser.firstName"
                    placeholder="Enter First Name" required />
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Last Name</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="lastname" v-model="createUser.lastName"
                    placeholder="Enter Last Name" required />
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Username</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="username" v-model="createUser.username"
                    placeholder="Enter Username" required />

                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Password</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="password" v-model="createUser.password"
                    placeholder="Enter Password" required />
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Role</label>
                </div>

                <div class="col-md-6">
                  <select name="Roles" class="form-select" as="select" v-model="createUser.role" placeholder="Roles"
                    required>
                    <option v-for="roles in roleMaster" :key="roles.id" :value="roles.id">
                      {{ roles.role_name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Shift</label>
                </div>

                <div class="col-md-6">
                  <select name="shifts" class="form-select" as="select" v-model="createUser.shift" placeholder="Shift"
                    required>
                    <option v-for="shift in shiftMaster" :key="shift.id" :value="shift.id">
                      {{ shift.shift_name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="fs-4 fw-semobold">Email</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="email" v-model="createUser.email"
                    placeholder="Enter Email" />
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Mobile Number</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="mobilenum" v-model="createUser.mobNo"
                    placeholder="Enter Mobile Number" required />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button class="btn btn-lg btn-primary" type="submit">
              <KTIcon icon-name="rocket" icon-class="fs-1" />
              <span class="indicator-label"> Create User</span>
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMasterData } from "@/stores/common";

export default defineComponent({
  name: "create-user-modal",
  data() {
    return {
      masters: useMasterData() as any,
      loading: false,
      createUser: {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        role: '',
        email: '',
        mobNo: '',
        shift: ''
      }
    }
  },
  computed: {
    roleMaster() {
      return this.masters.getMasters.roleMaster.filter(r => r.id != 1).reverse()
    },
    shiftMaster() {
      return this.masters.getMasters.shiftMaster
    }
  },
  mounted() {
    this.createUser.role = this.roleMaster[0]?.id
    this.createUser.shift = this.shiftMaster[0]?.id
  },
  methods: {
    submit() {
      this.$emit(
        "submit",
        JSON.stringify({
          first_name: this.createUser.firstName,
          last_name: this.createUser.lastName,
          username: this.createUser.username,
          mobile_number: this.createUser.mobNo,
          shift_id: this.createUser.shift,
          email: this.createUser.email,
          role_id: this.createUser.role,
          password: this.createUser.password,
        })
      );
    }
  },
});
</script>
