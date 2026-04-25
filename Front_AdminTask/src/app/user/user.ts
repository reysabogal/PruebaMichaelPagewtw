import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogAddEditUser } from '../Dialogs/dialog-add-edit-user/dialog-add-edit-user';
import { DialogDeleteUser } from '../Dialogs/dialog-delete-user/dialog-delete-user';
import { User} from '../Interfaces/_user';
import { UserService } from '../Services/user';

@Component({
  selector: 'app-user',
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
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);

  readonly displayedColumns: string[] = ['name', 'email', 'actions'];
  readonly dataSource = new MatTableDataSource<User>([]);

  searchName = '';

  constructor() {
    this.dataSource.filterPredicate = (user, filter) =>
      user.name.toLowerCase().includes(filter.trim().toLowerCase());
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
        this.dataSource.data = [];
      },
    });
  }

  applyNameFilter(): void {
    this.dataSource.filter = this.searchName;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  openUserDialog(user: User | null = null): void {
    const dialogRef = this.dialog.open(DialogAddEditUser, {
      width: '500px',
      disableClose: true,
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openDeleteDialog(user: User): void {
    const dialogRef = this.dialog.open(DialogDeleteUser, {
      width: '420px',
      disableClose: true,
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  addUser(): void {
    this.openUserDialog();
  }

  editUser(user: User): void {
    this.openUserDialog(user);
    console.log('Editing user:', user);
    console.log('User ID being edited:', user.id);
  }

  deleteUser(user: User): void {
    this.openDeleteDialog(user);
  }
}
