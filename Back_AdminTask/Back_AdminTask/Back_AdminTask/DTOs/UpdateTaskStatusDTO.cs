using Back_AdminTask.Enums;
using TaskStatusEnum = Back_AdminTask.Enums.TaskStatus;

namespace Back_AdminTask.DTOs
{
    public class UpdateTaskStatusDTO
    {
        public TaskStatusEnum Status { get; set; }
    }
}
