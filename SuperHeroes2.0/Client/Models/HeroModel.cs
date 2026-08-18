using System.Text.Json.Serialization;

namespace SuperHeroes.Client.Models;

public class HeroModel
{
    [JsonPropertyName("heroName")]
    public string HeroName { get; set; } = string.Empty;

    [JsonPropertyName("playerName")]
    public string PlayerName { get; set; } = string.Empty;

    [JsonPropertyName("secretIdentity")]
    public string SecretIdentity { get; set; } = string.Empty;

    [JsonPropertyName("distinctions")]
    public List<string> Distinctions { get; set; } = new();

    [JsonPropertyName("affiliations")]
    public List<AffiliationModel> Affiliations { get; set; } = new();

    [JsonPropertyName("specialties")]
    public List<RatedTraitModel> Specialties { get; set; } = new();

    [JsonPropertyName("powersets")]
    public List<PowerSetModel> PowerSets { get; set; } = new();

    [JsonPropertyName("milestones")]
    public List<string> Milestones { get; set; } = new();

    [JsonPropertyName("prodigyEnabled")]
    public bool ProdigyEnabled { get; set; }

    // Custom descriptions attached directly to this hero
    [JsonPropertyName("customSfxDescriptions")]
    public Dictionary<string, string> CustomSfxDescriptions { get; set; } = new(StringComparer.OrdinalIgnoreCase);

    [JsonPropertyName("customLimitDescriptions")]
    public Dictionary<string, string> CustomLimitDescriptions { get; set; } = new(StringComparer.OrdinalIgnoreCase);

    [JsonPropertyName("customMilestoneDescriptions")]
    public Dictionary<string, string> CustomMilestoneDescriptions { get; set; } = new(StringComparer.OrdinalIgnoreCase);

    // Client metadata
    [JsonIgnore]
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    [JsonIgnore]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public bool IsFavorite { get; set; }

    public string GetDisplayName()
    {
        if (!string.IsNullOrWhiteSpace(HeroName))
            return HeroName;

        if (Distinctions != null && Distinctions.Count > 0)
            return Distinctions[0];

        return "Unnamed Hero";
    }
}

public class AffiliationModel
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("rating")]
    public int Rating { get; set; } = 8;
}

public class RatedTraitModel
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("rating")]
    public int Rating { get; set; } = 8;
}

public class PowerSetModel
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("powers")]
    public List<RatedTraitModel> Powers { get; set; } = new();

    [JsonPropertyName("sfx")]
    public List<string> Sfx { get; set; } = new();

    [JsonPropertyName("limits")]
    public List<string> Limits { get; set; } = new();
}
