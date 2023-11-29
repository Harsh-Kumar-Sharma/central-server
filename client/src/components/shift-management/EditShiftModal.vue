<template>
  <div
    class="modal fade"
    id="kt_modal_edit_shift"
    ref="newTargetModalRef"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded">
        <div class="modal-header pb-0 border-0">
          <h1>Edit Shift</h1>
          <div
            class="btn btn-sm btn-icon btn-active-color-primary"
            data-bs-dismiss="modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>
        <hr />
        <div class="modal-body">
          <el-form
            id=" kt_modal_new_target_form"
            @submit.prevent="saveShiftDetails()"
          >
            <div class="d-flex flex-column mb-8 fv-row">
              <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                <span class="required">Shift Name</span>
                <i
                  class="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                  title="Specify a target name for future usage and reference"
                ></i>
              </label>

              <el-form-item prop="shiftName">
                <el-input
                  v-model="formData.shift_name"
                  placeholder="Enter Shift Name"
                  name="shiftName"
                ></el-input>
              </el-form-item>
            </div>

            <div class="row g-9 mb-8">
              <div class="col-md-6 fv-row">
                <label class="required fs-6 fw-semobold mb-2">Start Time</label>

                <div class="position-relative align-items-center">
                  <el-form-item prop="startTime">
                    <el-input
                      v-model="formData.shift_start_time"
                      type="text"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="col-md-6 fv-row">
                <label class="required fs-6 fw-semobold mb-2">End Time</label>

                <div class="position-relative align-items-center">
                  <el-form-item prop="endTime">
                    <el-input
                      v-model="formData.shift_end_time"
                      type="text"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>

            <div class="text-center">
              <button
                type="button"
                id="kt_modal_new_target_cancel"
                class="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                :data-kt-indicator="loading ? 'on' : null"
                class="btn btn-lg btn-primary"
                type="submit"
              >
                <span v-if="!loading" class="indicator-label"> Save </span>
                <span v-if="loading" class="indicator-progress">
                  Please wait...
                  <span
                    class="spinner-border spinner-border-sm align-middle ms-2"
                  ></span>
                </span>
              </button>
            </div>
          </el-form>
          <!--end:Form-->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { hideModal } from "@/core/helpers/dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";
import { API_ROUTES, BASE_URL } from "@/constants/Config";

export default defineComponent({
  name: "new-target-modal",
  components: {},
  props: {
    shiftData: Object,
  },
  data() {
    return {
      loading: false,
      formData: {} as any,
    };
  },
  watch: {
    shiftData: function () {
      this.formData = this.shiftData;
      return this.formData;
    },
  },
  methods: {
    async saveShiftDetails() {
      try {
        await axios.patch(
          `${BASE_URL}${API_ROUTES.SHIFT.UPDATE_SHIFT}${this.formData.id}`,
          this.formData
        );
        this.$emit("submit", JSON.stringify(this.formData));
        this.formData = {};

        this.$emit("loadShifts");

        Swal.fire({
          title: "Shift Updated!",
          icon: "success",
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          hideModal(this.$refs.newTargetModalRef as HTMLElement);
        });
      } catch (e: any) {
        Swal.fire({
          text: e.response.data.message as string,
          icon: "error",
          showCancelButton: false,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },
  },
});
</script>

<style lang="scss">
.override-styles {
  z-index: 99999 !important;
  pointer-events: initial;
}

.el-select {
  width: 100%;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
