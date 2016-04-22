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
    var $ = require("jquery");
    require("bootstrap");
    require("jquery.table")($);
    require("jquery.pages")($);
    require ('moment');
    require ('datetimepicker');
    require('../../../module/ui/widget.timeRange')($);
    var initSidebar = require("../../../module/ui/sidebar");
    var fn = require("../../../module/data/fn")
    //file upload old
    //require('widgets/jQuery.fileupload/1.1.0/jquery.fileupload.js');
    //require('widgets/jQuery.fileupload/1.1.0/jquery.iframe-transport.js');

    //file upload
    //require('widgets/jQuery.fileupload/9.12.1/js/jquery.iframe-transport.cmd.js');
    //require('widgets/jQuery.fileupload/9.12.1/js/jquery.fileupload.cmd.js');

    //uploadify
    require('widgets/jQuery.uploadify/1.0.0/main.js')($);
    require('widgets/jQuery.uploadifive/1.1.2/jquery.uploadifive.cmd.js')($);

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

    var _this = {
        initUploadify: function () {
            //upload
            $('#fileupload00').uploadify({
                'height': 30,
                'width': 100,
                'swf': '/assets/js/module/uploadify.swf',
                'buttonImage': '',
                'fileObjName': 'material_file',
                'uploader': '/material/upload_material/?advertiser_id=',
                'fileTypeDesc': 'Image Files，Vedio Files',
                'fileTypeExts': '*.gif; *.jpg; *.png;*.mp4;*.mov;*.wmv;*.avi;*.flv;*.swf',
                'buttonText': '<i class="fa fa-plus"></i>本地上传',
                'overrideEvents': ['onUploadProgress'],
                'buttonClass': 'btn btn-xs btn-primary',
                'itemTemplate': '<div id="${fileID}" class="uploadify-queue-item clearfix">' +
                    //'<div class="pull-left">${fileName}<span class="text-muted">(${fileSize})</span></div>'+
                    //'<div class="pull-right"><a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')"><i class="ace-icon glyphicon glyphicon-remove"></i></a></div>'+
                '</div>',
                'onInit': function (instance) {

                }
            });
        },
        initUploadifive: function () {
            $('#fileupload01').uploadifive({
                'auto': false,
                'checkScript': 'check-exists.php',
                'formData': {
                    'timestamp': '',
                    'token': ''
                },
                'fileType': '*.gif; *.jpg; *.png;*.mp4;*.mov;*.wmv;*.avi;*.flv;*.swf',
                'buttonText': '<i class="fa fa-plus"></i>本地上传',
                'buttonClass': 'btn btn-xs btn-primary',
                'queueID': 'queue',
                'dnd': false,
                'uploadScript': 'uploadifive.php',
                'onUploadComplete': function (file, data) {
                    console.log(data);
                },
                'onAddQueueItem': function (file) {
                    console.log(file);
                }
            });
        },
        initUpload: function () {
            $('#fileupload1').fileupload({
                // Uncomment the following to send cross-domain cookies:
                //xhrFields: {withCredentials: true},
                url: 'server/php/',
                change: function (e, data) {
                    console.log(e);
                    _this.imgReview(e);
                }
            });
        },
        imgReview: function (e) {
            var _file = e.target.files[0];
            if (_file) {
                var reader = new FileReader();
                reader.onload = function () {
                    $('.img-thumbnail').attr('src', this.result);
                    $('#uploadReview').attr('src', this.result).closest('.btnReview').show();
                    $('#btnCont').html(_tpl.edit);
                    if (_options.isDel) {
                        $('#delReview').show();
                    }
                }
                reader.readAsDataURL(_file);
                //$('#material_file_edit').remove();
            };
        },
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
        //$('.page-header').dialog()
        //date time picker
        fn.datatimepicker();
        fn.chosen();
        $('#timeRange').timeChoose();
        // pop 弹窗
        $('[data-toggle="popover"]').popover();
        initSidebar();
        //_this.initUploadifive();
        //_this.initUpload();
        //_this.initUploadify();


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
