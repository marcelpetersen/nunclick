import { Component, ViewChild, ElementRef } from '@angular/core';//
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";

import { User } from '../../models/user';
import { UserService } from '../../providers/user.service';

import { IonicPage } from 'ionic-angular';

declare var google;//


 @IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'route.html'
})
export class RoutePage {

@ViewChild('map') mapElement: ElementRef;//
  map: any;//
  start = '';//
  end = '';//
  stepDisplay = new google.maps.InfoWindow;
  directionsService = new google.maps.DirectionsService;//
  directionsDisplay = new google.maps.DirectionsRenderer({map: this.map});//
  markerArray = [];//
  infoTxt: string = '';



  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,

  ) {
  
  }

  ionViewDidLoad(){//
    this.initMap();
  }

  initMap() {
   
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 19,
      center: {lat: -23.5667572, lng: -46.3752304},
      mapTypeId: google.maps.MapTypeId.HYBRID,
      fullscreenControl: false
    });

    this.directionsDisplay.setMap(this.map);//

    

    //this.directionsDisplay.setPanel();
    
  }




  onChangeHandler() {
    if(this.start != '' && this.end != ''){
      this.calculateAndDisplayRoute(
          this.directionsDisplay, this.directionsService, this.markerArray, this.stepDisplay, this.map);
    }
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
        showSteps(response, ma, sd, m);//
        this.infoTxt="" + response.routes[0].legs[0].distance.text +' - '
                        + response.routes[0].legs[0].duration.text;
        //console.log(this.infoTxt);
       

      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  
  
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
        marker.setMap(map);
        marker.setPosition(myRoute.steps[i].start_location);
        attachInstructionText(
            stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
}

function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}
