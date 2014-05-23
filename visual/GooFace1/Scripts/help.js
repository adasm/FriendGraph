   
function changeSpanText(location, is_long)
{   
    
    var tekst = new String();
        
    //http://www.movable-type.co.uk/scripts/latlong.html
    //http://en.wikipedia.org/wiki/Geographic_coordinate_conversion
    //http://www.togis.com/address_geodecoder/index_ger.html
    //Pantera jest bardzo niedobra
        
    var degrees = Math.abs(location); //wspo³rzedne bezwzgledne - obs³uga kierunku zajmiemy sie pozniej/absolut cordinates, 
    var gps_degrees = parseInt(degrees);
    var auxiliary1 = degrees - (gps_degrees * 1.0);
    var gps_minutes = auxiliary1 * 60.0;
    var auxiliary2 = gps_minutes - (parseInt(gps_minutes)*1.0);
             
    tekst = degrees + "°\r\n " 
	+gps_degrees + "° " +gps_minutes + "'  \r\n " 
	+ gps_degrees + "° " + parseInt(gps_minutes) +"'  " + parseInt(auxiliary2*60.0)+ "\""; //prepare string with coordinates
        
    if (is_long == 1) { //is it longitude?
        document.getElementById('latitude_coordinates').innerText = tekst; //change data in field
        if ( location >= 0 ) document.getElementById('latitude_sign').innerText = "N";//determine direct
        else document.getElementById('latitude_sign').innerText = "S";
    
    } else {
		 
        document.getElementById('longitude_coordinates').innerText = tekst;
        if ( location >= 0 ) document.getElementById('longitude_sign').innerText = "E";
        else document.getElementById('longitude_sign').innerText = "W";
		 
		 
    }
}

var geocoder;
var map;
  
function initialize() {
  
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(52,19.5);  //wspolrzedne geograficznego srodka polski - miejscowaosc Piatek
    var myOptions = {
        zoom: 6,  //powiekszenie
        center: latlng, //wycentruj na ta zmienna
        mapTypeControl: true, //wylacz przelacznik terain/map/hybryda
        navigationControl: true, //wlacz panel nawigacyjny
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}, //ustaw na mini panel
        disableDoubleClickZoom: true, //wylacz powiekszenie na podwojne klikniecie
        mapTypeId: google.maps.MapTypeId.ROADMAP //typ mapy roadmap
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
    google.maps.event.addListener(map, 'dblclick', function(event) {
        placeMarker(event.latLng);
    });
}

function placeMarker(location) {
 
    var clickedLocation = new google.maps.LatLng(location);
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable:true
    });
	
    google.maps.event.addListener(marker, 'drag' , function(event){
        changeSpanText(marker.position.lng(), 0);
        changeSpanText(marker.position.lat(), 1);
	  
    });
	
    google.maps.event.addListener(marker, 'click', function(event){
        changeSpanText(marker.position.lng(), 0);
        changeSpanText(marker.position.lat(), 1);
	  
    });
	
    changeSpanText(location.lng(), 0);
    changeSpanText(location.lat(), 1);
  
    map.setCenter(location);
}