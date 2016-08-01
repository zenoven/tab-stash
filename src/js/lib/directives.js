var directives = {
    focus(val){
        if(val) {
            var self = this;
            // self.el.select();  //this does not work, self.el.value is ''
            this.vm.$nextTick(function () {
                self.el.select(); //this works
            });
        }
    }

};

Object.keys(directives).forEach(function(directive) {
    Vue.directive(directive, directives[directive])
});

