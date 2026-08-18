using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.JSInterop;
using SuperHeroes.Client.Models;

namespace SuperHeroes.Client.Services;

public class HeroApiService
{
    private readonly HttpClient _httpClient;
    private readonly IJSRuntime _jsRuntime;
    private readonly IConfiguration _config;
    private readonly CustomLibraryService _libraryService;
    private const string FavoritesStorageKey = "cortex_saved_heroes_v2";

    public string ApiBaseUrl { get; set; } = "https://jfsuperherofunction-fzbqb9hqc5h3f0ek.centralus-01.azurewebsites.net/api/hero";
    public string FunctionKey { get; set; } = string.Empty;

    public HeroApiService(HttpClient httpClient, IJSRuntime jsRuntime, IConfiguration config, CustomLibraryService libraryService)
    {
        _httpClient = httpClient;
        _jsRuntime = jsRuntime;
        _config = config;
        _libraryService = libraryService;

        var configuredUrl = _config["HeroApi:BaseUrl"];
        if (!string.IsNullOrWhiteSpace(configuredUrl))
        {
            ApiBaseUrl = configuredUrl;
        }

        var configuredKey = _config["HeroApi:FunctionKey"];
        if (!string.IsNullOrWhiteSpace(configuredKey))
        {
            FunctionKey = configuredKey;
        }
    }

    private string BuildUrl(int? count = null)
    {
        var baseUrl = ApiBaseUrl.TrimEnd('/');
        
        // If count is specified and > 1
        if (count.HasValue && count.Value > 1)
        {
            // If base url ends in /hero, change to /hero/{count}
            if (baseUrl.EndsWith("/hero", StringComparison.OrdinalIgnoreCase))
            {
                baseUrl = $"{baseUrl}/{count.Value}";
            }
            else
            {
                baseUrl = $"{baseUrl}/{count.Value}";
            }
        }

        var uriBuilder = new UriBuilder(baseUrl);
        var query = System.Web.HttpUtility.ParseQueryString(uriBuilder.Query);

        if (!string.IsNullOrWhiteSpace(FunctionKey))
        {
            query["code"] = FunctionKey;
        }

        uriBuilder.Query = query.ToString();
        return uriBuilder.ToString();
    }

    public async Task<HeroModel> GenerateHeroAsync(CancellationToken cancellationToken = default)
    {
        var url = BuildUrl();

        try
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(12)); // Allow up to 12s for Azure cold start

            var response = await _httpClient.GetAsync(url, cts.Token);
            if (response.IsSuccessStatusCode)
            {
                var hero = await response.Content.ReadFromJsonAsync<HeroModel>(cancellationToken: cts.Token);
                if (hero != null)
                {
                    hero.CreatedAt = DateTime.UtcNow;
                    return hero;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"API fetch error: {ex.Message}. Falling back to client-side generation.");
        }

        // Fallback offline hero if API is warming up or offline
        return GenerateOfflineHero();
    }

    public async Task<List<HeroModel>> GenerateBatchHeroesAsync(int count = 10, CancellationToken cancellationToken = default)
    {
        count = Math.Clamp(count, 1, 100);
        var url = BuildUrl(count);

        try
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(20));

            var response = await _httpClient.GetAsync(url, cts.Token);
            if (response.IsSuccessStatusCode)
            {
                var heroes = await response.Content.ReadFromJsonAsync<List<HeroModel>>(cancellationToken: cts.Token);
                if (heroes != null && heroes.Count > 0)
                {
                    foreach (var h in heroes) h.CreatedAt = DateTime.UtcNow;
                    return heroes;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Batch API fetch error: {ex.Message}. Generating offline batch.");
        }

        // Generate offline batch
        var list = new List<HeroModel>();
        for (int i = 0; i < count; i++)
        {
            list.Add(GenerateOfflineHero());
        }
        return list;
    }

    // Favorites / Local Storage
    public async Task<List<HeroModel>> GetFavoritesAsync()
    {
        try
        {
            var json = await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", FavoritesStorageKey);
            if (!string.IsNullOrWhiteSpace(json))
            {
                return JsonSerializer.Deserialize<List<HeroModel>>(json) ?? new();
            }
        }
        catch { }
        return new();
    }

    public async Task ToggleFavoriteAsync(HeroModel hero)
    {
        var favs = await GetFavoritesAsync();
        var existing = favs.FirstOrDefault(f => f.Id == hero.Id);
        if (existing != null)
        {
            favs.Remove(existing);
            hero.IsFavorite = false;
        }
        else
        {
            hero.IsFavorite = true;
            favs.Insert(0, hero);
        }

        try
        {
            var json = JsonSerializer.Serialize(favs);
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", FavoritesStorageKey, json);
        }
        catch { }
    }

    // Discord Markdown generation
    public string GenerateDiscordMarkdown(HeroModel hero)
    {
        var sb = new StringBuilder();

        // Hero Identity Header
        if (!string.IsNullOrWhiteSpace(hero.HeroName))
        {
            sb.AppendLine($"# {hero.HeroName.ToUpper()}");
        }
        if (!string.IsNullOrWhiteSpace(hero.SecretIdentity) || !string.IsNullOrWhiteSpace(hero.PlayerName))
        {
            var meta = new List<string>();
            if (!string.IsNullOrWhiteSpace(hero.SecretIdentity)) meta.Add($"**Secret ID:** {hero.SecretIdentity}");
            if (!string.IsNullOrWhiteSpace(hero.PlayerName)) meta.Add($"**Player:** {hero.PlayerName}");
            sb.AppendLine(string.Join(" | ", meta));
            sb.AppendLine();
        }

        // Distinctions
        sb.AppendLine($"**{string.Join(" **|** ", hero.Distinctions)}**\n");

        // Affiliations
        var affilStrings = hero.Affiliations.Select(a => $"{a.Name} d{a.Rating}");
        sb.AppendLine($"**{string.Join("  •  ", affilStrings)}**\n");

        // Specialties
        var specStrings = hero.Specialties.Select(s => $"{s.Name} d{s.Rating}");
        sb.AppendLine($"**Specialties:** {string.Join(", ", specStrings)}\n");

        // Power Sets
        int psIndex = 1;
        foreach (var ps in hero.PowerSets)
        {
            var psTitle = string.IsNullOrWhiteSpace(ps.Name) ? $"Power Set {psIndex++}" : ps.Name;
            sb.AppendLine($"**{psTitle}:**");
            var powers = ps.Powers.Select(p => $"• {p.Name} d{p.Rating}");
            sb.AppendLine(string.Join("\n", powers));

            if (ps.Sfx.Count > 0)
            {
                sb.AppendLine("\n**SFX:**");
                foreach (var sfx in ps.Sfx)
                {
                    var desc = _libraryService.GetSfxDescription(sfx, hero);
                    sb.AppendLine($"• ***{sfx}***: {desc}");
                }
            }

            if (ps.Limits.Count > 0)
            {
                sb.AppendLine("\n**Limits:**");
                foreach (var limit in ps.Limits)
                {
                    var desc = _libraryService.GetLimitDescription(limit, hero);
                    sb.AppendLine($"• ***{limit}***: {desc}");
                }
            }
            sb.AppendLine();
        }

        // Milestones
        if (hero.Milestones.Count > 0)
        {
            sb.AppendLine("**Milestones:**");
            foreach (var m in hero.Milestones)
            {
                sb.AppendLine($"***{m}***");
                sb.AppendLine(_libraryService.GetMilestoneDescription(m, hero));
                sb.AppendLine();
            }
        }

        return sb.ToString().TrimEnd();
    }

    private static readonly Random _rng = new();

    private static readonly string[] Descriptors = new[]
    {
        "Absent-Minded", "Alienated", "Ambitious", "Artistic", "Attention-Seeking", "Bitter", "Boisterous",
        "Brutal", "Calculating", "Charming", "Compassionate", "Dangerous", "Dashing", "Deadly", "Defiant",
        "Devout", "Disciplined", "Duplicitous", "Ethical", "Extroverted", "Fearless", "Genius", "Gentle",
        "Gifted", "Headstrong", "Heroic", "Honorable", "Hotheaded", "Impatient", "Imperious", "Innovative",
        "Intense", "Intimidating", "Intuitive", "Kind-Hearted", "Loyal", "Mysterious", "Optimistic",
        "Passionate", "Relentless", "Sarcastic", "Streetwise", "Superstitious", "Vengeful", "Vigilant", "Wise-Cracking"
    };

    private static readonly string[] Nouns = new[]
    {
        "Activist", "Alien", "Android", "Archer", "Assassin", "Astronaut", "Athlete", "Attorney", "Bounty Hunter",
        "Criminal", "Cryptid", "Defender", "Demigod", "Detective", "Doctor", "Engineer", "First Responder",
        "Fugitive", "Genius", "Ghost", "Hacker", "Immortal", "Inventor", "Investigator", "Journalist", "Knight",
        "Leader", "Legend", "Lycanthrope", "Martial Artist", "Mastermind", "Mercenary", "Monarch", "Monster",
        "Mutant", "Mystic", "Ninja", "Outcast", "Pacifist", "Powerhouse", "Psychic", "Rebel", "Savior",
        "Scientist", "Secret Agent", "Soldier", "Sorcerer", "Spy", "Strategist", "Vigilante", "Warrior", "Wizard"
    };

    private static readonly string[] PowerNames = new[]
    {
        "Superhuman Strength", "Godlike Strength", "Flight", "Superhuman Speed", "Reflexes",
        "Durability", "Psychic Blast", "Telekinesis", "Energy Blast", "Force Field",
        "Invisibility", "Teleportation", "Elemental Mastery", "Intangibility", "Healing Factor",
        "Sensory Powers", "Shape-Shifting", "Sorcery", "Cybernetics", "Weapon Mastery"
    };

    private static readonly string[] SpecialtyNames = new[]
    {
        "Acrobatics", "Business", "Combat", "Covert", "Crime", "Medical", "Menace", "Psych", "Science", "Tech", "Vehicle", "Mystic", "Cosmic"
    };

    private static readonly string[] SfxList = new[]
    {
        "Absorption", "Adaptive Tactics", "Afflict", "Area Attack", "Berserker", "Boost", "Burst",
        "Constructs", "Dangerous", "Focus", "Healing", "Immunity", "Invulnerable", "Master Plan",
        "Multipower", "Push", "Regenerate", "Second Chance", "Second Wind", "Unleashed", "Versatile"
    };

    private static readonly string[] LimitList = new[]
    {
        "Conscious Activation", "Exhausted", "Gear", "Growing Dread", "Issues",
        "Mutually Exclusive", "Powered Down", "Uncontrollable", "Vulnerable"
    };

    private static readonly string[] MilestoneList = CortexRulesData.MilestonesDescriptions.Keys.ToArray();

    public static HeroModel GenerateOfflineHero()
    {
        var hero = new HeroModel();

        // 3 Distinctions
        for (int i = 0; i < 3; i++)
        {
            var d = $"{Descriptors[_rng.Next(Descriptors.Length)]} {Nouns[_rng.Next(Nouns.Length)]}";
            if (!hero.Distinctions.Contains(d))
                hero.Distinctions.Add(d);
            else
                hero.Distinctions.Add($"{Descriptors[_rng.Next(Descriptors.Length)]} {Nouns[_rng.Next(Nouns.Length)]}");
        }

        // Affiliations (Solo, Buddy, Team: one d10, one d8, one d6 randomly assigned)
        var dice = new List<int> { 6, 8, 10 }.OrderBy(_ => _rng.Next()).ToList();
        hero.Affiliations = new List<AffiliationModel>
        {
            new() { Name = "Solo", Rating = dice[0] },
            new() { Name = "Buddy", Rating = dice[1] },
            new() { Name = "Team", Rating = dice[2] }
        };

        // Specialties (2 to 4 specialties rated d8 or d10)
        var specs = SpecialtyNames.OrderBy(_ => _rng.Next()).Take(_rng.Next(2, 5)).ToList();
        hero.Specialties = specs.Select(s => new RatedTraitModel
        {
            Name = s,
            Rating = _rng.Next(0, 4) == 0 ? 10 : 8
        }).ToList();

        // 1 or 2 Power Sets
        int psCount = _rng.Next(1, 3);
        for (int i = 0; i < psCount; i++)
        {
            var ps = new PowerSetModel();
            var powers = PowerNames.OrderBy(_ => _rng.Next()).Take(_rng.Next(2, 4)).ToList();
            ps.Powers = powers.Select(p => new RatedTraitModel
            {
                Name = p,
                Rating = new[] { 6, 8, 8, 10, 10, 12 }[_rng.Next(6)]
            }).ToList();

            var sfxCount = _rng.Next(1, 3);
            ps.Sfx = SfxList.OrderBy(_ => _rng.Next()).Take(sfxCount).ToList();
            if (psCount == 1 && !ps.Sfx.Contains("Adaptive Tactics"))
            {
                ps.Sfx.Add("Adaptive Tactics");
            }

            var limitCount = _rng.Next(1, 3);
            ps.Limits = LimitList.OrderBy(_ => _rng.Next()).Take(limitCount).ToList();

            hero.PowerSets.Add(ps);
        }

        // 2 Milestones
        hero.Milestones = MilestoneList.OrderBy(_ => _rng.Next()).Take(2).ToList();

        return hero;
    }
}
