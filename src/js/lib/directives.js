var Vue = require('vue');
var directives = {
    focus(val){
        if(val) {
            var s = this
            this.el.select();
            // setTimeout(function () {
            //     s.el.select();
            // },0);
        }
    }
};

Object.keys(directives).forEach(function(directive) {
    Vue.directive(directive, directives[directive])
});
