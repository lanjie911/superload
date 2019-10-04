let vInst = null;

// 处理请求列表的数据
let handleReqQryResult = function (resp) {
    //console.log(resp.data);
    let rsdata = resp.data;
    if (rsdata.rs == "ERROR") {
        alert("服务器内部错误");
        return [];
    }
    if (rsdata.rs == "OK") {
        if (!rsdata.rsArray) {
            alert("没有查询到数据");
            return;
        }
        if (rsdata.rsArray.length == 0) {
            alert("没有查询到数据");
            return;
        }
        vInst.reqDataSet = rsdata.rsArray;
        vInst.totalCount = rsdata.total;
        return;
    }
    alert("未知错误");
    return [];
};

openPic = function(ele){
    let xsrc = ele.firstChild.src;
    // alert(xsrc);
    window.open(xsrc,"ppic");
}

vInst = new Vue({
    el: "#worksarea",
    data: {
        uiHeight: 100,
        uiMargin: 160,
        activeTabIndex: "0",

        //请求列表属性
        pageSize: 10,
        totalCount: 0,
        currentPage: 1,
        reqDataSet: [],
        merchantName: "",
        requestBeginDate: "",
        requestEndDate: "",

        //修改密码数据
        oldPwd: "",
        newPwd: "",
        newPwdAffirm: "",

        // 执行群发短信任务
        groupMarketing: {
            merchantList: [],
            uplodeFile: "",
            uploadMerchantId: 0
        },

        // 审核自助发短信的列表
        selfSMSData : {
            auditPList: [
                
            ],
            auditEList: [

            ]
        },

        adtitle: "审批",
        dialogVisible: false,
        auditdesc:"",
        curr_kind:"",
        curr_id:0
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
            document.getElementById("tab-" + idx).style.display = "";
            document.getElementById("pane-" + idx).style.display = "";
            document.getElementById("tab-" + idx).click();
        },
        goPage: function (pageNumber) {
            //console.log(pageNumber);
            this.qryRequestList(pageNumber);
        },
        // 关闭标签
        tabRemoved: function (tabIdx) {
            console.log("tab index is %s", tabIdx);
            document.getElementById("tab-" + tabIdx).style.display = "none";
            document.getElementById("pane-" + tabIdx).style.display = "none";
        },
        // 标签被选中
        tabSelected: function (tabObj) {
            let idx = tabObj.index;
            if(5 == idx){
                // 切换到审核自助发短信的列表
                // 刷新个人审核数据
                axios.get("/task/qrypaudits", {
                    params: {}
                }).then(function(res){
                    console.log(res);
                    vInst.selfSMSData.auditPList = res.data.rs;
                }).catch(resp => {
                    console.log('请求失败：' + resp.status + ',' + resp.statusText);
                });
                return;
            }
            if(6 == idx){
                // 切换到审核自助发短信的列表
                // 刷新个人审核数据
                axios.get("/task/qryeaudits", {
                    params: {}
                }).then(function(res){
                    console.log(res);
                    vInst.selfSMSData.auditEList = res.data.rs;
                }).catch(resp => {
                    console.log('请求失败：' + resp.status + ',' + resp.statusText);
                });
                return;
            }
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
            if (this.merchantName != "") {
                obParas.paraName = this.merchantName;
            }
            if (this.requestBeginDate != "") {
                obParas.paraBeginDate = this.requestBeginDate;
            }
            if (this.requestEndDate != "") {
                obParas.paraEndDate = this.requestEndDate;
            }
            axios.get("admin/qryreqlist", {
                params: obParas
            }).then(handleReqQryResult).catch(resp => {
                console.log('请求失败：' + resp.status + ',' + resp.statusText);
            });
        },
        goResetPwd: function () {
            let oldPwd = this.oldPwd;
            let newPwd = this.newPwd;
            let newPwdAffirm = this.newPwdAffirm;
            if (oldPwd == "" || oldPwd == "请输入原始密码") {
                alert("请输入原始密码名");
                return;
            }
            if (newPwd == "" || newPwd == "请输入新密码") {
                alert("请输入新密码");
                return;
            }
            if (newPwdAffirm == "" || newPwdAffirm == "请再次输入新密码") {
                alert("请再次输入新密码");
                return;
            }
            if (newPwd != newPwdAffirm) {
                alert("新密码两次输入不一致");
                return;
            }
            axios.post("admin/resetpwd", {
                oldPwd: oldPwd,
                newPwd: newPwd
            }).then(function (resp) {
                alert(resp.data.rs);
            }).catch(resp => {
                console.log('请求失败：' + resp.status + ',' + resp.statusText);
            });
        },

        //上传文件
        uploadTask: function(){
            let merchantId = this.groupMarketing.uploadMerchantId;
            console.log("TO BE DONE...")
        },

        // 处理申请
        handleAudit: function(rowid,kind){
            this.curr_id = rowid;
            this.curr_kind = kind;
            this.dialogVisible = true;
        },

        doAudit: function(opt){
            let paraOb = {};
            paraOb.rid = this.curr_id;
            paraOb.desc = this.auditdesc;
            paraOb.opt = opt;
            let aurl = "/task/doaudit";
            paraOb.kind = this.curr_kind;
            axios.post(aurl, paraOb).then(function (resp) {
                alert("操作成功");
                if("p"==vInst.curr_kind){
                    vInst.selfSMSData.auditPList = [];
                    vInst.dialogVisible = false;
                    vInst.gofunc(5);
                }else if("e"==vInst.curr_kind){
                    vInst.selfSMSData.auditEList = [];
                    vInst.dialogVisible = false;
                    vInst.gofunc(6);
                }
            }).catch(resp => {
                console.log('请求失败：' + resp.status + ',' + resp.statusText);
            });
        }
    }
});