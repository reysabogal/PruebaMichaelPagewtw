import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../Interfaces/_task';

type TaskApiModel = { 
  id?: number;
  title?: string;
  description?: string;
  status?: string;
  userId?: number;
  additionalData?: string;
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = `${environment.endPoint}api/Tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http
      .get<TaskApiModel[]>(this.apiUrl)
      .pipe(map((tasks) => tasks.map((task) => this.mapTask(task))));
  }

  getTask(id: number): Observable<Task> {
    return this.http
      .get<TaskApiModel>(`${this.apiUrl}/${id}`)
      .pipe(map((task) => this.mapTask(task)));
  }

  createTask(task: Task): Observable<Task> {
    return this.http
      .post<TaskApiModel>(this.apiUrl, this.toApiTask(task))
      .pipe(map((createdTask) => this.mapTask(createdTask)));
  }

  updateTask(id: number, status: string): Observable<Task> {
    return this.http
      .put<TaskApiModel>(`${this.apiUrl}/${id}/status`, JSON.stringify(status),  // "InProgress" → '"InProgress"'
      { headers: { 'Content-Type': 'application/json' } })
      .pipe(map((updatedTask) => this.mapTask(updatedTask)));
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapTask(task: TaskApiModel): Task {
    return {
      id: task.id ?? 0,
      title: task.title ?? '',
      description: task.description ??  '',
      status: task.status ??  '',
      userId: task.userId ?? 0,
      additionalData: task.additionalData ?? '',
    };
  }

  private toApiTask(task: Task): TaskApiModel {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      additionalData: task.additionalData,
    };
  }
}
