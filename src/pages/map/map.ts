import { Component, ViewChild, ElementRef } from '@angular/core';//
import { NavController, NavParams, IonicPage } from 'ionic-angular';

import { User } from '../../models/user';
import { UserService } from '../../providers/user.service';
import { MapService } from '../../providers/map.service';

declare var google;

 @IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'map.html'
})
export class MapPage {

@ViewChild('map') mapElement: ElementRef;//
  map: any;//
  start = '';//
  end = '';//
  stepDisplay = new google.maps.InfoWindow;
  directionsService = new google.maps.DirectionsService;//
  directionsDisplay = new google.maps.DirectionsRenderer({map: this.map});//
  markerArray = [];//
  markers: Array<any> = [];
  obj: Array<any> = [];
  loading: Boolean;

  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    private mapService: MapService
  ) {/*
    this.obj = [
      {lat: '-16.7637572', lng: '-48.3752378', title: 'marker', points: '5', info: 'just a marker'},
      {lat: '-10.5664562', lng: '-46.3751504', title: 'marker', points: '5', info: 'just a marker'},
      {lat: '-53.2667552', lng: '-43.3752304', title: 'marker', points: '5', info: 'just a marker'},
      {lat: '-42.7663542', lng: '-52.3792304', title: 'marker', points: '5', info: 'just a marker'},
      {lat: '-29.4667532', lng: '-49.3752304', title: 'marker', points: '5', info: 'just a marker'},
      {lat: '-30.5667222', lng: '-71.3852304', title: 'marker', points: '5', info: 'just a marker'},
      {lat: '-23.0667512', lng: '-12.3752594', title: 'marker', points: '5', info: 'just a marker'}
    ];*/
  }

  ionViewDidLoad(){
    var thus = this;
    const subscription = thus.mapService.getPlaces().subscribe(res => {
      var cds = [];
      var cd = [];
      var each = res.feed.entry;
      var l = each.length;
      for (let i = 0; i < l; i++) {
        cd.push({});
        cd[i].lat = each[i]['gsx$lat']['$t'];
        cd[i].lng = each[i]['gsx$lng']['$t'];
        cd[i].title = each[i]['gsx$title']['$t'];
        cd[i].points = each[i]['gsx$points']['$t'];
        cd[i].info = each[i]['gsx$info']['$t'];
        cds.push(cd[i]);
      }
      thus.obj = cds;
      thus.initMap();
    });
  }

  initMap() {
      let latLng = this.userService.userLatLng;
      let mapOptions = {
        center: latLng,
        zoom: 9,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      var infoWindow = new google.maps.InfoWindow({map: this.map});
      infoWindow.setPosition(latLng);
      infoWindow.setContent('Você está aqui!');
      this.map.setCenter(latLng);
      this.directionsDisplay.setMap(this.map);// 
      this.createMarkers(this.obj, infoWindow);
  }



  onChangeHandler() {
    if(this.start != '' && this.end != ''){
      this.calculateAndDisplayRoute(
          this.directionsDisplay, this.directionsService, this.markerArray, this.stepDisplay, this.map);
    }
  }

  cleanMarkers() {
    for (var i=0; i < this.markers.length; i++) {
      this.markers[i].setMap(null); 
    }
  }

  createMarker(obj, image, iw) {      
    var sponsor = '<strong style="color:#000000;">Abutres MC</strong> <p2>Sub-Sede:</p2>';
    var emailString = '<a href="mailto:abutres13mc@gmail.com">abutres13mc@gmail.com</a>';
    
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        obj.lat, 
        obj.lng
      ),
      title: obj.info,
      //animation: google.maps.Animation.DROP,
      icon: image

    });
    
    marker.setMap(this.map);
    this.markers.push(marker);
    
    marker.addListener('click', function(){
      iw.open(this.map, marker);            
      iw.setContent('<div id="content">'+
      '<h4 id="firstHeading" class="firstHeading" style="margin: 0 0 5px!important;">'+sponsor+'</h4>'+//logo+'<br>'+
      '<h4 style="margin: 0 0 5px!important;">'+obj.title+'</h4>'+
      '<div id="bodyContent">'+
      '<p>'+obj.info+'</p>'+
      '<p>'+emailString+'</p>'+
      '</div>'+
      '</div>');
    });
    }

  calculateAndDisplayRoute(dd, ds, ma, sd, m) {

  for (var i = 0; i < ma.length; i++) {//
        ma[i].setMap(null);//
    }//

    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      //console.log(response);
      if (status === google.maps.DirectionsStatus.OK) {
        dd.setDirections(response);
      //showSteps(response, ma, sd, m);//
      // this.infoTxt="" + response.routes[0].legs[0].distance.text +' - '
      //                 + response.routes[0].legs[0].duration.text;
      //console.log(this.infoTxt);
       

      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  createMarkers(obj, iw){
    //this.cleanMarkers();
    for (var i=0; i < obj.length; i++) {
      var image = 'data:image/png;base64,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';
      
      this.createMarker (obj[i],image, iw);
    }
  }

  
  
}
