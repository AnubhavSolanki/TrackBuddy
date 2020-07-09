import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import {AgmMap  } from '@agm/core';
import * as io from 'socket.io-client';
import {} from 'googlemaps';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @ViewChild(AgmMap,{static: true}) public agmMap: AgmMap;
  @ViewChild('myName') myName: ElementRef;
  @ViewChild('friendName') friendName: ElementRef;
  socket: SocketIOClient.Socket;
  myLocationLongitude:number;
  myLocationLatitude:number;
  my_name:string;
  friend_name:string;
  friendLongitude:number;
  friendLatitude:number;
  zoom:number = 14;
  myIcon:string='https://img.icons8.com/color/40/000000/marker.png';
  friendIcon:string='https://img.icons8.com/color/48/000000/boy-avatar.png';

  constructor() {
    this.socket = io.connect('https://peaceful-ridge-27523.herokuapp.com/');
  }

  


  getMylocation() {  
    if (navigator.geolocation) {  
        navigator.geolocation.getCurrentPosition((position: Position) => {  
            if (position) { 
              this.myLocationLatitude = position.coords.latitude;
              this.myLocationLongitude = position.coords.longitude;  
            } 
        })  
    }
  }
  


  onMouseOver(infoWindow) {
    infoWindow.open();
  }
  onMouseOut(infoWindow) {
    infoWindow.close();
  }
  
  
  moveMarker(i,previousLocation,delta){
    {
        previousLocation.longitude += delta.longitude;
        previousLocation.latitude += delta.latitude;
        this.friendLatitude = previousLocation.latitude;
        this.friendLongitude = previousLocation.longitude;
        if(i <= 100){
          i++;
          setTimeout(()=>{this.moveMarker(i,previousLocation,delta);},10);
        }
     }
   }
  
  


  scrollFunction(id){
    let el = document.getElementById(id);
    el.scrollIntoView();
  }

 
  animate(friendLocation,previousLocation){
    let i=0;
    let delta = {
    latitude : (friendLocation.latitude - previousLocation.latitude)/100,
    longitude : (friendLocation.longitude - previousLocation.longitude)/100
    }
    this.moveMarker(i,previousLocation,delta);
  }
 

  showfriendLocation(){
    let runOnce =true;
    this.my_name =this.myName.nativeElement.value;
    this.friend_name = this.friendName.nativeElement.value;
    let previousLocation={
      latitude : 123,
      longitude : 456
    };
    let myDetails = {
      name : this.my_name,
      friendName : this.friend_name,
      latitude : this.myLocationLatitude,
      longitude : this.myLocationLongitude
    }
    document.getElementById('mapBox').style.display = "block";
    this.socket.emit("sendMyDetails",myDetails);
    this.socket.on(this.friend_name+'-'+this.my_name,friendLocation=>{
      if(runOnce){
        this.friendLatitude = friendLocation.latitude;
        this.friendLongitude = friendLocation.longitude;
        runOnce = false;
        previousLocation.latitude = friendLocation.latitude;
        previousLocation.longitude = friendLocation.longitude;
        this.socket.emit("sendMyDetails",myDetails);
      }else{
        this.animate(friendLocation,previousLocation);
      }
    });
  }



  ngOnInit(): void {
    this.getMylocation();
    if(navigator.geolocation){
      navigator.geolocation.watchPosition(position=>{
        let myDetails = {
          name : this.my_name,
          friendName : this.friend_name,
          latitude : position.coords.latitude,
          longitude : position.coords.longitude
        };
        this.socket.emit("sendMyDetails",myDetails);
      } ,()=>{console.log("error occured");} , {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      });
    }
  }

}
