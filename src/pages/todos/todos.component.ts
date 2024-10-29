import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { CreateTodoComponent } from '@pages/create-todo/create-todo.component';
import { RouterLink, Routes } from '@angular/router';
import { TodoComponent } from '@components/todo/todo.component';
import { TodosState } from '@state/todos.state';

@Component({
    imports: [NgClass, RouterLink, TodoComponent],
    standalone: true,
    selector: 'app-todos',
    templateUrl: './todos.component.html',
    host: {
        class: 'flex-1 flex flex-col items-stretch min-h-0',
    },
})
export class TodosComponent {
    state = inject(TodosState);
}

export const routes: Routes = [
    {
        path: '',
        component: TodosComponent,
    },
    {
        path: 'create',
        component: CreateTodoComponent,
    },
];
