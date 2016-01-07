Ext.define('Desktop.login.AuthenticationModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.authentication',

    data: {
        username : '',
        password : '',
        persist: false
    }
});