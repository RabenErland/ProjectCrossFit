/* Equipment class */
function Equipment(equipmentJson) {
	this.equipmentJson = equipmentJson;
}

Equipment.getStorageKey = function(equipmentId) {
	return "projectCrossFit_Equipment" + equipmentId;
}

Equipment.storeVisibilityInStorage = function(equipmentId, visibility) {
	var key = Equipment.getStorageKey(equipmentId);
	localStorage.setItem(key, visibility);
}

Equipment.prototype.getStorageKey = function() {
	return Equipment.getStorageKey(this.equipmentJson.Id);
}

Equipment.prototype.isVisible = function() {
	var key = this.getStorageKey();
	var val = localStorage.getItem(key);
	return val != "undefined" && val == "false";
}

Equipment.prototype.createListHtml = function() {
	//Determine if the equipment item should be shown
	var displayStyle = "";
	
	if(this.isVisible())
		 displayStyle = ' style="display:none"';
	
	var html =  		
		'<li data-icon="false" class="ui-li-custom-equipment">' +
			'<a href="#" class="equipment-clickable" data-equipmentId=' + this.equipmentJson.Id  + '>' +
				'<img src="data/' + this.equipmentJson.Icon + '">' + 
				'<span class="checkmark-image-overlay"' + displayStyle + '></span>' +
				this.equipmentJson.Name +
			'</a>' +
		'</li>';	
	return html;
}
/* End of - Equipment class */


/* WOD class */
function Wod(wodJson) {
	this.wodJson = wodJson;
}

Wod.getStorageKey = function(wodId) {
	return "projectCrossFit_Wod" + wodId;
}

Wod.prototype.createListHtml = function() {
	//Determine if the equipment item should be shown
	var exercises = this.wodJson.Exercises;
	exercises.replace('[', '');
	exercises.replace(']', '');
	
	var html =  		
		'<li><a href="woddetail?'+ this.wodJson.Id + '">' +						
		'<h2>' + this.wodJson.Name + '</h2>' +
		'<p class="ui-li-desc">' + exercises + '</p>' +		
		'</a></li>'	
	return html;
}
/* End of - WOD class */


//Function for loading WODs from json and injecting html 
function loadWodHtmlFromJson() {

	//Get equipment list with AJAX call
	$.getJSON("data/wods.json", function(result) {

		var wodList = result.wods;

		//Determine if html element exists for injection
		if ($("#wodList").length > 0) { 

			var html = "";
			// Iterate through list and create html
			$.each(wodList, function(i, wodItem) {
				var eq = new Wod(wodItem);
				html += eq.createListHtml();
			});

			$(html).appendTo("#wodList");

			// Tell jQuery Mobile to enhance the inserted html as it was
			// inserted by an AJAX call
			$('#wodList').listview('refresh')						
		}
	});
}


//Function for loading equipment from json and creating and injecting html 
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
				var eq = new Equipment(equipmentItem);
				html += eq.createListHtml();
			});

			$(html).appendTo("#equipmentList");

			// Tell jQuery Mobile to enhance the inserted html as it was
			// inserted by an AJAX call
			$('#equipmentList').listview('refresh')
						
			//Bind to "click" on the list items
			$(".equipment-clickable").on("click", function(event) {
				handleEquipmentClick($(this));		  
			});
			
			
		}
	});
}

//Handles a click on a equipment anchor tag
function handleEquipmentClick(anchor) {
	//Find related check mark span
	var span = anchor.children('span');
	var equipmentId = anchor.attr("data-equipmentId");
	
	//Toggle and determine check mark is visible
	span.toggle();				
	var visible = span.is(":visible");
	
	//Store visibility in localstorage
	Equipment.storeVisibilityInStorage(equipmentId, visible);	
}

function sortByDisplayOrder(list) {
	list.sort(function(a, b) {
		return a.DisplayOrder - b.DisplayOrder;
	});
}

function toggleMenu() {

	var menupanel = $.mobile.activePage.find('#menupanel');
	if(menupanel != undefined && menupanel.css("visibility") == "hidden") {
		menupanel.panel("open");
	}
	else {
		menupanel.panel("close");
	}
}