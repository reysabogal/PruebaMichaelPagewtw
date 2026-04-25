using Back_AdminTask.Models;

namespace Back_AdminTask.Services
{
    public interface IUsersService
    {
        /// <summary>
        /// Obtiene todos los usuarios
        /// </summary>
        Task<List<User>> GetAllUsersAsync();

        /// <summary>
        /// Busca un usuario por nombre
        /// </summary>
        Task<User?> GetUserByNameAsync(string name);

        /// <summary>
        /// Crea un nuevo usuario
        /// </summary>
        Task<User> CreateUserAsync(User user);

        /// <summary>
        /// Edita los campos Name y Email de un usuario existente
        /// </summary>
        Task<User?> UpdateUserAsync(int id, string name, string email);

        /// <summary>
        /// Elimina un usuario por Id
        /// </summary>
        Task<bool> DeleteUserAsync(int id);

        /// <summary>
        /// Obtiene el nombre del usuario por su Id
        /// </summary>
        Task<string?> GetUserNameByIdAsync(int id);
    }
}
