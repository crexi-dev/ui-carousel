import {
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList
} from '@angular/core';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { UICarouselItemComponent } from '../ui-carousel-item/ui-carousel-item.component';

@Component({
    selector: 'ui-carousel',
    styleUrls: ['./ui-carousel.css'],
    templateUrl: './ui-carousel.html'
})
export class UICarouselComponent implements AfterViewInit, OnDestroy, OnInit {

    private _width: number;
    private firstItemIndex: number; // the visual index of item and not necessary the index in the DOM
    private lastItemIndex: number;
    private nextSubject: Subject<any> = new Subject<any>();
    private prevSubject: Subject<any> = new Subject<any>();

    @Input('arrows') isArrowsVisible = true;
    @Input('dots') isDotsVisible = true;
    @Input() autoPlay = true;
    @Input() autoPlaySpeed: number;
    @Input() fade = false;
    @Input() height = '300px';
    @Input() infinite = true;
    @Input() speed: number;
    @Input() width = '100%';

    @Output() onChange: EventEmitter<number> = new EventEmitter<number>();

    @ContentChildren(UICarouselItemComponent) items: QueryList<UICarouselItemComponent>;

    currentItemIndex = 0;
    interval: any;

    @HostListener('window:resize', ['$event'])
    onResize () {

        this.rePosition();

    }

    constructor (private el: ElementRef) { }

    ngAfterViewInit () {

        this.el.nativeElement.style.height = this.height;
        this.el.nativeElement.style.width = this.width;
        if (this.items && this.items.length > 0) {

            this.onChange.emit(0);
            this._width = this.items.first.el.nativeElement.offsetWidth;

        }
        this.firstItemIndex = 0;
        this.lastItemIndex = this.items.length - 1;
        if (!this.fade) {

            this.items.forEach((item, itemIndex) => {

                let totalDistanceSwiped = 0;
                item.speed = this.speed;
                item.position = this._width * itemIndex;
                item.currentPosition = item.position;
                item.disableTransition();
                item.moveTo(item.position);

                item.swiper.onSwipeLeft.subscribe((distance: number) => {

                    totalDistanceSwiped += Math.abs(distance);
                    const shortDistance = distance / Math.pow(totalDistanceSwiped, .4);
                    if (itemIndex === this.firstItemIndex && this.infinite) {

                        this.rotateRight();

                    }
                    this.items.forEach((itm) => {

                        if ((itemIndex === this.firstItemIndex || (itemIndex === this.lastItemIndex && distance > 0))
                            && !this.infinite
                        ) {

                            itm.currentPosition += shortDistance;

                        } else {

                            itm.currentPosition += distance;

                        }
                        itm.moveTo(itm.currentPosition);

                    });

                });

                item.swiper.onSwipeRight.subscribe((distance: number) => {

                    totalDistanceSwiped += Math.abs(distance);
                    const shortDistance = distance / Math.pow(totalDistanceSwiped, .4);
                    if (itemIndex === this.lastItemIndex && this.infinite) {

                        this.rotateLeft();

                    }
                    this.items.forEach((itm) => {

                        if ((itemIndex === this.lastItemIndex || (itemIndex === this.firstItemIndex && distance < 0))
                            && !this.infinite
                        ) {

                            itm.currentPosition += shortDistance;

                        } else {

                            itm.currentPosition += distance;

                        }
                        itm.moveTo(itm.currentPosition);

                    });

                });

                item.swiper.swipeLeft.subscribe(() => {

                    totalDistanceSwiped = 0;
                    this.slideLeft();

                });

                item.swiper.swipeRight.subscribe(() => {

                    totalDistanceSwiped = 0;
                    this.slideRight();

                });

                item.swiper.onSwipeEnd.subscribe(() => {

                    totalDistanceSwiped = 0;
                    this.enableTransition();
                    this.slideToPrevPosition();

                });

                item.swiper.onSwipeStart.subscribe(() => {

                    totalDistanceSwiped = 0;
                    this.disableTransition();

                });

            });

        } else {

            this.items.forEach((item, index) => {

                item.zIndex = this.items.length - index;
                item.setzIndex(item.zIndex);

            });

        }

    }

    ngOnDestroy () {

        this.nextSubject.unsubscribe();
        this.prevSubject.unsubscribe();

    }

    ngOnInit () {

        this.speed = this.speed || 500;
        this.autoPlaySpeed = this.autoPlaySpeed || 1500;
        if (this.autoPlay) {

            this.autoPlayFunction(true);

        }

        this.nextSubject.asObservable().pipe(throttleTime(this.speed)).subscribe(() => {

            if (!this.fade) {

                this.slideLeft();

            } else {

                this.fadeLeft();

            }

        });
        this.prevSubject.asObservable().pipe(throttleTime(this.speed)).subscribe(() => {

            if (!this.fade) {

                this.slideRight();

            } else {

                this.fadeRight();

            }

        });
        this.onChange.subscribe((index: number) => {

            const item = this.getItemByIndex(index);
            item.lazyLoad();

        });

    }

    next () {

        this.prevSubject.next();

    }

    prev () {

        this.nextSubject.next();

    }

    goTo (index: number) {

        if (!this.fade) {

            this.slideTo(index);

        } else {

            this.fadeTo(index);

        }

    }

    rotateRightTo (index: number) {

        while (index !== this.lastItemIndex) {

            this.rotateRight();

        }

    }

    rotateLeftTo (index: number) {

        while (index !== this.firstItemIndex) {

            this.rotateLeft();

        }

    }

    slideTo (index: number) {

        this.onChange.emit((index + this.items.length) % this.items.length);
        const steps = this.currentItemIndex - index;
        if (this.infinite) {

            if (steps > 0) {

                this.rotateRightTo(this.currentItemIndex);

            } else if (steps < 0) {

                this.rotateLeftTo(this.currentItemIndex);

            }

        }
        setTimeout(() => {

            this.enableTransition();
            this.items.forEach((item) => {

                item.position += this._width * (steps);
                item.currentPosition = item.position;
                item.moveTo(item.position);

            });
            this.currentItemIndex = (index + this.items.length) % this.items.length;

        }, 50);

    }

    slideLeft () {

        if (!this.infinite) {

            if (this.currentItemIndex === 0) {

                this.slideToPrevPosition();
                return;

            }

        }
        this.slideTo(this.currentItemIndex - 1);

    }

    slideRight () {

        if (!this.infinite) {

            if (this.currentItemIndex === this.items.length - 1) {

                this.slideToPrevPosition();
                return;

            }

        }
        this.slideTo(this.currentItemIndex + 1);

    }

    slideToPrevPosition () {

        this.enableTransition();
        this.items.forEach(item => {

            item.currentPosition = item.position;
            item.moveTo(item.position);

        });

    }

    disableTransition () {

        this.items.forEach((item) => {

            item.disableTransition();

        });

    }

    enableTransition () {

        this.items.forEach((item) => {

            item.enableTransition();

        });

    }

    getItemByIndex (index: number) {

        return this.items.find((_, i) => {

            return i === index;

        });

    }

    getIndexByItem (item: UICarouselItemComponent) {

        return this.items.toArray().indexOf(item);

    }

    rotateRightNTimes (n: number) {

        for (let i = 0; i < n; i++) {

            this.rotateRight();

        }

    }

    rotateLeftNTimes (n: number) {

        for (let i = 0; i < n; i++) {

            this.rotateLeft();

        }

    }

    rotateRight () {

        const firstItemRef = this.getItemByIndex(this.firstItemIndex);
        const lastItemRef = this.getItemByIndex(this.lastItemIndex);

        if (!this.fade) {

            lastItemRef.position = firstItemRef.position - this._width;
            lastItemRef.currentPosition = lastItemRef.position;
            lastItemRef.disableTransition();
            lastItemRef.moveTo(lastItemRef.position);
            this.firstItemIndex = this.lastItemIndex;
            this.lastItemIndex = (this.lastItemIndex - 1 + this.items.length) % this.items.length;

        }

    }

    rotateLeft () {

        const firstItemRef = this.getItemByIndex(this.firstItemIndex);
        const lastItemRef = this.getItemByIndex(this.lastItemIndex);
        firstItemRef.position = lastItemRef.position + this._width;
        firstItemRef.currentPosition = firstItemRef.position;
        firstItemRef.disableTransition();
        firstItemRef.moveTo(firstItemRef.position);
        this.lastItemIndex = this.firstItemIndex;
        this.firstItemIndex = (this.lastItemIndex + 1) % this.items.length;

    }

    fadeTo (index: number) {

        this.onChange.emit(index);
        const firstItem = this.getItemByIndex(this.currentItemIndex);
        const targetItem = this.getItemByIndex(index);
        targetItem.zIndex = firstItem.zIndex + 1;
        targetItem.setzIndex(targetItem.zIndex);
        targetItem.disableTransition();
        targetItem.fadeIn(this.speed);
        this.currentItemIndex = index;

    }

    fadeRight () {

        const newIndex = (this.currentItemIndex + 1) % this.items.length;
        this.fadeTo(newIndex);
        this.currentItemIndex = newIndex;

    }

    fadeLeft () {

        const newIndex = (this.currentItemIndex - 1 + this.items.length) % this.items.length;
        this.fadeTo(newIndex);
        this.currentItemIndex = newIndex;

    }

    // is item first visually and not necessary first in the dom (QueryList)
    isItemFirst (index: number) {

        return this.firstItemIndex === index;

    }

    // is item last visually and not necessary last in the dom (QueryList)
    isItemLast (index: number) {

        return this.lastItemIndex === index;

    }

    rePosition () {

        if (this.items && this.items.length > 0) {

            this._width = this.items.first.el.nativeElement.offsetWidth;

        }
        const items = this.items.toArray();
        items.sort((item1, item2) => {

            if (item1.position > item2.position) {

                return 1;

            } else if (item1.position < item2.position) {

                return -1;

            } else {

                return 0;

            }

        });

        const currentItem = this.getItemByIndex(this.currentItemIndex);
        const currentItemIndex = items.indexOf(currentItem);
        for (let i = currentItemIndex; i < items.length + currentItemIndex; i++) {

            const item = items[(i + items.length) % items.length];
            item.position = ((i + items.length) % items.length - currentItemIndex) * this._width;
            item.disableTransition();
            item.moveTo(item.position);

        }

    }

    autoPlayFunction (isAutoPlay: boolean) {

        if (this.autoPlay) {

            if (isAutoPlay) {

                this.interval = setInterval(() => {

                    this.next();

                }, this.autoPlaySpeed);

            } else {

                clearInterval(this.interval);

            }

        }

    }

}

