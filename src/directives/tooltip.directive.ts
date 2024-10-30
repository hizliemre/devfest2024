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
        class: 'absolute pointer-events-none bg-black text-white p-2 rounded-lg',
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
    #ref!: ComponentRef<TooltipComponent>;
    #renderer = inject(Renderer2);
    #document = inject(DOCUMENT);
    #delayRef!: Timeout;
    #offset = 16;

    onMouseEnter(e: MouseEvent): void {
        this.#delayRef = setTimeout(() => {
            this.#ref = this.#vcr.createComponent(TooltipComponent);
            this.#ref.setInput('text', this.tooltip());
            this.#ref.changeDetectorRef.detectChanges();
            this.#setPosition(e);
            clearTimeout(this.#delayRef);
        }, this.delay());
    }

    onMouseLeave(): void {
        this.#vcr.clear();
        if (this.#delayRef) clearTimeout(this.#delayRef);
    }

    onMouseMove(e: MouseEvent): void {
        this.#setPosition(e);
    }

    ngOnDestroy(): void {
        this.#vcr.clear();
        if (this.#delayRef) clearTimeout(this.#delayRef);
    }

    #setPosition(e: MouseEvent) {
        if (this.#ref) {
            const x = this.#calculatePosition(e, 'X');
            const y = this.#calculatePosition(e, 'Y');
            this.#renderer.setStyle(this.#ref.location.nativeElement, 'left', `${x}px`);
            this.#renderer.setStyle(this.#ref.location.nativeElement, 'top', `${y}px`);
        }
    }

    #calculatePosition(e: MouseEvent, position: 'X' | 'Y'): number {
        const componentWidth = this.#ref.location.nativeElement.offsetWidth + this.#offset;
        const componentHeight = this.#ref.location.nativeElement.offsetHeight + this.#offset;
        const windowWidth = this.#document.documentElement.clientWidth;
        const windowHeight = this.#document.documentElement.clientHeight;

        const componentPos = position === 'Y' ? componentHeight : componentWidth;
        const windowPos = position === 'Y' ? windowHeight : windowWidth;
        const checkPoint = position === 'Y' ? this.position().y === 'bottom' : this.position().x === 'right';
        const clientPos = e[`client${position}`];

        return checkPoint
            ? clientPos + componentPos > windowPos
                ? clientPos - componentPos
                : clientPos + this.#offset
            : clientPos - componentPos < 0
              ? clientPos + this.#offset
              : clientPos - componentPos;
    }
}
