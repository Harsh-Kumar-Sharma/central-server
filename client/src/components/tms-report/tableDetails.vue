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
                    <template v-slot:LANE_TRANS_ID="{ row: transaction }">
                        {{ transaction.LANE_TRANS_ID }}
                    </template>
                    <template v-slot:LANE_ID="{ row: transaction }">
                        {{ transaction.LANE_ID }}
                    </template>
                    <template v-slot:VEH_PLATE="{ row: transaction }">
                        {{ transaction.VEH_PLATE }}
                    </template>
                    <template v-slot:PASSAGE_TIME="{ row: transaction }">
                        {{
                            transaction.PASSAGE_TIME
                        }}
                    </template>
                    <template v-slot:CLASS_DESCRIPTION="{ row: transaction }">
                        {{ transaction.CLASS_DESCRIPTION }}
                    </template>
                    <template v-slot:DESCRIPTION="{ row: transaction }">
                        {{ transaction.DESCRIPTION }}
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
                    columnName: "Txn Id",
                    columnLabel: "LANE_TRANS_ID",
                    sortEnabled: true,
                },
                {
                    columnName: "Lane Id",
                    columnLabel: "LANE_ID",
                    sortEnabled: true,
                },
                {
                    columnName: "Vehicle No",
                    columnLabel: "VEH_PLATE",
                    sortEnabled: true,
                },
                {
                    columnName: "Passage Time",
                    columnLabel: "PASSAGE_TIME",
                    sortEnabled: true,
                },
                {
                    columnName: "Vehicle Class",
                    columnLabel: "CLASS_DESCRIPTION",
                    sortEnabled: true,
                },
                {
                    columnName: "Payment",
                    columnLabel: "DESCRIPTION",
                    sortEnabled: true,
                }
            ],
        };
    },
    computed: {
        getFiltertransaction() {
            return reportStore.getFiltertransaction;
        },
        getpayload() {
            return reportStore.getpayload;
        },
    },

    watch: {
        getFiltertransaction: {
            handler(newVal, oldVal) {
                this.loader = false
                // React to changes in getFiltertransaction
                this.payload = this.getpayload;
                this.totalTransCount = newVal.totalCount;
                this.pageCount = Math.round(newVal.totalCount / 10);
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
            await reportStore.setFiltertransactionData(payload, page)
        }
    },
    mounted() {
        this.payload = this.getpayload;
        this.totalTransCount = this.getFiltertransaction.totalCount;
        this.pageCount = Math.round(this.getFiltertransaction.totalCount / 10);
        this.transactions = this.getFiltertransaction.data;
    }
});
</script>
  