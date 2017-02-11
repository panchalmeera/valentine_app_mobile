/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        var socket = io.connect('http://valentine-app.herokuapp.com');
    	var mapData=[];
      	socket.on('gifts', function (data) {
      		mapData = data;
      		var longitude = mapData[0].lng;
    		var latitude = mapData[0].lat;
    		var latlong = new google.maps.LatLng(latitude,longitude);
    		var mapOptions = {
    			center: latlong,
    			zoom: 3,
    			mapTypeId: google.maps.MapTypeId.ROADMAP
    		};
    		var infoWindow = new google.maps.InfoWindow(), marker;
    		var map = new google.maps.Map(document.getElementById("geolocation"),mapOptions);
    		var addSwipeTo = function(selector) {  
         		$(selector).swipe("destroy");
         		$(selector).swipe({
            		//Generic swipe handler for all directions
            		swipe:function(event, direction, distance, duration, fingerCount) {
              			//$(this).text("You swiped " + direction );  
              			alert("sdfsdf");
            		},
            		//Default is 75px, set to 0 for demo so any distance triggers swipe
             		threshold:0
          		});
    		};
      		for(var i=0; i< mapData.length; i++){
      			marker = new google.maps.Marker({
            		position: new google.maps.LatLng(mapData[i].lat, mapData[i].lng),
            		map: map,
            		img: mapData[i].pic,
            		upvotes:mapData[i].upvotes,
            		name:mapData[i].name
            		//label: mapData[i].name
          		});
          		var infoWindowContent = 
          		    '<a id="doSwipe">' +
        				'<img src='+mapData[i].pic+'></img>' +
        			'</a>';
          		google.maps.event.addListener(marker, 'click', (function(marker, i) {
            		return function() {
                		infoWindow.setContent(infoWindowContent);
                		infoWindow.open(map, marker);
                		addSwipeTo(".doSwipe");
            		}
        		})(marker, i));
      		}
        	socket.emit('my other event', { my: 'data' });
      	});
    }
};
