using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.JSInterop;
using SuperHeroes.Client.Models;

namespace SuperHeroes.Client.Services;

public class GoogleDriveSyncService
{
    private readonly HttpClient _httpClient;
    private readonly IJSRuntime _jsRuntime;
    private readonly IConfiguration _config;
    private readonly CustomLibraryService _customLibraryService;
    private readonly DiceThemeService _themeService;

    public const string DefaultClientId = "319335039362-as9fivuakk44mlt0gi86ofhv31ns3mug.apps.googleusercontent.com";
    private const string BackupFileName = "CortexSuperHeroes_Backup.json";
    private const string ClientIdStorageKey = "cortex_google_client_id";
    private const string LastSyncStorageKey = "cortex_last_drive_sync";

    public string ClientId { get; set; } = DefaultClientId;
    public string? AccessToken { get; private set; }
    public string? UserEmail { get; private set; }
    public bool IsAuthenticated => !string.IsNullOrWhiteSpace(AccessToken);
    public bool IsBusy { get; private set; }
    public string? StatusMessage { get; private set; }
    public DateTime? LastSyncedAt { get; private set; }

    public event Action? OnStateChanged;

    public GoogleDriveSyncService(
        HttpClient httpClient,
        IJSRuntime jsRuntime,
        IConfiguration config,
        CustomLibraryService customLibraryService,
        DiceThemeService themeService)
    {
        _httpClient = httpClient;
        _jsRuntime = jsRuntime;
        _config = config;
        _customLibraryService = customLibraryService;
        _themeService = themeService;

        var configuredId = _config["GoogleDrive:ClientId"];
        if (!string.IsNullOrWhiteSpace(configuredId))
        {
            ClientId = configuredId;
        }
    }

    public async Task InitializeAsync()
    {
        try
        {
            var savedClientId = await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", ClientIdStorageKey);
            if (!string.IsNullOrWhiteSpace(savedClientId))
            {
                ClientId = savedClientId;
            }

            var lastSyncStr = await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", LastSyncStorageKey);
            if (DateTime.TryParse(lastSyncStr, out var parsed))
            {
                LastSyncedAt = parsed;
            }
        }
        catch { }
    }

    public async Task SetCustomClientIdAsync(string newClientId)
    {
        if (string.IsNullOrWhiteSpace(newClientId))
        {
            ClientId = DefaultClientId;
        }
        else
        {
            ClientId = newClientId.Trim();
        }
        await _jsRuntime.InvokeVoidAsync("localStorage.setItem", ClientIdStorageKey, ClientId);
        OnStateChanged?.Invoke();
    }

    public async Task RequestTokenAsync()
    {
        IsBusy = true;
        StatusMessage = "Connecting to Google Account...";
        OnStateChanged?.Invoke();

        try
        {
            var token = await _jsRuntime.InvokeAsync<string>("googleDriveHelper.requestAccessToken", ClientId);
            if (!string.IsNullOrWhiteSpace(token))
            {
                AccessToken = token;
                StatusMessage = "Connected to Google Drive!";
                await FetchUserInfoAsync();
            }
            else
            {
                StatusMessage = "Authentication cancelled or failed.";
            }
        }
        catch (Exception ex)
        {
            StatusMessage = $"Connection failed: {ex.Message}";
        }
        finally
        {
            IsBusy = false;
            OnStateChanged?.Invoke();
        }
    }

    public void Disconnect()
    {
        AccessToken = null;
        UserEmail = null;
        StatusMessage = "Disconnected from Google Drive.";
        OnStateChanged?.Invoke();
    }

    private async Task FetchUserInfoAsync()
    {
        if (string.IsNullOrWhiteSpace(AccessToken)) return;
        try
        {
            var req = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/oauth2/v3/userinfo");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
            var res = await _httpClient.SendAsync(req);
            if (res.IsSuccessStatusCode)
            {
                var json = await res.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("email", out var emailProp))
                {
                    UserEmail = emailProp.GetString();
                }
            }
        }
        catch { }
    }

    public async Task<bool> PushToDriveAsync()
    {
        if (!IsAuthenticated)
        {
            StatusMessage = "Please connect to Google Drive first.";
            OnStateChanged?.Invoke();
            return false;
        }

        IsBusy = true;
        StatusMessage = "Packaging data & uploading to Google Drive...";
        OnStateChanged?.Invoke();

        try
        {
            // 1. Gather all local state
            var heroesJson = await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", "cortex_saved_heroes_v2");
            var heroes = string.IsNullOrWhiteSpace(heroesJson) ? new List<HeroModel>() : JsonSerializer.Deserialize<List<HeroModel>>(heroesJson) ?? new();

            var payload = new SyncPayloadModel
            {
                Version = "2.0",
                LastSyncedAt = DateTime.UtcNow,
                ClientInfo = "SuperHeroes 2.0 Web Client",
                SavedHeroes = heroes,
                CustomLibrary = new CustomLibraryBackupModel
                {
                    Milestones = _customLibraryService.CustomMilestones,
                    Sfx = _customLibraryService.CustomSfx,
                    Limits = _customLibraryService.CustomLimits
                },
                DiceTheme = _themeService.CurrentTheme
            };

            var payloadJson = JsonSerializer.Serialize(payload, new JsonSerializerOptions { WriteIndented = true });

            // 2. Search for existing file on Drive
            var existingFileId = await FindBackupFileIdAsync();

            if (string.IsNullOrWhiteSpace(existingFileId))
            {
                // Create new file via multipart upload
                await CreateDriveFileAsync(payloadJson);
            }
            else
            {
                // Update existing file
                await UpdateDriveFileAsync(existingFileId, payloadJson);
            }

            LastSyncedAt = DateTime.UtcNow;
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", LastSyncStorageKey, LastSyncedAt.Value.ToString("O"));
            StatusMessage = $"✓ Successfully backed up {heroes.Count} heroes to Google Drive!";
            return true;
        }
        catch (Exception ex)
        {
            StatusMessage = $"Push failed: {ex.Message}";
            return false;
        }
        finally
        {
            IsBusy = false;
            OnStateChanged?.Invoke();
        }
    }

    public async Task<bool> PullFromDriveAsync(bool merge = true)
    {
        if (!IsAuthenticated)
        {
            StatusMessage = "Please connect to Google Drive first.";
            OnStateChanged?.Invoke();
            return false;
        }

        IsBusy = true;
        StatusMessage = "Searching and downloading backup from Google Drive...";
        OnStateChanged?.Invoke();

        try
        {
            var fileId = await FindBackupFileIdAsync();
            if (string.IsNullOrWhiteSpace(fileId))
            {
                StatusMessage = "No backup file ('CortexSuperHeroes_Backup.json') found on Google Drive.";
                return false;
            }

            // Download file content
            var req = new HttpRequestMessage(HttpMethod.Get, $"https://www.googleapis.com/drive/v3/files/{fileId}?alt=media");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
            var res = await _httpClient.SendAsync(req);

            if (!res.IsSuccessStatusCode)
            {
                StatusMessage = $"Failed to download file (HTTP {res.StatusCode}).";
                return false;
            }

            var json = await res.Content.ReadAsStringAsync();
            var payload = JsonSerializer.Deserialize<SyncPayloadModel>(json);
            if (payload == null)
            {
                StatusMessage = "Corrupted or invalid backup file on Google Drive.";
                return false;
            }

            // 1. Restore Heroes
            if (merge)
            {
                var existingJson = await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", "cortex_saved_heroes_v2");
                var localHeroes = string.IsNullOrWhiteSpace(existingJson) ? new List<HeroModel>() : JsonSerializer.Deserialize<List<HeroModel>>(existingJson) ?? new();

                // Merge by Id
                foreach (var remoteHero in payload.SavedHeroes)
                {
                    var matchIndex = localHeroes.FindIndex(h => h.Id == remoteHero.Id);
                    if (matchIndex >= 0)
                    {
                        localHeroes[matchIndex] = remoteHero;
                    }
                    else
                    {
                        localHeroes.Add(remoteHero);
                    }
                }
                var updatedJson = JsonSerializer.Serialize(localHeroes);
                await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "cortex_saved_heroes_v2", updatedJson);
            }
            else
            {
                var updatedJson = JsonSerializer.Serialize(payload.SavedHeroes);
                await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "cortex_saved_heroes_v2", updatedJson);
            }

            // 2. Restore Custom Library
            if (payload.CustomLibrary != null)
            {
                foreach (var kvp in payload.CustomLibrary.Milestones)
                    await _customLibraryService.SaveCustomMilestoneAsync(kvp.Key, kvp.Value);

                foreach (var kvp in payload.CustomLibrary.Sfx)
                    await _customLibraryService.SaveCustomSfxAsync(kvp.Key, kvp.Value);

                foreach (var kvp in payload.CustomLibrary.Limits)
                    await _customLibraryService.SaveCustomLimitAsync(kvp.Key, kvp.Value);
            }

            // 3. Restore Theme if present
            if (payload.DiceTheme != null)
            {
                await _themeService.SetThemeAsync(payload.DiceTheme);
            }

            LastSyncedAt = DateTime.UtcNow;
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", LastSyncStorageKey, LastSyncedAt.Value.ToString("O"));
            StatusMessage = $"✓ Successfully restored {payload.SavedHeroes.Count} heroes from Google Drive!";
            return true;
        }
        catch (Exception ex)
        {
            StatusMessage = $"Pull failed: {ex.Message}";
            return false;
        }
        finally
        {
            IsBusy = false;
            OnStateChanged?.Invoke();
        }
    }

    private async Task<string?> FindBackupFileIdAsync()
    {
        var query = Uri.EscapeDataString($"name = '{BackupFileName}' and trashed = false");
        var url = $"https://www.googleapis.com/drive/v3/files?q={query}&fields=files(id,name,modifiedTime)";

        var req = new HttpRequestMessage(HttpMethod.Get, url);
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
        var res = await _httpClient.SendAsync(req);

        if (!res.IsSuccessStatusCode) return null;

        var json = await res.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        if (doc.RootElement.TryGetProperty("files", out var filesArray) && filesArray.GetArrayLength() > 0)
        {
            return filesArray[0].GetProperty("id").GetString();
        }
        return null;
    }

    private async Task CreateDriveFileAsync(string content)
    {
        var boundary = "------------" + DateTime.UtcNow.Ticks.ToString("x");
        var multipartContent = new MultipartFormDataContent(boundary);

        // Metadata part
        var metadata = new { name = BackupFileName, mimeType = "application/json" };
        var metadataContent = new StringContent(JsonSerializer.Serialize(metadata), Encoding.UTF8, "application/json");
        multipartContent.Add(metadataContent);

        // File Content part
        var fileContent = new StringContent(content, Encoding.UTF8, "application/json");
        multipartContent.Add(fileContent);

        var req = new HttpRequestMessage(HttpMethod.Post, "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart")
        {
            Content = multipartContent
        };
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

        var res = await _httpClient.SendAsync(req);
        res.EnsureSuccessStatusCode();
    }

    private async Task UpdateDriveFileAsync(string fileId, string content)
    {
        var req = new HttpRequestMessage(new HttpMethod("PATCH"), $"https://www.googleapis.com/upload/drive/v3/files/{fileId}?uploadType=media")
        {
            Content = new StringContent(content, Encoding.UTF8, "application/json")
        };
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

        var res = await _httpClient.SendAsync(req);
        res.EnsureSuccessStatusCode();
    }
}
