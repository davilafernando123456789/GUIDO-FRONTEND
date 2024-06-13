import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCreditCard]'
})
export class CreditCardDirective {
  private regex: RegExp = new RegExp(/^\d{0,16}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = this.el.nativeElement.value.replace(/\s+/g, '');
    if (!String(event.key).match(/^[0-9]$/) || !current.match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let formatted = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = formatted.match(/\d{1,4}/g);
    if (matches) {
      formatted = matches.join(' ');
      input.value = formatted;
    }
  }
}
