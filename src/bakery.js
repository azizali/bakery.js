/*
 * bakery.js v1.0.0
 *
 * Copyright (c) 2012 Taka Okunishi
 *
 * http://techbakery.net
 */
Bakery = (function () {


    var B = {};

    B.meta = {
        defineField:function(obj, name, val){
            var actualName = '_' + name;
            obj[actualName] = val;
            obj[name] = function (val) {
                var s = this;
                if (!arguments.length) return s[actualName];
                s[actualName] = val;
                return s;
            }

        }
    };



    /*
     *  - Baker.define(def) -
     *
     *  A method to define object.
     *  Argument 'def' composed of
     *   {
     *      prototype:function(){}
     *      init : function(){},
     *      property : {}
     *      field:{
     *          field_name:'default val'
     *      }
     *   }
     *  Baker will add below methods to the defined object:
     *     .__mixin__(mixin)
     *     .__extend__()
     */
    var define = B.define = function (def) {

        var func = def.init || function () {};

        if (def.prototype) func.prototype = new def.prototype();

        //add property to the prototype
        for (var key in def.property) {
            if (def.property.hasOwnProperty(key)) {
                func.prototype[key] = def.property[key];
            }
        }

        if (def.field) {
            //field names will be used for accessor.
            //actual name of filed variable is prefixed with '_'.
            Object.keys(def.field).forEach(function (name) {
                B.meta.defineField(func.prototype, name, def.field[name]);
            });
        }

        //prepare a mixin method to add propery dynamically.
        func.__mixin__ = function (mixin) {
            for (var key in mixin) {
                if (!mixin.hasOwnProperty(key)) continue;
                func.prototype[key] = mixin[key];
            }
            return func;
        };

        //prepare a extend method to extend func itself.
        func.__extend__ = function (extension) {
            for (var key in extension) {
                if (!extension.hasOwnProperty(key)) continue;
                func[key] = extension[key];
            }
            return func;
        };

        func.prototype.__super__ = function(){
            var s = this;
            return s.__proto__.__proto__;
        };

        return func;
    };




    /* - Baker.Mixin -
     *
     *  A mixin definition for Baker object.
     *  Pass this mixin to .__mixin__() method of
     *  a Baker object and the object prototype will
     *  be extended.
     *
     */
    B.Mixin = define({
        init:function (definitions) {
            var s = this;
            for (var i = arguments.length - 1; i >= 0; i--) {
                var def = arguments[i];
                for (var key in def) {
                    if (def.hasOwnProperty(key)) {
                        s[key] = def[key];
                    }
                }
            }
        },
        property:{
            __field__:function(def){
                var s = this;
                for(var key in def){
                    if(def.hasOwnProperty(key)){
                        B.meta.defineField(s, key, def[key]);
                    }
                }
                return s;
            }
        }
    });


    B.repeat = function(callback, times){
        for(var i=0; i<times; i++){
            callback();
        }
    };



    return B;
})();

