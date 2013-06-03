/* Equipment class */
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

Equipment.prototype.getLookupStorageKey = function () {
    return Equipment.getLookupStorageKey(this.equipmentJson.Id);
};

Equipment.prototype.isVisible = function () {
    var key = this.getLookupStorageKey();
    var val = localStorage.getItem(key);
    return val != "undefined" && val == "false";
};

Equipment.prototype.createListHtml = function () {
    //Determine if the equipment item should be shown
    var displayStyle = "";

    if (this.isVisible())
        displayStyle = ' style="display:none"';

    var html =
        '<li data-icon="false" class="ui-li-custom-equipment">' +
            '<a href="#" class="equipment-clickable" data-equipmentId=' + this.equipmentJson.Id + '>' +
            '<img src="data/' + this.equipmentJson.Icon + '">' +
            '<span class="checkmark-image-overlay"' + displayStyle + '></span>' +
            this.equipmentJson.Name +
            '</a>' +
            '</li>';
    return html;
};
/* End of - Equipment class */


