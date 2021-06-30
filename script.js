var lat, lng;
var map;
var marker = [];
var infowindow = [];
var markerdata = [];


//中央座標
var center = {
	lat: 35.57066599,
	lng: 139.37388145
};

window.onload = function() {
  iniMap(center);
}

//Google Map設定
function iniMap(center) {
	map = new google.maps.Map(document.getElementById("map"),{
		center: center,
		zoom: 10,
		clickableIcons: false,
		streetViewControl: false,
		fullscreenControl: false,
		styles: [{
			featureType: 'poi.medical',
			elementType: 'labels',
			stylers: [{ visibility: 'off' }]
		}]
	});
	const centerControlDiv = document.createElement("div");
	CenterControl(centerControlDiv, map);
	centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);

	getCSVfile();
}

//csv読み込み
function getCSVfile(){
	var data = new XMLHttpRequest();
    data.onload = function() {
		createArray(data.responseText);
    };
    data.open("get", "data.csv", true);
	data.send(null);
}

//医療機関のマーカーの設定
function createArray(csvData) {
    var tempArray = csvData.split("\n");
    var Data = new Array();
    for(var i = 0; i<tempArray.length;i++){
		Data[i] = tempArray[i].split(",");

		markerLatLng = new google.maps.LatLng({lat: Number(Data[i][3]), lng: Number(Data[i][4])});
		marker[i] = new google.maps.Marker({
			position: markerLatLng,
			map: map
		});

		link = Data[i][2];

		var text = '';
		text += Data[i][1].fontcolor("fuchsia").fontsize("4") + '</br>';
		text += '</br>';
		text += '外来(平日): '.fontsize("3") + setColor(Data[i][5]).fontsize("3") + '</br>';
		text += '外来(休日): '.fontsize("3") + setColor(Data[i][6]).fontsize("3") + '</br>';
		text += '入院: '.fontsize("3") + setColor(Data[i][7]).fontsize("3") + '</br>';
		text += '救急: '.fontsize("3") + setColor(Data[i][8]).fontsize("3") + '</br>';
		text += '</br>';
		text += 'クリックしてHPに飛びます'.fontsize("3") + '</br>';

		infowindow[i] = new google.maps.InfoWindow({
			content: '<div class="map">' + text + '</div>'
		});
		markerEvent(i, link);
    }
}

//マーカーの動作設定
function markerEvent(i, link){
	marker[i].addListener('mouseover', function(){
		infowindow[i].open(map, marker[i]);
	  });

	marker[i].addListener('mouseout', function(){
		infowindow[i].close(map, marker[i]);
	  });

	marker[i].addListener('click', function(){
		window.open(link, '_blank');
	  });
}

//マーカー設定
function toggleBounce(i) {
	if (marker[i].getAnimation() !== null) {
	  marker[i].setAnimation(null);
	} else {
	  marker[i].setAnimation(google.maps.Animation.BOUNCE);
	}
}

//受け入れ状況設定
function setColor(input){
	switch(input){
		case '通常':
			input = input.fontcolor('blue');
			break;
		case '一部制約あり':
			input = input.fontcolor('800080').bold();
			break;
		case 'なし':
			input = input.fontcolor("red").bold();
			break;
	}
	return input;
}

//マーカー表示切替ボタン設定
function CenterControl(controlDiv, map) {
	const controlUI = document.createElement("div");
	controlUI.style.backgroundColor = "#fff";
	controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
	controlUI.style.cursor = "pointer";
	controlUI.style.marginTop = "10px";
	controlUI.style.marginBottom = "22px";
	controlUI.style.textAlign = "center";
	controlUI.title = "マーカーの表示切替";
	controlDiv.appendChild(controlUI);
	const controlText = document.createElement("div");
	controlText.style.color = "rgb(25,25,25)";
	controlText.style.fontFamily = "Roboto,Arial,sans-serif";
	controlText.style.fontSize = "18px";
	controlText.style.lineHeight = "39px";
	controlText.style.paddingLeft = "17px";
	controlText.style.paddingRight = "17px";
	controlText.innerHTML = "マーカー";
	controlUI.appendChild(controlText);
	controlUI.addEventListener("click", () => {
		if(marker[1].getVisible() == true){
			for(var i = 0; i < marker.length; i++){
				marker[i].setVisible(false);
			}
		  }else{
			for(var i = 0; i < marker.length; i++){
				marker[i].setVisible(true);
			}
		  }
	});
  }