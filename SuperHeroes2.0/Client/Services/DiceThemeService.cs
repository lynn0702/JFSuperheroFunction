using System.Text.Json;
using Microsoft.JSInterop;
using SuperHeroes.Client.Models;

namespace SuperHeroes.Client.Services;

public class DiceThemeService
{
    private readonly IJSRuntime _jsRuntime;
    private const string StorageKey = "cortex_dice_theme_v2";

    public DiceTheme CurrentTheme { get; private set; } = DiceTheme.PresetThemes[0];
    public event Action? OnThemeChanged;

    public DiceThemeService(IJSRuntime jsRuntime)
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
                var saved = JsonSerializer.Deserialize<DiceTheme>(json);
                if (saved != null)
                {
                    CurrentTheme = saved;
                    OnThemeChanged?.Invoke();
                }
            }
        }
        catch
        {
            // Fallback to default
        }
    }

    public async Task SetThemeAsync(DiceTheme theme)
    {
        CurrentTheme = theme;
        OnThemeChanged?.Invoke();
        await SaveThemeAsync();
    }

    public async Task SetCustomColorAsync(int die, string hexColor)
    {
        switch (die)
        {
            case 2: CurrentTheme.D2Color = hexColor; break;
            case 4: CurrentTheme.D4Color = hexColor; break;
            case 6: CurrentTheme.D6Color = hexColor; break;
            case 8: CurrentTheme.D8Color = hexColor; break;
            case 10: CurrentTheme.D10Color = hexColor; break;
            case 12: CurrentTheme.D12Color = hexColor; break;
        }
        CurrentTheme.Id = "custom";
        CurrentTheme.Name = "Custom Palette";
        OnThemeChanged?.Invoke();
        await SaveThemeAsync();
    }

    public async Task SetStrokeColorAsync(string hexColor)
    {
        CurrentTheme.StrokeColor = hexColor;
        CurrentTheme.Id = "custom";
        OnThemeChanged?.Invoke();
        await SaveThemeAsync();
    }

    public async Task SetTextColorAsync(string hexColor)
    {
        CurrentTheme.TextColor = hexColor;
        CurrentTheme.Id = "custom";
        OnThemeChanged?.Invoke();
        await SaveThemeAsync();
    }

    private async Task SaveThemeAsync()
    {
        try
        {
            var json = JsonSerializer.Serialize(CurrentTheme);
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", StorageKey, json);
        }
        catch
        {
            // Ignore storage errors
        }
    }
}
