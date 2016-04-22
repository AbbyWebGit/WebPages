/**
 * Author: 吴斌(wubin)
 *
 * 时间选择及区间插件
 *
 * 依赖库：jQuery,momentjs,datetimepicker
 *
 *
 * Examples:
 *
 * <pre><code>
 * &lt;div id="timeRange"&gt;&lt;/div&gt;
 *
 * &lt;script&gt;
 * $('#pages').timeChoose({
 * 'sTime': '',// 默认开始时间
 *    'eTime': '',//默认结束时间
 *    'maxDate': '2020-01-01',//默认可选最晚时间
 *    'minDate': '2014-05-01',//默认可选最早时间
 *    'sName': 'start_date',//开始时间的name[key]
 *    'eName': 'end_date',//结束时间的name[key]
 *    'inputW':'300px',//容器快读
 *    'multipleNum': 0,//添加多组时间区间
 *     classRange:'dateRange'//默认时间区间的classname
 * })
 * &lt;/script&gt;
 * </code></pre>
 */
define(function (require, exports, module) {
    require('moment');
    require('datetimepicker');
    return function (jQuery) {
        (function ($) {
            $.fn.extend({
                timeChoose: function (options) {
                    var _options = $.extend({
                        'sTime': '',// 默认开始时间
                        'eTime': '',//默认结束时间
                        'maxDate': '2020-01-01',//默认可选最晚时间
                        'minDate': '2014-05-01',//默认可选最早时间
                        'sName': 'start_date',//开始时间的name[key]
                        'eName': 'end_date',//结束时间的name[key]
                        'inputW': '300px',//容器快读
                        'multipleNum': 0,//添加多组时间区间
                        classRange: 'dateRange'//默认时间区间的classname
                    }, options);
                    var _timeOption = {
                        'maxDate': _options.maxDate,
                        'minDate': _options.minDate,
                        dayViewHeaderFormat: 'YYYY MMMM',
                        format: 'YYYY/MM/DD',
                        useCurrent: false
                        //isRTL:true,
                    };
                    var dateObj = {};

                    function tempReplace(template, obj, loc) {
                        var _loc = (loc === 'i' || loc === 'g') ? loc : 'g',
                            _temp = template;
                        for (var _key in obj) {
                            var _ex = new RegExp('{{' + _key + '}}', _loc);
                            _temp = _temp.replace(_ex, obj[_key]);
                        }
                        return _temp;
                    }

                    var _selector = $(this), _DOM = this;
                    var _TPL = {
                        filter: '<div class="pull-left" style="margin-right:30px"><select id="chooseDate" class="chosen"> <option data-action="0">自定义</option><option data-action="0d">今天</option> <option data-action="1d">昨天</option> <option data-action="7d">最近7天</option> <option data-action="15d">最近15天</option> <option data-action="0m">本月</option> <option data-action="1m">上月</option> </select></div>',
                        //day: '<div class="input-group" data-id="{{id}}"><div class="input-group date-picker date-picker-s" style="width:'+_options.inputW+'"><input class="form-control" type="text" name="' + _options.sName + '" placeholder="不限"><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div>></div>',
                        range: '<div class="input-daterange input-group" data-id="{{id}}" style="width:' + _options.inputW + '"><input type="text" class="input-sm form-control date-picker-s" name="' + _options.sName + '"><span class="input-group-addon"><i class="fa fa-exchange"></i></span><input type="text" class="input-sm form-control date-picker-e" name="' + _options.eName + '"></div>',
                        add: '<span data-action="addTimeCal" class="pull-left btn btn-xs btn-primary btn-only-icon"><i class="ace-icon fa fa-plus"></i></span>',
                        remove: '<span data-action="delTimeCal" class="pull-left btn btn-xs btn-danger btn-only-icon"><i class="ace-icon fa fa-close"></i></span>'
                    };
                    //init
                    function _init() {
                        if (_options.timeFileter) {
                            _selector.html(_TPL.filter);
                            initFilter();
                        }

                        _selector.append(tempReplace(_TPL.range, {id: 0}));

                        initDatePicker($('.date-picker-s', _selector), $('.date-picker-e', _selector));
                        if (_options.multiple) {
                            _selector.find('.input-group').append(_TPL.add);
                            initMultiple();
                            initMultipleNum();
                        }
                    }

                    function initDatePicker($S, $E) {
                        $S.datetimepicker(_timeOption);
                        $E.datetimepicker(_timeOption);
                        $S.on("dp.change", function (e) {
                            var _date = e.date === undefined ? _options.minDate : e.date.add(-1, 'days');
                            var _e = $S.closest('.input-group').children('.date-picker-e');
                            _e.data("DateTimePicker").minDate(_date);
                            _selector.trigger('change');
                            _dateRange();
                        }).on('dp.pageChange', function (e) {
                            _dateRange();
                        }).on('dp.show', function (e) {
                            _dateRange();
                        }).on('input', function (e) {
                            var __val = this.value !== undefined ? this.value : $(this).children('input').val();
                            if (__val === '' || __val === null) {
                                _selector.trigger('change');
                                $S.trigger('dp.change');
                            }
                        });
                        $E.on("dp.change", function (e) {
                            var _date = e.date === undefined ? _options.maxDate : e.date;
                            var _s = $S.closest('.input-group').children('.date-picker-s');
                            _s.data("DateTimePicker").maxDate(_date);
                            _selector.trigger('change');
                            _dateRange();
                        }).on('dp.pageChange', function (e) {
                            _dateRange();
                        }).on('dp.show', function (e) {
                            _dateRange();
                        }).on('input', function (e) {
                            var __val = this.value !== undefined ? this.value : $(this).children('input').val();
                            if (__val === '' || __val === null) {
                                _selector.trigger('change');
                                $E.trigger('dp.change');
                            }
                        });


                        function _dateRange() {
                            var __sDate = $S.find('input').val() || $S.val(),
                                __eDate = $E.find('input').val() || $E.val(),
                                __cal = $('.bootstrap-datetimepicker-widget .datepicker-days');
                            var __sTime, __eTime, __days;
                            __sTime = new Date(__sDate).getTime();
                            __eTime = new Date(__eDate).getTime();
                            __cal.find('tbody td').not('.disabled').each(function (i, a) {
                                var __td = $(a), __date = __td.attr('data-day'), __dateTime = new Date(__date).getTime(),
                                    __classRange = _options.classRange;
                                __td.removeClass(__classRange);
                                if (__dateTime >= __sTime && __dateTime <= __eTime + 86400000) {
                                    $('[data-day="' + __date + '"]', __cal).addClass(__classRange);
                                } else {
                                    __td.removeClass(__classRange);
                                }
                                $('[data-day="' + __sDate + '"]', __cal).addClass('active');
                                $('[data-day="' + __eDate + '"]', __cal).addClass('active');
                            });
                        }
                    }

                    // todo 多组筛选是否还需要?
                    //function initMultiple() {
                    //
                    //    //add
                    //    $('[data-action="addTimeCal"]', _selector).on('click', function () {
                    //        var __id = $(_DOM).find('.input-group').length,
                    //            __tpl = tempReplace(_TPL.day, {id: __id});
                    //        var __cDOM;
                    //        _selector.append(__tpl);
                    //        __cDOM = _selector.find('.input-group[data-id="' + __id + '"]');
                    //        initDatePicker($('.date-picker-s', __cDOM), $('.date-picker-e', __cDOM));
                    //        // remove
                    //        __cDOM.append(_TPL.remove);
                    //        $('[data-action="delTimeCal"]', __cDOM).on('click', function () {
                    //            $(this).off('click');
                    //            $(this).closest('.input-group').remove();
                    //        });
                    //    });
                    //}
                    //
                    //function initMultipleNum() {
                    //    if (_options.multiple && _options.multipleNum < 1) {
                    //        return;
                    //    }
                    //    for (var i = 1; i < _options.multipleNum; i++) {
                    //        $('[data-action="addTimeCal"]', _selector).click();
                    //    }
                    //}

                    function initFilter() {
                        var _cont = $('#chooseDate');
                        _cont.chosen({
                            'width': '160px',
                            'disable_search': true
                        });

                        _cont.off().on('change', function (e) {
                            var __self = $(this),
                                __type = __self.find('option:selected').attr('data-action');
                            var _start, _end;
                            e.stopPropagation();
                            //type
                            switch (__type) {
                                case '0':
                                    //_s.click();
                                    _start = '';
                                    _end = '';
                                    break;
                                case '0d':
                                    _start = _end = dateObj.today;
                                    break;
                                case '1d':
                                    _start = _end = dateObj.today - 1 * dateObj.day;
                                    break;
                                case '7d':
                                    _start = dateObj.last7day;
                                    _end = dateObj.today;
                                    break;
                                case '15d':
                                    _start = _today - 14 * _day;
                                    _end = dateObj.today;
                                    break;
                                case '0m':
                                    _start = dateObj.thisMonthStart;
                                    _end = dateObj.today;
                                    break;
                                case '1m':
                                    _start = dateObj.lastMonth === 12 ? new Date('12/' + '1' + '/' + dateObj.thisYear - 1) : new Date(dateObj.lastMonth + '/' + '1' + '/' + dateObj.thisYear);
                                    _start = _start.getTime();
                                    _end = dateObj.thisMonthStart - dateObj.day;
                                    break;
                            }
                            // set date
                            _s.data("DateTimePicker").setDate(_start);
                            _e.data("DateTimePicker").setDate(_end);
                            _selector.trigger('change');
                            //default


                            //session
                            //sessionStorage['_start'] = _start;
                            //sessionStorage['_end'] = _end;
                            ////去掉几天选择日期区间的快捷按钮选中态
                            //clearCur();
                            ////setCookie
                            //sessionStorage.setItem('_type', __type);
                        });
                    }

                    _init();
                }
            });
        })(jQuery);
    };
});