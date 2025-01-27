import {
  inject,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  // Renderer2,
} from "@angular/core";

@Directive({
  selector: "[appHilightBasic]",
})
export class HilightBasicDirective implements OnInit {
  // reference element directive sits on
  private host = inject(ElementRef);

  @HostBinding("style.backgroundColor") bgColor: any = "transparent";

  // constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.host.nativeElement.style.backgroundColor = "green";
  }

  @HostListener("mouseover") mouseOver(e: Event) {
    //
    this.bgColor = "blue";
  }
  @HostListener("mouseleave") mouseLeave(e: Event) {
    //
    this.bgColor = "green";
  }
}
