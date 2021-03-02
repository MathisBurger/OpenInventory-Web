import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector} from '@angular/core';
import {PopupWindowComponent} from "./popup-window.component";

@Injectable({
  providedIn: 'root'
})
export class PopupWindowService {

  popup: any;

  // basic values for service in constructor
  constructor(
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  // shows component
  showAsComponent(message: string, color: string) {

    // create element
    const popup = document.createElement('app-alert-window');


    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const popupComponentRef = factory.create(this.injector, [], popup);
    this.applicationRef.attachView(popupComponentRef.hostView);

    // Set message and color
    popupComponentRef.instance.message = message;
    popupComponentRef.instance.color = color;

    // Add to the DOM
    document.body.appendChild(popup);
    this.popup = popup;
  }

  // closes popup after given time
  closePopup(timeout: number): void {
    setTimeout(() => {
      document.body.removeChild(this.popup);
    }, timeout);
  }
}
