sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Fragment",
  "../model/formatter",
  "../model/mapper"
],

  function (BaseController, JSONModel, Fragment, formatter, mapper) {
      "use strict";

      return BaseController.extend("simmel.mappaInterattiva.controller.Detail", {
        onInit: function() {
          this.getRouter().getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
          this._initDetailData();
        },

        _initDetailData: function() {
          const testModel = new JSONModel();

          const getData = async () => await testModel.loadData("./data/data.json");
          const getLegend = async () => await testModel.loadData("./data/legend.json");
          const getRegions = async () => await testModel.loadData("./data/regions.json");
          const getAgreements = async () => await testModel.loadData("./data/agreement.json");
          const getContracts = async () => await testModel.loadData("./data/contracts.json");
          const getOffers = async () => await testModel.loadData("./data/offers.json");
          const getBID = async () => await testModel.loadData("./data/bid-nobid.json");
          const getChart1 = async () => await testModel.loadData("./data/chart1.json");

          getData()
              .then(() => {
                  const { data } = testModel.getData();
                  this.getOwnerComponent().getModel("detail").setProperty("/data", data);
              });

          getLegend()
              .then(() => {
                  const { legend } = testModel.getData();
                  this.getOwnerComponent().getModel("detail").setProperty("/legend", legend);
              })

          getRegions()
              .then(() => {
                  const { regions } = testModel.getData();
                  this.getOwnerComponent().getModel("detail").setProperty("/regions", regions);
              })

          getAgreements()
              .then(() => {
                  const { agreements } = testModel.getData();
                  this.getOwnerComponent().getModel("detail").setProperty("/agreements", agreements);
              })

          getContracts()
              .then(() => {
                  const { contracts } = testModel.getData();
                  this.getOwnerComponent().getModel("detail").setProperty("/contracts", contracts);
              })

          getOffers()
              .then(() => {
                  const { offers } = testModel.getData();
                  this.getOwnerComponent().getModel("detail").setProperty("/offers", offers);
              })

            getBID()
                .then(() => {
                    const { bidnobid } = testModel.getData();
                    this.getOwnerComponent().getModel("detail").setProperty("/bidnobid", bidnobid);
                })

            getChart1()
                .then(() => {
                    const { milk } = testModel.getData();
                    this.getOwnerComponent().getModel("detail").setProperty("/panel/chart1/data", milk);
                })
        },

        _onRouteMatched: function(e) {
            if( e.getParameter("arguments").country ) {
                this.byId("vbi1").fireRegionClick({
                    code: e.getParameter("arguments").country
                });
            }
        },

        // View Events //

        onRegionClick: function(e){
            const sCode = e.getParameter("code");

            if( !e.getSource().getRegionMap()[sCode] ) {
              this.getModel("detail").setProperty("/selectedRegion", null);
              this.byId("detailsPanel").setExpanded(false);
              e.getSource().setCenterPosition("5;35;0");
              e.getSource().setZoomlevel(2);
              return this.getRouter().navTo("master");
            }
            
            const oSelectedRegionContext = e.getSource().getRegionMap()[sCode].getBindingContext("detail");

            this.getModel("detail").setProperty("/selectedRegion", oSelectedRegionContext.getObject());
            
            //opens details panel
            this.byId("detailsPanel").setExpanded(true);
            //increases zoom level on selected region
            Object.values(e.getSource().getRegionMap()).forEach(el => {
                if( el.getCode() === sCode ) el.setSelect(true);
                else el.setSelect(false);
            });
            e.getSource().zoomToRegions([sCode]);
        },

        onSpotClick: function(e) {
            const oSource = e.getSource();
            const oContext = oSource.getBindingContext("detail");

            e.getSource().getParent().getParent().fireRegionClick({code: oContext.getProperty("country")});

            if( !this._oAgreementDetailsDialog ){
                this._oAgreementDetailsDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "simmel.mappaInterattiva.view.fragment.detail.DetailsDialog",
                    type: "XML",
                    controller: this
                }).then(oDialog => {
                    this.getView().addDependent(oDialog);
                    oDialog.setModel(new JSONModel({
                        agreement: {},
                        contracts: {},
                        offers: {
                            panel: {
                                selectedOffer: null
                            },
                            treeTable: {
                                rows: {}
                            }
                        },
                        bidnobid: {}
                    }), "detailsDialog");
                    return oDialog;
                });
            }

            this._oAgreementDetailsDialog.then(oDialog => {
                const aFilteredAgreement = this.getModel("detail").getProperty("/agreements").filter(el => el.country === oContext.getProperty("country"));
                const aFilteredContracts = this.getModel("detail").getProperty("/contracts").filter(el => el.country === oContext.getProperty("country"));
                const aFilteredOffers = this.getModel("detail").getProperty("/offers").filter(el => el.country === oContext.getProperty("country"));
                const aFilteredBidnobid = this.getModel("detail").getProperty("/bidnobid").filter(el => el.country === oContext.getProperty("country"));

                oDialog.getContent()[0].getItems()[0].setSelectedKey("agreement");
                oDialog.getModel("detailsDialog").setProperty("/selectedIconTabKey", oDialog.getContent()[0].getItems()[0].getSelectedKey());
                oDialog.getModel("detailsDialog").setProperty("/context", oContext.getObject());
                oDialog.getModel("detailsDialog").setProperty("/agreement/items", aFilteredAgreement);
                oDialog.getModel("detailsDialog").setProperty("/contracts/items", aFilteredContracts);
                oDialog.getModel("detailsDialog").setProperty("/offers/treeTable/rows", mapper.mapTreeTableData(aFilteredOffers));
                oDialog.getModel("detailsDialog").setProperty("/bidnobid/items", aFilteredBidnobid);
                oDialog.open();
            })
        },

        onGoToDetailsPress: function(e) {
            const oContext = this.getModel("detail").getProperty("/selectedRegion");
            const { country_code } = oContext;

            if( !this._oAgreementDetailsDialog ){
                this._oAgreementDetailsDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "simmel.mappaInterattiva.view.fragment.detail.DetailsDialog",
                    type: "XML",
                    controller: this
                }).then(oDialog => {
                    this.getView().addDependent(oDialog);
                    oDialog.setModel(new JSONModel({
                        agreement: {},
                        contracts: {},
                        offers: {
                            panel: {
                                selectedOffer: null
                            },
                            treeTable: {
                                rows: {}
                            }
                        },
                        bidnobid: {}
                    }), "detailsDialog");
                    return oDialog;
                });
            }

            this._oAgreementDetailsDialog.then(oDialog => {
                const aFilteredAgreement = this.getModel("detail").getProperty("/agreements").filter(el => el.country === country_code);
                const aFilteredContracts = this.getModel("detail").getProperty("/contracts").filter(el => el.country === country_code);
                const aFilteredOffers = this.getModel("detail").getProperty("/offers").filter(el => el.country === country_code);
                const aFilteredBidnobid = this.getModel("detail").getProperty("/bidnobid").filter(el => el.country === country_code);

                oDialog.getContent()[0].getItems()[0].setSelectedKey("agreement");
                oDialog.getModel("detailsDialog").setProperty("/selectedIconTabKey", oDialog.getContent()[0].getItems()[0].getSelectedKey());
                oDialog.getModel("detailsDialog").setProperty("/context", oContext);
                oDialog.getModel("detailsDialog").setProperty("/agreement/items", aFilteredAgreement);
                oDialog.getModel("detailsDialog").setProperty("/contracts/items", aFilteredContracts);
                oDialog.getModel("detailsDialog").setProperty("/offers/treeTable/rows", mapper.mapTreeTableData(aFilteredOffers));
                oDialog.getModel("detailsDialog").setProperty("/bidnobid/items", aFilteredBidnobid);
                oDialog.open();
            })
        },

        onIconTabSelect: function( e ){
            const oDialog = e.getSource().getParent().getParent();
            oDialog.getModel("detailsDialog").setProperty("/selectedIconTabKey", e.getParameter("selectedKey"));
        },

        // Dialog Init //

        _getContactsDetailsDialog: function(oContext) {
            if( !this._oContactsDetailsDialog ){
                this._oContactsDetailsDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "simmel.mappaInterattiva.view.fragment.dialog.subfragment.ContactsDetailsDialog",
                    type: "XML",
                    controller: this
                }).then(oDialog => {
                    this.getView().addDependent(oDialog);
                    oDialog.setModel(new JSONModel({}), "contactsDialog");
                    return oDialog;
                });
            }

            this._oContactsDetailsDialog.then(oDialog => {
                oDialog.getModel("contactsDialog").setData(oContext.getObject());
                oDialog.open();
            })
        },

        _getAddDataPopover: function(oSource, oTable) {
            if( !this._oAddDataPopover ){
                this._oAddDataPopover = Fragment.load({
                    id: this.getView().getId(),
                    name: "simmel.mappaInterattiva.view.fragment.dialog.subfragment.AddDataPopover",
                    type: "XML",
                    controller: this
                }).then(oPopover => {
                    this.getView().addDependent(oPopover);
                    oPopover.setModel(new JSONModel({}), "addData");
                    return oPopover;
                });
            }

            this._oAddDataPopover.then(oPopover => {
                const oDialog = oSource.getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent();
                oPopover.getModel("addData").setProperty("/context", oTable);
                oPopover.getModel("addData").setProperty("/selectedIconTabKey", oDialog.getModel("detailsDialog").getProperty("/selectedIconTabKey"));
                oPopover.openBy(oSource);
            })
        },

        _getUploadFileDialog: function (){
            if( !this._oUploadFileDialog ){
                this._oUploadFileDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "simmel.mappaInterattiva.view.fragment.dialog.subfragment.UploadFileDialog",
                    type: "XML",
                    controller: this
                }).then(oDialog => {
                    this.getView().addDependent(oDialog);
                    oDialog.setModel(new JSONModel({}), "uploadDialog");
                    return oDialog;
                });
            }

            this._oUploadFileDialog.then(oDialog => {
                oDialog.open();
            })
        },

        // Dialog Events //

        onContactsButtonPress: function(e) {
            const oContext = e.getSource().getBindingContext("detailsDialog");
            this._getContactsDetailsDialog(oContext);
        },

        onDetailsDialogAddRecordsPress: function(e) {
            const oSource = e.getSource();
            const oTable = e.getSource().getParent().getParent();
            
            this._getAddDataPopover(oSource, oTable);
        },

        onGanttStartDateChange: function(e) {
            const oDate = e.getSource().getDateValue();
            const oContext = e.getSource().getParent().getParent().getBindingContext("detailsDialog");
            const sPath = oContext.getPath();
            const oModel = oContext.getModel();

            oModel.setProperty(sPath + "/startDate", oDate);
        },

        onGanttEndDateChange: function(e) {
            const oDate = e.getSource().getDateValue();
            const oContext = e.getSource().getParent().getParent().getBindingContext("detailsDialog");
            const sPath = oContext.getPath();
            const oModel = oContext.getModel();

            oModel.setProperty(sPath + "/endDate", oDate);
        },

        onAddToExistingRowPress: function(e) {
            const oTable = e.getSource().getParent().getParent().getModel("addData").getProperty("/context");
            const sPath = oTable.getBinding("rows").getPath();
            const oModel = oTable.getModel("detailsDialog");
            const aList = oModel.getProperty(sPath);
            const oRow = {};

            if( oTable.getSelectedIndex() === -1 ) return new sap.m.MessageBox.error("Selezionare una riga per proseguire");

            Object.keys(aList[0].rows[0]).forEach( el => {
                if( aList[0].rows[0][el] instanceof Date ) oRow[el] = null;
                else oRow[el] = "";
            });

            oRow.datePicker_editable = true;
            oRow.input_editable = true;

            oModel.setProperty( oTable.getContextByIndex(oTable.getSelectedIndex()).getPath() + "/rows/" + oModel.getProperty(oTable.getContextByIndex(oTable.getSelectedIndex()).getPath() + "/rows").length, oRow )
            oTable.expand(oTable.getSelectedIndex());
        },

        onAddRowPress: function(e) {
            const oTable = e.getSource().getParent().getParent().getModel("addData").getProperty("/context");
            const sPath = oTable.getBinding("rows").getPath();
            const oModel = oTable.getModel("detailsDialog");
            const aList = oModel.getProperty(sPath);
            const aKeys = Object.keys(aList[0]);
            const oO = {};

            aKeys.forEach(el => {
                const value = aList[0][el];
                if( typeof value === 'object' && Array.isArray(value) ) oO[el] = [];
                else if( typeof value === 'object' && !Array.isArray(value) ) oO[el] = {};
                else oO[el] = "";
            })

            // eslint-disable-next-line default-case
            switch( oTable.getMetadata().getElementName() ){
                case "sap.ui.table.TreeTable":
                    let oRow = {};

                    oO.input_editable = true;
                    oO.datePicker_editable = false;
                    oO.country = aList[0].rows[0].country;

                    Object.keys(aList[0].rows[0]).forEach( el => {
                        if( aList[0].rows[0][el] instanceof Date ) oRow[el] = null;
                        else oRow[el] = "";
                    });
                    oRow.datePicker_editable = true;
                    oRow.input_editable = true;
                    oO.rows = [oRow];
                    break;
                case "sap.ui.table.Table":
                    oO.input_editable = true;
                    oO.country = aList[0].country;
                break;
            }

            oModel.setProperty(sPath + "/" + aList.length, oO);
        },

        onAddAttachmentPress: function(e) {
            this._getUploadFileDialog(e);
        },

        onUploadFileDialogConfirmPress: function(e){
            e.getSource().getParent().close();
        },

        // GANTT CHART

        onGanttChartShapePress: function(e) {
            const oShape = e.getParameter("shape");
            const oContext = oShape.getBindingContext("detailsDialog");
            const oModel = oShape.getBindingContext("detailsDialog").getModel();

            oModel.setProperty("/offers/panel/selectedOffer", oContext.getObject());
        }

      });
  }
);
