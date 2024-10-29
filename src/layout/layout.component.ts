import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
    imports: [RouterOutlet, RouterLink, NgOptimizedImage],
    standalone: true,
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    host: {
        class: 'flex-1 flex flex-col items-stretch min-h-0',
    },
})
export class LayoutComponent {}
