import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArrowComponent } from './arrow/arrow.component';
import { SwiperDirective } from './directives/swiper.directive';
import { UILazyloadDirective } from './directives/ui-lazy-load.directive';
import { DotsComponent } from './dots/dots.component';
import { UICarouselItemComponent } from './ui-carousel-item/ui-carousel-item.component';
import { UICarouselComponent } from './ui-carousel/ui-carousel.component';


@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        UICarouselComponent,
        UICarouselItemComponent,
        UILazyloadDirective
    ],
    declarations: [
        UICarouselComponent,
        UICarouselItemComponent,
        DotsComponent,
        ArrowComponent,
        SwiperDirective,
        UILazyloadDirective
    ]
})
export class UICarouselModule { }
