<template>
    <div class="row" :class="`page-title mb-3`">
        <div class="card">
            <div class="card-body">
                <Datatable :data="transactions" :header="fields" :enable-items-per-page-dropdown="true"
                    :checkbox-enabled="false">
                    <template v-slot:Day="{ row: transaction }">
                        {{ transaction.Day }}
                    </template>
                    <template v-slot:CARJEEPVAN="{ row: transaction }">
                        {{ transaction.CARJEEPVAN }}
                    </template>
                    <template v-slot:LCVMINIBUS="{ row: transaction }">
                        {{ transaction.LCVMINIBUS }}
                    </template>
                    <template v-slot:BUS2AXLES="{ row: transaction }">
                        {{
                            transaction.BUS2AXLES
                        }}
                    </template>
                    <template v-slot:TRUCK2AXLES="{ row: transaction }">
                        {{ transaction.TRUCK2AXLES }}
                    </template>
                    <template v-slot:MAV3AXLES="{ row: transaction }">
                        {{ transaction.MAV3AXLES }}
                    </template>
                    <template v-slot:MAV4to6AXLES="{ row: transaction }">
                        {{ transaction.MAV4to6AXLES }}
                    </template>
                    <template v-slot:Oversized_vehicle="{ row: transaction }">
                        {{ transaction.Oversized_vehicle }}
                    </template>
                    <template v-slot:Total="{ row: transaction }">
                        {{ transaction.Total }}
                    </template>
                </Datatable>
                <!--end::Table container-->
            </div>
            <!--begin::Body-->
        </div>
        <!--end::Tables Widget 11-->
    </div>
</template>
  
<script>
import { defineComponent, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
export default defineComponent({
    name: "kt-widget-11",
    components: {
        Datatable
    },
    props: {
        widgetClasses: String,
        transactions: Array
    },

    data() {
        return {
            fields: [
                {
                    columnName: "Date",
                    columnLabel: "Day",
                    sortEnabled: true,
                },
                {
                    columnName: "CARJEEPVAN",
                    columnLabel: "CARJEEPVAN",
                    sortEnabled: true,
                },
                {
                    columnName: "LCVMINIBUS",
                    columnLabel: "LCVMINIBUS",
                    sortEnabled: true,
                },
                {
                    columnName: "BUS2AXLES",
                    columnLabel: "BUS2AXLES",
                    sortEnabled: true,
                },
                {
                    columnName: "TRUCK2AXLES",
                    columnLabel: "TRUCK2AXLES",
                    sortEnabled: true,
                },
                {
                    columnName: "MAV3AXLES",
                    columnLabel: "MAV3AXLES",
                    sortEnabled: true,
                },
                {
                    columnName: "MAV4to6AXLES",
                    columnLabel: "MAV4to6AXLES",
                    sortEnabled: true,
                },
                {
                    columnName: "Oversized_vehicle",
                    columnLabel: "Oversized_vehicle",
                    sortEnabled: true,
                },
                {
                    columnName: "Total",
                    columnLabel: "Total",
                    sortEnabled: true,
                },
            ],
        };
    },
});
</script>
  