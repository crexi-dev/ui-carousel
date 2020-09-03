import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'dots',
    styleUrls : ['./dots.css'],
    templateUrl: './dots.html'
})

export class DotsComponent implements OnInit {

    numbers: Array<number>;

    @Input('active-dot') activeDot = 0;
    @Input('dots-count') dotsCount: number;

    @HostBinding('class')
    @Input() position = 'left';

    @Output('on-click') onClick= new EventEmitter<number>();

    ngOnInit () {

        this.numbers = Array(this.dotsCount).fill(0).map((x, i) => i);

    }

    click (index: number) {

        this.onClick.emit(index);
        this.activeDot = index;

    }

}
