<template>
    <div class="card h-md-100 border border-2 border-gray-300 border-hover mt-5">
        <div class="card-body">
            <div class="row fv-row mb-5 fw-semobold text-center">
                <div class="col-2">
                    <h6>Report Name</h6>
                </div>
                <div class="col-3">
                    <h6>FromDate</h6>
                </div>
                <div class="col-2">
                    <h6>ToDate</h6>
                </div>
                <div class="col-2">
                    <h6>Status</h6>
                </div>
                <div class="col-3">
                    <h6>Download</h6>
                </div>
            </div>
            <div class="row fv-row mb-5 text-center" v-for="iteam of data" :key="iteam.id">
                <div class="col-2">
                    <span class="text-muted mt-1 fw-semobold fs-7">{{ iteam.report_name }}</span>
                </div>
                <div class="col-3">
                    <span class="text-muted mt-1 fw-semobold fs-7">{{ new Date(iteam.from).toLocaleString("en-GB", {
                        timeZone: "UTC",
                    }) }}</span>
                </div>
                <div class="col-2">
                    <span class="text-muted mt-1 fw-semobold fs-7">{{ new Date(iteam.to).toLocaleString("en-GB", {
                        timeZone: "UTC",
                    }) }}</span>
                </div>
                <div class="col-2">
                    <span v-if="iteam.status === 'Done'" class="badge badge-light-success">{{ iteam.status }}</span>
                    <span v-else-if="iteam.status === 'Failed'" class="badge badge-light-danger">{{ iteam.status }}</span>
                    <span v-else class="badge badge-light-warning">{{ iteam.status }}</span>
                </div>
                <div class="col-3">
                    <a :href="iteam.download_url" download="file.csv">
                        <button type="button" class="btn btn-light-success mb-2">
                            <span class="indicator-label"> Download Report </span>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { API_ROUTES, BASE_URL } from '@/constants/Config';

export default {
    data() {
        return {
            data: null
        };
    },
    methods: {
        fetchdata() {
            axios.get(`${BASE_URL}${API_ROUTES.TMS_REPORT.GET_REPORTS}`).then((res) => {
                this.data = res.data.data
            }).catch((err) => {
                console.log(err)
            })
        },
        downloadFile(downloadUrl) {
            // Check if the downloadUrl is valid
            if (!downloadUrl) {
                console.error('Invalid download URL');
                return;
            }

            // Create a hidden anchor element
            const downloadLink = document.createElement('a');
            downloadLink.style.display = 'none';

            // Set the href and download attributes for the anchor element
            downloadLink.href = downloadUrl;
            downloadLink.download = 'report.csv'; // You can set the desired filename here

            // Append the anchor element to the document body
            document.body.appendChild(downloadLink);

            // Programmatically trigger a click event on the anchor element to initiate the download
            downloadLink.click();

            // Remove the anchor element from the document body after the download is initiated
            document.body.removeChild(downloadLink);
        },
        deleteFile() {
            axios.get(`${BASE_URL}${API_ROUTES.TMS_REPORT.DELETE_FILE}`).then((res) => {
                this.data = res.data.data
            }).catch((err) => {
                console.log(err)
            });
        }
    },
    mounted() {
        this.fetchdata();
        let i = 0
        const intervalId = setInterval(() => {
            this.fetchdata();
            i++
            if (i === 6) {
                clearInterval(intervalId); // Stop the interval after 6 intervals
            }
        }, 30000);
    }
};
</script>
