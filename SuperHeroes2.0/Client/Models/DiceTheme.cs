namespace SuperHeroes.Client.Models;

public class DiceTheme
{
    public string Id { get; set; } = "cortex-standard";
    public string Name { get; set; } = "Cortex Standard";
    public string Description { get; set; } = "Standard Cortex Prime color-coded polyhedral dice.";

    public string D2Color { get; set; } = "#475569";
    public string D4Color { get; set; } = "#d97706";
    public string D6Color { get; set; } = "#2563eb";
    public string D8Color { get; set; } = "#059669";
    public string D10Color { get; set; } = "#7c3aed";
    public string D12Color { get; set; } = "#ea580c";

    public string StrokeColor { get; set; } = "#ffffff";
    public string TextColor { get; set; } = "#ffffff";
    public double StrokeWidth { get; set; } = 1.0;

    public string GetColorForDie(int dieSize) => dieSize switch
    {
        2 => D2Color,
        4 => D4Color,
        6 => D6Color,
        8 => D8Color,
        10 => D10Color,
        12 => D12Color,
        _ => D6Color
    };

    public static List<DiceTheme> PresetThemes => new()
    {
        new DiceTheme
        {
            Id = "cortex-standard",
            Name = "Cortex Prime Standard",
            Description = "Classic vibrant color tiering for fast at-a-glance reading.",
            D2Color = "#475569",
            D4Color = "#d97706",
            D6Color = "#2563eb",
            D8Color = "#059669",
            D10Color = "#7c3aed",
            D12Color = "#ea580c",
            StrokeColor = "#ffffff",
            TextColor = "#ffffff",
            StrokeWidth = 1.0
        },
        new DiceTheme
        {
            Id = "cyber-neon",
            Name = "Cyberpunk Neon",
            Description = "High-energy electric neon hues with bright accents.",
            D2Color = "#334155",
            D4Color = "#f43f5e",
            D6Color = "#06b6d4",
            D8Color = "#10b981",
            D10Color = "#d946ef",
            D12Color = "#facc15",
            StrokeColor = "#ffffff",
            TextColor = "#ffffff",
            StrokeWidth = 1.2
        },
        new DiceTheme
        {
            Id = "golden-comic",
            Name = "Golden Age Comic",
            Description = "Bold primary & secondary superhero comic tones.",
            D2Color = "#52525b",
            D4Color = "#e11d48",
            D6Color = "#0284c7",
            D8Color = "#16a34a",
            D10Color = "#9333ea",
            D12Color = "#eab308",
            StrokeColor = "#ffffff",
            TextColor = "#ffffff",
            StrokeWidth = 1.0
        },
        new DiceTheme
        {
            Id = "dark-knight",
            Name = "Dark Knight / Stealth",
            Description = "Deep midnight shades for tactical and stealthy heroes.",
            D2Color = "#1e293b",
            D4Color = "#881337",
            D6Color = "#1e3a8a",
            D8Color = "#064e3b",
            D10Color = "#581c87",
            D12Color = "#78350f",
            StrokeColor = "#94a3b8",
            TextColor = "#f8fafc",
            StrokeWidth = 1.0
        },
        new DiceTheme
        {
            Id = "classic-charcoal",
            Name = "Original Charcoal Mono",
            Description = "The authentic #434343 monochrome styling from CortexUtilities.",
            D2Color = "#434343",
            D4Color = "#434343",
            D6Color = "#434343",
            D8Color = "#434343",
            D10Color = "#434343",
            D12Color = "#434343",
            StrokeColor = "#ffffff",
            TextColor = "#ffffff",
            StrokeWidth = 1.0
        }
    };
}
