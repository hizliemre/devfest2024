import { Component, input, output } from '@angular/core';
import { Todo } from '@data-access/todo.api';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from '@directives/tooltip.directive';
import { NgClass } from '@angular/common';

export interface TodoStatusChangedEvent {
    id: number;
    status: boolean;
}

@Component({
    imports: [FormsModule, TooltipDirective, NgClass],
    standalone: true,
    selector: 'app-todo',
    templateUrl: './todo.component.html',
})
export class TodoComponent {
    todo = input.required<Todo>();
    statusChanged = output<TodoStatusChangedEvent>();

    toggleStatus() {
        this.statusChanged.emit({
            id: this.todo().id,
            status: !this.todo().completed,
        });
    }
}
