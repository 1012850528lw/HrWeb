function treeInit(flag) {
    $("ul li").remove();
    layui.use(['tree','form','jquery','layer'], function () {
        window.jQuery = window.$ = layui.jquery;
        window.layer = layui.layer;
        var form = layui.form;
        layui.tree({
            elem: '#organ_tree',
            nodes: getTreeData(),
            click: function (item) {
                $.ajax({
                    type: "get",
                    url: "/organ/getOne?organId="+item.organId,
                    data: "",
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        form.val('organForm',{
                            "organId":data.organId,
                            "pareOrganId": data.pareOrganId,
                            "organName": data.organName,
                            "organTypeCode": data.organTypeCode,
                            "organNote": data.organNote,
                            "establishDate": data.establishDate,
                            "revokeDate": data.revokeDate,
                            "revokeReason": data.revokeReason,
                            "headEmployeeId": data.headEmployeeId,
                            "usSocialCreditCode": data.unSocialCreditCode,
                            "organAddress": data.organAddress,
                            "contactNumber": data.contactNumber,
                            "basicDepositAcct": data.basicDepositAcct,
                            "basicDepositBank": data.basicDepositBank,
                            "organStatus": data.organStatus,
                            "createEmployeeId": data.createEmployeeId,
                            "mdyEmployeeId": data.mdyEmployeeId,
                            "createTime": data.createTime,
                            "mdyTime": data.mdyTime,
                            "post": data.post,
                            "fax": data.fax,
                            "organLevel": data.organLevel
                        })
                    }
                });
            }
        });
        if(flag === "zzjgwh"){
            //添加操作的图标(鼠标划过时显示的添加，删除的按钮组)
            $("#organ_tree").find("a").after("<i class='layui-icon add select hide '></i>"+
                "<i class='layui-icon del select hide'></i>");
            //显示/隐藏 分类的操作栏
            $("#organ_tree").on({
                mouseover: function(event) {
                    event.stopPropagation();
                    $(this).children(".select").removeClass("hide")
                },
                mouseout: function(event) {
                    event.stopPropagation();
                    $(this).children(".select").addClass("hide")
                }
            },"li","a");
        }
    });
}
//增加操作
$("ul#organ_tree").on("click","li .add",function () {
    var node=$(this).parent().children("a").children("cite");
    parent.layer.open({
        type: 2,
        title: '增加组织',
        shade: 0.1,
        shadeClose: true,
        maxmin: true,
        area: ['70%', '60%'],
        content: '/zzjgwh_add',
        end: function () {
            //treeInit("zzjgwh");
        }
    });
    $.ajax({
        type: 'get',
        url: '/organ/getIds?organName='+node.text(),
        data: '',
        async:false,
        dataType: 'json',
        success: function (data) {

        }
    })
});

//删除操作
$("ul#organ_tree").on("click","li .del",function () {
    var node=$(this).parent().children("a").children("cite");
    parent.layer.confirm("是否删除此条记录?",{
        shade: false,
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            type: 'get',
            url: '/organ/deleteOrgan',
            data: {"organName":node.text()},
            dataType: 'text',
            success: function () {
                showInfo("删除成功");
                treeInit("zzjgwh");
                closeAddShow();
            },
            error: function () {
                showInfo("系统错误");
            }
        });
    })
});

var midData = [];
function getTreeData() {
    var treeData = [];
    var rootTree = new Array();
    var treeNode;
    $.ajax({
        type: 'get',
        url: '/organ/getAll',
        async: false,
        dataType: 'json',
        success: function (data) {
            treeData = JSON.parse(JSON.stringify(data));
            midData = JSON.parse(JSON.stringify(data));
        }
    });
    treeData.forEach(function (e) {
        if(e.pareOrganId === "～"){
            var obj = {organId: "",name: "",pareOrganId: "",children: new Array()};
            obj.organId = e.organId;
            obj.name = e.organName;
            obj.pareOrganId = e.pareOrganId;
            obj.children = buildChildren(e.organId);
            rootTree.push(obj);
        }
    });
    treeNode = JSON.parse(JSON.stringify(rootTree));
    return treeNode;
}

function buildChildren(organId) {
    var nTypeData = new Array();
    var treeChild = new Array();
    midData.forEach(function (value) {
        if(value.pareOrganId === organId){
            nTypeData.push(value);
        }
    });
    nTypeData.forEach(function (value) {
        if(value.organId != null && value.organId != ""){
            var obj1 = {organId: "",pareOrganId:"",name: "",children: new Array()};
            obj1.organId = value.organId;
            obj1.name = value.organName;
            obj1.pareOrganId = value.pareOrganId;
            obj1.children = buildChildren(value.organId);
            treeChild.push(obj1);
        }else{
            var obj2 = {organId:"",pareOrganId:"",name:"",children:new Array()};
            obj2.organId = value.organId;
            obj2.name = value.organName;
            obj2.pareOrganId = value.pareOrganId;
            treeChild.push(obj2);
        }
    });
    return treeChild;
}

function updateOrgan() {
    $.ajax({
        type: "get",
        url: "/organ/updateOrgan",
        async: false,
        data: $("#form_organ_edit").serialize(),
        dataType: "text",
        success: function () {
            showInfo("菜单保存成功");
        },
        error: function () {
            showInfo("系统错误");
        }
    });
}


function showInfo(str) {
    parent.layer.msg(str,{
        offset: 't',
        time: 1000,
        anim: 4
    });
}
function closeAddShow() {
    setTimeout(function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    },200);
}

$('#form_organ_add').bootstrapValidator({
    message: 'This value is not valid',
    excluded: ':disabled',
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        organId: {
            message: '编号不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '编号必填不能为空'
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
    insertOrgan();
});


function insertOrgan() {
    $.ajax({
        type: "get",
        url: "/organ/insertOrgan",
        async: false,
        data: $("#form_organ_add").serialize(),
        dataType: "text",
        success: function () {
            showInfo("添加成功");
            closeAddShow();
        },
        error: function () {
            showInfo("系统错误");
        }
    });
}