using System.Text.Json;
using Microsoft.JSInterop;
using SuperHeroes.Client.Models;

namespace SuperHeroes.Client.Services;

public class CustomLibraryService
{
    private readonly IJSRuntime _jsRuntime;
    private const string StorageKey = "cortex_custom_library_v2";

    public Dictionary<string, string> CustomMilestones { get; private set; } = new(StringComparer.OrdinalIgnoreCase);
    public Dictionary<string, string> CustomSfx { get; private set; } = new(StringComparer.OrdinalIgnoreCase);
    public Dictionary<string, string> CustomLimits { get; private set; } = new(StringComparer.OrdinalIgnoreCase);

    public event Action? OnLibraryUpdated;

    public CustomLibraryService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public async Task InitializeAsync()
    {
        try
        {
            var json = await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", StorageKey);
            if (!string.IsNullOrWhiteSpace(json))
            {
                var data = JsonSerializer.Deserialize<CustomLibraryData>(json);
                if (data != null)
                {
                    CustomMilestones = new Dictionary<string, string>(data.Milestones ?? new(), StringComparer.OrdinalIgnoreCase);
                    CustomSfx = new Dictionary<string, string>(data.Sfx ?? new(), StringComparer.OrdinalIgnoreCase);
                    CustomLimits = new Dictionary<string, string>(data.Limits ?? new(), StringComparer.OrdinalIgnoreCase);
                    OnLibraryUpdated?.Invoke();
                }
            }
        }
        catch { }
    }

    public string GetMilestoneDescription(string name, HeroModel? hero = null)
    {
        if (hero != null && hero.CustomMilestoneDescriptions.TryGetValue(name, out var heroDesc) && !string.IsNullOrWhiteSpace(heroDesc))
            return heroDesc;

        if (CustomMilestones.TryGetValue(name, out var localDesc) && !string.IsNullOrWhiteSpace(localDesc))
            return localDesc;

        return CortexRulesData.GetMilestoneDescription(name);
    }

    public string GetSfxDescription(string name, HeroModel? hero = null)
    {
        if (hero != null && hero.CustomSfxDescriptions.TryGetValue(name, out var heroDesc) && !string.IsNullOrWhiteSpace(heroDesc))
            return heroDesc;

        if (CustomSfx.TryGetValue(name, out var localDesc) && !string.IsNullOrWhiteSpace(localDesc))
            return localDesc;

        return CortexRulesData.GetSfxDescription(name);
    }

    public string GetLimitDescription(string name, HeroModel? hero = null)
    {
        if (hero != null && hero.CustomLimitDescriptions.TryGetValue(name, out var heroDesc) && !string.IsNullOrWhiteSpace(heroDesc))
            return heroDesc;

        if (CustomLimits.TryGetValue(name, out var localDesc) && !string.IsNullOrWhiteSpace(localDesc))
            return localDesc;

        return CortexRulesData.GetLimitDescription(name);
    }

    public async Task SaveCustomMilestoneAsync(string name, string desc)
    {
        if (string.IsNullOrWhiteSpace(name)) return;
        CustomMilestones[name.Trim()] = desc;
        await PersistAsync();
        OnLibraryUpdated?.Invoke();
    }

    public async Task SaveCustomSfxAsync(string name, string desc)
    {
        if (string.IsNullOrWhiteSpace(name)) return;
        CustomSfx[name.Trim()] = desc;
        await PersistAsync();
        OnLibraryUpdated?.Invoke();
    }

    public async Task SaveCustomLimitAsync(string name, string desc)
    {
        if (string.IsNullOrWhiteSpace(name)) return;
        CustomLimits[name.Trim()] = desc;
        await PersistAsync();
        OnLibraryUpdated?.Invoke();
    }

    public List<PickerOption> GetMilestonePickerOptions()
    {
        var list = new List<PickerOption>();
        // Add all defaults
        foreach (var m in CortexRulesData.PredefinedMilestones)
        {
            var isLocal = CustomMilestones.ContainsKey(m);
            list.Add(new PickerOption
            {
                Key = m,
                DisplayName = isLocal ? $"{m} (Local)" : m,
                IsLocal = isLocal,
                Description = GetMilestoneDescription(m)
            });
        }
        // Add any custom ones not in default
        foreach (var kvp in CustomMilestones)
        {
            if (!CortexRulesData.MilestonesDescriptions.ContainsKey(kvp.Key))
            {
                list.Add(new PickerOption
                {
                    Key = kvp.Key,
                    DisplayName = $"{kvp.Key} (Local)",
                    IsLocal = true,
                    Description = kvp.Value
                });
            }
        }
        return list.OrderBy(x => x.DisplayName).ToList();
    }

    public List<PickerOption> GetSfxPickerOptions()
    {
        var list = new List<PickerOption>();
        foreach (var s in CortexRulesData.PredefinedSfx)
        {
            var isLocal = CustomSfx.ContainsKey(s);
            list.Add(new PickerOption
            {
                Key = s,
                DisplayName = isLocal ? $"{s} (Local)" : s,
                IsLocal = isLocal,
                Description = GetSfxDescription(s)
            });
        }
        foreach (var kvp in CustomSfx)
        {
            if (!CortexRulesData.SfxDescriptions.ContainsKey(kvp.Key))
            {
                list.Add(new PickerOption
                {
                    Key = kvp.Key,
                    DisplayName = $"{kvp.Key} (Local)",
                    IsLocal = true,
                    Description = kvp.Value
                });
            }
        }
        return list.OrderBy(x => x.DisplayName).ToList();
    }

    public List<PickerOption> GetLimitPickerOptions()
    {
        var list = new List<PickerOption>();
        foreach (var l in CortexRulesData.PredefinedLimits)
        {
            var isLocal = CustomLimits.ContainsKey(l);
            list.Add(new PickerOption
            {
                Key = l,
                DisplayName = isLocal ? $"{l} (Local)" : l,
                IsLocal = isLocal,
                Description = GetLimitDescription(l)
            });
        }
        foreach (var kvp in CustomLimits)
        {
            if (!CortexRulesData.LimitsDescriptions.ContainsKey(kvp.Key))
            {
                list.Add(new PickerOption
                {
                    Key = kvp.Key,
                    DisplayName = $"{kvp.Key} (Local)",
                    IsLocal = true,
                    Description = kvp.Value
                });
            }
        }
        return list.OrderBy(x => x.DisplayName).ToList();
    }

    private async Task PersistAsync()
    {
        try
        {
            var data = new CustomLibraryData
            {
                Milestones = CustomMilestones,
                Sfx = CustomSfx,
                Limits = CustomLimits
            };
            var json = JsonSerializer.Serialize(data);
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", StorageKey, json);
        }
        catch { }
    }

    private class CustomLibraryData
    {
        public Dictionary<string, string>? Milestones { get; set; }
        public Dictionary<string, string>? Sfx { get; set; }
        public Dictionary<string, string>? Limits { get; set; }
    }
}

public class PickerOption
{
    public string Key { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public bool IsLocal { get; set; }
    public string Description { get; set; } = string.Empty;
}
