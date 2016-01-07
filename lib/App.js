/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Desktop.App', {
    extend: 'Ext.ux.desktop.App',
    xtype: 'app-main',

    requires: [
        'Ext.window.MessageBox',

        'Ext.ux.desktop.ShortcutModel',

        'Desktop.SystemStatus',
      //  'Desktop.VideoWindow',
        'Desktop.GridWindow',
        'Desktop.TabWindow',
      //  'Desktop.AccordionWindow',
        'Desktop.Notepad',
      //  'Desktop.BogusMenuModule',
      //  'Desktop.BogusModule',

//        'Desktop.Blockalanche',
        'Desktop.Settings',
        'Desktop.login.Login'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...

        this.callParent();

        // now ready...
    },

    getModules : function(){
        return [
            //new Desktop.VideoWindow(),
            //new Desktop.Blockalanche(),
            new Desktop.SystemStatus(),
            new Desktop.GridWindow(),
            new Desktop.TabWindow(),
            //new Desktop.AccordionWindow(),
            new Desktop.Notepad()
            //new Desktop.BogusMenuModule(),
            //new Desktop.BogusModule()
        ];
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            //cls: 'ux-desktop-black',

            contextMenuItems: [
                { text: 'Change Settings', handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: [
                    { name: 'Grid Window', iconCls: 'grid-shortcut', module: 'grid-win' },
                    { name: 'Tab Window', iconCls: 'notepad-shortcut', module: 'tab-win' },
                    { name: 'File Browser', iconCls: 'accordion-shortcut', module: 'filebrowser' },
                    { name: 'System Status', iconCls: 'cpu-shortcut', module: 'systemstatus'}
                ]
            }),

            wallpaper: 'resources/images/wallpapers/Blue-Sencha.jpg',
            wallpaperStretch: false
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            title: 'Don Griffin',
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text:'Settings',
                        iconCls:'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text:'Logout',
                        iconCls:'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: [
             //   { name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win' },
                { name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win' }
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        // Remove the localStorage key/value
        localStorage.removeItem('TutorialLoggedIn');
        localStorage.removeItem('username');
        // Remove Main View
        this.desktop.destroy();

        // Add the Login Window
        Ext.create({
            xtype: 'login'
        });
    },

    onSettings: function () {
        var dlg = new Desktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});
