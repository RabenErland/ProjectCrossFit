define("EquipmentLookup", ["Equipment"], function(Equipment) {

    var equipmentList;
    $.ajax({
        dataType : "json",
        url : "data/equipment.json",
        async : false,
        cache : false
    }).done(function(result) {
            equipmentList = result.equipment;
        });

    var equipmentLookup = {};
    $.each(equipmentList, function(i, equipmentItem) {
        equipmentLookup[equipmentItem.Id] = new Equipment(equipmentItem);
    });

    return {
        getLookup: function() {
            return equipmentLookup;
        }
    };

});
