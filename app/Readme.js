/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Desktop.Readme', {
    extend: 'Ext.ux.desktop.Module',

    id:'readme',

//    requires: [
//        'Ext.form.Panel',
//        'Ext.Ajax'
//    ],


    init : function(){
        this.launcher = {
            text: 'Readme',
            iconCls:'notepad'
        }
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('readme');
        if(!win){
            win = desktop.createWindow({
                id: 'readme',
                title:'Readme',
                iconCls: 'notepad',
                width: 820,
                height: 600,
                animCollapse:false,
            //    border: false,
            //    bodyPadding: 10,
            //    modal: true,
            //    closeAction: 'hide',
                layout: 'fit',
                items: [{ 
                    xtype: 'component',
                    html : '<iframe src="lib/nap.pdf" width="100%" height="100%"></iframe>'
                }]
            });
        }
        return win;
    }
});
