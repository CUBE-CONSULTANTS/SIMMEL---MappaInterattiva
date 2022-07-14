sap.ui.define([

],
  function () {
      "use strict";

      return {
          mapTreeTableData: function(aData) {
            return aData.map(el => {
              return {
                "name": el.customer_name,
                "rows": aData.filter(item => item.customer_name === el.customer_name).map(mapItem => {
                  return {
                    "customer_name": mapItem.customer_name,
                    "offer_number": mapItem.offer_number,
                    "country": mapItem.country,
                    "pays": mapItem.pays,
                    "name": mapItem.offer_title,
                    "amount": mapItem.amount,
                    "startDate": new Date(mapItem.startDate),
                    "endDate": new Date(mapItem.endDate),
                    "commercial": mapItem.commercial
                  }
                })
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
