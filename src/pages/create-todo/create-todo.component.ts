import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodosState } from '@state/todos.state';

@Component({
    imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
    selector: 'app-create-todo',
    templateUrl: './create-todo.component.html',
})
export class CreateTodoComponent {
    #state = inject(TodosState);
    #formBuilder = inject(FormBuilder);
    form = this.#formBuilder.group({
        todo: this.#formBuilder.control('', Validators.required),
    });

    submit() {
        if (this.form.invalid) return;
        this.#state.add(this.form.value.todo!);
    }
}
