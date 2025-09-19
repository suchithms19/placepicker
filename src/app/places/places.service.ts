import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.getResponseData('http://localhost:3000/places','Failed to fetch places');
  }

  loadUserPlaces() {
    return this.getResponseData('http://localhost:3000/user-places','Failed to fetch user places');
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put(`http://localhost:3000/user-places`, {
      placeId
    });
  }

  removeUserPlace(place: Place) {}


  getResponseData(url: string,errorMessage: string) {
    return this.httpClient
      .get<{ places: Place[] }>(url)
      .pipe(
        map((resData) => resData.places),
        catchError(() => throwError(() => new Error(errorMessage)))
      )
  }

}
