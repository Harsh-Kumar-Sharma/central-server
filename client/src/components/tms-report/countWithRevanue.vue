<template>
    <div class="row" :class="`page-title mb-3`">
        <div class="card">
            <div class="card-body">
                <Datatable :data="transactions" :header="fields" :enable-items-per-page-dropdown="true"
                    :checkbox-enabled="false">
                    <template v-slot:PAYMENT_TYPE="{ row: transaction }">
                        {{ transaction.PAYMENT_TYPE }}
                    </template>
                    <template v-slot:CARJEEPVAN_Count="{ row: transaction }">
                        {{ transaction.CARJEEPVAN_Count }}
                    </template>
                    <template v-slot:CARJEEPVAN_Fee="{ row: transaction }">
                        {{ transaction.CARJEEPVAN_Fee }}
                    </template>
                    <template v-slot:LCVMINIBUS_Count="{ row: transaction }">
                        {{ transaction.LCVMINIBUS_Count }}
                    </template>
                    <template v-slot:LCVMINIBUS_Fee="{ row: transaction }">
                        {{ transaction.LCVMINIBUS_Fee }}
                    </template>
                    <template v-slot:BUS2AXLES_Count="{ row: transaction }">
                        {{ transaction.BUS2AXLES_Count }}
                    </template>
                    <template v-slot:BUS2AXLES_Fee="{ row: transaction }">
                        {{ transaction.BUS2AXLES_Fee }}
                    </template>
                    <template v-slot:TRUCK2AXLES_Count="{ row: transaction }">
                        {{ transaction.TRUCK2AXLES_Count }}
                    </template>
                    <template v-slot:TRUCK2AXLES_Fee="{ row: transaction }">
                        {{ transaction.TRUCK2AXLES_Fee }}
                    </template>
                    <template v-slot:MAV3AXLES_Count="{ row: transaction }">
                        {{ transaction.MAV3AXLES_Count }}
                    </template>
                    <template v-slot:MAV3AXLES_Fee="{ row: transaction }">
                        {{ transaction.MAV3AXLES_Fee }}
                    </template>
                    <template v-slot:MAV4to6AXLES_Count="{ row: transaction }">
                        {{ transaction.MAV4to6AXLES_Count }}
                    </template>
                    <template v-slot:MAV4to6AXLES_Fee="{ row: transaction }">
                        {{ transaction.MAV4to6AXLES_Fee }}
                    </template>
                    <template v-slot:Oversized_vehicle_Count="{ row: transaction }">
                        {{ transaction.Oversized_vehicle_Count }}
                    </template>
                    <template v-slot:Oversized_vehicle_Fee="{ row: transaction }">
                        {{ transaction.Oversized_vehicle_Fee }}
                    </template>
                    <template v-slot:totalCount="{ row: transaction }">
                        {{ transaction.totalCount }}
                    </template>
                    <template v-slot:totalRevanue="{ row: transaction }">
                        {{ transaction.totalRevanue }}
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
                    columnName: "PAYMENT_TYPE",
                    columnLabel: "PAYMENT_TYPE",
                    sortEnabled: true,
                },
                {
                    columnName: "CARJEEPVAN Count",
                    columnLabel: "CARJEEPVAN_Count",
                    sortEnabled: true,
                },
                {
                    columnName: "CARJEEPVAN Fee",
                    columnLabel: "CARJEEPVAN_Fee",
                    sortEnabled: true,
                },
                {
                    columnName: "LCVMINIBUS Count",
                    columnLabel: "LCVMINIBUS_Count",
                    sortEnabled: true,
                },
                {
                    columnName: "LCVMINIBUS Fee",
                    columnLabel: "LCVMINIBUS_Fee",
                    sortEnabled: true,
                },
                {
                    columnName: "BUS2AXLES Count",
                    columnLabel: "BUS2AXLES_Count",
                    sortEnabled: true,
                },
                {
                    columnName: "BUS2AXLES Fee",
                    columnLabel: "BUS2AXLES_Fee",
                    sortEnabled: true,
                },
                {
                    columnName: "TRUCK2AXLES Count",
                    columnLabel: "TRUCK2AXLES_Count",
                    sortEnabled: true,
                },
                {
                    columnName: "TRUCK2AXLES Fee",
                    columnLabel: "TRUCK2AXLES_Fee",
                    sortEnabled: true,
                },
                {
                    columnName: "MAV3AXLES Count",
                    columnLabel: "MAV3AXLES_Count",
                    sortEnabled: true,
                },
                {
                    columnName: "MAV3AXLES Fee",
                    columnLabel: "MAV3AXLES_Fee",
                    sortEnabled: true,
                },
                {
                    columnName: "MAV4to6AXLES Count",
                    columnLabel: "MAV4to6AXLES_Count",
                    sortEnabled: true,
                },
                {
                    columnName: "MAV4to6AXLES Fee",
                    columnLabel: "MAV4to6AXLES_Fee",
                    sortEnabled: true,
                },
                {
                    columnName: "Oversized vehicle Count",
                    columnLabel: "Oversized_vehicle_Count",
                    sortEnabled: true,
                },
                {
                    columnName: "Oversized vehicle Fee",
                    columnLabel: "Oversized_vehicle_Fee",
                    sortEnabled: true,
                },
                {
                    columnName: "Total Count",
                    columnLabel: "totalCount",
                    sortEnabled: true,
                },
                {
                    columnName: "Total Revenue",
                    columnLabel: "totalRevanue",
                    sortEnabled: true,
                },
            ],
        };
    },
});
</script>
  