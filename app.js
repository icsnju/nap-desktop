/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'Desktop',

    //-------------------------------------------------------------------------
    // Most customizations should be made to Desktop.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------

    views: [
        'Desktop.App',
        'Desktop.login.Login'
    ],
    launch: function () {

        // It's important to note that this type of application could use
        // any type of storage, i.e., Cookies, LocalStorage, etc.
        var loggedIn;

        // Check to see the current value of the localStorage key
        loggedIn = localStorage.getItem("TutorialLoggedIn");
        // This ternary operator determines the value of the TutorialLoggedIn key.
        // If TutorialLoggedIn isn't true, we display the login window,
        // otherwise, we display the main view
        
        if(loggedIn == 'true'){
            Ext.create({
                xtype: 'app-main'
            });
        }else{
            Ext.create({
                xtype: 'login'
            });
        }
    }
});
