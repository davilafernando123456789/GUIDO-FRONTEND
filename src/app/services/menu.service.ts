// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class MenuService {
//   private menuActive = new BehaviorSubject<boolean>(false);
//   menuActive$ = this.menuActive.asObservable();

//   toggleMenu() {
//     this.menuActive.next(!this.menuActive.getValue());
//   }

//   getMenuState() {
//     return this.menuActive.getValue();
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuActive = new BehaviorSubject<boolean>(false);
  menuActive$ = this.menuActive.asObservable();

  toggleMenu() {
    this.menuActive.next(!this.menuActive.getValue());
  }

  getMenuState() {
    return this.menuActive.getValue();
  }
}


// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class MenuService {
//   private menuActive = new BehaviorSubject<boolean>(false);
//   menuActive$ = this.menuActive.asObservable();

//   toggleMenu() {
//     this.menuActive.next(!this.menuActive.getValue());
//   }
// }
