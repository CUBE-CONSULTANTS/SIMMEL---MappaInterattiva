sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","simmel/mappaInterattiva/model/models"],function(e,t,i){"use strict";return e.extend("simmel.mappaInterattiva.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device");this.setModel(i.createAppModel(),"app");this.setModel(i.createMainModel(),"master");this.setModel(i.createDetailsModel(),"detail")}})});