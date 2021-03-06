sap.ui.define(
    [
        "sap/ui/model/json/JSONModel", 
        "sap/ui/Device"
    ],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     *
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     *
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                const oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createAppModel: function() {
                return new JSONModel({
                    busy: false,
                    busyIndicatorDelay: 0,
                    layout: "TwoColumnsMidExpanded"
                });
            },

            createMainModel: function() {
                return new JSONModel({
                    table: {
                        data: []
                    }
                });
            },

            createDetailsModel: function() {
                return new JSONModel({
                    mapContainer: {
                        data: {},
                        legend: {},
                        selectedRegion: {},
                        regions: {},
                        agreements: {},
                        contracts: {}
                    },
                    panel: {
                        chart1: {
                            data: []
                        },
                        chart2: {
                            data: []
                        }
                    },
                    detailsDialog: {
                        agreements: {

                        },
                        contracts: {

                        },
                        offers: {

                        },
                        bidnobid: {

                        }
                    }
                });
            }
        };
    }
);
