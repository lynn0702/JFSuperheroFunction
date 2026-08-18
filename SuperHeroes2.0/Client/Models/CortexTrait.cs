namespace SuperHeroes.Client.Models;

public class CortexTrait
{
    public string Name { get; set; } = string.Empty;
    public int Rating { get; set; } = 8;
    public string Type { get; set; } = string.Empty;
    public string Subtype { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public string RatingString => $"d{Rating}";
}
