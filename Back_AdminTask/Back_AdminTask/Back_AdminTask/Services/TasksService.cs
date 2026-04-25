using Back_AdminTask.Models;
using Back_AdminTask.Enums;
using Microsoft.EntityFrameworkCore;
using TaskModel = Back_AdminTask.Models.Task;
using TaskStatusEnum = Back_AdminTask.Enums.TaskStatus;

namespace Back_AdminTask.Services
{
    public class TasksService : ITasksService
    {
        private readonly AdminTaskContext _context;

        public TasksService(AdminTaskContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtiene todas las tareas de la base de datos
        /// </summary>
        public async System.Threading.Tasks.Task<List<TaskModel>> GetAllTasksAsync()
        {
            return await _context.Tasks.ToListAsync();
        }

        /// <summary>
        /// Crea una nueva tarea con estado Pending por defecto
        /// </summary>
        public async System.Threading.Tasks.Task<TaskModel> CreateTaskAsync(string title, string? description, int userId, string? additionalData)
        {
            // Validar que el título no es vacío o nulo
            if (string.IsNullOrWhiteSpace(title))
            {
                throw new InvalidOperationException("El campo Título es obligatorio.");
            }

            // Verificar que el usuario existe
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                throw new InvalidOperationException($"El usuario con Id {userId} no existe.");
            }

            var newTask = new TaskModel
            {
                Title = title,
                Description = description,
                UserId = userId,
                Status = TaskStatusEnum.Pending.ToString(),
                CreatedAt = DateTime.Now,
                AdditionalData = additionalData
            };

            _context.Tasks.Add(newTask);
            await _context.SaveChangesAsync();
            return newTask;
        }

        /// <summary>
        /// Edita los campos Title, Description y UserId de una tarea existente
        /// </summary>
        public async System.Threading.Tasks.Task<TaskModel?> UpdateTaskAsync(int id, string title, string? description, int userId)
        {
            // Validar que el título no es vacío o nulo
            if (string.IsNullOrWhiteSpace(title))
            {
                throw new InvalidOperationException("El campo Título es obligatorio.");
            }

            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return null;
            }

            // Verificar que el nuevo usuario existe
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                throw new InvalidOperationException($"El usuario con Id {userId} no existe.");
            }

            task.Title = title;
            task.Description = description;
            task.UserId = userId;

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
            return task;
        }

        /// <summary>
        /// Cambia el estado de una tarea
        /// </summary>
        public async System.Threading.Tasks.Task<TaskModel?> ChangeTaskStatusAsync(int id, string status)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return null;
            }

            // Validar que el estado proporcionado es válido
            if (!Enum.TryParse<TaskStatusEnum>(status, true, out var newStatus))
            {
                throw new InvalidOperationException($"Estado '{status}' no válido. Estados permitidos: Pending, InProgress, Done.");
            }

            // Validar que no se puede pasar de Pending a Done directamente
            var currentStatus = task.Status;
            if (currentStatus == TaskStatusEnum.Pending.ToString() && newStatus == TaskStatusEnum.Done)
            {
                throw new InvalidOperationException("No se puede cambiar de Pending a Done directamente. Primero debe cambiar a InProgress.");
            }

            task.Status = newStatus.ToString();

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
            return task;
        }
    }
}
