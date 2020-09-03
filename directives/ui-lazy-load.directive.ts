import { Directive, ElementRef, Input } from '@angular/core';
@Directive({ selector: '[ui-lazy-load]' })
export class UILazyloadDirective {

    @Input('ui-lazy-load') uiLazyLoad: string;

    constructor(private el: ElementRef) { }

    load () {

        const img = this.el.nativeElement;
        if (img.src) {

            return;

        }
        img.src = this.uiLazyLoad;

    }

}
