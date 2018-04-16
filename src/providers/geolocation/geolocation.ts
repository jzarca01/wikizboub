import { Injectable } from '@angular/core';
import { LatLng } from '@ionic-native/google-maps';

@Injectable()
export class GeolocationProvider {

  private locations: LatLng[];
  private referential: LatLng;

  constructor() {
    this.locations = [];
  }

  getLength(): number {
    return this.locations.length;
  }

  addLocation(newLocation: LatLng): void {
    this.locations.push(newLocation);
  }

  setNewReferential(location: LatLng) {
    this.referential = location;
  }


  getDistanceFromReferential(): number {
    var deg2Rad = deg => {
      return deg * Math.PI / 180;
    }

    const referential = this.referential;
    const lastLocation = this.locations.length ? this.locations[length - 1]: this.referential;

    var r = 6371; // Radius of the earth in km
    var dLat = deg2Rad(lastLocation.lat - referential.lat);
    var dLon = deg2Rad(lastLocation.lng - referential.lng);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2Rad(referential.lat)) * Math.cos(deg2Rad(lastLocation.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = r * c; // Distance in km
    return d;
  }
}

