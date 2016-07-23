var Vue = require('vue');
var directives = {
    focus(val){
        if(val) {
            this.el.focus();
        }
    }
};

Object.keys(directives).forEach(function(directive) {
    Vue.directive(directive, directives[directive])
});
