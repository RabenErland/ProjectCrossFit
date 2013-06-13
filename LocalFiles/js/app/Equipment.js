define("Equipment", [], function() {

    var Equipment = function (equipmentJson) {
        this.equipmentJson = equipmentJson;
    };

    Equipment.getLookupStorageKey = function (equipmentId) {
        return "projectCrossFit_Equipment" + equipmentId;
    };

    Equipment.storeVisibilityInStorage = function (equipmentId, visibility) {
        var key = Equipment.getLookupStorageKey(equipmentId);
        localStorage.setItem(key, visibility);
    };

    Equipment.prototype.getJson = function() {
        return this.equipmentJson;
    }

    Equipment.prototype.getLookupStorageKey = function () {
        return Equipment.getLookupStorageKey(this.equipmentJson.Id);
    };

    Equipment.prototype.isVisible = function () {
        var key = this.getLookupStorageKey();
        var val = localStorage.getItem(key);
        return val != "undefined" && val == "false";
    };

    return Equipment;
});


