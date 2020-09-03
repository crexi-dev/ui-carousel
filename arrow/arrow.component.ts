import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'arrow',
    styleUrls: ['./arrow.css'],
    templateUrl: './arrow.html'
})

export class ArrowComponent {

    @Input() dir: string;
    @Input() disabled = true;

    @Output('on-click') click: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    onClick() {

        if (!this.disabled) {

            this.click.emit();

        }

    }

}
