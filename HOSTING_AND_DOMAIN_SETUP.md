# Zero-Cost Hosting & Domain Setup Guide: `heroes.lynnjones.rocks`

This guide explains how to host the new **SuperHeroes 2.0** Blazor WebAssembly frontend at **`heroes.lynnjones.rocks`** while maintaining your existing Azure Function API backend on a **$0.00 / extreme low-budget** tier.

---

## 🏗️ Architecture Overview

```
[User Browser]
       │
       ├──► https://heroes.lynnjones.rocks
       │    └── Azure Static Web Apps (Free Tier)
       │        ├── $0.00 / month
       │        ├── 100 GB/month bandwidth free
       │        ├── Automatic Free TLS/SSL Certificate
       │        └── Global CDN distribution
       │
       └──► https://jfsuperherofunction-...azurewebsites.net/api/hero
            └── Azure Functions Consumption Plan (Pay-as-you-go)
                ├── $0.00 / month (1,000,000 free executions/month)
                └── Serverless auto-scaling
```

---

## Step 1: Provision the Free Azure Static Web App

1. Go to the [Azure Portal](https://portal.azure.com).
2. Click **Create a resource** > Search for **Static Web App** > Click **Create**.
3. Fill in the basics:
   - **Subscription**: Your Pay-As-You-Go subscription.
   - **Resource Group**: Use your existing resource group (same as `JFSuperheroFunction` or `CortexUtilities`).
   - **Name**: `jfsuperheroes-web` (or any name you prefer).
   - **Plan type**: **Free** ($0.00/mo).
   - **Region**: Central US (or closest to your function).
4. Under **Deployment details**:
   - **Source**: **GitHub**.
   - **Organization**: `lynn0702`.
   - **Repository**: `JFSuperheroFunction`.
   - **Branch**: `main`.
   - **Build Presets**: **Custom** (or Blazor).
   - **App location**: `SuperHeroes2.0/Client`
   - **Api location**: (Leave blank)
   - **Output location**: `wwwroot` (or `output/wwwroot`)
5. Click **Review + create** > **Create**.

> [!NOTE]
> Azure will automatically add a secret named `AZURE_STATIC_WEB_APPS_API_TOKEN_...` to your GitHub repository and link the GitHub Actions workflow in `.github/workflows/azure-static-web-apps-heroes.yml`.

---

## Step 2: Configure Custom Subdomain `heroes.lynnjones.rocks`

### 1. In your DNS Provider for `lynnjones.rocks` (where your domain is managed):
Add a new **CNAME** DNS record:
- **Type**: `CNAME`
- **Host / Name / Subdomain**: `heroes`
- **Value / Target / Points to**: `<your-app-name>.azurestaticapps.net` *(find this URL on the Overview page of your Static Web App)*
- **TTL**: Auto or `300` seconds
- **Proxy Status** (if using Cloudflare): *DNS Only* (Grey Cloud) during initial validation, then proxied.

### 2. In Azure Static Web App Portal:
1. Navigate to your Static Web App (`jfsuperheroes-web`).
2. In the left sidebar, click **Custom domains**.
3. Click **+ Add** > Choose **Custom domain on other DNS**.
4. Enter `heroes.lynnjones.rocks` and click **Next**.
5. Choose **CNAME record** validation method.
6. Azure will detect the DNS record and automatically generate a **free, auto-renewing SSL certificate** from DigiCert.

---

## Step 3: Enable CORS on your Azure Function

Because the Blazor WebAssembly frontend makes browser `fetch` calls to your Azure Function API, you must permit the `heroes.lynnjones.rocks` origin:

1. In the [Azure Portal](https://portal.azure.com), go to your **Function App** (`jfsuperherofunction-...`).
2. In the left sidebar under **API**, click **CORS**.
3. In **Allowed Origins**, add:
   - `https://heroes.lynnjones.rocks`
   - `https://localhost:7000` (for local development)
   - `http://localhost:5000` (for local development)
4. Check **Enable Access-Control-Allow-Credentials** (optional).
5. Click **Save**.

---

## Step 4: Budget & Cost Safeguards ($0.00 / month Guarantee)

To guarantee you never pay unexpected charges for this hobbyist project:

1. **Azure Functions Consumption Plan Free Grant**:
   - Every Azure subscription receives **1 Million free executions** and **400,000 GB-seconds** of compute every month for life.
   - For a hobby tool, you are unlikely to exceed 0.1% of this limit.
2. **Azure Static Web Apps Free Tier**:
   - Includes **100 GB bandwidth / month** and 3 custom domains per app with free SSL at $0.00.
3. **Set a $1.00 Azure Budget Alert**:
   - In Azure Portal, search for **Cost Management + Billing** > **Budgets**.
   - Create a budget with an amount of **$1.00 USD**.
   - Add your email for alerts at 50%, 80%, and 100%. If any charges ever appear, you will receive an immediate notification.

---

## 🚀 Running Locally

To run and test the SuperHeroes 2.0 Blazor frontend on your local machine:

```powershell
# Navigate to the Client directory
cd SuperHeroes2.0/Client

# Run the local development server
dotnet watch run
```

Then open your browser to `http://localhost:5000` or `https://localhost:7001`.
