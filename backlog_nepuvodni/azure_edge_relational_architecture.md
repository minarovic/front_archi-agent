# Azure Edge Relational Architecture
*Škoda Auto Procurement Intelligence - Complete System Architecture*

**Version:** 1.0
**Date:** 2025-09-18
**Status:** Master Architecture Document

---

## 📋 Executive Summary

### Architecture Overview
**Azure Edge Computing** deployment with **relational database** backend, **batch processing** workflows, and **full API integration** (DnB + Sayari) for 20,000 supplier intelligence system.

### Key Architectural Decisions
- ✅ **Azure Edge Computing:** Docker containers in Azure cloud environment
- ✅ **Relational Database:** Azure SQL Database with pre-loaded supplier structure
- ✅ **Batch Processing:** Scheduled updates, AI Agent orchestration with latency tolerance
- ✅ **Full API Integration:** Both DnB and Sayari APIs fully available and utilized
- ✅ **Pre-loaded Data:** 20k suppliers (10k active + 10k potential) loaded at initialization

### Business Capabilities Delivered
- **<5 minute screening** for Tier 1 suppliers
- **Complete supply chain visibility** across multiple tiers
- **Risk assessment and monitoring** with early warning capabilities
- **Crisis impact analysis** with quantified business impact
- **Alternative supplier recommendations** powered by AI

---

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Azure Cloud Environment                    │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Azure SQL    │  │   Azure Edge     │  │  Batch Job   │  │
│  │  Database     │  │   Compute Node   │  │  Scheduler   │  │
│  │               │  │                  │  │              │  │
│  │ • 20k suppliers│  │ • LangGraph API  │  │ • Daily ETL  │  │
│  │ • Relationships│  │ • AI Agent       │  │ • API Updates│  │
│  │ • Time-series │  │ • FastAPI        │  │ • Calculations│  │
│  └───────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
           ┌────────▼──────┐      ┌────────▼──────┐
           │  DnB Direct+  │      │   Sayari API  │
           │               │      │               │
           │ • Financial   │      │ • Trade data  │
           │ • Ownership   │      │ • Network     │
           │ • Risk data   │      │ • UBO info    │
           └───────────────┘      └───────────────┘
```

### Core Components

#### 1. **Azure SQL Database** (Primary Data Store)
```sql
-- Core supplier structure
CREATE TABLE suppliers (
    supplier_id VARCHAR(50) PRIMARY KEY,
    tier_level INT NOT NULL,
    name NVARCHAR(255) NOT NULL,
    duns_number VARCHAR(9),
    sayari_entity_id VARCHAR(50),
    commodity_group VARCHAR(50),
    annual_volume_eur DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    country VARCHAR(3),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    created_date DATETIME DEFAULT GETDATE(),
    last_updated DATETIME DEFAULT GETDATE(),

    INDEX idx_tier (tier_level),
    INDEX idx_duns (duns_number),
    INDEX idx_commodity (commodity_group),
    INDEX idx_country (country)
);

-- Supply chain relationships
CREATE TABLE supplier_relationships (
    id INT IDENTITY(1,1) PRIMARY KEY,
    parent_supplier_id VARCHAR(50) NOT NULL,
    child_supplier_id VARCHAR(50) NOT NULL,
    relationship_type VARCHAR(50), -- 'SUPPLIES_TO', 'SUBSIDIARY_OF', 'PARENT_OF'
    confidence_score DECIMAL(3,2) DEFAULT 0.80,
    data_source VARCHAR(20), -- 'SAYARI', 'DNB', 'INTERNAL'
    created_date DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (parent_supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (child_supplier_id) REFERENCES suppliers(supplier_id),
    UNIQUE KEY uk_relationship (parent_supplier_id, child_supplier_id, relationship_type)
);

-- Financial and risk metrics (time-series)
CREATE TABLE supplier_metrics (
    id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id VARCHAR(50) NOT NULL,
    metric_date DATE NOT NULL,
    financial_score DECIMAL(5,2),
    failure_score DECIMAL(5,2),
    paydex_score INT,
    delivery_performance DECIMAL(5,2),
    quality_score DECIMAL(5,2),
    risk_level VARCHAR(20),
    data_source VARCHAR(20),

    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    INDEX idx_supplier_date (supplier_id, metric_date),
    INDEX idx_date (metric_date)
);

-- Business dependencies and impact
CREATE TABLE business_dependencies (
    id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id VARCHAR(50) NOT NULL,
    project_code VARCHAR(50),
    part_number VARCHAR(100),
    criticality VARCHAR(20), -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    single_source BOOLEAN DEFAULT FALSE,
    annual_quantity INT,
    unit_price DECIMAL(10,4),
    lead_time_days INT,
    plant_code VARCHAR(20), -- 'MB', 'KV', 'VR'

    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    INDEX idx_supplier_project (supplier_id, project_code),
    INDEX idx_criticality (criticality),
    INDEX idx_plant (plant_code)
);
```

#### 2. **Azure Edge Compute Node** (Application Layer)
```yaml
Azure Edge Configuration:
  VM Size: Standard_D4s_v3 (4 vCPU, 16 GB RAM)
  OS: Ubuntu 22.04 LTS
  Docker Engine: Latest stable

  Containers:
    - langgraph-api:
        Image: custom/langgraph-procurement
        Ports: 8123:8000
        Memory: 8GB
        CPU: 2 cores

    - fastapi-service:
        Image: custom/fastapi-analytics
        Ports: 8125:8125
        Memory: 4GB
        CPU: 1 core

    - redis-cache:
        Image: redis:7-alpine
        Ports: 6379:6379
        Memory: 2GB
        Persistence: Enabled

  Network:
    - Virtual Network: procurement-vnet
    - Subnet: edge-compute-subnet
    - NSG: Allow HTTP/HTTPS, SSH, Custom ports
    - Load Balancer: Standard (for HA)
```

#### 3. **Batch Processing System** (Data Orchestration)
```python
# Azure Functions or Logic Apps for scheduled processing
class SupplierDataOrchestrator:
    """
    Batch processing orchestrator for supplier data updates
    Runs in Azure Functions with scheduled triggers
    """

    def __init__(self):
        self.db = AzureSQLConnection()
        self.dnb_client = DnBAPIClient()
        self.sayari_client = SayariAPIClient()

    @schedule(cron="0 2 * * *")  # Daily at 2 AM
    async def tier1_daily_update(self):
        """Daily update for Tier 1 suppliers (2000 suppliers)"""
        tier1_suppliers = await self.db.get_tier1_suppliers()

        # Batch update from DnB (financial + risk)
        for batch in chunks(tier1_suppliers, 50):
            await self.update_financial_data(batch)
            await asyncio.sleep(10)  # Respect rate limits

        # Update calculated metrics
        await self.calculate_risk_scores()
        await self.detect_deterioration()

        logger.info(f"Tier 1 daily update completed: {len(tier1_suppliers)} suppliers")

    @schedule(cron="0 3 * * 0")  # Weekly on Sunday at 3 AM
    async def tier2_weekly_update(self):
        """Weekly update for Tier 2 suppliers (5000 suppliers)"""
        tier2_suppliers = await self.db.get_tier2_suppliers()

        # Sayari supply chain analysis
        for batch in chunks(tier2_suppliers, 100):
            await self.update_supply_chain_data(batch)
            await asyncio.sleep(30)

        # Network analysis updates
        await self.calculate_spof_scores()
        await self.detect_hidden_risks()

        logger.info(f"Tier 2 weekly update completed: {len(tier2_suppliers)} suppliers")
```

---

## 📊 Data Model & Relationships

### Pre-loaded Supplier Structure
```
┌─────────────────────────────────┐
│         Tier 1 Suppliers        │
│         (2,000 suppliers)       │
│      ● Complete financial data  │
│      ● Full ownership structure │
│      ● Daily monitoring         │
└─────────────┬───────────────────┘
              │
    ┌─────────▼─────────┐
    │   Tier 2 Suppliers │
    │   (5,000 suppliers)│
    │   ● Partial data   │
    │   ● Weekly updates │
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │   Tier 3+ Suppliers│
    │   (3,000 suppliers)│
    │   ● Basic info     │
    │   ● Monthly updates │
    └───────────────────┘

┌─────────────────────────────────┐
│      Potential Suppliers        │
│      (10,000 suppliers)         │
│      ● Discovery pool           │
│      ● Quarterly assessment     │
└─────────────────────────────────┘
```

### Relational Query Patterns
```sql
-- Fast tier-based queries
SELECT s.name, s.annual_volume_eur, sm.financial_score
FROM suppliers s
JOIN supplier_metrics sm ON s.supplier_id = sm.supplier_id
WHERE s.tier_level = 1
  AND s.commodity_group = 'SEMICONDUCTORS'
  AND sm.metric_date = (
      SELECT MAX(metric_date)
      FROM supplier_metrics sm2
      WHERE sm2.supplier_id = s.supplier_id
  );

-- Supply chain traversal (3 hops)
WITH supply_chain AS (
    SELECT parent_supplier_id, child_supplier_id, 1 as level
    FROM supplier_relationships
    WHERE parent_supplier_id = @supplier_id

    UNION ALL

    SELECT sr.parent_supplier_id, sr.child_supplier_id, sc.level + 1
    FROM supplier_relationships sr
    JOIN supply_chain sc ON sr.parent_supplier_id = sc.child_supplier_id
    WHERE sc.level < 3
)
SELECT DISTINCT s.name, s.tier_level, sc.level
FROM supply_chain sc
JOIN suppliers s ON sc.child_supplier_id = s.supplier_id
ORDER BY sc.level, s.name;

-- Risk aggregation by geographic region
SELECT s.country,
       COUNT(*) as supplier_count,
       AVG(sm.financial_score) as avg_financial_score,
       SUM(s.annual_volume_eur) as total_volume
FROM suppliers s
JOIN supplier_metrics sm ON s.supplier_id = sm.supplier_id
WHERE s.tier_level <= 2
  AND sm.metric_date >= DATEADD(month, -1, GETDATE())
GROUP BY s.country
HAVING COUNT(*) >= 5
ORDER BY total_volume DESC;
```

---

## 🔌 API Integration Architecture

### DnB Direct+ Integration
```python
class DnBAPIClient:
    """
    Production DnB API client for Azure Edge deployment
    Handles authentication, rate limiting, and batch processing
    """

    def __init__(self):
        self.base_url = "https://plus.dnb.com"
        self.auth_manager = DnBAuthManager()
        self.rate_limiter = TokenBucket(rate=5, capacity=10)  # 5 TPS
        self.cache = RedisClient()

    async def batch_financial_update(self, supplier_batch: List[str]) -> Dict:
        """
        Batch update financial data for supplier list
        Optimized for daily Tier 1 updates
        """
        results = {}

        for duns in supplier_batch:
            await self.rate_limiter.acquire()

            # Check cache first (24 hour TTL)
            cache_key = f"dnb:financial:{duns}"
            if cached := await self.cache.get(cache_key):
                results[duns] = json.loads(cached)
                continue

            # Fetch from API
            try:
                data = await self._fetch_company_profile(duns)
                results[duns] = data

                # Cache result
                await self.cache.setex(cache_key, 86400, json.dumps(data))

            except Exception as e:
                logger.error(f"DnB API error for DUNS {duns}: {e}")
                results[duns] = {"error": str(e)}

        return results

    async def _fetch_company_profile(self, duns: str) -> Dict:
        """Fetch comprehensive company profile"""
        token = await self.auth_manager.get_token()

        headers = {"Authorization": f"Bearer {token}"}
        params = {
            "blockIDs": "companyinfo_L2_v1,financialstrengthinsight_L4_v1,principalscontacts_L3_v2"
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/v1/data/duns/{duns}",
                headers=headers,
                params=params
            ) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    raise DnBAPIError(f"HTTP {response.status}: {await response.text()}")
```

### Sayari API Integration
```python
class SayariAPIClient:
    """
    Full Sayari API client for supply chain intelligence
    Leverages complete endpoint availability for comprehensive analysis
    """

    def __init__(self):
        self.base_url = "https://api.sayari.com"
        self.auth_manager = SayariAuthManager()
        self.rate_limiter = TokenBucket(rate=10, capacity=20)  # 10 TPS

    async def batch_supply_chain_analysis(self, entity_batch: List[str]) -> Dict:
        """
        Comprehensive supply chain analysis using full Sayari API
        """
        results = {}

        for entity_id in entity_batch:
            await self.rate_limiter.acquire()

            try:
                # Multi-endpoint data gathering
                entity_data = await self._get_entity_details(entity_id)
                trade_data = await self._get_trade_relationships(entity_id)
                ubo_data = await self._get_ultimate_owners(entity_id)
                network_data = await self._get_network_connections(entity_id)

                results[entity_id] = {
                    "entity": entity_data,
                    "trade": trade_data,
                    "ownership": ubo_data,
                    "network": network_data
                }

            except Exception as e:
                logger.error(f"Sayari API error for entity {entity_id}: {e}")
                results[entity_id] = {"error": str(e)}

        return results

    async def _get_trade_relationships(self, entity_id: str) -> Dict:
        """Get trade data - suppliers and buyers"""
        token = await self.auth_manager.get_token()

        # Use trade endpoints (now available)
        suppliers = await self._call_endpoint(
            "/v1/trade/search/suppliers",
            {"entity_id": entity_id}
        )
        buyers = await self._call_endpoint(
            "/v1/trade/search/buyers",
            {"entity_id": entity_id}
        )

        return {"suppliers": suppliers, "buyers": buyers}

    async def _get_network_connections(self, entity_id: str) -> Dict:
        """Get network analysis - upstream/downstream"""
        # Use supply chain traversal endpoints (now available)
        upstream = await self._call_endpoint(
            "/v1/supply_chain/upstream",
            {"entity_id": entity_id, "hops": 3}
        )
        downstream = await self._call_endpoint(
            "/v1/supply_chain/downstream",
            {"entity_id": entity_id, "hops": 2}
        )

        return {"upstream": upstream, "downstream": downstream}
```

---

## 🤖 AI Agent Architecture

### LangGraph Agent Workflows
```python
from langgraph import Graph, State
from typing import Dict, Any

class SupplierAnalysisState(State):
    """State for supplier analysis workflow"""
    supplier_id: str
    analysis_type: str  # 'risk_assessment', 'supply_chain', 'crisis_impact'
    input_data: Dict[str, Any]
    sql_results: Dict[str, Any] = {}
    api_data: Dict[str, Any] = {}
    calculated_metrics: Dict[str, Any] = {}
    final_report: Dict[str, Any] = {}
    confidence_score: float = 0.0

class SupplierAnalysisWorkflow:
    """
    AI Agent workflow for comprehensive supplier analysis
    Tolerates latency - focuses on thorough analysis over speed
    """

    def __init__(self):
        self.graph = Graph()
        self.db = AzureSQLConnection()
        self.dnb_client = DnBAPIClient()
        self.sayari_client = SayariAPIClient()

    def build_graph(self) -> Graph:
        """Build LangGraph workflow"""

        # Add nodes
        self.graph.add_node("load_base_data", self.load_base_data_node)
        self.graph.add_node("enrich_financial", self.enrich_financial_node)
        self.graph.add_node("analyze_supply_chain", self.analyze_supply_chain_node)
        self.graph.add_node("calculate_risks", self.calculate_risks_node)
        self.graph.add_node("generate_report", self.generate_report_node)

        # Add edges
        self.graph.add_edge("load_base_data", "enrich_financial")
        self.graph.add_edge("enrich_financial", "analyze_supply_chain")
        self.graph.add_edge("analyze_supply_chain", "calculate_risks")
        self.graph.add_edge("calculate_risks", "generate_report")

        # Set entry point
        self.graph.set_entry_point("load_base_data")

        return self.graph

    async def load_base_data_node(self, state: SupplierAnalysisState) -> SupplierAnalysisState:
        """Load base supplier data from Azure SQL"""
        supplier_id = state.supplier_id

        # SQL query for comprehensive supplier data
        query = """
            SELECT s.*,
                   sm.financial_score, sm.failure_score, sm.risk_level,
                   COUNT(sr.child_supplier_id) as direct_suppliers,
                   SUM(bd.annual_quantity * bd.unit_price) as total_dependency_value
            FROM suppliers s
            LEFT JOIN supplier_metrics sm ON s.supplier_id = sm.supplier_id
                AND sm.metric_date = (SELECT MAX(metric_date) FROM supplier_metrics WHERE supplier_id = s.supplier_id)
            LEFT JOIN supplier_relationships sr ON s.supplier_id = sr.parent_supplier_id
            LEFT JOIN business_dependencies bd ON s.supplier_id = bd.supplier_id
            WHERE s.supplier_id = @supplier_id
            GROUP BY s.supplier_id, s.name, sm.financial_score, sm.failure_score, sm.risk_level
        """

        sql_results = await self.db.execute_query(query, {"supplier_id": supplier_id})

        return SupplierAnalysisState(
            **state,
            sql_results=sql_results
        )

    async def enrich_financial_node(self, state: SupplierAnalysisState) -> SupplierAnalysisState:
        """Enrich with DnB financial data"""
        duns = state.sql_results.get("duns_number")

        if duns:
            dnb_data = await self.dnb_client.get_company_profile(duns)
            api_data = {**state.api_data, "dnb": dnb_data}
        else:
            api_data = state.api_data

        return SupplierAnalysisState(
            **state,
            api_data=api_data
        )

    async def analyze_supply_chain_node(self, state: SupplierAnalysisState) -> SupplierAnalysisState:
        """Analyze supply chain using Sayari data"""
        sayari_entity_id = state.sql_results.get("sayari_entity_id")

        if sayari_entity_id:
            sayari_data = await self.sayari_client.get_supply_chain_analysis(sayari_entity_id)
            api_data = {**state.api_data, "sayari": sayari_data}
        else:
            api_data = state.api_data

        return SupplierAnalysisState(
            **state,
            api_data=api_data
        )

    async def calculate_risks_node(self, state: SupplierAnalysisState) -> SupplierAnalysisState:
        """Calculate custom risk metrics using SQL and algorithms"""

        # Combined Risk Score (SQL-based)
        risk_query = """
            WITH risk_components AS (
                SELECT
                    supplier_id,
                    AVG(financial_score) as financial_risk,
                    COUNT(CASE WHEN sr.confidence_score < 0.7 THEN 1 END) as ownership_risk,
                    CASE
                        WHEN country IN ('CN', 'RU', 'IR') THEN 80
                        WHEN country IN ('UA', 'BY', 'MM') THEN 60
                        ELSE 20
                    END as geo_risk
                FROM suppliers s
                LEFT JOIN supplier_metrics sm ON s.supplier_id = sm.supplier_id
                LEFT JOIN supplier_relationships sr ON s.supplier_id = sr.child_supplier_id
                WHERE s.supplier_id = @supplier_id
                  AND sm.metric_date >= DATEADD(month, -3, GETDATE())
                GROUP BY s.supplier_id, s.country
            )
            SELECT
                supplier_id,
                (financial_risk * 0.4 + ownership_risk * 0.3 + geo_risk * 0.3) as combined_risk_score
            FROM risk_components
        """

        risk_results = await self.db.execute_query(risk_query, {"supplier_id": state.supplier_id})

        # SPOF Score (SQL-based network analysis)
        spof_query = """
            WITH supplier_criticality AS (
                SELECT
                    bd.supplier_id,
                    SUM(CASE WHEN bd.criticality = 'CRITICAL' THEN bd.annual_quantity * bd.unit_price ELSE 0 END) as critical_value,
                    COUNT(CASE WHEN bd.single_source = 1 THEN 1 END) as single_source_count,
                    COUNT(*) as total_dependencies
                FROM business_dependencies bd
                WHERE bd.supplier_id = @supplier_id
                GROUP BY bd.supplier_id
            )
            SELECT
                supplier_id,
                CASE
                    WHEN single_source_count > 0 AND critical_value > 1000000 THEN 95
                    WHEN single_source_count > 0 THEN 75
                    WHEN critical_value > 5000000 THEN 60
                    ELSE 30
                END as spof_score
            FROM supplier_criticality
        """

        spof_results = await self.db.execute_query(spof_query, {"supplier_id": state.supplier_id})

        calculated_metrics = {
            "combined_risk_score": risk_results.get("combined_risk_score", 50),
            "spof_score": spof_results.get("spof_score", 30),
            "confidence_score": min(95, len(state.api_data) * 30 + 35)  # Based on data completeness
        }

        return SupplierAnalysisState(
            **state,
            calculated_metrics=calculated_metrics,
            confidence_score=calculated_metrics["confidence_score"]
        )

    async def generate_report_node(self, state: SupplierAnalysisState) -> SupplierAnalysisState:
        """Generate final analysis report"""

        report = {
            "supplier_id": state.supplier_id,
            "analysis_timestamp": datetime.utcnow().isoformat(),
            "base_information": state.sql_results,
            "external_data": state.api_data,
            "risk_metrics": state.calculated_metrics,
            "overall_confidence": state.confidence_score,
            "recommendations": await self._generate_recommendations(state),
            "processing_time_minutes": 3.5  # Typical processing time
        }

        return SupplierAnalysisState(
            **state,
            final_report=report
        )

    async def _generate_recommendations(self, state: SupplierAnalysisState) -> List[str]:
        """Generate actionable recommendations based on analysis"""
        recommendations = []

        risk_score = state.calculated_metrics.get("combined_risk_score", 50)
        spof_score = state.calculated_metrics.get("spof_score", 30)

        if risk_score > 70:
            recommendations.append("HIGH RISK: Consider immediate risk mitigation measures")
        if spof_score > 80:
            recommendations.append("CRITICAL SPOF: Urgent alternative supplier identification required")
        if state.confidence_score < 60:
            recommendations.append("LOW CONFIDENCE: Additional data collection needed")

        return recommendations
```

---

## 📈 Performance & Scalability

### Performance Targets
| Metric | Target | Measurement |
|--------|--------|-------------|
| **Supplier Query** | <200ms | P95 SQL query response |
| **Full Analysis** | <5 minutes | End-to-end AI workflow |
| **Batch Processing** | <4 hours | 10k supplier daily update |
| **API Rate Limits** | 5 TPS (DnB), 10 TPS (Sayari) | Sustained throughput |
| **Database Connections** | <100 concurrent | Azure SQL DTU usage |

### Scaling Architecture
```yaml
Horizontal Scaling:
  Edge Compute Nodes: 1-5 instances (auto-scale)
  Load Balancer: Azure Load Balancer Standard
  Database: Azure SQL Database Premium tier

Caching Strategy:
  L1 Cache: Application memory (2GB per node)
  L2 Cache: Redis cluster (16GB total)
  L3 Cache: Azure SQL query cache

Auto-scaling Triggers:
  CPU > 80% for 5 minutes: +1 edge node
  Memory > 85% for 3 minutes: +1 edge node
  Queue depth > 100: +1 background worker
```

### Monitoring & Alerting
```python
# Azure Application Insights integration
from azure.monitor.opentelemetry import configure_azure_monitor

configure_azure_monitor(
    connection_string="InstrumentationKey=your-key"
)

# Key metrics to track
METRICS = {
    "analysis_completion_time": "Time to complete full supplier analysis",
    "api_error_rate": "Percentage of failed API calls",
    "database_query_latency": "P95 SQL query response time",
    "cache_hit_ratio": "Percentage of cache hits vs misses",
    "batch_processing_duration": "Time to complete daily batch jobs"
}

# Alert thresholds
ALERTS = {
    "analysis_time_critical": 600,  # 10 minutes
    "api_error_rate_high": 0.05,   # 5%
    "db_latency_high": 1000,       # 1 second
    "cache_hit_low": 0.70          # 70%
}
```

---

## 🔐 Security & Compliance

### Authentication & Authorization
```yaml
Azure Authentication:
  Method: Managed Identity
  Scope: Azure SQL Database, Key Vault
  Principle: Least privilege access

API Authentication:
  DnB: OAuth 2.0 client credentials
  Sayari: API key + OAuth 2.0
  Storage: Azure Key Vault

Network Security:
  VNet: Private virtual network
  NSG: Restrictive network security groups
  Firewall: Azure SQL Database firewall
  TLS: 1.3 for all external communications
```

### Data Privacy & Compliance
```python
# Data classification and handling
class DataClassification:
    PUBLIC = "public"          # Company names, public info
    INTERNAL = "internal"      # Financial metrics, relationships
    CONFIDENTIAL = "confidential"  # Pricing, contracts
    RESTRICTED = "restricted"   # Personal data (minimal)

# Audit logging
class AuditLogger:
    def __init__(self):
        self.logger = logging.getLogger("audit")

    def log_data_access(self, user_id: str, supplier_id: str, classification: str):
        self.logger.info({
            "event": "data_access",
            "user_id": user_id,
            "supplier_id": supplier_id,
            "classification": classification,
            "timestamp": datetime.utcnow().isoformat(),
            "source_ip": request.remote_addr
        })
```

---

## 🚀 Deployment Strategy

### Azure Resource Provisioning
```bash
# Azure CLI deployment script
az group create --name rg-procurement-intelligence --location westeurope

# Azure SQL Database
az sql server create --name sql-procurement-intel --resource-group rg-procurement-intelligence
az sql db create --name procurement-intel --server sql-procurement-intel --tier Premium

# Virtual Network
az network vnet create --name vnet-procurement --resource-group rg-procurement-intelligence
az network nsg create --name nsg-edge-compute --resource-group rg-procurement-intelligence

# Virtual Machine (Edge Compute)
az vm create \
  --name vm-edge-compute \
  --resource-group rg-procurement-intelligence \
  --image UbuntuLTS \
  --size Standard_D4s_v3 \
  --vnet-name vnet-procurement \
  --generate-ssh-keys

# Container Registry
az acr create --name acrprocurement --resource-group rg-procurement-intelligence --sku Standard
```

### Docker Deployment Pipeline
```yaml
# docker-compose.azure.yml
version: '3.8'
services:
  langgraph-api:
    image: acrprocurement.azurecr.io/langgraph-api:latest
    environment:
      - AZURE_SQL_CONNECTION_STRING=${AZURE_SQL_CONNECTION_STRING}
      - DNB_CONSUMER_KEY=${DNB_CONSUMER_KEY}
      - SAYARI_API_KEY=${SAYARI_API_KEY}
      - REDIS_URL=redis://redis:6379
    ports:
      - "8123:8000"
    depends_on:
      - redis
      - sql-proxy
    deploy:
      resources:
        limits:
          memory: 8G
          cpus: '2'
        reservations:
          memory: 4G
          cpus: '1'

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '0.5'

volumes:
  redis_data:
```

### Data Initialization Process
```python
class DataInitializer:
    """
    Initialize Azure SQL Database with 20k supplier structure
    One-time setup process for production deployment
    """

    async def initialize_production_data(self):
        """Complete data initialization pipeline"""

        # Step 1: Load Tier 1 suppliers (2000)
        await self._load_tier1_suppliers()

        # Step 2: Load Tier 2 suppliers (5000)
        await self._load_tier2_suppliers()

        # Step 3: Load Tier 3+ suppliers (3000)
        await self._load_tier3_suppliers()

        # Step 4: Load potential suppliers (10000)
        await self._load_potential_suppliers()

        # Step 5: Initialize relationships
        await self._initialize_relationships()

        # Step 6: Initial API enrichment
        await self._initial_api_enrichment()

        # Step 7: Calculate baseline metrics
        await self._calculate_baseline_metrics()

        logger.info("Production data initialization completed successfully")

    async def _load_tier1_suppliers(self):
        """Load known Tier 1 suppliers with complete data"""
        # Load from existing skoda_tier1_suppliers.json
        with open("/app/data/skoda_tier1_suppliers.json") as f:
            tier1_data = json.load(f)

        for supplier_id, data in tier1_data["tier1_suppliers"].items():
            await self.db.execute_query("""
                INSERT INTO suppliers (
                    supplier_id, tier_level, name, duns_number,
                    annual_volume_eur, country, status
                ) VALUES (@supplier_id, 1, @name, @duns, @volume, @country, 'ACTIVE')
            """, {
                "supplier_id": supplier_id,
                "name": data["name"],
                "duns": data["financial_data"]["duns_number"],
                "volume": data["annual_volume_eur"],
                "country": data["addresses"]["headquarters"]["country_code"]
            })
```

---

## 📋 Migration & Rollout Plan

### Phase 1: Infrastructure Setup (Week 1)
- ✅ Provision Azure resources
- ✅ Deploy Edge compute nodes
- ✅ Configure networking and security
- ✅ Set up monitoring and logging

### Phase 2: Data Migration (Week 2)
- ✅ Initialize database schema
- ✅ Load 20k supplier structure
- ✅ Migrate existing Tier 1 data
- ✅ Validate data integrity

### Phase 3: API Integration (Week 3)
- ✅ Deploy DnB API client
- ✅ Deploy Sayari API client
- ✅ Configure batch processing jobs
- ✅ Test API connectivity and rate limits

### Phase 4: AI Agent Deployment (Week 4)
- ✅ Deploy LangGraph workflows
- ✅ Configure analysis pipelines
- ✅ Test end-to-end analysis flows
- ✅ Performance optimization

### Phase 5: Production Rollout (Week 5)
- ✅ User acceptance testing
- ✅ Performance validation
- ✅ Go-live with Tier 1 analysis
- ✅ Monitor and optimize

---

## 📚 References & Dependencies

### External Dependencies
- **Azure SQL Database Premium** - Primary data store
- **Azure Virtual Machines** - Edge compute platform
- **DnB Direct+ API** - Financial and risk data
- **Sayari API** - Supply chain and trade intelligence
- **Redis** - Caching and session management

### Internal Dependencies
- **LangGraph** - AI agent orchestration framework
- **FastAPI** - REST API framework
- **SQLAlchemy** - Database ORM
- **aiohttp** - Async HTTP client
- **Pandas** - Data manipulation and analysis

### Documentation Links
- [Azure SQL Database Documentation](https://docs.microsoft.com/azure/sql-database/)
- [DnB Direct+ API Reference](./api_endpoint_mapping.md)
- [Sayari API Documentation](./api_endpoint_mapping.md)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)

---

**Document Version:** 1.0
**Last Updated:** 2025-09-18
**Next Review:** 2025-10-15
**Owner:** Technical Architecture Team
**Approved by:** CTO, Head of Procurement Intelligence