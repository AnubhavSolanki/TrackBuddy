import { Component } from '@angular/core';  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  scrollFunction(id){
    let el = document.getElementById(id);
    el.scrollIntoView();
  }
}
