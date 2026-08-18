using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using SuperHeroes.Client;
using SuperHeroes.Client.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddScoped<DiceThemeService>();
builder.Services.AddScoped<CustomLibraryService>();
builder.Services.AddScoped<HeroApiService>();

var host = builder.Build();

// Initialize theme preferences and custom library from local storage
var themeService = host.Services.GetRequiredService<DiceThemeService>();
await themeService.InitializeAsync();

var libraryService = host.Services.GetRequiredService<CustomLibraryService>();
await libraryService.InitializeAsync();

await host.RunAsync();
