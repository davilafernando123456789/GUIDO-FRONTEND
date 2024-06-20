import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sistema';
}


// import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit, AfterViewInit {
//   menuActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

//   ngOnInit(): void {}

//   ngAfterViewInit(): void {}

//   toggleMenu(): void {
//     this.menuActive$.next(!this.menuActive$.getValue());
//   }
// }
