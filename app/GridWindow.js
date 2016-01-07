/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

//var uname = localStorage.getItem("username");
//var uname = 'hello';
//var token = localStorage.getItem("token");
var itemsPerPage = 15;


Ext.define('Node', {
    extend: 'Ext.data.Model',
    fields: ['name', 'ip','active','sub']
});

Ext.define('nestGrid',{
    extend: 'Ext.grid.Panel',
    xtype: 'nestGrid',
    autoLoad: true,
    
    columns: [
      //  new Ext.grid.RowNumberer({width: 30}),
        {
            text: "NAME",
            flex: 1.5,
            sortable: true,
            dataIndex: 'name'
        },
        {
            text: "URL",
            flex: 5,
            sortable: false,
            dataIndex: 'url'
        },
        {
            xtype: 'widgetcolumn',
            widget: {
                width: 60,
                text: 'Destroy',
                xtype: 'button',
            //    style:'background-color:#FF3030',
                handler: function(btn) {
                    var rec = btn.getWidgetRecord();
                    var store = btn.up('grid').getStore();
                    Ext.Msg.confirm('Destroy', 'Destroy the project?', function (button) {
                        if (button == 'yes') {
                            Ext.Ajax.request({
                                url: 'http://114.212.189.147:8000/app/projects/'+rec.data.name,
                                method: 'DELETE',
                                headers: {
                                    Authorization: localStorage.getItem("token")
                                },
                                success: function (response, options) {
                                    var res = Ext.decode(response.responseText);
                                    alert(res.log);
                                },
                                failure: function (response, options) {
                                    alert('fail');
                                }
                            });
                            store.remove(rec);
                        }
                    });
                }
            }
        }
    ],
    selModel: {
        selType: 'rowmodel'
    },
    plugins: [{
        ptype: 'rowexpander',
        rowBodyTpl: [
            '<div class="detailData"></div>'
        ]
    }], 
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'simpsonsStore', // same store GridPanel is using
        dock: 'bottom',
        displayInfo: true
    }],

    initComponent: function () {
        Ext.apply(this, {
            store: Ext.create('Ext.data.Store', {
                id: 'simpsonsStore',
                autoLoad: false,
                fields: [
                   { name: 'name' },
                   { name: 'url' },
                   { name: 'num', type: 'int' }
                ],
                pageSize: itemsPerPage, // items per page
                proxy: {
                    type: 'ajax',
                    url: 'http://114.212.189.147:8000/app/projects',
                    headers: {
                        Authorization: localStorage.getItem("token")
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'items',
                        totalProperty: 'total'
                    }
                }
            })
        });
        var me = this;
        me.callParent(arguments);

        me.getView().on('expandBody', me.onExpandNestedGrid,me);
        me.getView().on('collapsebody', me.onCollapseNestedGrid,me);
    },

    onExpandNestedGrid : function (rowNode, record, expandRow, eOpts) {
        var detailData = Ext.DomQuery.select("div.detailData", expandRow);
        var desktop = this.up('window').desktop;

        var innerGrid = Ext.create('Ext.grid.Panel', {
            store: {
                model: 'Node',
                proxy: {
                    type: 'ajax',
                    url: 'http://114.212.189.147:8000/app/services?project='+record.get('name'),
                    headers: {
                        Authorization: localStorage.getItem("token")
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'services'
                    }
                }
            },
            autoLoad: true,
            columns: [
                {   xtype: 'rownumberer'},
                {   text: "Name", flex: 1.5, dataIndex: 'name' ,menuDisabled : true},
                {   text: "Ip", flex: 2, dataIndex: 'ip' ,menuDisabled : true},
                {   text: "Port", flex: 1, dataIndex: 'port', menuDisabled : true},
                {   text: "Status", flex: 1, dataIndex: 'status' ,menuDisabled : true},
                {   xtype: 'widgetcolumn',
                    menuDisabled : true,
                    flex: 1, 
                    widget: {
                        width: 60,
                        text: 'logs',
                        xtype: 'button',
                    //    style:'background-color:#00b2ee',
                        handler: function(btn) {
                            var rec = btn.getWidgetRecord();
                            Ext.Ajax.request({
                                url: 'http://114.212.189.147:8000/app/log?project='+record.data.name+'&service='+rec.data.name,
                                method: 'GET',
                                headers: {
                                    Authorization: localStorage.getItem("token")
                                },
                                success: function (response, options) {
                                    var res = Ext.decode(response.responseText);
                                    Ext.create('Ext.window.Window', {
                                        width : 400,
                                        height: 500,
                                        layout : 'fit',
                                        title : 'logs',
                                        modal: true,
                                        autoScroll: true,
                                        items : [{
                                            xtype : "textarea",
                                            value: res.logs,
                                            readOnly: true
                                        }]
                                    }).show();
                                },
                                failure: function (response, options) {
                                    alert('fail');
                                }
                            });
                        }
                    }
                },
                {   xtype: 'widgetcolumn',
                    menuDisabled : true,
                    flex: 1, 
                    widget: {
                        width: 60,
                        text: 'shell',
                        xtype: 'button',
                    //    style:'background-color:#00b2ee',
                        handler: function(btn) {
                            var rec = btn.getWidgetRecord();
                            var frame = record.data.name+'_'+rec.data.name+'_shell';
                            desktop.createWindow({
                                width : 600,
                                height: 500,
                                layout : 'fit',
                                iconCls: 'icon-grid',
                                title : frame,
                                items : [{
                                    xtype : "component",
                                    id: frame,
                                    autoEl : {
                                        tag : "iframe",
                                        href : ""
                                    }
                                }]
                            }).show();

                            Ext.getDom(frame).src = 'http://' +rec.data.ip+ ':'+ rec.data.shell;
                        }
                    }
                }
            ],
            columnLines: true,
            frame: false,
            renderTo: detailData[0]
        });

        innerGrid.getEl().swallowEvent([
            'mousedown', 'mouseup', 'click',
            'contextmenu', 'mouseover', 'mouseout',
            'dblclick', 'mousemove'
        ]);
    },

    onCollapseNestedGrid : function (rowNode, record, expandRow, eOpts) {
        var detailData = Ext.DomQuery.select("div.detailData", expandRow);
        var parent = detailData[0];
        var child = parent.firstChild;

        while (child) {
            var next = child.nextSibling;
            child.parentNode.removeChild(child);
            child = next;
        }
    }
});


Ext.define('Desktop.GridWindow', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'
    ],

    id:'grid-win',

    init : function(){
        this.launcher = {
            text: 'Project List',
            iconCls:'icon-grid'
        };
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('grid-win');
        if(!win){
            win = desktop.createWindow({
                id: 'grid-win',
                title:'Project List',
                width: 700,
                height: 450,
                desktop: desktop,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [
                    {
                        border: false,
                        xtype: 'nestGrid',
                        id: 'outer-grid'
                    }
                ]

            });
        }
        return win;
    }

});

