/**
 * name
 * @param {Object}
 * @return {Object} 实例
 * @author xxx@yiche.com
 * @example
 *
 */

define(function (require, exports, module) {
    //---引用定义区----------------------------------
    var $ = require("jqueryui");
    require("bootstrap");
    require("datetimepicker");
    require("jquery.chosen");
    require('../../../module/ui/widget.timeRange')($);
    var initSidebar = require("../../../module/ui/sidebar");
    var widgetOption = require('../../../module/ui/widget.option');

    //---常量定义区----------------------------------

    //----------------------------------------------

    //---构造函数----------------------------------
    function init() {
        // argsCheck();
        initPlugins();
        bindDOM();
        bindCustEvt();
        bindListener();
    }

    //----------------------------------------------

    //---变量量定义区----------------------------------

    var _choose;
    var _gettype = 'all';

    var _this = {
        DOM: {}, //节点容器
        objs: {} //组件容器
    }
//----------------------------------------------
//---自定义事件绑定的回调函数定义区--------------------
    var bindCustEvtFuns = {};
//----------------------------------------------

//---广播事件绑定的回调函数定义区---------------------
    var bindListenerFuns = {};
//-------------------------------------------

//---参数的验证方法定义区---------------------------
    var argsCheck = function (node) {
        if (node == null) {
            throw "[]:argsCheck()-The param node is not a DOM node.";
        } else {
            _this.DOM = node;
        }
    };
//-------------------------------------------

//---模块的初始化方法定义区-------------------------
    var initPlugins = function () {
        initSidebar();
    };
//-------------------------------------------

//---DOM事件绑定方法定义区-------------------------
    var bindDOM = function () {

        //chosen
        $('[data-node="chosen"]').chosen(widgetOption.chosenDefault)
        $('[data-node="chosen-search"]').chosen(widgetOption.chosenSearch)
    };
//-------------------------------------------

//---自定义事件绑定方法定义区------------------------
    var bindCustEvt = function () {

    };
//-------------------------------------------

//---广播事件绑定方法定义区------------------------
    var bindListener = function () {

    };
//-------------------------------------------

//---组件公开方法的定义区---------------------------
    init.prototype.destroy = function () {
        if (_this) {
            $.foreach(_this.objs, function (o) {
                if (o && o.destroy) {
                    o.destroy();
                }
            });
            _this = null;
        }
    };
//-------------------------------------------
//---组件的初始化方法定义区-------------------------
// var init = function() {
// };
//-------------------------------------------

//---组件公开属性或方法的赋值区----------------------
    module.exports = init;
//-------------------------------------------
})
;
