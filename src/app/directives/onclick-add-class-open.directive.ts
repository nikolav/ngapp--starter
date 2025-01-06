import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnclickAddClassOpen]',
})
export class OnclickAddClassOpenDirective {
  @HostBinding('class.open') isOpen = false;
  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
