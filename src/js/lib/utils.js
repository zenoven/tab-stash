module.exports = {
    isEmpty: function(value) {
        var type;

        if(value == null) { // 等同于 value === undefined || value === null
            return true;
        }

        type = Object.prototype.toString.call(value).slice(8, -1);

        switch(type) {
            case 'String':
                return !!$.trim(value);
            case 'Array':
                return !value.length;
            case 'Object':
                for(var v in value) {
                    return false;
                }
                return true; 
            default:
                return false; // 其他对象均视作非空
            }
    }
}