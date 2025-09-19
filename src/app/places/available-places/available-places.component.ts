import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

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
  private backendClient = inject(PlacesService);
  isFetching = false;
  error = signal(' ');

  ngOnInit() {
    this.isFetching = true;
    const subscription = this.backendClient
      .loadAvailablePlaces()
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
    this.backendClient.addPlaceToUserPlaces(selectedPlace.id)
    .subscribe({
        next: () => {
          console.log('Place added to user places');
        }
      });
  }
}
