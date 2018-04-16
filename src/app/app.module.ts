import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";

import { HttpClientModule } from "@angular/common/http";
import { GoogleMaps } from "@ionic-native/google-maps";
import { IonicStorageModule } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation";
import { NativeStorage } from "@ionic-native/native-storage";

import { WikiProvider } from "../providers/wikipedia/wikipedia";
import { GeolocationProvider } from "../providers/geolocation/geolocation";

@NgModule({
  declarations: [MyApp, HomePage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Geolocation,
    GeolocationProvider,
    NativeStorage,
    HttpClientModule,
    WikiProvider
  ]
})
export class AppModule {}
