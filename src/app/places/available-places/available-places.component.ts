import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);
  isFetching = false;
  error = signal(' ');

  ngOnInit() {
    this.isFetching = true;
    const subscription = this.httpClient
      .get<{ places: Place[] }>(`http://localhost:3000/places`)
      .pipe(
        map((resData) => resData.places),
        catchError(() => throwError(() => new Error('Failed to fetch places')))
      )
      .subscribe({
        next: (resData) => {
          this.places.set(resData);
        },
        complete: () => {
          this.isFetching = false;
        },
        error: (error) => {
          this.error.set(error.message);
          this.isFetching = false;
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

  }

  onSelectPlace(selectedPlace: Place) {
    this.httpClient.put(`http://localhost:3000/user-places`, {
      placeId:selectedPlace.id }).subscribe({
        next: () => {
          console.log('Place added to user places');
        }
      });
  }
}
