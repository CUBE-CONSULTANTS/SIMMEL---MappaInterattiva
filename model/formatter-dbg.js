sap.ui.define([], function () {
    "use strict";
    return {
        formatStartDate: function(sDate) {
            if ( !sDate ) return;
            const oDate = new Date(sDate);

            return new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), 0, 0, 0);
        },

        formatEndDate: function(sDate) {
            if ( !sDate ) return;
            const oDate = new Date(sDate);

            return new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), 23, 59, 59);
        },

        formatStandardDate: function(sDate) {
            if( !sDate ) return;

            return new Date(sDate).toLocaleDateString();
        }
    };
});
