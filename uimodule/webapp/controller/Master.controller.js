sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "../model/formatter",
    "../model/mapper"
],

    function (BaseController, JSONModel, Fragment, formatter, mapper) {
        "use strict";

        return BaseController.extend("simmel.mappaInterattiva.controller.Master", {

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
                const oContext = oRow.getBindingContext("master");
                const sCode = oContext.getProperty("country_code");

                if( sCode ) this.getRouter().navTo("detail", {country: sCode});
            }
        });
    }
);
