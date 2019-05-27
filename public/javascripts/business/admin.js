let vInst = new Vue({
    el: "#worksarea",
    data: {
        uiHeight: 100,
        uiMargin: 160,
        editableTabs: [],
        activeTabIndex: "0"
    },
    created: function () {
        this.uiHeight = document.documentElement.clientHeight;
        console.info("body height is %s", this.uiHeight);
    },
    mounted: function(){
        console.log("mounted...")
       // this.qryRequestList();
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
        checkTabsExist:function(tabIdx){
            for(let i=0;i<this.editableTabs.length;i++) {
                let element = this.editableTabs[i];
                if(element.name == tabIdx){
                    return true;
                }
            }
            return false;
        }
    }
});