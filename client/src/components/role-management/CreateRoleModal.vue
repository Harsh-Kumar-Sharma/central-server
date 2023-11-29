<template>
  <div class="modal fade" id="kt_modal_create_role" ref="addDeviceModalRef" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_add_device_header">
          <h2 class="fw-bold">Create New Role</h2>
          <div @click="close" data-bs-dismiss="modal" class="btn btn-icon btn-sm btn-active-icon-primary">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <el-form @submit.prevent="submit()">
          <div class="modal-body py-10 px-lg-17">
            <div class="scroll-y me-n7 pe-7" id="kt_modal_add_device_scroll" data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_vsds" data-kt-scroll-wrappers="#kt_modal_add_device_scroll"
              data-kt-scroll-offset="300px">
              <div class="row mt-2">
                <div class="col-4">
                  <label class="required fs-4 fw-semobold">Role Name</label>
                </div>

                <div class="col-8">
                  <el-form-item prop="state">
                    <el-input v-model="createRoleName" placeholder="Enter Role Name" />
                  </el-form-item>
                </div>
              </div>

              <div class="row">
                <div class="col-4">
                  <label class="required fs-4 fw-semobold">Permissions</label>
                </div>
                <div class="col-8">
                  <div class="form-check form-switch form-check-custom form-check-solid m-3"
                    v-for="(module, i) in modules" :key="i">
                    <input class="form-check-input h-20px w-30px" type="checkbox" v-model="selectedModules[module.id]"
                      :id="`check-${i}`" />
                    <label class="form-check-label fs-5 mx-5" :for="`check-${i}`">
                      {{ module.module_name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button class="btn btn-lg btn-primary" type="submit">
              <KTIcon icon-name="rocket" icon-class="fs-1" />
              <span class="indicator-label">Create Role</span>
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useMasterData } from "@/stores/common";

export default {
  name: "create-role-modal",
  data() {
    return {
      masters: useMasterData() as any,
      createRoleName: '',
      selectedModules: []
    }
  },
  computed: {
    modules() {
      return this.masters.getMasters.moduleMaster
    }
  },
  mounted() {
    this.createRoleName = ''
    this.selectedModules = []
  },
  methods: {
    submit() {

      const module_ids = Object.entries(this.selectedModules)
        .filter(([_, value]) => value === true)
        .map(([number, _]) => parseInt(number));

      const modules = [] as any;

      for (let moduleId of module_ids) {
        modules.push({
          module_id: moduleId,
          permission: 'RW'
        })
      }

      let payload = {
        role_name: this.createRoleName,
        modules: modules
      }

      this.$emit('submit', JSON.stringify(payload))
    },
    close() {
      this.createRoleName = ''
      this.selectedModules = []
    }
  },
}
</script>
