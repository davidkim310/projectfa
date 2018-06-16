import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { IActivity } from '../../shared/activity.model';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { GeoJson, FeatureCollection } from './map';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  /// default settings
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v9';
  lat = 34.0522;
  lng = -118.2437;
  markers;
  activities;
  zoomThreshold;
  constructor(private mapService: MapService) { }

  ngOnInit() {
    // this.initializeMap();
    this.mapService.loadDummyData()
      .subscribe(data => {
        this.markers = data;
      });
  }

  ngAfterViewInit() {
    this.buildMap();
  }

  flyToUser() {
    /// locate the user
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(position => {
    //     this.lat = position.coords.latitude;
    //     this.lng = position.coords.longitude;
    //     this.map.flyTo({
    //       center: [this.lng, this.lat]
    //     });
    //   });
    // }
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 2,
      center: [this.lng, this.lat],
      trackResize: true,
      interactive: true
    });
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
          enableHighAccuracy: true
      },
      trackUserLocation: true
  }));
    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    // this.loadLocations();
    this.addLayer();
  }

  addLayer() {
    this.map.on('load', () => {
      this.map.addSource('pointsSource', {
        type: 'geojson',
        data: this.markers
      });
      this.map.addLayer({
        id: 'points',
        source: 'pointsSource',
        type: 'heatmap'
      });
    });
  }

}


// loadLocations() {
//   // make a marker for each feature and add to the map
//   this.markers.features.forEach(marker => {
//     //     // create a HTML element for each feature
//     const el = document.createElement('div');
//     el.className = 'markers';
//     // tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
//     el.style.cssText = 'background-image: url("../../../assets/mapmarker.png");background-size: cover;width: 20px;height: 20px;border-radius: 50%;cursor: pointer;';
//     new mapboxgl.Marker(el)
//       .setLngLat(marker.geometry.coordinates)
//       .addTo(this.map);
//   });
// }
