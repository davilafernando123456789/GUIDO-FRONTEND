import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appExpiryDate]'
})
export class ExpiryDateDirective {
  private regex: RegExp = new RegExp(/^\d{0,4}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = this.el.nativeElement.value.replace(/\//g, '');
    if (!String(event.key).match(/^[0-9]$/) || !current.match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let formatted = input.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
    if (formatted.length >= 3) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
    }
    input.value = formatted;
  }
}
