import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Todo {
    id: number;
    todo: string;
    completed: boolean;
}

export interface GetTodosResponse {
    todos: Todo[];
    total: number;
    skip: number;
    limit: number;
}

@Injectable({ providedIn: 'root' })
export class TodoApi {
    #http = inject(HttpClient);
    #path = 'https://dummyjson.com/todos';

    getTodos(limit: number, skip: number): Observable<Todo[]> {
        const params = new HttpParams({
            fromString: `limit=${limit}&skip=${skip}`,
        });
        return this.#http.get<GetTodosResponse>(this.#path, { params }).pipe(
            map((response) => response.todos)
            // delay(3000)
        );
    }

    updateStatus(id: number, status: boolean): Observable<void> {
        return this.#http.patch<void>(`${this.#path}/${id}`, { completed: status });
    }

    add(todo: string): Observable<Todo> {
        return this.#http.post<Todo>(`${this.#path}/add`, {
            todo,
            completed: false,
            userId: 1,
        });
    }
}
