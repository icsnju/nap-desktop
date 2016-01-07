/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Desktop.Create', {
    extend: 'Ext.ux.desktop.Module',

    id:'create',

    requires: [
        'Ext.form.Panel',
        'Ext.Ajax'
    ],


    init : function(){
        this.launcher = {
            text: 'Create Project',
            iconCls:'notepad'
        }
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('create');
        if(!win){
            win = desktop.createWindow({
                id: 'create',
                title:'Create Project',
                iconCls: 'notepad',
                width: 500,
                animCollapse:false,
                border: false,
                bodyPadding: 10,
                items: [{
                    xtype: 'form',
                    items: [{
                        xtype: 'textfield',
                        name: 'projname',
                        width: 450,
                        fieldLabel: 'Project name',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        name: 'projurl',
                        width: 450,
                        fieldLabel: 'Project url',
                        allowBlank: false
                    }, {
                        xtype: 'displayfield',
                        hideEmptyLabel: false,
                        value: ''
                    }],
                    buttons: [{
                        text: 'create',
                        formBind: true,
                        listeners: {
                            click: function(btn){
                                var createWindow= btn.up('window');
                                var projname = btn.up('window').down('textfield[name=projname]').getValue();
                                var projurl = btn.up('window').down('textfield[name=projurl]').getValue();
                                Ext.Ajax.request({
                                    url: 'http://114.212.189.147:8000/app/projects',
                                    method: 'POST',
                                    async: true,
                                    params: {projname: projname, projurl: projurl},
                                    headers: {
                                        Authorization: localStorage.getItem("token")
                                    },
                                    success: function (response, options) {
                                    //    var res = Ext.decode(response.responseText);
                                        alert(response.responseText);
                                    },
                                    failure: function (response, options) {
                                        Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                                    }
                                });
                                createWindow.destroy();
                            }
                        }
                    }]       
                }]
            });
        }
        return win;
    }
});
