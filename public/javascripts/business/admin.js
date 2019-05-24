let vInst = new Vue({
    el: "#worksarea",
    data: {
        uiHeight: 100,
        uiMargin: 150
    },
    created: function () {
        this.uiHeight = document.documentElement.clientHeight;
        console.info("body height is %s", this.uiHeight);
    },
    computed: {
        calcHeight: function () {
            return this.uiHeight - this.uiMargin;
        },
        containerHeight: function(){
            return this.calcHeight - 2;
        },
        asideHeight: function(){
            return this.containerHeight - 2;
        },
        mainHeight: function(){
            return this.asideHeight;
        }
    }
});