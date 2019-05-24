let business = {

    login: function () {
        let vAcc = vIns.acc;
        let vPwd = vIns.pwd;
        if (vAcc == "" || vAcc == "请输入用户名") {
            alert("请输入用户名");
            return;
        }
        if (vPwd == "" || vPwd == "请输入密码") {
            alert("请输入密码");
            return;
        }
        console.log("vAcc is %s and vPwd is %s", vAcc, vPwd);
        window.location.href = "/admin/";
    }

};
let vIns = new Vue(
    {
        el: "#maindoor",
        data: {
            acc: "",
            pwd: ""
        },
        created: function () {
            //document.body.style = "text-align:center";
        },
        methods: {
            login: business.login,
            reset: function () {
                this.acc = "";
                this.pwd = "";
            }
        }
    }
);