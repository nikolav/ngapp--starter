import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Foobar } from './foobar/foobar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Foobar],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  id = '61b97ab7-e5c1-5697-8182-590fcdfe16fa';
  title = 'NGApp';

  public ngOnInit(): void {
    console.log('@ngOnInit');
  }
}
