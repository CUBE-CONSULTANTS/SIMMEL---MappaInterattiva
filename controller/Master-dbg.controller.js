sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "../model/formatter",
    "../model/mapper"
],

    function (BaseController, JSONModel, Filter, FilterOperator, Fragment, formatter, mapper) {
        "use strict";

        return BaseController.extend("simmel.mappaInterattiva.controller.Master", {

            //modifica fittizia
            onInit: function () {
                this.getRouter().getRoute("master").attachPatternMatched(this._onRouteMatched, this);
            },

            _initMasterData: function() {
                const testModel = new JSONModel();

                const getRegions = async () => await testModel.loadData("../data/regions.json");

                getRegions()
                    .then(() => {
                        const { regions } = testModel.getData();
                        this.getOwnerComponent().getModel("master").setProperty("/table/data", regions);
                    })
            },

            _onRouteMatched: function() {
                this._initMasterData();
            },

            onCustomListItemPress: function(e) {
                const oRow = e.getSource();
                const oRowContext = oRow.getBindingContext("master");
                const sCode = oRowContext.getProperty("country_code");

                e.getSource().getParent().getItems().forEach(el => {
                    const oPanel = el.getContent()[0];
                    const oPanelContext = oPanel.getBindingContext("master");

                    if( oPanelContext.getProperty("country_code") === sCode ) oPanel.setExpanded(true);
                    else oPanel.setExpanded(false);
                });

                if( sCode ) this.getRouter().navTo("detail", {country: sCode});
            },

            onSearchFieldLiveChange: function(e) {
                const oTable = e.getSource().getParent().getItems()[1];
                const sQuery = e.getParameter("newValue");
                const oFilter = new Filter("country_name", FilterOperator.Contains, sQuery);

                if( sQuery ) oTable.getBinding("items").filter(oFilter);
                else oTable.getBinding("items").filter([]);
            }
        });
    }
);
