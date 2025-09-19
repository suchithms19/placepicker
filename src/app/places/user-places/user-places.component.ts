import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {

  places = signal<Place[] | undefined>(undefined);
    private destroyRef = inject(DestroyRef);
    private httpClient = inject(HttpClient);
    isFetching = false;
    error = signal(' ');
  
    ngOnInit() {
      this.isFetching = true;
      const subscription = this.httpClient
        .get<{ places: Place[] }>(`http://localhost:3000/user-places`)
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
}
