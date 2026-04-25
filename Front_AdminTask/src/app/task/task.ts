import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DialogAddTask } from '../Dialogs/dialog-add-task/dialog-add-task';
import { DialogStatusTask } from '../Dialogs/dialog-status-task/dialog-status-task';
import { Task as TaskModel } from '../Interfaces/_task';
import { TaskService } from '../Services/task';
import { UserService } from '../Services/user';

type TaskRow = TaskModel & {
  userName: string;
};

@Component({
  selector: 'app-task',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class TaskComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly dialog = inject(MatDialog);
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);

  readonly displayedColumns: string[] = ['title', 'description', 'user', 'status', 'actions'];
  readonly dataSource = new MatTableDataSource<TaskRow>([]);

  searchTitle = '';

  constructor() {
    this.dataSource.filterPredicate = (task, filter) =>
      task.title.toLowerCase().includes(filter.trim().toLowerCase());
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadTasks(): void {
    this.taskService
      .getTasks()
      .pipe(
        switchMap((tasks) => {
          if (!tasks.length) {
            return of([] as TaskRow[]);
          }

          const userIds = [...new Set(tasks.map((task) => task.userId).filter((id) => id > 0))];

          if (!userIds.length) {
            return of(tasks.map((task) => ({ ...task, userName: 'Sin usuario' })));
          }

          const userRequests = userIds.map((userId) =>
            this.userService.getUserByName(userId).pipe(
              map((user) => ({ userId, userName: user.name })),
              catchError(() => of({ userId, userName: 'Usuario no disponible' }))
            )
          );

          return forkJoin(userRequests).pipe(
            map((users) => {
              const usersMap = new Map(users.map((user) => [user.userId, user.userName]));

              return tasks.map((task) => ({
                ...task,
                userName: usersMap.get(task.userId) ?? 'Sin usuario',
              }));
            })
          );
        })
      )
      .subscribe({
        next: (tasks) => {
          this.dataSource.data = tasks;
          if (this.paginator) {
            this.paginator.firstPage();
          }
        },
        error: (error) => {
          console.error('Error al obtener tareas', error);
          this.dataSource.data = [];
        },
      });
  }

  applyTitleFilter(): void {
    this.dataSource.filter = this.searchTitle;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  openTaskDialog(): void {
    const dialogRef = this.dialog.open(DialogAddTask, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  createTask(): void {
    this.openTaskDialog();
  }

  changeStatus(task: TaskRow): void {
    const dialogRef = this.dialog.open(DialogStatusTask, {
      width: '500px',
      disableClose: true,
      data: task,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }
}
