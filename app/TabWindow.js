/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Desktop.TabWindow', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.tab.Panel',
        'Ext.chart.*'
    ],

    id:'tab-win',

    init : function(){
        this.launcher = {
            text: 'System Status',
            iconCls:'tabs'
        }
    },

    refreshRate: 1000,

    createNewWindow: function () {
        var me = this,
            desktop = me.app.getDesktop();

        me.cpuLoadData = [];
        me.cpuLoadStore = Ext.create('store.json', {
            fields: ['core1', 'core2', 'time']
        });

        me.memoryArray = ['Wired', 'Active', 'Inactive', 'Free'];
        me.memoryStore = Ext.create('store.json', {
                fields: ['name', 'memory'],
                data: me.generateData(me.memoryArray)
            });

        me.pass = 0;
        me.processArray = ['explorer', 'monitor', 'charts', 'desktop', 'Ext3', 'Ext4'];
        me.processesMemoryStore = Ext.create('store.json', {
            fields: ['name', 'memory'],
            data: me.generateData(me.processArray)
        });

        me.generateCpuLoad();

        return desktop.createWindow({
            id: 'tab-win',
            title:'System Status',
            width:740,
            height:480,
            iconCls: 'tabs',
            animCollapse:false,
            border:false,
            constrainHeader:true,

            layout: 'fit',
            listeners: {
                afterrender: {
                    fn: me.updateCharts,
                    delay: 100
                },
                destroy: function () {
                    clearTimeout(me.updateTimer);
                    me.updateTimer = null;
                },
                scope: me
            },
            items: [{
                xtype: 'tabpanel',

                ui: 'navigation',
                tabPosition: 'left',
                tabRotation: 0,
                tabBar: {
                    // turn off borders for classic theme.  neptune and crisp don't need this
                    // because they are borderless by default
                    border: false
                },

                defaults: {
                    textAlign: 'left',
                    bodyPadding: 15
                },

                items: [{
                    title: 'Cpu1',
                    iconCls: 'fa-home',
                    layout: 'fit',
                    items: me.createCpu1LoadChart()
                },{
                    title: 'Cpu2',
                    iconCls: 'fa-user',
                    layout: 'fit',
                    items: me.createCpu2LoadChart()
                },{
                    title: 'Memory',
                    iconCls: 'fa-users',
                    layout: 'fit',
                    items: me.createMemoryPieChart()
                },{
                    title: 'Process',
                    iconCls: 'fa-cog',
                    layout: 'fit',
                    items: me.createProcessChart()
                }]
            }]

        });
    },

    createWindow : function() {
        var win = this.app.getDesktop().getWindow(this.id);
        if (!win) {
            win = this.createNewWindow();
        }
        return win;
    },

    createCpu1LoadChart: function () {
        return {
            xtype: 'cartesian',
            theme: 'Category1',
            title: 'CPU load',
            animation: false,
            store: this.cpuLoadStore,
            legend: {
                docked: 'bottom'
            },
            axes: [{
                type: 'numeric',
                position: 'left',
                minimum: 0,
                maximum: 100,
                fields: ['core1','core2'],
                title: {
                    text: 'CPU Load',
                    font: '13px Arial'
                },
                grid: true,
                label: {
                    font: '11px Arial'
                }
            }],
            series: [{
              //  title: 'CPU',
                type: 'area',
                highlight: false,
                axis: 'left',
                showMarkers: false,
                xField: 'time',
                yField: ['core1','core2'],
                style: {
                    opacity: 0.93
                }
            }]
        };
    },

    createCpu2LoadChart: function () {
        return {
            xtype: 'cartesian',
            theme: 'Category2',
            animation: false,
            store: this.cpuLoadStore,
            legend: {
                docked: 'bottom'
            },
            axes: [{
                type: 'numeric',
                position: 'left',
                minimum: 0,
                maximum: 100,
                grid: true,
                fields: ['core2'],
                title: {
                    text: 'Memory Load',
                    font: '13px Arial'
                },
                label: {
                    font: '11px Arial'
                }
            }],
            series: [{
                title: 'Memory',
                type: 'line',
                fill: true,
                showMarkers: false,
                axis: 'left',
                xField: 'time',
                yField: 'core2',
                style: {
                    lineWidth: 4,
                    'stroke-width': 1
                }
            }]
        };
    },

    createMemoryPieChart: function () {
        var me = this;

        return {
            xtype: 'polar',
            innerPadding: 3,
            animation: {
                duration: 250
            },
            store: this.memoryStore,

            legend: {
                docked: 'right'
            },
            insetPadding: 40,
            theme: 'Memory:gradients',
            series: [{
                donut: 30,
                type: 'pie',
                angleField: 'memory',
                tooltip: {
                    trackMouse: true,
                    width: 140,
                    height: 28,
                    renderer: function(tooltip, record) {
                        //calculate percentage.
                        var total = 0;
                        me.memoryStore.each(function(rec) {
                            total += rec.get('memory');
                        });
                        tooltip.setTitle(record.get('name') + ': ' +
                            Math.round(record.get('memory') / total * 100) + '%');
                    }
                },
                highlight: {
                    margin: 20
                },
                label: {
                    field: 'name',
                    display: 'rotate',
                    contrast: true,
                    font: '12px Arial'
                }
            }]
        };
    },

    createProcessChart: function () {
        return {
            xtype: 'cartesian',
            theme: 'Category1',
            store: this.processesMemoryStore,
            animation: {
                easing: 'easeInOut',
                duration: 750
            },
            innerPadding: '0 5 0 5',
            axes: [{
                type: 'numeric',
                position: 'left',
                minimum: 0,
                maximum: 10,
                fields: ['memory'],
                title: {
                    text: 'Memory',
                    font: '13px Arial'
                },
                label: {
                    font: '11px Arial'
                }
            },{
                type: 'category',
                position: 'bottom',
                fields: ['name'],
                title: {
                    text: 'System Processes',
                    font: 'bold 14px Arial'
                },
                label: {
                    rotation: {
                        degrees: 45
                    }
                }
            },{
                type: 'numeric',
                position: 'top',
                fields: ['memory'],
                title: {
                    text: 'Memory Usage',
                    font: 'bold 14px Arial'
                },
                label: {
                    fillStyle: '#FFFFFF',
                    strokeStyle: '#FFFFFF'
                },
                style: {
                    fillStyle: '#FFFFFF',
                    strokeStyle: '#FFFFFF'
                }
            }],
            series: [{
                title: 'Processes',
                type: 'bar',
                style: {
                    minGapWidth: 10
                },
                xField: 'name',
                yField: 'memory',
                renderer: function(sprite, config, data, index) {
                    var lowColor = Ext.draw.Color.fromString('#b1da5a'),
                        value = data.store.getAt(index).get('memory'),
                        color;

                    if (value > 5) {
                        color = lowColor.createDarker((value - 5) / 15).toString();
                    } else {
                        color = lowColor.createLighter(((5 - value) / 20)).toString();
                    }

                    if (value >= 8) {
                        color = '#CD0000';
                    }

                    return {
                        fillStyle: color
                    };
                }
            }]
        };
    },

    generateCpuLoad: function () {
        var me = this,
            data = me.cpuLoadData;

        function generate(factor) {
            var value = factor + ((Math.floor(Math.random() * 2) % 2) ? -1 : 1) * Math.floor(Math.random() * 9);

            if (value < 0 || value > 100) {
                value = 50;
            }

            return value;
        }

        if (data.length === 0) {
            data.push({
                core1: 0,
                core2: 0,
                time: 0
            });

            for (var i = 1; i < 100; i++) {
                data.push({
                    core1: 0,
                    core2: 0,
                    time: i
                });
            }

            me.cpuLoadStore.loadData(data);
        } else {
            me.cpuLoadStore.data.removeAt(0);
            me.cpuLoadStore.data.each(function(item, key) {
                item.data.time = key;
            });

            var lastData = me.cpuLoadStore.last().data;
            Ext.Ajax.request({
                url: 'status.json',
                method: 'GET',
                success: function (response, options) {
                    var res = Ext.decode(response.responseText);
                    me.cpuLoadStore.loadData([{
                        core1: res.core1,
                        core2: res.core2,
                        time: lastData.time + 1
                    }], true);
                },
                failure: function (response, options) {
                    Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                }
            });
        }

    },

    generateData: function (names) {
        var data = [],
            i,
            rest = names.length, consume;

        for (i = 0; i < names.length; i++) {
            consume = Math.floor(Math.random() * rest * 100) / 100 + 2;
            rest = rest - (consume - 5);
            data.push({
                name: names[i],
                memory: consume
            });
        }

        return data;
    },

    updateCharts: function () {
        var me = this;
        clearTimeout(me.updateTimer);
        me.updateTimer = setTimeout(function() {
            var start = new Date().getTime();
            if (me.pass % 3 === 0) {
                me.memoryStore.loadData(me.generateData(me.memoryArray));
            }

            if (me.pass % 5 === 0) {
                me.processesMemoryStore.loadData(me.generateData(me.processArray));
            }

            me.generateCpuLoad();

            var end = new Date().getTime();

            // no more than 25% average CPU load
        //    me.refreshRate = Math.max(me.refreshRate, (end - start) * 4);

            me.updateCharts();
            me.pass++;
        }, me.refreshRate);
    }
});

