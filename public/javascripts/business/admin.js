let vInst = new Vue({
    el: "#worksarea",
    data: {
        uiHeight: 100,
        uiMargin: 160,
        editableTabs: [],
        activeTabIndex: "0",
        pageSize: 10,
        totalCount: 0,
        currentPage: 1,
        reqDataSet: [],
        merchantName: "",
        requestBeginDate: "",
        requestEndDate: ""
    },
    created: function () {
        this.uiHeight = document.documentElement.clientHeight;
        console.info("body height is %s", this.uiHeight);
    },
    mounted: function () {
        console.log("mounted...refresh req list");
        this.qryRequestList(1);
    },
    computed: {
        calcHeight: function () {
            return this.uiHeight - this.uiMargin;
        },
        containerHeight: function () {
            return this.calcHeight - 2;
        },
        asideHeight: function () {
            return this.containerHeight - 2;
        },
        mainHeight: function () {
            return this.asideHeight;
        }
    },
    methods: {
        checkTabsExist: function (tabIdx) {
            for (let i = 0; i < this.editableTabs.length; i++) {
                let element = this.editableTabs[i];
                if (element.name == tabIdx) {
                    return true;
                }
            }
            return false;
        },
        gofunc: function (idx) {
            document.getElementById("tab-" + idx).click();
        },
        goPage: function (pageNumber) {
            //console.log(pageNumber);
            this.qryRequestList(pageNumber);
        },
        clearSearchConditions: function () {
            this.merchantName = "";
            this.requestBeginDate = "";
            this.requestEndDate = "";
        },
        qryWithCondition: function () {
            this.qryRequestList(1);
        },
        qryRequestList: function (pageNumber) {
            let rand = new Date().getTime();
            let obParas = {
                limit: 10,
                offset: (pageNumber - 1) * 10,
                randstamp: rand
            };
            if(this.merchantName != ""){
                obParas.paraName = this.merchantName;
            }
            if(this.requestBeginDate != ""){
                obParas.paraBeginDate = this.requestBeginDate;
            }
            if(this.requestEndDate != ""){
                obParas.paraEndDate = this.requestEndDate;
            }
            axios.get("admin/qryreqlist", {
                params: obParas
            }).then(function (resp) {
                //console.log(resp.data);
                let rsdata = resp.data;
                if (rsdata.rs == "ERROR") {
                    alert("服务器内部错误");
                    return [];
                }
                if (rsdata.rs == "OK") {
                    vInst.reqDataSet = rsdata.rsArray;
                    vInst.totalCount = rsdata.total;
                    return;
                }
                alert("未知错误");
                return [];
            }).catch(resp => {
                console.log('请求失败：' + resp.status + ',' + resp.statusText);
            });
        }
    }
});