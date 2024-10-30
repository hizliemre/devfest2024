import { Component, ComponentRef, Directive, inject, input, OnDestroy, Renderer2, ViewContainerRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

type Timeout = ReturnType<typeof setTimeout>;
export type TooltipPosition = {
    x: 'left' | 'right';
    y: 'top' | 'bottom';
};

@Component({
    selector: 'app-tooltip',
    standalone: true,
    template: `{{ text() }}`,
    host: {
        class: 'absolute pointer-events-none bg-black text-white p-20 rounded-lg',
    },
})
class TooltipComponent {
    text = input.required<string>();
}

@Directive({
    selector: '[tooltip]',
    standalone: true,
    host: {
        '(mouseenter)': 'onMouseEnter($event)',
        '(mouseleave)': 'onMouseLeave()',
        '(mousemove)': 'onMouseMove($event)',
    },
})
export class TooltipDirective implements OnDestroy {
    tooltip = input.required<string>();
    delay = input<number>(150);
    position = input<TooltipPosition>({ x: 'right', y: 'bottom' });
    #vcr = inject(ViewContainerRef);
    #renderer = inject(Renderer2);
    #document = inject(DOCUMENT);
    #offset = 16;
    #ref!: ComponentRef<TooltipComponent>;
    #delayRef!: Timeout;
    #mouseEvent!: MouseEvent;

    onMouseEnter(e: MouseEvent): void {
        this.#mouseEvent = e;
        this.#delayRef = setTimeout(() => {
            this.#ref = this.#vcr.createComponent(TooltipComponent);
            this.#ref.setInput('text', this.tooltip());
            this.#ref.changeDetectorRef.detectChanges();
            this.#setPosition();
            clearTimeout(this.#delayRef);
        }, this.delay());
    }

    onMouseLeave(): void {
        this.#clear();
    }

    onMouseMove(e: MouseEvent): void {
        this.#mouseEvent = e;
        this.#setPosition();
    }

    ngOnDestroy(): void {
        this.#clear();
    }

    #setPosition() {
        if (this.#ref) {
            const x = this.#calculatePosition('X');
            const y = this.#calculatePosition('Y');
            this.#renderer.setStyle(this.#ref.location.nativeElement, 'left', `${x}px`);
            this.#renderer.setStyle(this.#ref.location.nativeElement, 'top', `${y}px`);
        }
    }

    #calculatePosition(position: 'X' | 'Y'): number {
        const renderOffset = position === 'Y' ? 0 : this.#offset;
        const componentWidth = this.#ref.location.nativeElement.offsetWidth + this.#offset;
        const componentHeight = this.#ref.location.nativeElement.offsetHeight + renderOffset;
        const windowWidth = this.#document.documentElement.clientWidth;
        const windowHeight = this.#document.documentElement.clientHeight;

        const componentPos = position === 'Y' ? componentHeight : componentWidth;
        const windowPos = position === 'Y' ? windowHeight : windowWidth;
        const checkPoint = position === 'Y' ? this.position().y === 'bottom' : this.position().x === 'right';
        const clientPos = this.#mouseEvent[`client${position}`];

        return checkPoint
            ? clientPos + componentPos > windowPos
                ? clientPos - componentPos
                : clientPos + renderOffset
            : clientPos - componentPos < 0
              ? clientPos + renderOffset
              : clientPos - componentPos;
    }

    #clear(): void {
        this.#vcr.clear();
        if (this.#delayRef) clearTimeout(this.#delayRef);
    }
}
