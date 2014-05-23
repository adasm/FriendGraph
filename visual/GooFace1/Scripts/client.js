//                                                          PLACES SET
function PlacesSet() {
    var setObj = {};
    this.add = function (key, position, imgUrl, link) {
        if (setObj[key] != null) {
            setObj[key].count++;
            setObj[key].imgUrls.push(imgUrl);
            setObj[key].links.push(link);
        }
        else {
           /* var marker = new google.maps.Marker({  
                position: position,   
                map: map,  
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + places.get(index).count + '|FF0000|000000'});
            google.maps.event.addListener(marker, 'click', function() { showSda(key); map.setCenter(position); });
           
            setObj[key] = {pos: position, count: 1, imgUrls: new Array(imgUrl), marker: marker};  */
            setObj[key] = {pos: position, count: 1, imgUrls: new Array(imgUrl), links: new Array(link)};
        }
    };
    this.contains = function (key) {
        return setObj[key] != null;
    };
    this.get = function (key) {
        return setObj[key];
    }
    this.getAll = function () {
        return setObj;
    }
}

//                                                          VARIABLES
var uid = "",
    accessToken = "", 
    MY_MAPTYPE_ID = "custom_style",
    map,
    places = new PlacesSet;
var cityCircle;
//var faces = [];

var ic = 1000, icm = 1000, icc = 0;

//                                                          CUSTOM MARKER
function CustomMarker(latlng, source, link) {
    this.latlng_ = latlng;
    this.source_ = source;
    this.link_ = link;
    
    this.setMap(map);

}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = function () {
    var link = this.link_;
    var me = this;
    var div = this.div_;
    if (!div) {
        div = this.div_ = document.createElement('DIV');
        div.style.border = "none";
        div.style.position = "absolute";
        div.style.paddingLeft = "0px";
        div.style.cursor = 'pointer';
        //div.style.backgroundColor = 'green';
        div.appendChild(this.source_);
        var panes = this.getPanes();
        //console.log(link);
        div.onclick = function () {
            window.open(link, '_blank');
            //var win = window.open(this.link_, '_blank');
        }
        panes.overlayImage.appendChild(div);
    }

    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
        div.style.left = point.x + 'px';
        div.style.top = point.y + 'px';
    }
};

CustomMarker.prototype.remove = function() {
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

CustomMarker.prototype.getPosition = function() {
    return this.latlng_;
};

//                                                          NUMBER MARKER
function NumberMarker(latlng, number) {
    this.latlng_ = latlng;
    this.number = number;
    //this.imgUrls = imgUrls;
    this.setMap(map);
}

NumberMarker.prototype = new google.maps.OverlayView();

NumberMarker.prototype.draw = function() {
    var me = this;
    var div = this.div_;
    if (!div) {
        div = this.div_ = document.createElement('DIV');
        div.style.border = "none";
        div.style.position = "absolute";
        // div.style.margin = "0 auto";
        div.style.marginBottom = 25 + "px";
        div.style.cursor = 'pointer';
        div.style.backgroundColor = 'white';
        div.style.height = 30 +"px";
        div.style.width = 30 +"px";
        div.style.border = "1px solid black";
        div.style.borderRadius = 15 + "px";
        
        div.innerHTML = div.innerHTML + '<p style = "text-align: center; position:relative;top:-11px; font-size: 17px; font-weight:bold; font-family:Arial">' + this.number + '</p>';
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
        
        //add element to clickable layer 
        this.getPanes().overlayMouseTarget.appendChild(div);

        // Add a listener - we'll accept clicks anywhere on this div, but you may want
        // to validate the click i.e. verify it occurred in some portion of your overlay.
        google.maps.event.addDomListener(div, 'click', function () {
            if (div.style.border == "1px solid black") {
                div.style.border = "2px solid red";
            }
            else {
                div.style.border = "1px solid black";
            }
            google.maps.event.trigger(me, 'click');
            //map.setZoom(7);
            map.setCenter(me.getPosition());
            //if(this) {
            
            //}
        });   
     
    }
    
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
        div.style.left = (point.x) + 'px';
        div.style.top = (point.y) + 'px';
    }
};

NumberMarker.prototype.remove = function() {
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

NumberMarker.prototype.getPosition = function() {
    return this.latlng_;
};

//                                                          SIDEBAR
function sbInit() {
    console.log("sbInit() - Start");
    $("#sidebar-list").selectable(true);
    $("#sidebar-list").hide();
    console.log("Initializing sidebar - Done");
}
function sbShow() {
    $("#sidebar-list").delay(5000).fadeIn(500);
}

//                                                          MAP
function initMaps() {
    console.log("initMaps() - Start");
    map = new google.maps.Map(document.getElementById("map-canvas"), { 
        zoom: 5, 
        center: new google.maps.LatLng(51.107778, 17.038333), 
        disableDefaultUI: !0, 
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    console.log("initMaps() - Done");

    google.maps.event.addListener(map, 'zoom_changed', function () {
        console.log(map.zoom)
    });
}

//                                                          FACEBOOK
function loginFB() {
    FB.login(function (response) {
        if (response.authResponse) {
            uid = response.authResponse.userID;
            accessToken = response.authResponse.accessToken;
            update();
        }
    }, { scope: "user_location,user_friends,friends_location" })
}
function initFB() {
    console.log("initFB() - Start");
    FB.init({
        appId: '623045327762516',
        cookie: true,
        status: true
    });
    $("#loginbutton,#feedbutton").removeAttr("disabled");
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            uid = response.authResponse.userID;
            accessToken = response.authResponse.accessToken;
            update();
        } else if (response.status === 'not_authorized') {
            loginFB();
        } else {
            loginFB();
        }
    });
    console.log("initFB() - Done");
}

//                                                          APP
function addMarker(position, imgUrl) {
    var imgSize = 25;
    var img = {
        url: imgUrl,
        size: new google.maps.Size(imgSize, imgSize),
        scaledSize: new google.maps.Size(imgSize, imgSize)
    };

    var img = document.createElement("img");
    img.src = imgUrl;
    img.style.border = "0px solid white";
    img.style.borderRadius = imgSize / 2 + "px";
    img.width = imgSize;
    img.height = imgSize;
    var marker = new CustomMarker(position, img);
}

function addNumberMarker(){
    $.each(places.getAll(), function(index) {
        formCircles(places.get(index).pos, places.get(index).count, 30, 50, 10, places.get(index).imgUrls, places.get(index).links);
        //google.maps.event.trigger(map, 'resize');
        google.maps.event.trigger(map, 'click');
    })

    NProgress.done();
}



//                                                          ROZRZUCANIE
function findChord(radius, imgSize) {
    var r = radius;
    var e = imgSize / 2;
    var h = Math.pow(e, 2) / (2 * r);
    var c = 2 * Math.sqrt(2 * h * r - Math.pow(h, 2));
    return c;
}

function findAlpha(radius, chord) {
    var r = radius;
    var c = chord;
    //console.log("findAlpha -> r: " + r + " | c: " + c);
    var cos = 1 - (Math.pow(c, 2) / (2 * Math.pow(r, 2)));
    var sin = Math.sqrt(1 - Math.pow(cos, 2));
    var alpha = sin * 180 / Math.PI;
    //console.log("findAlpha -> sin: " + sin + " | alpha: " + alpha);
    return alpha;
}

function formCircles(position, number, markerSize, imageSize, minDistance, imgUrls, links) {

    var marSize = markerSize;
    var imgSize = imageSize;
    var minDist = minDistance;
    var radiusPx = 0.5 * marSize + minDist + 0.5 * imgSize;
    var radiusM = radiusPx * 395;
    var scale = Math.pow(2, map.getZoom());
    var myCenter = position;
    var isShown = false;
    var faces = drawCircles(myCenter, number, imgSize, radiusPx, imgUrls, links);

    //var markerCenter = new google.maps.Marker({
    //    position: myCenter,
    //    map: map,
    //    title: 'Centrum'
    //});
    var markerCenter = new NumberMarker(myCenter, number);

    google.maps.event.addListener(markerCenter, 'click', function () {
        map.setZoom(8);
        map.setCenter(markerCenter.getPosition());
        if (!isShown) {
            for (var i = 0; i < faces.length; i++) {
                console.log("Wyœwietl");
                faces[i].setMap(map);
                //faces[i][1].setMap(map);
            }
            isShown = true;
        } else {
            for (var i = 0; i < faces.length; i++) {
                faces[i].setMap(null);
                //faces[i][1].setMap(null);
            }
            isShown = false;
        }
    });

    for (var i = 0; i < faces.length; i++) {
        faces[i].setMap(null);
        //faces[i][1].setMap(null);
    }

    //circleCenter = new google.maps.Circle({
    //    map: map,
    //    radius: 30 * 395 /2, //radiusM,
    //    fillColor: '#7bb47b',
    //    fillOpacity: .6,
    //    strokeColor: '#313131',
    //    strokeOpacity: .4,
    //    strokeWeight: .8
    //});
    //circleCenter.bindTo('center', markerCenter, 'position');
}
                                                /*
                                                    Zoom:   7           |   8     
                                                    Meters: 77500       |   39500
                                                    Pixels: 100         |   100
                                                    M/Px:   775         |   395
                                                    M/30Px: 23250       |   11850
                                                */
function drawCircles(center, number, imgSize, radius, imgUrls, links) {

    var index = 0;
    var radNum = 1;
    var alpha = findAlpha(radius * radNum, findChord(radius * radNum, imgSize));
    var maxOnRadius = Math.floor(360 / (alpha + 5));
    console.log("drawCircles -> alpha: " + alpha + " | MOR: " + maxOnRadius);
    var left = 0;
    var full = true;
    if (number < maxOnRadius) {
        full = false;
        left = number;
    }
    var bearing = 0;
    var faces = [];

    for (var i = 0; i < number; i++) {
        var imgUrl = imgUrls[i];
        var link = links[i];
        if (index == maxOnRadius) {
            index = 0;
            radNum++;
            alpha = findAlpha(radius * radNum, findChord(radius * radNum, imgSize));
            maxOnRadius = Math.floor(360 / (alpha + 5));
            if (number - i < maxOnRadius) {
                full = false;
                left = number - i;
            }
        }
        //circle = new google.maps.Circle({
        //    map: null,
        //    radius: imgSize * 395 / 2,
        //    fillColor: '#fff',
        //    fillOpacity: .6,
        //    strokeColor: '#313131',
        //    strokeOpacity: .4,
        //    strokeWeight: .8
        //});
        if (!full) bearing = index * (360 / left);
        else bearing = index * (360 / maxOnRadius);

        //var marker = new google.maps.Marker({
        //    position: google.maps.geometry.spherical.computeOffset(center, radNum * radius * 395, bearing),
        //    map: null,
        //    title: 'Osoba'
        //});
        var imgSize = 35;
        var img = {
            url: imgUrl,
            size: new google.maps.Size(imgSize, imgSize),
            scaledSize: new google.maps.Size(imgSize, imgSize)
        };

        var img = document.createElement("img");
        img.src = imgUrl;
        img.style.border = "0px solid white";
        img.style.borderRadius = imgSize / 2 + "px";
        img.width = imgSize;
        img.height = imgSize;
        var marker = new CustomMarker(google.maps.geometry.spherical.computeOffset(center, radNum * radius * 395, bearing), img, link);
        //circle.bindTo('center', marker, 'position');
        index++;
        //var temp = [marker, circle];
        var temp = marker;
        faces.push(temp);
    }
    //for (var i = 0; i < faces.length; i++) {
    //    faces[i][0].setMap(null);
    //    //faces[i][1].setMap(null);
    //}
    return faces;
}

//                                                          ROZRZUCANIE END



function gloc(locId, callback) {
    FB.api("/" + locId + "?fields=location", function (response) {
        callback(
            new google.maps.LatLng(
                parseFloat(response.location.latitude),
                parseFloat(response.location.longitude)
            )
        )
    })
}
function meloc(locId) {
    gloc(locId, function (position) {
        map.setCenter(position);
        places.add(locId, position);
    })
}

function anf(name, locId, position, imgUrl, link) {
    //$("#sidebar-list").append('<li class="ui-widget-content">' + name + '</li>');
    if (places.contains(position + "") == false) {
        places.add(locId, position, imgUrl, link);
    }
    ic--;
    icc++;
    if (icc > 20) {
        NProgress.set((icm - ic) / icm);
        icc = 0;
    }
    
}

function floc(name, locId, imgUrl, link) {
    gloc(locId, function (position) {
        anf(name, locId, position, imgUrl, link);
    })
}

var wait_iter = 20;
function wait_iter_func() {
    if (ic == 0) addNumberMarker();
    else {
        wait_iter--;
        if (wait_iter > 0) setTimeout(wait_iter_func, 300);
        else addNumberMarker();
    }
}

function update() {
    //sbShow();
    if (1 /*confirm("Batch?")*/) {
        FB.api("/me?fields=location,friends.fields(name,location,picture,link)&accessToken=" + accessToken, function (response) {
            meloc(response.location.id);
            ic = response.friends.data.length;
            icm = ic;
            $.each(response.friends.data, function (i, row) {
                if (typeof row.location != "undefined" && typeof row.location.id != "undefined") {
                    //var link = typeof row.link != "undefined" ? row.link : "";
                    floc(row.name, row.location.id, row.picture.data.url, row.link);
                } else ic--;
            })
        });
    } else {
        FB.api("/me?fields=location,friends.fields(name,location,picture)&accessToken=" + accessToken, function (response) {
            meloc(response.location.id);
            $.each(response.friends.data, function (i, row) {
                if (typeof row.location != "undefined" && typeof row.location.id != "undefined") {
                    floc(row.name, row.location.id, row.picture.data.url);
                }
            })
        })
    }

    setTimeout(wait_iter_func, 500);

    //addMarker(new google.maps.LatLng(50.0, 15.0), "https://fbcdn-profile-a.akamaihd.net/static-ak/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif")

   // formCircles(new google.maps.LatLng(50.0, 10.0), 100, 30, 50, 10, "https://fbcdn-profile-a.akamaihd.net/static-ak/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif");
   // formCircles(new google.maps.LatLng(50.0, 20.0), 60, 30, 50, 10, "https://fbcdn-profile-a.akamaihd.net/static-ak/rsrc.php/v2/y9/r/IB7NOFmPw2a.gif");
   // formCircles(new google.maps.LatLng(50.0, 30.0), 4, 30, 50, 10, "https://fbcdn-profile-a.akamaihd.net/static-ak/rsrc.php/v2/y9/r/IB7NOFmPw2a.gif");
}

$(function () {
    console.log("Starting Facebook Friends-Graph");
    //sbInit();
    NProgress.start();
    google.maps.visualRefresh = true;
    google.maps.event.addDomListener(window, "load", initMaps);
    $.ajaxSetup({ cache: true });
    $.getScript("//connect.facebook.net/en_UK/all.js", initFB);
    console.log("Done");
});