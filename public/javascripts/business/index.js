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
        //here is browser output
        console.log("vAcc is %s and vPwd is %s", vAcc, vPwd);
        //here we need a ajax req
        axios.post("/login", {
            acc: vAcc,
            pwd: vPwd
        }
        ).then(function (resp) {
            console.log(resp.data);
            let rsdata = resp.data;
            if (rsdata.rs == "LoginError") {
                alert("账号或密码错误");
                return;
            }
            if (rsdata.rs == "LoginOK") {
                window.location.href = "/admin/login?user_acc="+rsdata.user_acc;
                return;
            }
            alert("未知错误");
            return;
        }).catch(resp => {
            console.log('请求失败：' + resp.status + ',' + resp.statusText);
        });

    }

};

let keyLogin = function(){
    if(event.keyCode == 13){
        vIns.login();
    }
}

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