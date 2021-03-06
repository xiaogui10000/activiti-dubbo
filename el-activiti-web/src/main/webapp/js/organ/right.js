/**
 * 初始化角色信息
 */
var roles = '';
function initRole(id){
    if (roles==null || roles == '' || roles == undefined){
        roles = loadAllRole();
    }
    if (roles==null || roles == ''  || roles == undefined){
        $.messager.alert("操作提示", "获取权限信息失败");
        return false;
    }
    $("#"+id).combobox("loadData", roles);
    return true;
}

/**
 * 展示添加职务表单
 */
function showDialogAddFun(){
    $("#add_form").form('clear');
    var node = getSelectedTreeNode();
    if (node != null && node != '' && node != 'undefined'){
        $("#pid_select").empty();
        $("#pid_select").append("<option selected='selected' value='"+node.id+"'>"+node.text+"</option>");
        $("#pid_select").append("<option value ='0'>=根权限=</option>");
        $("#pid_select").combobox({});
        $('#pid_select').combobox('select',node.id);
    }

    $('#add_diglog').dialog('open')
}

/**
 * 添加节点
 */
function addFunction(){
    var node = getSelectedTreeNode();
    var param = {};

    var pid = $('#pid_select').combobox('getValue');
    if (pid == null || pid == ''){
        alert('请选择上级权限');
        return;
    }
    param.pid = pid;

    var name = $("#right_name").val();
    if (right_name == null || right_name == ''){
        alert('权限名称不能为空');
        return;
    }
    param.name = name;

    var code = $("#right_code").val();
    if (code == null || code == ''){
        alert('权限编码不能为空');
        return;
    }
    param.code = code;

    param.busCode = $("#bus_code").val();

    //将新节点信息发送到后端服务入库
    $.ajax({
        url: '/right/add',
        data: param,
        type: "post",
        async:false,
        success: function (data, textStatus, XMLHttpRequest) {
            if(data != null && data.code=='0'){
                $.messager.alert('提示','保存成功！','info',function(){
                    //if (functionId == null || functionId == '' || functionId != undefined){
                    //}
                    var data_append = [{id : data.data.id,code : data.data.code,name: data.data.name}];
                    treeNodeAppend(node,data_append);
                    $('#add_diglog').dialog('close');
                });
            }else{
                $.messager.alert('提示',data.message,'error');
            }

        }
    });
}

/**
 * 初始化职务角色
 */
function initFunRole(datagrid,funid){
    var data = searchFunRoles(funid);
    $('#'+datagrid).datagrid({
        data : data,
        columns:[[
            {field:'name',title:'角色名',width:100},
            {field:'_operate',title:'操作',width:100,formatter:function(value,row,index){
                return '<a name="operate" href="javascript:delFunRole('+row.id+','+funid+',\''+datagrid+'\','+index+');" class="easyui-linkbutton"></a>';
            }}
        ]],
        onLoadSuccess:function(data){
            $("a[name='operate']").linkbutton({text:'删除',plain:true,iconCls:'icon-remove'});
        },
    });
}

/**
 * 删除职务角色记录
 * @param roleId
 * @param Funid
 */
function delFunRole(roleId,funId,datagrid,index){
    var configMsg = '确认删除该角色吗？';
    $.messager.defaults = {ok:"确定", cancel:"取消",width:250};
    $.messager.confirm("确认", configMsg, function (r) {
        if (r) {
            $.ajax({
                url: '/funRole/delRecord',
                data: {roleId:roleId,funId:funId},
                type: "post",
                async:false,
                success: function (data, textStatus, XMLHttpRequest) {
                    if(data != null && data.code=='0'){
                        $.messager.alert('提示','操作成功！','info',function(){
                            $('#'+datagrid).datagrid('deleteRow',index);
                            initFunRole(datagrid,funId);
                        });
                    }else{
                        $.messager.alert('提示',data.message,'error');
                    }

                }
            });
        }
    })
}

/**
 * 打开修改节点
 */
function showDialogUpdateFun(){
    $("#update_form").form('clear');
    var node = getSelectedTreeNode();
    $("#right_name_update").textbox('setValue',node.text);
    $("#right_code_update").textbox('setValue',node.attributes.code);

    $("#showFunRolesForEditDiv" ).css("display", "block");
    $('#update_diglog').dialog('open');
}

/**
 * 修改节点
 */
function updateFunction(){
    var param = {};
    var node = getSelectedTreeNode();
    param.id = node.id;
    var right_name_update = $("#right_name_update").val();
    if (right_name_update == null || right_name_update == ''){
        alert('权限名称不能为空');
        return;
    }
    param.name = right_name_update;

    var right_code_update = $("#right_code_update").val();
    if (right_code_update == null || right_code_update == ''){
        alert('权限编码不能为空');
        return;
    }
    param.code = right_code_update;

    //将节点信息发送到后端服务入库
    $.ajax({
        url: '/right/update',
        data: param,
        type: "post",
        async:false,
        success: function (data, textStatus, XMLHttpRequest) {
            if(data != null && data.code=='0'){
                $.messager.alert('提示','修改成功！','info',function(){
                    treeNodeUpdate(node,right_name_update);
                    $('#update_diglog').dialog('close');
                });
            }else{
                $.messager.alert('提示',data.message,'error');
            }

        }
    });
}

/**
 * 删除节点
 */
function removeFunction(){
    var node = getSelectedTreeNode();
    var configMsg = '确认删除 "'+node.text+'" 吗？';

    $.messager.defaults = {ok:"确定", cancel:"取消",width:250};
    $.messager.confirm("确认", configMsg, function (r) {
        if (r) {
            $.ajax({
                url: '/right/delete',
                data: {id:node.id,status:3},
                type: "post",
                async:false,
                success: function (data, textStatus, XMLHttpRequest) {
                    if(data != null && data.code=='0'){
                        $.messager.alert('提示','删除成功！','info',treeNodeRemove(node));
                    }else{
                        $.messager.alert('提示',data.message,'error');
                    }
                }
            });
        }
    });
}

/**
 * 打开角色展示框
 */
function showFunRolesDialog(){
    var node = getSelectedTreeNode();
    var funid = node.id;
    initFunRole('showFunRolesTable',funid);
    $('#showFunRoles_diglog').dialog('open');
}

/**
 * 查看职务对应的角色
 */
function searchFunRoles(funid){
    var roles = '';
    $.ajax({
        url: '/funRole/searchRolesByFunId',
        data: {funId:funid},
        type: "post",
        async:false,
        success: function (data, textStatus, XMLHttpRequest) {
            if(data != null && data.code=='0'){
                roles = data.data;
            }else{
                $.messager.alert('提示',data.message,'error');
            }
        }
    });
    return roles;
}
