import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appHilightBasic]',
})
export class HilightBasicDirective implements OnInit {
  @HostBinding('style.backgroundColor') bgColor: any = 'transparent';

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.elRef.nativeElement.style.backgroundColor = 'green';
  }

  @HostListener('mouseover') mouseOver(e: Event) {
    //
    this.bgColor = 'blue';
  }
  @HostListener('mouseleave') mouseLeave(e: Event) {
    //
    this.bgColor = 'green';
  }
}
