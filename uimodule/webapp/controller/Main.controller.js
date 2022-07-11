sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "../model/formatter",
    "../model/mapper"
],

    function (BaseController, JSONModel, Fragment, formatter, mapper) {
        "use strict";

        return BaseController.extend("simmel.mappaInterattiva.controller.Main", {

            onInit: function () {
                this.getRouter().getRoute("Main").attachPatternMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function() {
                const testModel = new JSONModel();
                const viewModel = new JSONModel({
                    data: {},
                    legend: {},
                    selectedRegion: {},
                    regions: {},
                    agreements: {},
                    contracts: {}
                });

                const getData = async () => await testModel.loadData("../data/data.json");
                const getLegend = async () => await testModel.loadData("../data/legend.json");
                const getRegions = async () => await testModel.loadData("../data/regions.json");
                const getAgreements = async () => await testModel.loadData("../data/agreement.json");
                const getContracts = async () => await testModel.loadData("../data/contracts.json");
                const getOffers = async () => await testModel.loadData("../data/offers.json");
                const getBID = async () => await testModel.loadData("../data/bid-nobid.json");

                getData()
                    .then(() => {
                        const { data } = testModel.getData();
                        viewModel.setProperty("/data", data);
                    });

                getLegend()
                    .then(() => {
                        const { legend } = testModel.getData();
                        viewModel.setProperty("/legend", legend);
                    })

                getRegions()
                    .then(() => {
                        const { regions } = testModel.getData();
                        viewModel.setProperty("/regions", regions);
                    })

                getAgreements()
                    .then(() => {
                        const { agreements } = testModel.getData();
                        viewModel.setProperty("/agreements", agreements);
                    })

                getContracts()
                    .then(() => {
                        const { contracts } = testModel.getData();
                        viewModel.setProperty("/contracts", contracts);
                    })

                getOffers()
                    .then(() => {
                        const { offers } = testModel.getData();
                        viewModel.setProperty("/offers", offers);
                    })

                    getBID()
                        .then(() => {
                            const { bidnobid } = testModel.getData();
                            viewModel.setProperty("/bidnobid", bidnobid);
                        })

                this.getView().setModel(viewModel, "test");
            },

            // View Events //

            onRegionClick: function(e){
                const sCode = e.getParameter("code");

                if( !e.getSource().getRegionMap()[sCode] ) {
                    this.byId("detailsPanel").setExpanded(false);
                    return sap.m.MessageToast.show("No data found");
                }
                
                const oSelectedRegionContext = e.getSource().getRegionMap()[sCode].getBindingContext("test");

                this.getView().getModel("test").setProperty("/selectedRegion", oSelectedRegionContext.getObject());
                
                //opens details panel
                this.byId("detailsPanel").setExpanded(true);
                //increases zoom level on selected region
                e.getSource().zoomToRegions([sCode], null);
            },

            onSpotClick: function(e) {
                const oSource = e.getSource();
                const { Action, Data } = e.getParameter("data");
                const oContext = oSource.getBindingContext("test");

                if( !this._oAgreementDetailsDialog ){
                    this._oAgreementDetailsDialog = Fragment.load({
                        id: this.getView().getId(),
                        name: "simmel.mappaInterattiva.view.fragment.DetailsDialog",
                        type: "XML",
                        controller: this
                    }).then(oDialog => {
                        this.getView().addDependent(oDialog);
                        oDialog.setModel(new JSONModel({
                            agreement: {},
                            contracts: {},
                            offers: {
                                table: {},
                                calendar: {}
                            },
                            bidnobid: {}
                        }), "detailsDialog");
                        return oDialog;
                    });
                }

                this._oAgreementDetailsDialog.then(oDialog => {
                    const aFilteredAgreement = this.getView().getModel("test").getProperty("/agreements").filter(el => el.country === oContext.getProperty("country"));
                    const aFilteredContracts = this.getView().getModel("test").getProperty("/contracts").filter(el => el.country === oContext.getProperty("country"));
                    const aFilteredOffers = this.getView().getModel("test").getProperty("/offers").filter(el => el.country === oContext.getProperty("country"));
                    const aFilteredBidnobid = this.getView().getModel("test").getProperty("/bidnobid").filter(el => el.country === oContext.getProperty("country"));

                    oDialog.getModel("detailsDialog").setProperty("/context", oContext.getObject());
                    oDialog.getModel("detailsDialog").setProperty("/agreement/items", aFilteredAgreement);
                    oDialog.getModel("detailsDialog").setProperty("/contracts/items", aFilteredContracts);
                    oDialog.getModel("detailsDialog").setProperty("/offers/table/items", aFilteredOffers);
                    oDialog.getModel("detailsDialog").setProperty("/offers/calendar/items", mapper.mapCalendarData(aFilteredOffers));
                    oDialog.getModel("detailsDialog").setProperty("/bidnobid/items", aFilteredBidnobid);
                    oDialog.open();
                })
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
                    oDialog.getModel("contactsDialog").setData(oContext.getProperty("contacts"));
                    oDialog.open();
                })
            },

            // Dialog Events //

            onContactsButtonPress: function(e) {
                const oContext = e.getSource().getBindingContext("detailsDialog");
                this._getContactsDetailsDialog(oContext);
            }
        });
    }
);
