
/* ObjectFactory class */
var ObjectFactory = function () {
};

ObjectFactory.storeEquipmentLookup = function (lookup) {
    window.equipmentLookup = lookup;
};

ObjectFactory.getEquipmentLookup = function () {
    return window.equipmentLookup;
};

ObjectFactory.storeWodLookup = function (lookup) {
    window.wodLookup = lookup;
};

ObjectFactory.getWodLookup = function () {
    return window.wodLookup;
};

ObjectFactory.getWodTracker = function() {

    if(window.wodTracker == null) {
        var tracker = window.wodTracker = WodTracker.getTracker(); //Create tracker
        return tracker;
    }
    else {
        return window.wodTracker;
    }
};
/* End of - ObjectFactory class */

