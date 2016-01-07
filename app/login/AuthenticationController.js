Ext.define('Desktop.login.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',

    onLoginButton: function(button, e, eOpts) {
        var data = this.getViewModel().data;
        var loginView = this.getView();
        var lockView = loginView.up('window');

        Ext.Ajax.request({
            url: 'http://114.212.189.147:8000/auth',
            params: {username: data.username, password: data.password},
            method: 'POST',
            success: function (response, options) {
                var res = Ext.decode(response.responseText);
                // Set the localStorage value to true
                localStorage.setItem("TutorialLoggedIn", data.persist);
            //    localStorage.setItem("username", username);
                localStorage.setItem("token",'Token '+res.token);

                // Remove Login Window
                loginView.destroy();
                lockView.destroy();

                // Add the main view to the viewport
                Ext.create({
                    xtype: 'app-main'
                });
            },
            failure: function (response, options) {
                if(response.status == 400){
                    Ext.MessageBox.alert('失败', '用户名或密码错误');
                }else{
                    Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                }
            }
        });
        
    }
});
