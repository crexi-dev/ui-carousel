import { Component, ContentChildren, ElementRef, QueryList, Renderer2, ViewChild } from '@angular/core';
import { SwiperDirective } from '../directives/swiper.directive';
import { UILazyloadDirective } from '../directives/ui-lazy-load.directive';

@Component({
    selector: 'ui-carousel-item',
    styleUrls: ['./ui-carousel-item.css'],
    templateUrl: './ui-carousel-item.html'
})
export class UICarouselItemComponent {

    static transitionStyle: any = {};

    @ViewChild('carouselItem') el: ElementRef;
    @ViewChild(SwiperDirective) swiper: SwiperDirective;

    @ContentChildren(UILazyloadDirective) lazyLoadedImages: QueryList<UILazyloadDirective>;

    currentPosition = 0;
    position = 0;
    speed: number;
    zIndex: number;

    constructor(private renderer: Renderer2) { }

    get transition () {

        return UICarouselItemComponent.transitionStyle;

    }

    set transition (transitionStyle) {

        UICarouselItemComponent.transitionStyle = transitionStyle;

    }

    moveTo (position: number) {

        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-o-transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transform', 'translate3d(' + position + 'px, 0px, 0px)');

    }

    moveBy (distance: number) {

        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(' + distance + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(' + distance + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transform', 'translate3d(' + distance + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-o-transform', 'translate3d(' + distance + 'px, 0px, 0px)');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transform', 'translate3d(' + distance + 'px, 0px, 0px)');

    }

    setzIndex (zIndex: number) {

        this.renderer.setStyle(this.el.nativeElement, 'z-index', zIndex);

    }

    disableTransition () {

        this.renderer.setStyle(this.el.nativeElement, 'transition', 'none');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transition', 'none');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transition', 'none');
        this.renderer.setStyle(this.el.nativeElement, '-o-transition', 'none');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transition', 'none');
        // this.transition = {
        //     "transition": "none",
        //     "-moz-transition": "none",
        //     "-webkit-transition": "none",
        //     "-o-transition": "none",
        //     "-ms-transition": "none"
        // }

    }

    enableTransition () {

        // this.transition = {
        //     "transition": "transform .5s",
        //     "-moz-transition": "transform .5s",
        //     "-webkit-transition": "transform .5s",
        //     "-o-transition": "transform .5s",
        //     "-ms-transition": "transform .5s",
        // }
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-o-transition', 'transform');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transition', 'transform');

        this.renderer.setStyle(this.el.nativeElement, 'transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-moz-transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-o-transition-duration', this.speed + 'ms');
        this.renderer.setStyle(this.el.nativeElement, '-ms-transition-duration', this.speed + 'ms');

    }

    fadeOut (duration: number) {

        return new Promise<void>(resolve => {

            this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
            setTimeout(() => {

                this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
                resolve();

            }, duration);

        });

    }

    fadeIn (duration: number) {

        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        setTimeout(() => {

            this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity ' + duration + 'ms');
            // this.renderer.setStyle(this.el.nativeElement, "transition-duration", duration+ "ms");
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');

        }, 0);

    }

    lazyLoad () {

        this.lazyLoadedImages.forEach((img) => {

            img.load();

        });

    }

}
