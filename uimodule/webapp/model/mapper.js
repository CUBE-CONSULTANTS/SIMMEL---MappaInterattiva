sap.ui.define([

],
  function () {
      "use strict";

      return {
          mapCalendarData: function(aData) {
            return aData.map(el => {
              return {
                "customer_name": el.customer_name,
                "offers": aData.filter(item => item.customer_name === el.customer_name)
              }
            }).filter((value, index, self) =>
              index === self.findIndex((t) => (
                t.customer_name === value.customer_name
              ))
            );
          }
      };
  }
);
