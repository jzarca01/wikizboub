import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavController, Platform, FabContainer } from "ionic-angular";

import {
  GoogleMap,
  GoogleMaps,
  LatLng,
  GoogleMapsEvent,
  Marker,
  MarkerOptions,
  MarkerIcon,
  HtmlInfoWindow
} from "@ionic-native/google-maps";
import { MarkerItem } from "../../../typings/markerItem";

import { Geolocation } from "@ionic-native/geolocation";

import { WikiProvider } from "../../providers/wikipedia/wikipedia";
import { GeolocationProvider } from "../../providers/geolocation/geolocation";
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  @ViewChild("map") mapElement: ElementRef;
  private markers: MarkerItem[];
  private marker: Marker;
  private map: GoogleMap;
  private location: LatLng;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private geolocation: Geolocation,
    private wikiProvider: WikiProvider,
	private geoProvider: GeolocationProvider,
	private nativeStorage: NativeStorage
  ) {
	  this.nativeStorage.getItem("wikizboub")
	  .then(
		  data => {
			  this.location = data.location;
		  },
		  error => {
				this.location = new LatLng(48.346903, 2.135101);
		  }
	  )
    this.geoProvider.setNewReferential(this.location);
    this.markers = [];
  }

  ionViewDidLoad(): void {
    this.platform.ready().then(() => {
      const element = this.mapElement.nativeElement;
      this.map = GoogleMaps.create(element);

      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        const options = {
          target: this.location,
          zoom: 16
        };

        this.map.moveCamera(options);
        this.addMarker(this.location);

        this.geolocation
          .watchPosition({
            timeout: 10 * 1000,
            maximumAge: 60 * 10 * 1000,
            enableHighAccuracy: true
          })
          .subscribe(async data => {
            if (data.coords) {
              const newLocation: LatLng = new LatLng(data.coords.latitude, data.coords.longitude);
			  this.geoProvider.addLocation(newLocation);
			  this.nativeStorage.setItem('wikizboub', {location: newLocation});

              this.moveMarker(newLocation);
              this.map.moveCamera({
                target: newLocation
              });

              if (this.shouldUpdateMarkers()) {
                this.geoProvider.setNewReferential(newLocation);
                this.wikiProvider
                  .getPagesByLocation(data.coords.latitude, data.coords.longitude)
                  .subscribe(data => {
                    data.map(wikiElement => {
                      const wikiPosition = new LatLng(wikiElement.lat, wikiElement.lon);
                      this.addWikiMarker(wikiPosition, wikiElement.title, wikiElement.pageid);
                    });
				});
              }
            }
          });
      });
    });
  }

  shouldUpdateMarkers(): boolean {
    return (
      this.geoProvider.getLength() === 1 ||
      this.geoProvider.getDistanceFromReferential() > 0.05
    );
  }

  moveMarker(location: LatLng): void {
    if (this.marker != null) {
      this.marker.setPosition(location);
      this.map.addMarker(this.marker);
    }
  }

  addMarker(location: LatLng): void {
    const icon: MarkerIcon = {
      url: "./assets/imgs/user.png",
      size: {
        width: 50,
        height: 50
      }
    };
    const newMarker: MarkerOptions = {
      icon: icon,
      position: location
    };

    this.map.addMarker(newMarker).then(marker => {
      this.marker = marker;
    });
  }

  addWikiMarker(location: LatLng, title: string, wikiId: number): void {
    if (!this.markers || !this.markers.filter(x => x.id === wikiId).length) {
      const newMarker: MarkerOptions = {
        title: title,
        icon: "blue",
        animation: "DROP",
        position: location
      };

      const infoWindow: HtmlInfoWindow = new HtmlInfoWindow();

      this.map.addMarker(newMarker).then(marker => {
        this.markers.push({
          id: wikiId,
          marker: this.marker
        });
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          infoWindow.setContent(`<h1>${title}</h1>
				<br />
				<a href="https://fr.wikipedia.org/?curid=${wikiId}" target="_blank">Voir la page</a>
				<br />`);
          infoWindow.open(marker);
        });
      });
    }
  }

  showThisMarkers(fab: FabContainer) {
    alert(this.geoProvider.getLength());
    fab.close();
  }
}
