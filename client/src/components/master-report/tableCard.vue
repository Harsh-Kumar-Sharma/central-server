<template>
    <div class="row" :class="`page-title mb-3`">
        <div class="col-3 mb-3">
            <FilterTransaction @filterTransaction="fetchTransactions" :payData="payment" class="mx-2"></FilterTransaction>
            <button id="toggle-filter" class="filter btn btn-light-primary mx-2 lh-1" data-bs-toggle="tooltip"
                data-bs-placement="left" data-bs-dismiss="click" data-bs-trigger="hover" disabled>
                <i class="bi bi-patch-exclamation"></i>Total Count -
                {{ totalTransCount }}
            </button>
        </div>

        <div class="card">
            <div class="card-body">
                <Datatable :data="transactions" :header="fields" :enable-items-per-page-dropdown="true"
                    :checkbox-enabled="false">
                    <template v-slot:entry_plaza_name="{ row: transaction }">
                        {{ transaction.entry_plaza_name }}
                    </template>
                    <template v-slot:exit_plaza_name="{ row: transaction }">
                        {{ transaction.exit_plaza_name }}
                    </template>
                    <template v-slot:TAG="{ row: transaction }">
                        {{ transaction.TAG }}
                    </template>
                    <template v-slot:ENTRY_LANE_ID="{ row: transaction }">
                        {{ transaction.ENTRY_LANE_ID }}
                    </template>
                    <template v-slot:EXIT_LANE_ID="{ row: transaction }">
                        {{ transaction.EXIT_LANE_ID }}
                    </template>
                    <template v-slot:ENTRY_PASSAGE_TIME="{ row: transaction }">
                        {{
                            transaction.ENTRY_PASSAGE_TIME.replace(/(\.\d{3})?Z$/, '').replace('T', ' ')
                        }}
                    </template>
                    <template v-slot:EXIT_PASSAGE_TIME="{ row: transaction }">
                        {{ transaction.EXIT_PASSAGE_TIME.replace(/(\.\d{3})?Z$/, '').replace('T', ' ') }}
                    </template>
                    <template v-slot:VEH_PLATE="{ row: transaction }">
                        {{ transaction.VEH_PLATE }}
                    </template>
                    <template v-slot:CLASS_DESCRIPTION="{ row: transaction }">
                        {{ transaction.CLASS_DESCRIPTION }}
                    </template>
                </Datatable>

                <div class="">
                    <ul class="nav float-end">
                        <li class="nav-item float-end">
                            <button
                                class="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-success active fw-bold px-4 me-1"
                                data-bs-toggle="tab" disabled>
                                Total Pages - {{ pageCount }}
                            </button>
                        </li>
                        <li class="nav-item float-end">
                            <a class="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1"
                                data-bs-toggle="tab" @click="prevPage" :disabled="page === 1">Pre</a>
                        </li>
                        <li class="mt-2 ms-2 me-2">
                            <a>{{ page }}</a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4"
                                data-bs-toggle="tab" @click="nextPage">Next</a>
                        </li>
                    </ul>
                </div>
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
import { useTmsStore } from "../../stores/report"
const reportStore = useTmsStore();
export default defineComponent({
    name: "kt-widget-11",
    components: {
        Datatable,
    },
    props: {
        widgetClasses: String,
    },

    data() {
        return {
            loader: true,
            transactions: [],
            page: 1,
            pageCount: 0,
            totalTransCount: null,
            payload: null,
            fields: [
                {
                    columnName: " Entry Plaza Name",
                    columnLabel: "entry_plaza_name",
                    sortEnabled: true,
                },
                {
                    columnName: "Exit Plaza Name",
                    columnLabel: "entry_plaza_name",
                    sortEnabled: true,
                },
                {
                    columnName: "TAG",
                    columnLabel: "TAG",
                    sortEnabled: true,
                },
                {
                    columnName: "Entry Lane ID",
                    columnLabel: "ENTRY_LANE_ID",
                    sortEnabled: true,
                },
                {
                    columnName: "Exit Lane ID",
                    columnLabel: "EXIT_LANE_ID",
                    sortEnabled: true,
                },
                {
                    columnName: "Entry Passage Time",
                    columnLabel: "ENTRY_PASSAGE_TIME",
                    sortEnabled: true,
                },
                {
                    columnName: "Exit Passage Time",
                    columnLabel: "EXIT_PASSAGE_TIME",
                    sortEnabled: true,
                },
                {
                    columnName: "Vehicle Number",
                    columnLabel: "VEH_PLATE",
                    sortEnabled: true,
                },
                {
                    columnName: "Vehicle Class",
                    columnLabel: "CLASS_DESCRIPTION",
                    sortEnabled: true,
                }
            ],
        };
    },
    computed: {
        getFilterMasterData() {
            return reportStore.getFilterMasterData;
        },
        getpayloadMaster() {
            return reportStore.getpayloadMaster;
        },
    },

    watch: {
        getFilterMasterData: {
            handler(newVal, oldVal) {
                this.loader = false
                // React to changes in getFiltertransaction
                this.payload = this.getpayloadMaster;
                this.totalTransCount = newVal.totalCount;
                this.pageCount = Math.round(newVal.totalCount / 50);
                this.transactions = newVal.data;
            },
            deep: true, // Enable deep watching if necessary
        },
    },
    methods: {
        nextPage() {
            this.page++;
            this.fetchTransactions(this.payload, this.page);
        },
        prevPage() {
            if (this.page != 1) {
                this.page--;
                this.fetchTransactions(this.payload, this.page);
            }
        },
        async fetchTransactions(payload, page) {
            await reportStore.setFilterMasterData(payload, page)
        }
    },
    mounted() {
        this.payload = this.getpayloadMaster;
        this.totalTransCount = this.getFilterMasterData.totalCount;
        this.pageCount = Math.round(this.getFilterMasterData.totalCount / 50);
        this.transactions = this.getFilterMasterData.data;
    }
});
</script>
  