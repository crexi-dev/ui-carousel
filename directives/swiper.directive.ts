import { Directive, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

const ZERO = 0.000000000001;

@Directive({
    exportAs: 'swiper',
    selector: '[swiper]'
})
export class SwiperDirective implements OnInit {

    static canISwipe = true;

    firstSwipeDate = Date.now();
    initialPos: number = ZERO;
    isDown = false;
    lastPos: number = ZERO;
    swipeDistance: number = ZERO;

    @Output() onSwipeEnd: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSwipeLeft: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSwipeRight: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSwipeStart: EventEmitter<any> = new EventEmitter<any>();
    @Output() swipeLeft: EventEmitter<any> = new EventEmitter<any>();
    @Output() swipeRight: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit () {

        this.swipeLeft.subscribe(() => {

            SwiperDirective.canISwipe = false;
            setTimeout(() => {

                SwiperDirective.canISwipe = true;

            }, 350);

        });
        this.swipeRight.subscribe(() => {

            SwiperDirective.canISwipe = false;
            setTimeout(() => {

                SwiperDirective.canISwipe = true;

            }, 350);

        });

    }

    @HostListener('mousedown', ['$event'])
    onMouseDown (event: any) {

        if (!SwiperDirective.canISwipe) {

            return;

        }
        this.firstSwipeDate = Date.now();
        this.isDown = true;
        this.initialPos = event.clientX;
        this.swipeDistance = 0;
        this.onSwipeStart.emit();

    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp () {

        if (!this.isDown) {

            return;

        }
        this.initialPos = this.lastPos = ZERO;
        this.isDown = false;

        if (this.swipeDistance > 100) {

            this.swipeLeft.emit();

        } else if (this.swipeDistance < -100) {

            this.swipeRight.emit();

        } else {

            this.onSwipeEnd.emit();

        }
        this.swipeDistance = ZERO;

    }

    @HostListener('mousemove', ['$event'])
    onMouseMove (event: any) {

        if (this.isDown) {

            const swipeFrameDistance = event.clientX - this.initialPos - this.lastPos;
            this.swipeDistance += swipeFrameDistance;
            this.lastPos = event.clientX - this.initialPos;

            if (swipeFrameDistance > 0) {

                this.onSwipeLeft.emit(swipeFrameDistance);

            } else {

                this.onSwipeRight.emit(swipeFrameDistance);

            }

        }

    }

    @HostListener('touchmove', ['$event'])
    onTouchMove (event: any) {

        if (!SwiperDirective.canISwipe) {

            return;

        }

        const touch = event.touches[0] || event.changedTouches[0];
        let swipeFrameDistance = touch.clientX - this.initialPos - this.lastPos;
        swipeFrameDistance = swipeFrameDistance < 30 ? swipeFrameDistance : 30;
        this.swipeDistance += swipeFrameDistance;
        this.lastPos = touch.clientX - this.initialPos;

        if (swipeFrameDistance > 0) {

            this.onSwipeLeft.emit(swipeFrameDistance);

        } else {

            this.onSwipeRight.emit(swipeFrameDistance);

        }

    }

    @HostListener('touchstart', ['$event'])
    onTouchStart (event: any) {

        if (!SwiperDirective.canISwipe) {

            return;

        }
        const touch = event.touches[0] || event.changedTouches[0];
        this.firstSwipeDate = Date.now();
        this.initialPos = touch.clientX;
        this.swipeDistance = ZERO;
        this.onSwipeStart.emit();

    }

    @HostListener('touchend', ['$event'])
    onTouchEnd () {

        this.initialPos = this.lastPos = ZERO;
        if (this.swipeDistance > 100) {

            this.swipeLeft.emit();

        } else if (this.swipeDistance < -100) {

            this.swipeRight.emit();

        } else {

            this.onSwipeEnd.emit();

        }
        this.swipeDistance = ZERO;

    }

}
