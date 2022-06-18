var values = new Array();
	var map = null;
	var map_bounds = new google.maps.LatLngBounds();
		
	function GetLink() {
		infoWindow = new google.maps.InfoWindow();
		var s = 'http://warfly.ru/?lat='+0+'&lon='+0+'&z='+0;
		infoWindow.setContent('Прямая ссылка на это место:<BR><INPUT id="glink" onFocus=f() type="TEXT" name="" size="50" value="'+s+'">');
		infoWindow.setPosition(new google.maps.LatLng(0, 0));
		infoWindow.open(map);
	}	
	
	function GetLinkControl(controlDiv, map) {
		var controlUI = document.createElement('div');
		controlUI.style.backgroundImage = "url(/images/link-icon20.png)";;
		controlUI.style.height = '20px';
		controlUI.style.width = '20px';
		controlUI.style.cursor = 'pointer';
		controlUI.title = 'Ссылка на это место';
		controlDiv.appendChild(controlUI);
		google.maps.event.addDomListener(controlUI, 'click', function() {
			infoWindow = new google.maps.InfoWindow();
			var s = 'http://warfly.ru/?lat='+map.getCenter().lat().toFixed(6)+'&lon='+map.getCenter().lng().toFixed(6)+'&z='+map.getZoom();
			infoWindow.setContent('Прямая ссылка на это место:<BR><INPUT id="glink" onFocus=f() type="TEXT" name="" size="50" value="'+s+'">');
			infoWindow.setPosition(map.getCenter());
			infoWindow.open(map);
		});
	}
	
	
	function GetFullScreenControl(controlDiv, map) {
		var controlUI = document.createElement('div');
		controlUI.style.backgroundImage = "url(/images/fullscreen20.png)";
		controlUI.style.height = '20px';
		controlUI.style.width = '20px';
		controlUI.style.cursor = 'pointer';
		controlUI.title = 'Во весь экран';
		controlDiv.appendChild(controlUI);
		google.maps.event.addDomListener(controlUI, 'click', function() {
			window.location.href = "http://warfly.ru/fullmap/ndex.htm";
		});
	}

    function initialize() {
		var p_url = location.search.substring(1);
		var parametr = p_url.split("&");
		values["lat"]="55.751849";
		values["lon"]="37.615814";
		values["z"]="11";
                values["sl"]="0";
		for (var i=0;i<parametr.length;i++) {
			var j=parametr[i].split("=");
			values[j[0]]=unescape(j[1]);
		}
		if (values["z"]<9) values["z"]=9;
		if (values["z"]>18) values["z"]=18;
	
	
		var map = new google.maps.Map(
			document.getElementById('map'), {
				center: new google.maps.LatLng(values["lat"], values["lon"]),
				zoom: parseInt(values["z"]),
				panControl: false,
				zoomControl: true,
				mapTypeControl: true,
				scaleControl: true,
				streetViewControl: false,
				overviewMapControl: true,
				backgroundColor: "Silver",
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, "wwii", "wwiisl"],
					//style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
				}
			}
		);
		
		google.maps.event.addListener(map,'bounds_changed', function() {
			map_bounds = map.getBounds();
		});
		
		/*
		if (marksshow) {
			RedrawMarks();
		} else {
			marksshow=true;
			marksshmain();
		}
		*/
		
		WWIILayer = new google.maps.ImageMapType({
			getTileUrl: function(tile, zoom) {
				return "https://17200.selcdn.ru/AerialWWII/Z" + zoom + "/" + tile.y + "/" + tile.x +".jpg"; 
			},
			maxZoom:18,
			minZoom:9,
			tileSize: new google.maps.Size(256, 256),
			name: "ВОВ"
		});

		map.mapTypes.set('wwii', WWIILayer);
		map.setMapTypeId('wwii');
		
		if(values["sl"]!="0") {
			WWIILayerSL = new google.maps.ImageMapType({
				getTileUrl: function(tile, zoom) {
					return "https://17200.selcdn.ru/AerialWWII/SL"+values["sl"]+"/Z" + zoom + "/" + tile.y + "/" + tile.x +".jpg"; 
				},
				maxZoom:18,
				minZoom:9,
				tileSize: new google.maps.Size(256, 256),
				name: values["sl"]
			});
			map.mapTypes.set('wwiisl', WWIILayerSL);
			map.setMapTypeId('wwiisl');
		} 
		
		
		var GetLinkControlDiv = document.createElement('div');
		GetLinkControlDiv.style.padding = '4px';
		GetLinkControl(GetLinkControlDiv, map);
		GetFullScreenControl(GetLinkControlDiv, map);

		GetLinkControlDiv.index = 1;
		map.controls[google.maps.ControlPosition.RIGHT_TOP].push(GetLinkControlDiv);
    }
	
	google.maps.event.addDomListener(window, 'load', initialize);
	
