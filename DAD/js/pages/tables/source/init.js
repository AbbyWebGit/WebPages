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
    require("jquery.table")($);
    require("jquery.pages")($);
    require("../../../module/ui/metisMenu");
    var initSidebar = require("../../../module/ui/sidebar");
    var widgetOption = require('../../../module/ui/widget.option');


    //require("../../../module/ui/fontFamily");

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
    var _mockData = require('../../../module/data/_testData');
    var _this = {
        DOM: {}, //节点容器
        showTable: function (data) {
            var opt = $.extend({
                'start_date': '', //
                'end_date': '', //
                'page_index': 1,
                'page_size': 10
            }, data);
            var _table = $('#dataTable');
            getData(opt, _table);

            //console.log(json);
            function getData(opt, dom) {
                //dataBase.get_campaign_lists_data(opt).then(function (json) {

                    var data = {};
                    var json = _mockData.table;
                    var _thList = ['{{checkAll}}', "广告计划名称", "广告组数", "开始时间", "结束时间", "状态", "创建人", "操作"];
                    var _tdList = ['{{check}}', '{{name}}', 'audience_num', 'start_date', 'end_date', 'status', 'creator', '{{control}}'];
                    var _thSort = [false, false, true, true, true, false, false, false, false, false];
                    var _list = json;


                    setTableData(data, opt, _list, _thList, _tdList, _thSort);

                    if (opt.addWidth != undefined) {
                        data['addWidth'] = opt.addWidth;
                    }
                    data['totalPage'] = _list.totals;
                    data['pageCount'] = json.page_size;
                    data['pageNum'] = json.page_index;
                    data['totalShow'] = '共' + _list.totals + '个计划';
                    //data['addFunction'] = addFunction;
                    //data['sortFunction'] = sortFunction;
                    data['pageChange'] = pageChange;
                    data['lengthChange'] = lengthChange;
                    dom.table(data);
                //全选
                    //广播table更新
                    _table.trigger('tableChange');

                //})
            };

            function pageChange(num) {
                opt.page_index = num;
                getData(opt, _table);
            }

            function lengthChange(num) {
                opt.page_size = num;
                opt.page_index = 1;
                getData(opt, _table);
            }

            function setTableData(data, opt, json, _thList, _tdList, _thSort) {
                var _th = [];
                if (opt.isAdd == true) {
                    _th.push({
                        isCenter: "",
                        isSorting: "",
                        content: ''
                    })
                }
                for (var k = 0; k < _thList.length; k++) {
                    var _s = '';
                    if (_thSort[k] && opt.isSort) {
                        _s = 'sorting';
                        if (_tdList[k] == opt.sortname) {
                            _s = opt.sorttype == 'asc' ? "sorting_asc" : "sorting_desc"
                        }
                    }
                    if (_thList[k] == '{{checkAll}}') {
                        _thList[k] = '<label class="position-relative"><input type="checkbox" class="ace" data-action="selectAll"><span class="lbl"></span></label>'

                        var _c = {
                            isCenter: "center",
                            isSorting: _s,
                            sortName: _tdList[k],
                            content: _thList[k]
                        };

                    } else {
                        var _c = {
                            isCenter: "",
                            isSorting: _s,
                            sortName: _tdList[k],
                            content: _thList[k]
                        };
                    }

                    _th.push(_c);
                }
                data['th'] = _th;

                if (json == null || json == '') {
                    data['td'] = '';
                } else {
                    var _td = [];
                    for (var i = 0; i < json.list.length; i++) {
                        var _tdOne = [];
                        if (opt.isAdd == true) {
                            _tdOne.push({
                                isCenter: "",
                                content: '{{add}}'
                            });
                        }
                        for (var j = 0; j < _tdList.length; j++) {
                            var _tdData = json.list[i],
                                _content = _tdData[_tdList[j]],
                                _cId = _tdData.id,
                                _cStr = 'campaign_id=' + _tdData.id,
                                _advStr = 'advertiser_id=' + '100';
                            if (_tdList[j].indexOf('date') > -1) {
                                var __data = _tdData[_tdList[j]];
                                if (typeof __data == 'string' && __data.indexOf('-') > -1) {
                                    _content = __data.replace(/-/g, '/')
                                } else if (__data == undefined) {
                                    _content = '0'
                                } else {
                                    _content = __data
                                }
                            }
                            if (_tdList[j] == '{{name}}') {
                                _content = '<a href="/audience?' + _advStr + '&' + _cStr + '">' + _tdData.name + '</a>'
                            }
                            if (_tdList[j] == '{{check}}') {
                                _content = '<label class="position-relative"><input type="checkbox" class="ace" value="' + _cId + '" title="' + _tdData.name + '"><span class="lbl"></span></label>';
                            }

                            if (_tdList[j] == '{{control}}') {
                                var __controls = _tdData.control;
                                _content = '<div class="table-btn">';
                                if (typeof __controls == 'object') {
                                    var __btns = '';
                                    for (var _i in __controls) {
                                        __btns += _i + ','
                                    }
                                    // 只考虑到1位数字的情况
                                    /**
                                     *
                                     control 操作
                                     1 预览
                                     2 编辑
                                     3 查看报告
                                     4 删除
                                     5 获取代码
                                     */
                                    if (__btns.indexOf('1') > -1) {
                                        _content += '<a href="/campaign/view_view?' + _advStr + '&' + _cStr + '" target="_blank" data-action="view" class="blue" title="预览"><i class="ace-icon fa fa-picture-o"></i><span>预览</span></a>'
                                    }

                                    if (__btns.indexOf('3') > -1) {
                                        _content += ' <a href="/campaign/view_report?' + _advStr + '&' + _cStr + '&report_block=0" class="blue" target="_blank" data-action="report" title="' + _tdData.name + '的报告"><i class="ace-icon fa fa-line-chart"></i><span>报告</span></a>'
                                    }
                                    if (__btns.indexOf('2') > -1) {
                                        //VALUE = 1 可读写 =2 只读
                                        if (__controls['2'] == 1) {
                                            _content += '<a href="/campaign/view_edit?' + _advStr + '&' + _cStr + '" class="blue" data-action="edit" title="编辑"><i class="ace-icon fa fa-edit"></i><span>编辑</span></a>'
                                        } else {
                                            _content += '<a href="javascript:;" class="blue disabled" data-action="edit" title="编辑"><i class="ace-icon fa fa-edit"></i><span>编辑</span></a>'
                                        }
                                    }
                                } else {
                                    continue;
                                }

                                _content += '</div>';
                            }

                            if (_tdList[j] == '{{check}}') {
                                var _c = {
                                    isCenter: "center",
                                    content: _content
                                };
                            } else {
                                var _c = {
                                    isCenter: "",
                                    content: _content
                                };
                            }

                            _tdOne.push(_c);
                        }
                        _td.push(_tdOne);
                    }
                    data['td'] = _td;

                }
            }
        },
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
        //$('.page-header').dialog()
        //tables
        _this.showTable();
        initSidebar();
    };
//-------------------------------------------

//---DOM事件绑定方法定义区-------------------------
    var bindDOM = function () {

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
