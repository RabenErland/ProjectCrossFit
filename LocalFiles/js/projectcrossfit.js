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
		}
	});
}

function createEquipmentHtml(equipmentItem) {
	var html = '<li style="text-transform: capitalize">' + '<img src="data/'
			+ equipmentItem.Icon
			+ '" onerror="this.src=\'data/doesnotexist.png\';">'
			+ equipmentItem.Name + '</li>';
	return html;
}

function sortByDisplayOrder(list) {
	list.sort(function(a, b) {
		return a.DisplayOrder - b.DisplayOrder;
	});
}