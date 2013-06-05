define("EquipmentView", ["Equipment", "EquipmentLookup"], function(Equipment, equipmentLookupGetter) {

    var EquipmentView = function() {}

    EquipmentView.prototype = {

            //Function for injecting equipment list html
            renderListHtml: function () {
                var equipmentLookup = equipmentLookupGetter.getLookup();

                // Determine if html element exists for injection
                if ($("#equipmentList").length > 0) {
                    var html = "";
                    // Iterate through list and create html
                    for (var i in equipmentLookup) {
                        var eq = equipmentLookup[i];
                        html += this.getSingleItemListHtml(eq);
                    }

                    $(html).appendTo("#equipmentList");

                    //Refresh JQM Listview (to apply JQM styling)
                    $('#equipmentList').listview('refresh');

                    var that = this;

                    // Bind to "click" on the list items
                    $(".equipment-clickable").on("click", function () {
                        that.handleEquipmentClick($(this));
                    });
                }

            },

            handleEquipmentClick: function (anchor) {
                //Find related check mark span
                var span = anchor.children('span');
                var equipmentId = anchor.attr("data-equipmentId");

                //Toggle and determine check mark is visible
                span.toggle();
                var visible = span.is(":visible");

                //Store visibility in localstorage
                Equipment.storeVisibilityInStorage(equipmentId, visible);

            },

            getSingleItemListHtml: function (equipment) {

                var json = equipment.getJson();

                //Determine if the equipment item should be shown
                var displayStyle = "";

                if (equipment.isVisible())
                    displayStyle = ' style="display:none"';

                var html =
                    '<li data-icon="false" class="ui-li-custom-equipment">' +
                        '<a href="#" class="equipment-clickable" data-equipmentId=' + json.Id + '>' +
                        '<img src="data/' + json.Icon + '">' +
                        '<span class="checkmark-image-overlay"' + displayStyle + '></span>' +
                        json.Name +
                        '</a>' +
                        '</li>';
                return html;
            }
        }

    return EquipmentView; //return constructor
});

