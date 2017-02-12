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
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        var socket = io.connect('http://valentine-app.herokuapp.com');
        $('body').on('click', 'img.swipeMe', function() {
  			$.ajax({
    			type: "POST",
    			url: 'http://valentine-app.herokuapp.com/gift/'+this.id+'/vote',
    			data: this.id,
    			success: function(data) { console.log("ajax worked"); },
    			error: function(data) {console.log("ajax error"); },
    			dataType: 'json'
			});
		});
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
    		
  			
      		for(var i=0; i< mapData.length; i++){
      			marker = new google.maps.Marker({
            		position: new google.maps.LatLng(mapData[i].lat, mapData[i].lng),
            		map: map,
            		img: mapData[i].pic,
            		upvotes:mapData[i].upvotes,
            		name:mapData[i].name
            		//label: mapData[i].name
          		});
          		
          		google.maps.event.addListener(marker, 'click', (function(marker, i) {
          			var infoWindowContent = 
          		    '<a>' + '<h3>'+mapData[i].name+'</h3>'+
        				'<img class="swipeMe" id='+mapData[i]._id+' style="border:2px solid black;height:200px;width:200px;" src='+mapData[i].pic+'></img>' +
        			'</a>'+
        			'<h4>'+mapData[i].upvotes+'</h4>';
            		return function() {
                		infoWindow.setContent(infoWindowContent);
                		infoWindow.open(map, marker);
            		}
        		})(marker, i));
      		}
        	socket.emit('my other event', { my: 'data' });
      	});
    }
};
