<template>
  <div class="card h-md-100 border border-2 border-gray-300 border-hover">
    <div class="card-header border-0 pt-2">
      <h4 class="card-title align-items-start flex-column">
        <span class="card-label">Generated Reports</span>
      </h4>
    </div>
    <div class="card-body pt-0">
      <Datatable
        :data="reportsData"
        :header="fields"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="false"
        checkbox-label="id"
      >
        <template v-slot:id="{ row: reportsData }">
          {{ reportsData.id }}
        </template>
        <template v-slot:from="{ row: reportsData }">
          <span v-if="reportsData.from">{{
            new Date(reportsData.from).toLocaleString("en-GB", {
              timeZone: "UTC",
            })
          }}</span>
          <span v-else>NA</span>
        </template>
        <template v-slot:to="{ row: reportsData }">
          <span v-if="reportsData.to">{{
            new Date(reportsData.to).toLocaleString("en-GB", {
              timeZone: "UTC",
            })
          }}</span>
          <span v-else>NA</span>
        </template>
        <template v-slot:status="{ row: reportsData }">
          <span
            class="badge badge-light-success ms-1 fs-9"
            v-if="reportsData.status === 'Done'"
            >{{ reportsData.status }}</span
          >
          <span
            class="badge badge-light-danger ms-1 fs-9"
            v-if="reportsData.status === 'Failed'"
            >{{ reportsData.status }}</span
          >
          <span
            class="badge badge-light-warning ms-1 fs-9"
            v-if="reportsData.status === 'Pending'"
            >{{ reportsData.status }}</span
          >
        </template>
        <template v-slot:action="{ row: reportsData }">
          <div v-if="reportsData.tms_report_links.length > 0">
            <div v-for="item of reportsData.tms_report_links">
              <span
                class="badge badge-light-warning ms-1 fs-9"
                v-if="item.tms_master_report.report_name"
                >{{ item.tms_master_report.report_name }}</span
              >
            </div>
          </div>
          <div v-else>NA</div>
        </template>
      </Datatable>
    </div>
  </div>
</template>
<script>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { defineComponent } from "vue";
import ApiService from "@/core/services/ApiService";
import { API_ROUTES } from "@/constants/Config";

export default defineComponent({
  name: "main-dashboard",
  components: { Datatable },
  data() {
    return {
      reportsData: [],
      fields: [
        {
          columnName: "Id",
          columnLabel: "id",
          sortEnabled: true,
          columnWidth: 80,
        },
        {
          columnName: "From",
          columnLabel: "from",
          sortEnabled: true,
          columnWidth: 150,
        },
        {
          columnName: "To",
          columnLabel: "to",
          sortEnabled: true,
          columnWidth: 150,
        },
        {
          columnName: "Status",
          columnLabel: "status",
          sortEnabled: true,
          columnWidth: 100,
        },
        {
          columnName: "Downloaded Reports",
          columnLabel: "action",
          columnWidth: 300,
        },
      ],
    };
  },

  methods: {
    async getReports() {
      try {
        const result = await ApiService.get(
          `${API_ROUTES.TMS_REPORT.GET_REPORTS}`
        );

        this.reportsData = result.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  async mounted() {
    await this.getReports();
  },
});
</script>
