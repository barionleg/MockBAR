	//var mrp = new MercatorProjection();
	var addmarker = null;
	var marksshow=false;
	
	function getClientWidth() {
		return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
	}

	function getClientHeight() {
		return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
	}
	
	function OpenWindow(url) {
		var width=Math.floor(getClientWidth()/1.5);
		var height=Math.floor(getClientHeight()/1.5);
		newWind=window.open(url,null,'width='+width+',height='+height+',left='+Math.floor(getClientWidth()/2-width/2)+',top='+Math.floor(getClientHeight()/2-height/2)+',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no'); 
		newWind.focus();
	}

	function markssh() {
		document.getElementById('markssh').style.textDecorationLineThrough=!marksshow;
		marksshow=!marksshow;
		if (marksshow) {
			if (values["action"]=="addmarker") {
				AddMarker(map);
			} else {
				//map.disableDragging();
				RedrawMarks();
			}
		} else {
			//map.clearOverlays();
			map.overlayMapTypes.setAt( 0, null);
		}
	}	
	
	function marksshmain() {
		if(marksshow){
			document.getElementById('markssh').childNodes[0].nodeValue='Показать фотографии';
		} else {
			document.getElementById('markssh').childNodes[0].nodeValue='Скрыть фотографии';
		}
		marksshow=!marksshow;
		if (marksshow) {
			if (values["action"]=="addmarker") {
				AddMarker(map);
			} else {
				//map.disableDragging();
				RedrawMarks();
			}
		} else {
			//map.clearOverlays();
			map.overlayMapTypes.setAt( 0, null);
		}
	}	
	
	function addmark() {
		if (values["action"]=="addmarker") {
			document.getElementById('addmark').childNodes[0].nodeValue='Добавить фото';
			document.getElementById('addmark').title='Добавить новую фотографию';
			values["action"]="none";
			marksshow=false;
			markssh();
		} else {
			document.getElementById('addmark').childNodes[0].nodeValue='Отменить добавление';
			document.getElementById('addmark').title='Отменить добавление фотографии';
			values["action"]="addmarker";
			marksshow=false;
			markssh();
		}
	}
	
	function AddMarker(nmap) {
		var FotoIcon = new GIcon(G_DEFAULT_ICON); 
		FotoIcon.image = "http://warfly.ru/markers/icons/foto3_add.png"; 
		FotoIcon.shadow = "http://warfly.ru/markers/icons/foto2_shd.png"; 
		FotoIcon.iconSize=GSize({width:24, height:24});
		FotoIcon.iconAnchor.x=12;
		FotoIcon.iconAnchor.y=12;
		addmarker = new GMarker(nmap.getCenter(), {icon: FotoIcon, draggable: true});
		map.clearOverlays();
		map.addOverlay(addmarker);
		google.maps.event.addListener(addmarker, "dragend", function(event) { 
			addmarker.openInfoWindowHtml(
			'<div id="markinfoblock">'+
			'<form enctype="multipart/form-data" action="http://warfly.ru/markers/savemark.php" method="POST" id="commentform" target="_new">'+
			'<table width=100%>'+
				'<input type="hidden" name="MAX_FILE_SIZE" value="1000000">'+
				'<tr>'+
					'<td align=right width="24%"><label for="inputt">Фотография:</label></td>'+
					'<td><input name="userfile" type="file" id="inputt"/><label> (jpg,<1Мб)</label></td>'+
				'</tr>'+
				'<tr>'+
					'<td align=right width="24%"><label for="inputt">Дата съемки:</label></td>'+
					'<td><input name="date" id="date" type="text"><label> (ГГГГ-ММ-ДД)</label></td>'+
				'</tr>'+
				'<tr>'+
					'<td align=right width="24%"><label for="inputt">Источник:</label></td>'+
					'<td><input name="src" id="src" type="text" maxlength="30"></td>'+
				'</tr>'+
				'<tr>'+
					'<td align=right width="24%"><label for="inputt">Описание:</label></td>'+
					'<td><TEXTAREA name=desc id="desc" COLS=20 ROWS=5 maxlength="250"></TEXTAREA></td>'+
				'</tr>'+
				'<tr>'+
					'<td align=right width="24%"><label for="inputt">Направление съемки:</label></td>'+
					'<td align=left>'+
					'<P>'+
					'<TABLE>'+
						'<tr>'+
							'<td> <input type="radio" name="ang" value="315"> </td>'+
							'<td> <input type="radio" name="ang" value="0"> </td>'+
							'<td> <input type="radio" name="ang" value="45"> </td>'+
						'</tr>'+
						'<tr>'+
							'<td> <input type="radio" name="ang" value="270"> </td>'+
							'<td> <input type="radio" name="ang" value="-1" CHECKED> </td>'+
							'<td> <input type="radio" name="ang" value="90"> </td>'+
						'</tr>'+
						'<tr>'+
							'<td> <input type="radio" name="ang" value="225"> </td>'+
							'<td> <input type="radio" name="ang" value="180"> </td>'+
							'<td> <input type="radio" name="ang" value="135"> </td>'+
						'</tr>'+
					'</TABLE>'+
					'</P>'+
					'</td>'+
				'</tr>'+
				'<input name="lng" type="hidden" value='+addmarker.getPosition().lng().toFixed(6)+'>'+
				'<input name="lat" type="hidden" value='+addmarker.getPosition().lat().toFixed(6)+'>'+
				'<tr>'+
					'<td align=right width="24%"><a href="http://warfly.ru/2011/02/rules_add_foto/" target="_new">ПРАВИЛА</a></td>'+
					'<td align=right> <input type="submit" id="inputt" value="Добавить"></td>'+
				'</tr>'+
			'</table>'+
			'</form>'+
			'</div>'
			); 	
		});
		google.maps.event.clearListeners(map, "dragend");
		google.maps.event.addListener(map, "dragend", function(){
				if (!map.getBounds().contains(addmarker.getLatLng())) {
					addmarker.setLatLng(map.getCenter());
				} 
		});
	}
	
	function RedrawMarks() {
		var locations = {};
		downloadUrl('http://warfly.ru/markers/getmarksfromdb.php?LLng='+map_bounds.getSouthWest().x+'&RLng='+map_bounds.getNorthEast().x+'&TLat='+map_bounds.getNorthEast().y+'&BLat='+map_bounds.getSouthWest().y, function(data) {
				var xml = GXml.parse(data);
				if (xml.documentElement != null) {
					var markers = xml.documentElement.getElementsByTagName("marker");
					for (var i=0; i<markers.length; i++) {
						var latlng = new GLatLng(parseFloat(markers[i].getAttribute("lat")),parseFloat(markers[i].getAttribute("lng")));
						var store = {latlng: latlng, desc: markers[i].getAttribute("desc"), id: markers[i].getAttribute("id"), date: markers[i].getAttribute("date"), src: markers[i].getAttribute("src"), ang: markers[i].getAttribute("ang"), user: markers[i].getAttribute("user")};		
						//var xx = Math.floor(mrp.fromLatLngToPixel(latlng,map.getZoom()).x/10);
						//var yy = Math.floor(mrp.fromLatLngToPixel(latlng,map.getZoom()).y/10);
						var xx = Math.floor(map.getProjection().fromLatLngToPoint(latlng).x/10);
						var yy = Math.floor(map.getProjection().fromLatLngToPoint(latlng).y/10);
						var latlngHash = (xx + "_" + yy);
						if (locations[latlngHash] == null) {
							locations[latlngHash] = []
						}
						locations[latlngHash].push(store);
					}
				}
				map.clearOverlays();
				for (var latlngHash in locations) {
					var stores = locations[latlngHash];
					if (stores.length > 1) {
						map.addOverlay(createClusteredMarker(stores));
					} else {
						map.addOverlay(createMarker(stores));
					}
				}	
				//map.enableDragging();				
		});
		google.maps.event.clearListeners(map, "dragend");
		google.maps.event.addListener(map, "dragend", function(){
				if (marksshow) {
					//map.disableDragging();
					RedrawMarks();
				}
		});			
	}

	function confirmDelete() {  
		if (confirm("Вы подтверждаете удаление?")) {  
			return true;  
		} else {  
	        return false;  
		}  
	} 

	
	function createMarker(stores) {
	  var FotoIcon = new GIcon(G_DEFAULT_ICON);
	  var ang = parseInt(stores[0].ang);
	  if (ang>=0) {
		FotoIcon.image = "http://warfly.ru/markers/icons/foto_a"+((45*Math.round(ang / 45)) % 360)+".png"; 
		FotoIcon.shadow = "http://warfly.ru/markers/icons/foto_shd_a.png"; 
		FotoIcon.iconSize=GSize({width:20, height:20});
		FotoIcon.iconAnchor.x=10;
		FotoIcon.iconAnchor.y=10;
	  } else {
		FotoIcon.image = "http://warfly.ru/markers/icons/foto2.png"; 
		FotoIcon.shadow = "http://warfly.ru/markers/icons/foto2_shd.png"; 
		FotoIcon.iconSize=GSize({width:16, height:16});
		FotoIcon.iconAnchor.x=8;
		FotoIcon.iconAnchor.y=8;
	  }
      var marker = new GMarker(stores[0].latlng, {icon: FotoIcon, draggable: false});
      var llnk = 'javascript:OpenWindow("http://warfly.ru/markers/foto/'+stores[0].id+'.jpg");';
	  var username = '';
	  if (stores[0].user!='') {
	    username = '<label>Добавил пользователь: <b>'+stores[0].user+'</b></label><br/>';
	  }
	  var html = '<div id="markinfo">'+
	  '<div id="foto">'+//"http://warfly.ru/markers/foto/'+stores[0].id+'.jpg" target="_new"
	  '<a href='+llnk+'>'+
	  '<img src="http://warfly.ru/markers/foto/tumbs/'+stores[0].id+'.jpg" height=100 title=Посмотреть в полном размере/>'+
	  '<br/><img src="http://warfly.ru/markers/icons/find.png"><font size=1>&nbsp;просмотр</font>'+
	  '</a>'+
	  '</div>'+
	  '<label>Описание: </label><br/><div id="desc">'+stores[0].desc+'</div>'+
	  '<label>Дата съемки: '+stores[0].date+'</label><br/>'+
	  '<label>Источник: '+stores[0].src+'</label><br/>'+
	  username+
	  '<div style="text-align:right; margin-top:3px"><a href="http://warfly.ru/markers/delmarksfromdb.php?id='+stores[0].id+'" target="_new" onclick="return confirmDelete();"><img src="http://warfly.ru/markers/icons/delete.png"><font size=1>&nbsp;Удалить фото</font></a><div>'+
	  '<div>';
      google.maps.event.addListener(marker, 'click', function() {
        marker.openInfoWindowHtml(html);
      });
      return marker;
    }
 
	function cut2Sp(str,sc){
		ind = str.indexOf(' ',sc);
		if (ind==-1) ind=sc;
		return str.substring(0,ind);
	}
	
    function createClusteredMarker(stores) {
	  var FotoIcon = new GIcon(G_DEFAULT_ICON); 
	  FotoIcon.image = "http://warfly.ru/markers/icons/foto2.png"; 
	  FotoIcon.shadow = "http://warfly.ru/markers/icons/foto2_shd.png"; 
	  FotoIcon.iconSize=GSize({width:16, height:16});
	  FotoIcon.iconAnchor.x=8;
	  FotoIcon.iconAnchor.y=8;
      var marker = new GMarker(stores[0].latlng, {icon: FotoIcon});
      var html = '<div style="width:260; height: 200px; float: left; margin: 15px 0px 0px 0px; overflow:auto;"><TABLE>';
      for (var i = 0; i < stores.length; i++) {
		html +=
		'<TR>'+
			'<TD align=center valign=center><a href="http://warfly.ru/markers/foto/'+stores[i].id+'.jpg" target="_new"><img src="http://warfly.ru/markers/foto/tumbs/'+stores[i].id+'.jpg" height=40 title=Посмотреть в полном размере border=0/></a></TD>'+
			'<TD valign=center>'+cut2Sp(stores[i].desc,35)+'...<BR/><label>Дата съемки: '+stores[0].date+'</label></TD>'+
		'</TR>';
      }
	  html += "</TABLE><div>";
      google.maps.event.addListener(marker, 'click', function() {
		marker.openInfoWindowHtml(html);
      });
      return marker;
    }