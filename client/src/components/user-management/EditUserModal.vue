<template>
  <div class="modal fade" id="kt_modal_edit_role" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_add_device_header">
          <h2 class="fw-bold">Edit User Details</h2>

          <div id="kt_modal_add_device_close" data-bs-dismiss="modal" class="btn btn-icon btn-sm btn-active-icon-primary">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>
        <el-form @submit.prevent="saveUserDetails()">
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
                  <input type="text" class="form-control" name="firstname" v-model="updateUser.firstName"
                    placeholder="Enter First Name" required />
                </div>
              </div>

              <!--begin: two input field in row-->
              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Last Name</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="lastname" v-model="updateUser.lastName"
                    placeholder="Enter last Name" required />
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Username</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="username" v-model="updateUser.username"
                    placeholder="Enter Username" required />
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="fs-4 fw-semobold">Password</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="password" v-model="updateUser.password"
                    placeholder="Enter Password" />
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Role</label>
                </div>

                <div class="col-md-6">
                  <select name="Roles" class="form-select" as="select" v-model="updateUser.roleId" placeholder="Roles"
                    required>
                    <option v-for="roles in roleMaster" :key="roles.id" :value="roles.id">
                      {{ roles.role_name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Shift </label>
                </div>

                <div class="col-md-6">
                  <select name="shifts" class="form-select" as="select" v-model="updateUser.shiftId" placeholder="Shift"
                    required>
                    <option v-for="shift in shiftMaster" :key="shift.id" :value="shift.id">
                      {{ shift.shift_name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class=" fs-4 fw-semobold">Email</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="email" v-model="updateUser.email"
                    placeholder="Enter Email" />
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="required fs-4 fw-semobold">Mobile Number</label>
                </div>

                <div class="col-md-6">
                  <input type="text" class="form-control" name="Mobile Num" v-model="updateUser.mobNo"
                    placeholder="Enter Mobile Num" required />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button class="btn btn-lg btn-primary" type="submit">
              <KTIcon icon-name="rocket" icon-class="fs-1" />
              <span class="indicator-label"> Save User </span>
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
  name: "edit-user-modal",
  components: {},
  props: {
    userData: Object,
  },
  data() {
    return {
      loading: false,
      updateUser: {
        id: '',
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        roleId: '',
        email: '',
        mobNo: '',
        shiftId: ''
      },
      masters: useMasterData() as any,
    };
  },
  computed: {
    roleMaster() {
      return this.masters?.getMasters?.roleMaster?.filter(r => r.id != 1).reverse()
    },
    shiftMaster() {
      return this.masters?.getMasters?.shiftMaster
    }
  },
  watch: {
    userData: function () {
      this.updateUser.id = this.userData?.id;
      this.updateUser.firstName = this.userData?.first_name;
      this.updateUser.lastName = this.userData?.last_name;
      this.updateUser.username = this.userData?.afs_login?.username;
      this.updateUser.roleId = this.userData?.role_id;
      this.updateUser.email = this.userData?.email;
      this.updateUser.mobNo = this.userData?.mobile_number;
    }
  },
  methods: {
    saveUserDetails() {
      this.$emit("submit", JSON.stringify(this.updateUser));
    },
  },
});
</script>
