# Venture Pulse — Security, Privacy & API Safety Specification
**Zero-Leak Credential Protection & Privacy-Preserving Cultural Intelligence**

---

## 1. Security Architecture & Threat Model

Venture Pulse processes proprietary API keys (`QLOO_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`) and outbound webhook URLs. Our security architecture ensures that **no private credential ever reaches the client browser, git history, or client-side telemetry**.

```mermaid
flowchart TD
    subgraph Browser["Client Browser (Untrusted Zone)"]
        UI["React / Next.js Client Components"]
    end

    subgraph Server["Next.js Server / Edge Runtime (Trusted Zone)"]
        Env["Server Environment Variables\n(process.env.QLOO_API_KEY)"]
        Proxy["Server Action / Route Proxy"]
        Sanitizer["Data Sanitizer & Redactor"]
    end

    subgraph External["External APIs"]
        Qloo["Qloo Taste Graph API"]
        LLM["LLM Inference Providers"]
    end

    UI -->|Session Payload without Keys| Proxy
    Proxy --> Env
    Proxy -->|Authenticated Request| Qloo
    Proxy -->|Authenticated Request| LLM
    Qloo --> Sanitizer
    LLM --> Sanitizer
    Sanitizer -->|Sanitized Result (Zero Keys)| UI
```

---

## 2. Security Protocols in Venture Pulse

### 2.1 Zero Client-Side Exposure
* All external API calls are executed strictly within Next.js Route Handlers (`/app/api/...`) or Server Actions.
* API keys are never prefixed with `NEXT_PUBLIC_`.
* Automated build-time checks verify that no secret keys are bundled into client-side chunks.

### 2.2 Git Guardian & Repository Hygiene
* `.gitignore` is pre-configured to strictly reject all environment files:
  ```gitignore
  .env
  .env*.local
  .env.local
  ```
* Continuous Integration (CI) runs automated secret scanning (`git-secrets` / Gitleaks) to prevent accidental commits of API tokens.

### 2.3 SSRF & Webhook Protection
When dispatching to external CRM endpoints:
* Target URLs must validate against strict URL protocol rules (`https://` required).
* Private and loopback IP ranges (`localhost`, `127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, AWS metadata `169.254.169.254`) are blocked at the networking layer to prevent Server-Side Request Forgery (SSRF).

---

## 3. Privacy & Cultural Data Guidelines

In compliance with Qloo’s hackathon data governance standards:
* **Aggregate Cultural Data Only:** Qloo data represents aggregate statistical affinities of subcultures and cohorts. Venture Pulse does not ingest, infer, or store Personal Identifiable Information (PII).
* **Respect of Creator Autonomy:** Creators have full control over what cultural anchors and brand suggestions are accepted, edited, or deleted before dispatch.
