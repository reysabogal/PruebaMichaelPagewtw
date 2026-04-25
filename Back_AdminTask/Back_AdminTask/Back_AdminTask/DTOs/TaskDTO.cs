namespace Back_AdminTask.DTOs
{
    public class TaskDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Status { get; set; } = null!;
        public int UserId { get; set; }
        //public DateTime? CreatedAt { get; set; }
        public string? AdditionalData { get; set; }
    }
}
