sap.ui.define([],function(){"use strict";return{formatStartDate:function(t){if(!t)return;const e=new Date(t);return new Date(e.getFullYear(),e.getMonth(),e.getDate(),0,0,0)},formatEndDate:function(t){if(!t)return;const e=new Date(t);return new Date(e.getFullYear(),e.getMonth(),e.getDate(),23,59,59)},formatStandardDate:function(t){if(!t)return;return new Date(t).toLocaleDateString()}}});