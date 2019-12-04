var sgGEO = {"type":"Feature","id":"SGP","properties":{"name":"Singapore"},"geometry":{"type":"Polygon","coordinates":[[[103.60313415527344,1.26675774823251],[103.61755371093749,1.3244212231757635],[103.65325927734375,1.3896342476555246],[103.66630554199219,1.4143460858068593],[103.67179870605467,1.4294476354255539],[103.68278503417969,1.439057660807751],[103.69583129882812,1.4438626583311722],[103.72055053710938,1.4589640128389818],[103.73771667480469,1.4582775898253464],[103.75419616699219,1.4493540716333067],[103.7603759765625,1.4500404973607948],[103.80363464355467,1.4788701887242242],[103.8269805908203,1.4754381021049132],[103.86680603027342,1.4582775898253464],[103.8922119140625,1.4321933610794366],[103.89701843261717,1.4287612034988086],[103.91555786132812,1.4267019064882447],[103.93478393554688,1.4321933610794366],[103.96018981933592,1.4218968729661605],[103.985595703125,1.4246426076343077],[104.00070190429688,1.4212104387885494],[104.02130126953125,1.4397440896459617],[104.04396057128906,1.445921939876798],[104.08721923828125,1.4246426076343077],[104.09477233886719,1.3971851147344805],[104.08103942871094,1.3573711816421556],[104.12704467773438,1.290097884072079],[104.12704467773438,1.2777413679950957],[103.98216247558594,1.2537146393239096],[103.81256103515625,1.1754546449158993],[103.73634338378906,1.1301452152248344],[103.65394592285156,1.1905576261723045],[103.56536865234375,1.1960495988987414],[103.60313415527344,1.26675774823251]]]}};

$(document).ready(function() {

	function onEachFeature(feature, layer) {
	  
	    if (feature.properties) {
	    	if(feature.properties.Home != "") {
	    		var reformedHomeText = "";
	    		var arrayOfText = feature.properties.Home.split(", ");
	    		for(i = 0; i < arrayOfText.length; i++) {
	    			reformedHomeText += "• " + arrayOfText[i] + "<br>";
	    		}
	    	}
	    	if(feature.properties.Public_Places != "") {
	    		var reformedPublicText = "";
	    		var arrayOfText = feature.properties.Public_Places.split(", ");
	    		for(i = 0; i < arrayOfText.length; i++) {
	    			reformedPublicText += "• " + arrayOfText[i] + "<br>";
	    		}
	    	}
	    	if(feature.properties.Construction_Sites != "") {
	    		var reformedSitesText = "";
	    		var arrayOfText = feature.properties.Construction_Sites.split(", ");
	    		for(i = 0; i < arrayOfText.length; i++) {
	    			reformedSitesText += "• " + arrayOfText[i] + "<br>";
	    		}
	    	}
	    	
	    	layer.bindPopup(
			    '<div class="tabs">' +

		            '<div class="tab" id="tab-1">' +
		            	'<div class="container">' + 
		            		'<div class="content">' +
		            			'<b>Locality: </b>' + feature.properties.Locality + '<br><br>' +
		            			'<b>Case Size: </b>' + feature.properties.Case_Size +
		            		'</div>' + 
		            	'</div>' +
		            '</div>' +

		            '<div class="tab" id="tab-2">' +
		            	'<div class="content">' +
		            		'<table class="table table-bordered">' +
		            			'<thead>' + '<tr>' + 
		            				'<th>' + "Breeding Habitat in Homes" + '</th>' +
						            '<th>' + "Breeding Habitat in Public Places" + '</th>' +
						            '<th>' + "Breeding Habitat in Construction Sites" + '</th>' +
		            			'</tr>' + '</thead>' + 
		            			'<tbody>' + '<tr>' +
		            				'<td><center>' + (feature.properties.Home == "" ? "NIL" : reformedHomeText) + "</center></td>" +
		            				'<td><center>' + (feature.properties.Public_Places == "" ? "NIL" : reformedPublicText) + "</center></td>" +
		            				'<td><center>' + (feature.properties.Construction_Sites == "" ? "NIL" : reformedSitesText) + "</center></td>" +
		            			'</tr>' + '</tbody>' + 
		            		'</table>' +
		            	'</div>' +
		            '</div>' +
		    
		            '<ul class="tabs-link">' +
		            	'<li class="tab-link"> <a href="#tab-1"><span>' + (feature.properties.Name.substring(0,3) == "kml" ? "Dengue Cluster" : "Zika Cluster") + '</span></a></li>' +
		            	'<li class="tab-link"> <a href="#tab-2"><span>Breeding Habitat</span></a></li>' +
		            '</ul>' +
		        '</div>'
        	);
	    }
	}

	function style(feature, layer) {
		if(feature.properties) {
			if(feature.properties.Case_Size < 5) {
				return {"color": "blue", "fillOpacity": 0.6}
			} else if(feature.properties.Case_Size >= 5 && feature.properties.Case_Size < 10) {
				return {"color": "green", "fillOpacity": 0.6}
			} else if(feature.properties.Case_Size >= 10) {
				return {"color": "red", "fillOpacity": 0.6}
			}
		}
	}

	function updateCheckboxStates() {
		checkboxStates = {
	  		types: [],
	    	habitats: []
		}
	  
		for (let input of document.querySelectorAll('input')) {
	  		if(input.checked) {
	    		switch (input.className) {
	      			case 'types': checkboxStates.types.push(input.value); break
	        		case 'habitats form-check-input': checkboxStates.habitats.push(input.value); break
	      		}
	    	}
	  	}
	}

	function updateGSONLayer() {
		$.get("./data/dengue-cluster.geojson", function(geoJSON) {

	  		geoJSONLayer = L.geoJSON(JSON.parse(geoJSON), {
	  			onEachFeature: onEachFeature,
	  			style: style,
				filter: (feature) => {
			  		const isTypeChecked = checkboxStates.types.includes(feature.properties.Name.substring(0,3))
			  		if(checkboxStates.habitats.includes("All")) {
			  			return isTypeChecked
			  		} else if(checkboxStates.habitats.includes("Home")) {
			  			const isHomeChecked = checkboxStates.habitats.includes(feature.properties.Home == "" ? false : "Home")
			    		return isTypeChecked && isHomeChecked
			  		} else if(checkboxStates.habitats.includes("PublicArea")) {
			  			const isPublicChecked = checkboxStates.habitats.includes(feature.properties.Public_Places == "" ? false : "PublicArea")
			  			return isTypeChecked && isPublicChecked
			  		} else if(checkboxStates.habitats.includes("ConstructionSites")) {
			  			const isConstructionChecked = checkboxStates.habitats.includes(feature.properties.Construction_Sites == "" ? false : "ConstructionSites")
			  			return isTypeChecked && isConstructionChecked
			  		}
			  	}
	  		}).addTo(leafletMap);
	  	})
	}	

  	var geoJSONLayer = null;
	var leafletMap = L.map('mapid').setView([1.290270, 103.851959], 17);

	var baseMap = new L.TileLayer.BoundaryCanvas("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    	boundary: sgGEO,
    	zoom: 11,
    });

  	leafletMap.addLayer(baseMap);
  	var sgLayer = L.geoJSON(sgGEO);
  	leafletMap.fitBounds(sgLayer.getBounds());

  	$.get("./data/dengue-cluster.geojson", function(geoJSON) {

  		geoJSONLayer = L.geoJSON(JSON.parse(geoJSON), {
  			onEachFeature: onEachFeature,
  			style: style,
			filter: (feature) => {
		  		const isTypeChecked = checkboxStates.types.includes(feature.properties.Name.substring(0,3))
		    	return isTypeChecked
		  	}
  		}).addTo(leafletMap);
  	})

  	leafletMap.setZoom(11);

	for (let input of document.querySelectorAll('input')) {
		input.onchange = (e) => {
	  		geoJSONLayer.clearLayers()
	  		updateCheckboxStates()
	  		updateGSONLayer();
	  	}
	}

	updateCheckboxStates()

});