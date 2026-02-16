# API Reference

**HiG Gävle API** – http://localhost:8080  
**Swagger UI** – http://localhost:8080/swagger-ui/index.html

---

## Current Implementation (aligned with Swagger)

### Base URL
```
http://localhost:8080/api
```

### Educations (JobEd)

| Endpoint | Method | Params | Description |
|----------|--------|--------|-------------|
| `/educations` | GET | page, size | Get all educations (paginated) |
| `/educations/{id}` | GET | — | Get single education by ID |
| `/educations/search` | GET | **query** (required), providerTitle (optional), page, size | Search by title |
| `/educations/search/filter` | GET | provider (repeatable), regionCode (repeatable), page, size | Filter by multiple providers and/or regions. Example: `?provider=A&provider=B&regionCode=01&regionCode=12` |
| `/educations/regions` | GET | — | List available regions (RegionDto[]) |
| `/educations/region/{regionCode}` | GET | page, size | Find educations by region |
| `/educations/provider/{provider}` | GET | page, size | Find educations by provider |

### Response Types

**EducationJobEdResponse** (list & detail):
- `id`: string
- `title`: string
- `providers`: string[]
- `regionCodes`: string[] (optional)
- `fullData`: object (optional)
- `lastSynced`: string (ISO date-time)

**Other endpoints:**
- `GET /api/education-providers` – All universities/providers (paginated)

**PagedResponse**:
- `content`: T[]
- `page`: { number, size, totalElements, totalPages, first, last, hasNext, hasPrevious }

---

## Other API Endpoints (not yet used)

- `/api/v1/education-info` – Education info (different schema)
- `/api/education-providers` – Providers
- `/api/education-events` – Events (with town, search, etc.)
