import { computed, inject, Injectable, signal } from '@angular/core';
import { TodoApi } from '@data-access/todo.api';
import { rxResource } from '@angular/core/rxjs-interop';
import { TodoStatusChangedEvent } from '@components/todo/todo.component';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodosState {
  #todoApi = inject(TodoApi);

  #limit = signal(30);
  #skip = signal(0);
  #todosResource = rxResource({
    request: () => ({ limit: this.#limit(), skip: this.#skip() }),
    loader: ({ request: params }) =>
      this.#todoApi.getTodos(params.limit, params.skip),
  });

  todos = computed(() => this.#todosResource.value() ?? []);
  loading = computed(() => this.#todosResource.isLoading());

  prev() {
    if (this.#skip() === 0) return;
    this.#skip.set(this.#skip() - this.#limit());
  }

  next() {
    this.#skip.set(this.#skip() + this.#limit());
  }

  add(todo: string) {
    this.#todoApi
      .add(todo)
      .pipe(take(1))
      .subscribe((added) => {
        this.#todosResource.update((todos) => [added, ...todos!]);
        alert('SUCCESS');
      });
  }

  itemStatusChanged(e: TodoStatusChangedEvent) {
    this.#todoApi
      .updateStatus(e.id, e.status)
      .pipe(take(1))
      .subscribe(() => {
        this.#todosResource.reload();
      });
  }
}
