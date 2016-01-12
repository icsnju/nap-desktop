Ext.getBody().addListener('click', function (event, el) {
    var clickTarget = event.target;

    if (clickTarget.href && clickTarget.href.indexOf(window.location.origin) === -1) {
        clickTarget.target = "_blank";
    }
});

Ext.define('Desktop.login.Login', {
    extend: 'Desktop.login.LockingWindow',
    xtype: 'login',

    requires: [
        'Desktop.login.Dialog',
        'Ext.container.Container',
        'Ext.form.field.Text',
        'Ext.form.field.Checkbox',
        'Ext.button.Button'
    ],

    title: 'Welcome to NAP',
    defaultFocus: 'authdialog', // Focus the Auth Form to force field focus as well

    items: [
        {
            xtype: 'authdialog',
            defaultButton : 'loginButton',
            autoComplete: true,
            bodyPadding: '20 20',
            header: false,
            width: 375,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults : {
                margin : '5 0'
            },

            items: [
                {
                    xtype: 'label',
                    text: 'Sign into your account'
                },
                {
                    xtype: 'textfield',
                    name: 'username',
                    bind: '{username}',
                    height: 55,
                    hideLabel: true,
                    allowBlank : false,
                    emptyText: 'username'
                },
                {
                    xtype: 'textfield',
                    height: 55,
                    hideLabel: true,
                    emptyText: 'password',
                    inputType: 'password',
                    name: 'password',
                    bind: '{password}',
                    allowBlank : false
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkboxfield',
                            flex : 1,
                            height: 30,
                            bind: '{persist}',
                            boxLabel: 'Remember me'
                        },
                        {
                            xtype: 'box',
                            html: '<a href="http://www.example.com" class="user-doc"> User Guide</a>'
                        }
                    ]
                },
                {
                    xtype: 'button',
                    reference: 'loginButton',
                    scale: 'large',
                    iconAlign: 'right',
                    text: 'Login',
                    formBind: true,
                    listeners: {
                        click: 'onLoginButton'
                    }
                }
            ]
        }
    ]
});
