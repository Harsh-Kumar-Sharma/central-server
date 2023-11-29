<template>
  <div class="modal fade" id="kt_modal_create_shift" ref="newTargetModalRef" tabindex="-1" aria-hidden="true"
    data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded">
        <div class="modal-header pb-0 border-0">
          <h2>Create New Shift</h2>
        </div>
        <hr />
        <div class="modal-body">
          <el-form id="kt_modal_new_target_form" @submit.prevent="submit()" :model="targetData" :rules="rules"
            ref="formRef" class="form">
            <div class="d-flex flex-column mb-8 fv-row">
              <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                <span class="required">Shift Name</span>
              </label>

              <el-form-item prop="shiftName">
                <el-input v-model="shiftName" placeholder="Enter shift name" name="shiftName"></el-input>
              </el-form-item>
            </div>

            <div class="row g-9 mb-8">
              <div class="col-md-6 fv-row">
                <label class="required fs-6 fw-semobold mb-2">Start Time</label>

                <div class="align-items-center">
                  <el-form-item prop="startTime">
                    <el-input v-model="startTime" type="text" placeholder="Enter start time"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="col-md-6 fv-row">
                <label class="required fs-6 fw-semobold mb-2">End Time</label>

                <div class="align-items-center">
                  <el-form-item prop="endTime">
                    <el-input v-model="endTime" type="text" placeholder="Enter end time"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>

            <div class="text-center">
              <button type="reset" data-bs-dismiss="modal" id="kt_modal_new_target_cancel" class="btn btn-light me-3">
                Cancel
              </button>

              <button :data-kt-indicator="loading ? 'on' : null" class="btn btn-lg btn-primary" type="submit">
                <span v-if="!loading" class="indicator-label">
                  Create Shift
                </span>
                <span v-if="loading" class="indicator-progress">
                  Please wait...
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.el-select {
  width: 100%;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { hideModal } from "@/core/helpers/dom";
import swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";
import { API_ROUTES, BASE_URL } from "@/constants/Config";

interface NewAddressData {
  shiftName: string;
  assign: string;
  startTime: string;
  endTime: string;
}

export default defineComponent({
  name: "new-target-modal",
  components: {},
  setup(props, { emit }) {
    const shiftName = ref("");
    const startTime = ref("");
    const endTime = ref("");
    const formRef = ref<null | HTMLFormElement>(null);
    const newTargetModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);

    const targetData = ref<NewAddressData>({
      shiftName: "",
      assign: "",
      startTime: "",
      endTime: "",
    });

    const rules = ref({});

    const submit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          loading.value = true;

          try {
            const data = await axios.post(
              `${BASE_URL}${API_ROUTES.SHIFT.CREATE_SHIFT}`,
              {
                shift_name: shiftName.value,
                shift_start_time: startTime.value,
                shift_end_time: endTime.value,
              }
            );

            loading.value = false;
            emit("loadShifts");

            targetData.value.shiftName = "";
            targetData.value.startTime = "";
            targetData.value.endTime = "";
            targetData.value.assign = "";

            swal
              .fire({
                title: "Shift Created!",
                icon: "success",
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1000,
              })
              .then(() => {
                hideModal(newTargetModalRef.value);
              });
          } catch (e: any) {
            swal.fire({
              text: e.response.data.message as string,
              icon: "error",
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3000,
            });
            loading.value = false;
          }
        }
      });
    };

    return {
      targetData,
      endTime,
      startTime,
      shiftName,
      submit,
      loading,
      formRef,
      rules,
      newTargetModalRef,
      getAssetPath,
    };
  },
});
</script>

<style lang="scss">
.override-styles {
  z-index: 99999 !important;
  pointer-events: initial;
}
</style>
