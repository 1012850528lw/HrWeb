//列表初始化
function tableInit(url) {
    $('#data_table').bootstrapTable({
        url: url,
        method: 'get',
        cache: false,
        toolbar: '#toolbar',
        pagination: true,
        pageSize: 10,
        pageNumber: 1,
        pageList: [10, 25, 50],
        search: false,
        sidePagination: 'server',
        queryParams: queryParams,
        showColumns: true,
        showExport: false,
        showRefresh: true,
        minimumCountColumns: 1,
        clickToSelect: true,
        smartDisplay: true,
        cardView: false,
        columns: [
            {
                field: 'name',
                title: '用户名',
                align: 'center'
            },
            {
                field: 'workid',
                title: '工号',
                align: 'center'
            },
            {
                field: 'phone',
                title: '电话',
                align: 'center'
            },
            {
                field: 'password',
                title: '密码',
                align: 'center'
            },
            {
                field: 'email',
                title: '邮箱',
                align: 'center'
            },
            {
                field: 'loginName',
                title: '登录名',
                align: 'center'
            },
            {
                title: '操作',
                align: 'center',
                width: 200,
                events: operateEvents,
                formatter: operationFormatter
            }]
    });

    function queryParams(params) {
        var temp = {
            pageSize: params.limit,
            pageNumber: params.offset,
            name: $("#name").val(),
            workid: $("#workid").val(),
            loginName: $("#loginName").val()
        };
        return temp;
    }
}

//增加页面跳转方法
function addShow() {
    parent.layer.open({
        type: 2,
        title: '增加用户',
        shade: 0.1,
        shadeClose: true,
        maxmin: true,
        area: ['70%', '80%'], //宽高
        content: '/user/saveonepage',
        end: function () {
            $("#data_table").bootstrapTable('refresh');
        }
    });
}

function operationFormatter(value, row, index) {
    return [
        '<span class=" modifiedOperate" style="margin-left:5px;color: white;text-align: center;background: #fe5722;padding: 4px 16px;cursor: pointer;">修改</span>',
        '<span class=" deleteOperate" style="margin-left:5px;color: white;text-align: center;background: #fe5722;padding: 4px 16px;cursor: pointer;">删除</span>']
        .join('');
}

window.operateEvents = {
    'click .deleteOperate': function (e, value, row, index) {
        parent.layer.confirm('是否删除此条记录', {
            shade: false,
            btn: ['确定', '取消']
        }, function () {
            $.ajax({
                type: "get",
                url: "/user/removeone",
                dataType: "text",
                data: {
                    "id": row.id
                },
                error: function () {
                    parent.layer.msg("删除失败");
                },
                success: function (msg) {
                    parent.layer.msg("删除成功");
                    $("#data_table").bootstrapTable('refresh');
                    setTimeout(function () {
                        var index = parent.parent.layer.getFrameIndex(window.name);
                        parent.parent.layer.close(index);
                    }, 1500);
                }
            });
        });
    },
    'click .modifiedOperate': function (e, value, row, index) {
        parent.layer.open({
            type: 2,
            title: '修改用户',
            shade: 0.1,
            shadeClose: true,
            area: ['70%', '80%'],
            maxmin: true,
            content: '/user/getone?id=' + row.id,
            end: function () {
                $("#data_table").bootstrapTable('refresh');
            }
        });
    }
};

//查询方法
function search() {
    $("#data_table").bootstrapTable('destroy');
    tableInit("/user/getlist");
}

//表单校验
$('#form_user_add').bootstrapValidator({
    message: 'This value is not valid',
    excluded: ':disabled',
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        name: {
            message: '用户名不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '用户名必填不能为空'
                }
            }
        },
        workid: {
            message: '工号不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '工号必填不能为空'
                }
            }
        },
        phone: {
            message: '电话不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '电话必填不能为空'
                }
            }
        },
        password: {
            message: '密码不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '密码必填不能为空'
                }
            }
        },
        email: {
            message: '邮箱不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '邮箱必填不能为空'
                }
            }
        },
        loginName: {
            message: '登录名不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '登录名必填不能为空'
                }
            }
        }
    }
}).on(
    'error.form.bv',
    function (e) {
        var $form = $(e.target), validator = $form
            .data('bootstrapValidator'), $invalidField = validator
            .getInvalidFields().eq(0), $collapse = $invalidField
            .parents('.collapse');

        $collapse.collapse('show');
    }).on('success.form.bv', function (e) {
    e.preventDefault();
    userSaveOne();
});

//增加提交
function userSaveOne() {
    $.ajax({
        type: "get",
        url: "/user/saveone",
        async: false,
        data: $("#form_user_add").serialize(),
        dataType: "text",
        success: function (data) {
            layer.msg("用户增加成功");

            setTimeout(function () {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            }, 1500);
        },
        error: function (data) {
        }
    });
}

//edit start
$('#form_user_edit').bootstrapValidator({
    message: 'This value is not valid',
    excluded: ':disabled',//
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        name: {
            message: '用户名不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '用户名必填不能为空'
                }
            }
        },
        workid: {
            message: '工号不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '工号必填不能为空'
                }
            }
        },
        phone: {
            message: '电话不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '电话必填不能为空'
                }
            }
        },
        password: {
            message: '密码不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '密码必填不能为空'
                }
            }
        },
        email: {
            message: '邮箱不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '邮箱必填不能为空'
                }
            }
        },
        loginName: {
            message: '登录名不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '登录名必填不能为空'
                }
            }
        }
    }
}).on(
    'error.form.bv',
    function (e) {
        var $form = $(e.target), validator = $form
            .data('bootstrapValidator'), $invalidField = validator
            .getInvalidFields().eq(0), $collapse = $invalidField
            .parents('.collapse');

        $collapse.collapse('show');
    }).on('success.form.bv', function (e) {
    e.preventDefault();
    userUpdateOne();
});

//修改提交
function userUpdateOne() {
    $.ajax({
        type: "get",
        url: "/user/updateone",
        async: false,
        data: $("#form_user_edit").serialize(),
        dataType: "text",
        success: function (data) {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        error: function (data) {

        }
    });
}

