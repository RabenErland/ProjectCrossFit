function loadEquipmentHtmlFromJson() {

	//Get equipment list with AJAX call
	$.getJSON("data/equipment.json", function(result) {

		var equipmentList = result.equipment;

		//Determine if html element exists for injection
		if ($("#equipmentList").length > 0) { 
						
			// Sort list
			sortByDisplayOrder(equipmentList);

			var html = "";
			// Iterate through list and create html
			$.each(equipmentList, function(i, equipmentItem) {
				html += createEquipmentHtml(equipmentItem);
			});

			$(html).appendTo("#equipmentList");

			// Tell jQuery Mobile to enhance the inserted html as it was
			// inserted by an AJAX call
			$('#equipmentList').listview('refresh')
			
			
			//Bind to "click" on the list items
			$(".equipment-clickable").on("touchend mousedown", function(event) {
				var span = $(this).children('span');
				span.toggle();
				
				var visible = span.is(":visible");
				
				//Store in localstorage
				if(typeof(Storage)!=="undefined") {
					var key = "equipment" + $(this).attr("data-equipmentId");
					localStorage.setItem(key, visible);
				}				  
			});
			
			
		}
	});
}

function createEquipmentHtml(equipmentItem) {
	var key = "equipment" + equipmentItem.Id;
	var val = localStorage.getItem(key);
	var displayStyle = "";
	
	if(val != "undefined" && val == "false")
		 displayStyle = ' style="display:none"';
	
	var html =  		
	'<li data-icon="false" class="ui-li-custom-equipment">' +
	'<a href="#" class="equipment-clickable" data-equipmentId=' + equipmentItem.Id  + '>' +
	'<img src="data/' + equipmentItem.Icon + '">' + 
	'<span class="checkmark-image-overlay"' + displayStyle + '></span>' +
	equipmentItem.Name +
	'</a>';
	
	return html;
}

function sortByDisplayOrder(list) {
	list.sort(function(a, b) {
		return a.DisplayOrder - b.DisplayOrder;
	});
}