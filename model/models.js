sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){const t=new e(n);t.setDefaultBindingMode("OneWay");return t},createAppModel:function(){return new e({busy:false,busyIndicatorDelay:0,layout:"TwoColumnsMidExpanded"})},createMainModel:function(){return new e({table:{data:[]}})},createDetailsModel:function(){return new e({mapContainer:{data:{},legend:{},selectedRegion:{},regions:{},agreements:{},contracts:{}},panel:{chart1:{data:[]},chart2:{data:[]}},detailsDialog:{agreements:{},contracts:{},offers:{},bidnobid:{}}})}}});