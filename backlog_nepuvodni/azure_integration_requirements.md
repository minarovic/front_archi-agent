# Azure Database Integration Requirements
*Škoda Auto Procurement Intelligence - Internal Data Platform*

**Date:** 2025-09-18
**Status:** Architecture Design
**Replaces:** Direct SAP/DAP Integration

---

## 📋 Executive Summary

Instead of direct SAP/DAP integration, we will use **Azure SQL Database** as the integration layer. This approach provides:
- ✅ **Better performance** (<100ms query response)
- ✅ **Simplified security** (no SAP credentials in app)
- ✅ **Decoupled architecture** (SAP changes don't affect app)
- ✅ **Scalability** (read replicas, caching)
- ✅ **Standard integration** (SQL, REST API)

---

## 🏗️ Architecture Overview

```
┌─────────────┐      Daily ETL       ┌──────────────┐
│   SAP/DAP   │──────────────────────▶│ Azure Data   │
│   Systems   │     (Azure Data       │   Factory    │
└─────────────┘      Factory)         └──────────────┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │  Azure SQL DB    │
                                    │  (Procurement)   │
                                    └──────────────────┘
                                               │
                                    ┌──────────┴──────────┐
                                    ▼                     ▼
                            ┌──────────────┐     ┌──────────────┐
                            │  LangGraph   │     │   REST API   │
                            │   Workflow   │     │   Endpoint   │
                            └──────────────┘     └──────────────┘
```

---

## 📊 Database Schema Design

### Core Tables

#### 1. **suppliers** (Tier 1 Master Data)
```sql
CREATE TABLE suppliers (
    supplier_id VARCHAR(50) PRIMARY KEY,      -- Internal SAP ID
    duns_number VARCHAR(9),                   -- D&B DUNS
    sayari_entity_id VARCHAR(50),             -- Sayari Entity ID
    name NVARCHAR(255) NOT NULL,
    status VARCHAR(20),                       -- ACTIVE/INACTIVE/BLOCKED
    commodity_group VARCHAR(50),
    tier_classification INT DEFAULT 1,
    primary_plant VARCHAR(20),                -- MB/KV/VR
    created_date DATETIME,
    modified_date DATETIME,
    INDEX idx_duns (duns_number),
    INDEX idx_commodity (commodity_group),
    INDEX idx_plant (primary_plant)
);
```

#### 2. **supplier_financials** (Business Volumes)
```sql
CREATE TABLE supplier_financials (
    id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    purchase_volume DECIMAL(18,2),            -- Annual spend in EUR
    invoice_count INT,
    payment_terms INT,                        -- Days
    on_time_delivery_rate DECIMAL(5,2),       -- Percentage
    quality_score DECIMAL(5,2),               -- 0-100
    currency VARCHAR(3) DEFAULT 'EUR',
    data_date DATE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    UNIQUE KEY uk_supplier_year (supplier_id, year)
);
```

#### 3. **projects_parts** (Production Dependencies)
```sql
CREATE TABLE projects_parts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    project_code VARCHAR(50),                 -- SK316, SK376, etc.
    part_number VARCHAR(100),
    supplier_id VARCHAR(50),
    criticality VARCHAR(20),                  -- CRITICAL/HIGH/MEDIUM/LOW
    single_source BOOLEAN DEFAULT FALSE,
    alternative_suppliers JSON,               -- Array of supplier_ids
    annual_quantity INT,
    unit_price DECIMAL(10,4),
    lead_time_days INT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    INDEX idx_project (project_code),
    INDEX idx_part (part_number),
    INDEX idx_criticality (criticality)
);
```

#### 4. **plant_allocations** (Facility Mapping)
```sql
CREATE TABLE plant_allocations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id VARCHAR(50) NOT NULL,
    plant_code VARCHAR(20) NOT NULL,          -- MB/KV/VR
    allocation_percentage DECIMAL(5,2),
    production_capacity INT,
    distance_km INT,
    transport_mode VARCHAR(20),               -- TRUCK/RAIL/AIR
    avg_transit_days DECIMAL(5,2),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    INDEX idx_plant_supplier (plant_code, supplier_id)
);
```

#### 5. **risk_events** (Historical Incidents)
```sql
CREATE TABLE risk_events (
    event_id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id VARCHAR(50),
    event_date DATETIME,
    event_type VARCHAR(50),                   -- DELIVERY_DELAY/QUALITY_ISSUE/BANKRUPTCY
    severity VARCHAR(20),                     -- CRITICAL/HIGH/MEDIUM/LOW
    impact_description NVARCHAR(MAX),
    resolution_days INT,
    cost_impact DECIMAL(18,2),
    affected_parts JSON,                      -- Array of part numbers
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    INDEX idx_event_date (event_date),
    INDEX idx_event_type (event_type)
);
```

---

## 🔌 Integration Patterns

### 1. **Connection Configuration**
```python
# Azure SQL Database connection
AZURE_SQL_CONFIG = {
    "server": "skoda-procurement.database.windows.net",
    "database": "procurement_intelligence",
    "authentication": "ActiveDirectoryPassword",  # Or Managed Identity
    "driver": "{ODBC Driver 18 for SQL Server}",
    "connection_timeout": 30,
    "command_timeout": 60,
    "encrypt": "yes",
    "trust_server_certificate": "no"
}
```

### 2. **Async Data Access Layer**
```python
from azure.sql import AsyncConnection
from typing import List, Dict, Optional
import asyncio

class AzureProcurementDB:
    """Async wrapper for Azure SQL procurement data"""

    def __init__(self, config: Dict):
        self.config = config
        self.pool = None

    async def initialize(self):
        """Create connection pool"""
        self.pool = await create_async_pool(
            min_size=5,
            max_size=20,
            **self.config
        )

    async def get_tier1_suppliers(
        self,
        commodity_group: Optional[str] = None,
        plant: Optional[str] = None
    ) -> List[Dict]:
        """Fetch Tier 1 suppliers with filters"""
        query = """
            SELECT
                s.supplier_id,
                s.duns_number,
                s.name,
                s.commodity_group,
                sf.purchase_volume,
                sf.quality_score
            FROM suppliers s
            LEFT JOIN supplier_financials sf ON
                s.supplier_id = sf.supplier_id
                AND sf.year = YEAR(GETDATE()) - 1
            WHERE s.tier_classification = 1
                AND s.status = 'ACTIVE'
        """

        params = []
        if commodity_group:
            query += " AND s.commodity_group = ?"
            params.append(commodity_group)

        if plant:
            query += """
                AND EXISTS (
                    SELECT 1 FROM plant_allocations pa
                    WHERE pa.supplier_id = s.supplier_id
                    AND pa.plant_code = ?
                )
            """
            params.append(plant)

        async with self.pool.acquire() as conn:
            return await conn.fetch_all(query, params)

    async def get_supplier_risk_history(
        self,
        supplier_id: str,
        days_back: int = 365
    ) -> List[Dict]:
        """Get risk events for supplier"""
        query = """
            SELECT
                event_date,
                event_type,
                severity,
                cost_impact
            FROM risk_events
            WHERE supplier_id = ?
                AND event_date >= DATEADD(day, -?, GETDATE())
            ORDER BY event_date DESC
        """

        async with self.pool.acquire() as conn:
            return await conn.fetch_all(query, [supplier_id, days_back])
```

### 3. **Caching Strategy**
```python
import redis.asyncio as redis
from datetime import timedelta

class CachedAzureDB(AzureProcurementDB):
    """Azure DB with Redis caching"""

    def __init__(self, config: Dict):
        super().__init__(config)
        self.redis = None

    async def initialize(self):
        await super().initialize()
        self.redis = await redis.from_url(
            "redis://localhost:6379",
            encoding="utf-8",
            decode_responses=True
        )

    async def get_tier1_suppliers(self, **kwargs) -> List[Dict]:
        """Cached Tier1 lookup"""
        cache_key = f"tier1:{hash(frozenset(kwargs.items()))}"

        # Try cache first
        if cached := await self.redis.get(cache_key):
            return json.loads(cached)

        # Fetch from Azure SQL
        result = await super().get_tier1_suppliers(**kwargs)

        # Cache for 1 hour
        await self.redis.setex(
            cache_key,
            timedelta(hours=1),
            json.dumps(result)
        )

        return result
```

---

## 📈 Performance Requirements

### Query Performance SLAs
| Query Type | Target Response | Max Response | Cache TTL |
|------------|----------------|--------------|-----------|
| Tier1 list | <100ms | 500ms | 1 hour |
| Supplier details | <50ms | 200ms | 30 min |
| Risk history | <200ms | 1s | 1 hour |
| Part criticality | <100ms | 500ms | 24 hours |
| Project impact | <500ms | 2s | No cache |

### Scaling Considerations
```yaml
# Azure SQL Database Configuration
Tier: Premium P2
DTUs: 250
Max Concurrent Connections: 300
Storage: 500GB with auto-growth
Geo-Replication: West Europe (primary), North Europe (secondary)

# Read Replica for Analytics
Read-Only Replica: Yes
Purpose: Heavy analytical queries
Connection String: Different endpoint
```

---

## 🔐 Security & Compliance

### 1. **Authentication**
```python
# Managed Identity (recommended)
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
token = credential.get_token("https://database.windows.net/.default")
```

### 2. **Row-Level Security**
```sql
-- Filter suppliers by user's plant access
CREATE FUNCTION dbo.fn_security_predicate(@plant_code VARCHAR(20))
RETURNS TABLE
WITH SCHEMABINDING
AS RETURN (
    SELECT 1 AS result
    WHERE @plant_code IN (
        SELECT value FROM STRING_SPLIT(CAST(SESSION_CONTEXT(N'AllowedPlants') AS VARCHAR(200)), ',')
    )
);

CREATE SECURITY POLICY SupplierFilter
ADD FILTER PREDICATE dbo.fn_security_predicate(primary_plant)
ON dbo.suppliers;
```

### 3. **Audit Logging**
```sql
-- Enable Azure SQL Auditing
CREATE DATABASE AUDIT SPECIFICATION ProcurementAudit
FOR SERVER AUDIT [SkodaAudit]
ADD (SELECT ON dbo.suppliers BY [public]),
ADD (UPDATE ON dbo.supplier_financials BY [public]),
ADD (INSERT ON dbo.risk_events BY [public]);
```

---

## 🔄 Data Synchronization

### ETL Pipeline (Azure Data Factory)
```json
{
  "name": "SAP_to_Azure_SQL_Pipeline",
  "properties": {
    "activities": [
      {
        "name": "Extract_Suppliers",
        "type": "Copy",
        "source": {
          "type": "SapTableSource",
          "query": "SELECT * FROM LFA1 WHERE KTOKK = 'Z001'"
        },
        "sink": {
          "type": "AzureSqlSink",
          "writeBehavior": "upsert",
          "upsertSettings": {
            "useTempDB": true,
            "keys": ["supplier_id"]
          }
        }
      }
    ],
    "schedule": {
      "frequency": "Day",
      "interval": 1,
      "startTime": "02:00:00"
    }
  }
}
```

### Data Freshness Requirements
| Data Type | Update Frequency | Acceptable Lag |
|-----------|-----------------|----------------|
| Supplier master | Daily | 24 hours |
| Financial data | Weekly | 7 days |
| Risk events | Real-time | <5 minutes |
| Projects/Parts | Daily | 24 hours |
| Plant allocations | Weekly | 7 days |

---

## 🔍 Monitoring & Alerts

### Key Metrics to Monitor
```python
# Azure Application Insights integration
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

configure_azure_monitor(
    connection_string="InstrumentationKey=xxx"
)

tracer = trace.get_tracer(__name__)

async def get_supplier_with_monitoring(supplier_id: str):
    with tracer.start_as_current_span("get_supplier") as span:
        span.set_attribute("supplier.id", supplier_id)
        start_time = time.time()

        try:
            result = await db.get_supplier(supplier_id)
            span.set_attribute("db.query.duration", time.time() - start_time)
            return result
        except Exception as e:
            span.record_exception(e)
            raise
```

### Alert Rules
```yaml
alerts:
  - name: "High Query Latency"
    condition: "avg(query_duration) > 1000ms for 5 minutes"
    severity: "Warning"

  - name: "Connection Pool Exhausted"
    condition: "available_connections < 10"
    severity: "Critical"

  - name: "Data Freshness Violation"
    condition: "max(data_date) < now() - interval '25 hours'"
    severity: "Warning"
```

---

## 🚀 Implementation Timeline

### Week 1-2: Foundation
- [ ] Provision Azure SQL Database
- [ ] Create database schema
- [ ] Set up Azure Data Factory pipelines
- [ ] Configure security policies

### Week 3-4: Integration
- [ ] Implement async data access layer
- [ ] Set up Redis caching
- [ ] Create monitoring dashboards
- [ ] Test ETL pipelines

### Week 5-6: Optimization
- [ ] Performance tuning (indexes, partitioning)
- [ ] Implement read replicas
- [ ] Set up automated backups
- [ ] Disaster recovery testing

---

## 📝 Migration Checklist

### From Direct SAP to Azure SQL
1. ✅ **Data Mapping** - Map SAP tables to Azure schema
2. ✅ **ETL Setup** - Configure Data Factory pipelines
3. ✅ **Access Layer** - Replace SAP RFC with SQL queries
4. ✅ **Caching** - Add Redis for performance
5. ✅ **Monitoring** - Set up Application Insights
6. ✅ **Security** - Configure Managed Identity
7. ✅ **Testing** - Validate data completeness
8. ✅ **Cutover** - Switch to Azure SQL endpoint

---

## 🎯 Success Criteria

### Technical
- **Query Performance:** 95% queries <200ms
- **Data Freshness:** 100% within SLA
- **Availability:** 99.9% uptime
- **Completeness:** >95% records migrated

### Business
- **Screening Time:** <5 minutes for Tier1 analysis
- **Data Quality:** >90% accuracy vs SAP
- **User Adoption:** >80% active users in Month 1

---

**Document Version:** 1.0
**Next Review:** 2025-10-01
**Owner:** Data Engineering Team
**Contact:** data-platform@skoda-auto.cz