import {
  Component,
  ComponentRef,
  Directive,
  inject,
  input,
  OnDestroy,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';

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

  #vcr = inject(ViewContainerRef);
  #ref!: ComponentRef<TooltipComponent>;
  #renderer = inject(Renderer2);

  onMouseEnter(e: MouseEvent): void {
    this.#ref = this.#vcr.createComponent(TooltipComponent);
    this.#ref.setInput('text', this.tooltip());
    this.#setPosition(e);
  }

  onMouseLeave(): void {
    this.#vcr.clear();
  }

  onMouseMove(e: MouseEvent): void {
    this.#setPosition(e);
  }

  ngOnDestroy(): void {
    this.#vcr.clear();
  }

  #setPosition(e: MouseEvent) {
    this.#renderer.setStyle(
      this.#ref.location.nativeElement,
      'top',
      `${e.clientY}px`,
    );
    this.#renderer.setStyle(
      this.#ref.location.nativeElement,
      'left',
      `${e.clientX + 16}px`,
    );
  }
}
