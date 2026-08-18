using System.Text.Json.Serialization;

namespace SuperHeroes.Client.Models;

public class SyncPayloadModel
{
    [JsonPropertyName("version")]
    public string Version { get; set; } = "2.0";

    [JsonPropertyName("lastSyncedAt")]
    public DateTime LastSyncedAt { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("clientInfo")]
    public string ClientInfo { get; set; } = "SuperHeroes 2.0 Web Client";

    [JsonPropertyName("savedHeroes")]
    public List<HeroModel> SavedHeroes { get; set; } = new();

    [JsonPropertyName("customLibrary")]
    public CustomLibraryBackupModel CustomLibrary { get; set; } = new();

    [JsonPropertyName("diceTheme")]
    public DiceTheme? DiceTheme { get; set; }
}

public class CustomLibraryBackupModel
{
    [JsonPropertyName("milestones")]
    public Dictionary<string, string> Milestones { get; set; } = new();

    [JsonPropertyName("sfx")]
    public Dictionary<string, string> Sfx { get; set; } = new();

    [JsonPropertyName("limits")]
    public Dictionary<string, string> Limits { get; set; } = new();
}
