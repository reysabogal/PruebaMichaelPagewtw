using System;
using System.Collections.Generic;

namespace Back_AdminTask.Models;

public partial class Task
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string Status { get; set; } = null!;

    public int UserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? AdditionalData { get; set; }

    public virtual User User { get; set; } = null!;
}
