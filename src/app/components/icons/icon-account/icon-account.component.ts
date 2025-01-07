import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-account',
  templateUrl: './icon-account.component.html',
})
export class IconAccount {
  @Input() size: any = '1em';
}
