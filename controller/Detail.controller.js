sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","../model/formatter","../model/mapper"],function(e,t,o,a,n){"use strict";return e.extend("simmel.mappaInterattiva.controller.Detail",{onInit:function(){this.getRouter().getRoute("detail").attachPatternMatched(this._onRouteMatched,this);this._initDetailData()},_initDetailData:function(){const e=new t;const o=async()=>await e.loadData("./data/data.json");const a=async()=>await e.loadData("./data/legend.json");const n=async()=>await e.loadData("./data/regions.json");const i=async()=>await e.loadData("./data/agreement.json");const r=async()=>await e.loadData("./data/contracts.json");const s=async()=>await e.loadData("./data/offers.json");const l=async()=>await e.loadData("./data/bid-nobid.json");const g=async()=>await e.loadData("./data/chart1.json");o().then(()=>{const{data:t}=e.getData();this.getOwnerComponent().getModel("detail").setProperty("/data",t)});a().then(()=>{const{legend:t}=e.getData();this.getOwnerComponent().getModel("detail").setProperty("/legend",t)});n().then(()=>{const{regions:t}=e.getData();this.getOwnerComponent().getModel("detail").setProperty("/regions",t)});i().then(()=>{const{agreements:t}=e.getData();this.getOwnerComponent().getModel("detail").setProperty("/agreements",t)});r().then(()=>{const{contracts:t}=e.getData();this.getOwnerComponent().getModel("detail").setProperty("/contracts",t)});s().then(()=>{const{offers:t}=e.getData();this.getOwnerComponent().getModel("detail").setProperty("/offers",t)});l().then(()=>{const{bidnobid:t}=e.getData();this.getOwnerComponent().getModel("detail").setProperty("/bidnobid",t)});g().then(()=>{const{milk:t}=e.getData();this.getOwnerComponent().getModel("detail").setProperty("/panel/chart1/data",t)})},_onRouteMatched:function(e){if(e.getParameter("arguments").country){this.byId("vbi1").fireRegionClick({code:e.getParameter("arguments").country})}},onRegionClick:function(e){const t=e.getParameter("code");if(!e.getSource().getRegionMap()[t]){this.getModel("detail").setProperty("/selectedRegion",null);this.byId("detailsPanel").setExpanded(false);e.getSource().setCenterPosition("5;35;0");e.getSource().setZoomlevel(2);return this.getRouter().navTo("master")}const o=e.getSource().getRegionMap()[t].getBindingContext("detail");this.getModel("detail").setProperty("/selectedRegion",o.getObject());this.byId("detailsPanel").setExpanded(true);Object.values(e.getSource().getRegionMap()).forEach(e=>{if(e.getCode()===t)e.setSelect(true);else e.setSelect(false)});e.getSource().zoomToRegions([t])},onSpotClick:function(e){const a=e.getSource();const i=a.getBindingContext("detail");e.getSource().getParent().getParent().fireRegionClick({code:i.getProperty("country")});if(!this._oAgreementDetailsDialog){this._oAgreementDetailsDialog=o.load({id:this.getView().getId(),name:"simmel.mappaInterattiva.view.fragment.detail.DetailsDialog",type:"XML",controller:this}).then(e=>{this.getView().addDependent(e);e.setModel(new t({agreement:{},contracts:{},offers:{panel:{selectedOffer:null},treeTable:{rows:{}}},bidnobid:{}}),"detailsDialog");return e})}this._oAgreementDetailsDialog.then(e=>{const t=this.getModel("detail").getProperty("/agreements").filter(e=>e.country===i.getProperty("country"));const o=this.getModel("detail").getProperty("/contracts").filter(e=>e.country===i.getProperty("country"));const a=this.getModel("detail").getProperty("/offers").filter(e=>e.country===i.getProperty("country"));const r=this.getModel("detail").getProperty("/bidnobid").filter(e=>e.country===i.getProperty("country"));e.getContent()[0].getItems()[0].setSelectedKey("agreement");e.getModel("detailsDialog").setProperty("/selectedIconTabKey",e.getContent()[0].getItems()[0].getSelectedKey());e.getModel("detailsDialog").setProperty("/context",i.getObject());e.getModel("detailsDialog").setProperty("/agreement/items",t);e.getModel("detailsDialog").setProperty("/contracts/items",o);e.getModel("detailsDialog").setProperty("/offers/treeTable/rows",n.mapTreeTableData(a));e.getModel("detailsDialog").setProperty("/bidnobid/items",r);e.open()})},onGoToDetailsPress:function(e){const a=this.getModel("detail").getProperty("/selectedRegion");const{country_code:i}=a;if(!this._oAgreementDetailsDialog){this._oAgreementDetailsDialog=o.load({id:this.getView().getId(),name:"simmel.mappaInterattiva.view.fragment.detail.DetailsDialog",type:"XML",controller:this}).then(e=>{this.getView().addDependent(e);e.setModel(new t({agreement:{},contracts:{},offers:{panel:{selectedOffer:null},treeTable:{rows:{}}},bidnobid:{}}),"detailsDialog");return e})}this._oAgreementDetailsDialog.then(e=>{const t=this.getModel("detail").getProperty("/agreements").filter(e=>e.country===i);const o=this.getModel("detail").getProperty("/contracts").filter(e=>e.country===i);const r=this.getModel("detail").getProperty("/offers").filter(e=>e.country===i);const s=this.getModel("detail").getProperty("/bidnobid").filter(e=>e.country===i);e.getContent()[0].getItems()[0].setSelectedKey("agreement");e.getModel("detailsDialog").setProperty("/selectedIconTabKey",e.getContent()[0].getItems()[0].getSelectedKey());e.getModel("detailsDialog").setProperty("/context",a);e.getModel("detailsDialog").setProperty("/agreement/items",t);e.getModel("detailsDialog").setProperty("/contracts/items",o);e.getModel("detailsDialog").setProperty("/offers/treeTable/rows",n.mapTreeTableData(r));e.getModel("detailsDialog").setProperty("/bidnobid/items",s);e.open()})},onIconTabSelect:function(e){const t=e.getSource().getParent().getParent();t.getModel("detailsDialog").setProperty("/selectedIconTabKey",e.getParameter("selectedKey"))},_getContactsDetailsDialog:function(e){if(!this._oContactsDetailsDialog){this._oContactsDetailsDialog=o.load({id:this.getView().getId(),name:"simmel.mappaInterattiva.view.fragment.dialog.subfragment.ContactsDetailsDialog",type:"XML",controller:this}).then(e=>{this.getView().addDependent(e);e.setModel(new t({}),"contactsDialog");return e})}this._oContactsDetailsDialog.then(t=>{t.getModel("contactsDialog").setData(e.getObject());t.open()})},_getAddDataPopover:function(e,a){if(!this._oAddDataPopover){this._oAddDataPopover=o.load({id:this.getView().getId(),name:"simmel.mappaInterattiva.view.fragment.dialog.subfragment.AddDataPopover",type:"XML",controller:this}).then(e=>{this.getView().addDependent(e);e.setModel(new t({}),"addData");return e})}this._oAddDataPopover.then(t=>{const o=e.getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent();t.getModel("addData").setProperty("/context",a);t.getModel("addData").setProperty("/selectedIconTabKey",o.getModel("detailsDialog").getProperty("/selectedIconTabKey"));t.openBy(e)})},_getUploadFileDialog:function(){if(!this._oUploadFileDialog){this._oUploadFileDialog=o.load({id:this.getView().getId(),name:"simmel.mappaInterattiva.view.fragment.dialog.subfragment.UploadFileDialog",type:"XML",controller:this}).then(e=>{this.getView().addDependent(e);e.setModel(new t({}),"uploadDialog");return e})}this._oUploadFileDialog.then(e=>{e.open()})},onContactsButtonPress:function(e){const t=e.getSource().getBindingContext("detailsDialog");this._getContactsDetailsDialog(t)},onDetailsDialogAddRecordsPress:function(e){const t=e.getSource();const o=e.getSource().getParent().getParent();this._getAddDataPopover(t,o)},onGanttStartDateChange:function(e){const t=e.getSource().getDateValue();const o=e.getSource().getParent().getParent().getBindingContext("detailsDialog");const a=o.getPath();const n=o.getModel();n.setProperty(a+"/startDate",t)},onGanttEndDateChange:function(e){const t=e.getSource().getDateValue();const o=e.getSource().getParent().getParent().getBindingContext("detailsDialog");const a=o.getPath();const n=o.getModel();n.setProperty(a+"/endDate",t)},onAddToExistingRowPress:function(e){const t=e.getSource().getParent().getParent().getModel("addData").getProperty("/context");const o=t.getBinding("rows").getPath();const a=t.getModel("detailsDialog");const n=a.getProperty(o);const i={};if(t.getSelectedIndex()===-1)return new sap.m.MessageBox.error("Selezionare una riga per proseguire");Object.keys(n[0].rows[0]).forEach(e=>{if(n[0].rows[0][e]instanceof Date)i[e]=null;else i[e]=""});i.datePicker_editable=true;i.input_editable=true;a.setProperty(t.getContextByIndex(t.getSelectedIndex()).getPath()+"/rows/"+a.getProperty(t.getContextByIndex(t.getSelectedIndex()).getPath()+"/rows").length,i);t.expand(t.getSelectedIndex())},onAddRowPress:function(e){const t=e.getSource().getParent().getParent().getModel("addData").getProperty("/context");const o=t.getBinding("rows").getPath();const a=t.getModel("detailsDialog");const n=a.getProperty(o);const i=Object.keys(n[0]);const r={};i.forEach(e=>{const t=n[0][e];if(typeof t==="object"&&Array.isArray(t))r[e]=[];else if(typeof t==="object"&&!Array.isArray(t))r[e]={};else r[e]=""});switch(t.getMetadata().getElementName()){case"sap.ui.table.TreeTable":let e={};r.input_editable=true;r.datePicker_editable=false;r.country=n[0].rows[0].country;Object.keys(n[0].rows[0]).forEach(t=>{if(n[0].rows[0][t]instanceof Date)e[t]=null;else e[t]=""});e.datePicker_editable=true;e.input_editable=true;r.rows=[e];break;case"sap.ui.table.Table":r.input_editable=true;r.country=n[0].country;break}a.setProperty(o+"/"+n.length,r)},onAttachmentButtonPress:function(e){this._getUploadFileDialog(e)},onUploadFileDialogConfirmPress:function(e){e.getSource().getParent().close()},onGanttChartShapePress:function(e){const t=e.getParameter("shape");const o=t.getBindingContext("detailsDialog");const a=t.getBindingContext("detailsDialog").getModel();a.setProperty("/offers/panel/selectedOffer",o.getObject())}})});