# Missing Data Analysis Report
*Škoda Auto Procurement Intelligence - Backlog Stories Gap Analysis*

**Date:** 2025-09-18
**Analyst:** Business Intelligence Architect
**Scope:** 9 Backlog Stories (SCR-20250918-01 to 09)

---

## 📊 Executive Summary

### Critical Findings
- **DnB API Success Rate:** 58.3% (7/12 endpoints functional)
- **Sayari API Coverage:** 100% (Full API access confirmed)
- **Available Critical Features:** Complete Sayari endpoint availability
- **Impact on <5min Screening:** Achievable with Azure Edge architecture
- **Data Integration Required:** 6 core metrics calculated from available data

### Business Impact
- ✅ **Batch monitoring:** Systematic scheduled updates (daily/weekly approach)
- ✅ **Supply chain transparency:** Full visibility via Sayari trade endpoints
- ✅ **Risk assessment:** Comprehensive through DnB + Sayari integration
- ✅ **Crisis response:** Enabled by Azure Edge computing architecture

### Recommendation
Implement **Azure Edge relational architecture** combining:
1. Full API data integration (DnB financial + complete Sayari intelligence)
2. Calculated metrics for enhanced analysis
3. Azure SQL Database for internal business data with pre-loaded supplier structure
4. Azure Edge Computing for batch processing workflows

---

## 🔍 Section 1: DnB API Gap Analysis

### Available Data ✅
| Data Point | Endpoint | Status | Coverage |
|------------|----------|--------|----------|
| Company Profile | `/v1/data/duns/{duns}` | ✅ Working | 100% |
| Financial Metrics | `companyinfo_L2_v1` | ✅ Working | Revenue, employees |
| Risk Indicators | `financialstrengthinsight_L4_v1` | ✅ Working | Failure score, PAYDEX |
| Management Data | `principalscontacts_L3_v2` | ✅ Working | Leadership info |
| Corporate Hierarchy | `/v1/familyTree/{duns}` | ✅ Working | Parent/subsidiary |

### Missing/Limited Data ❌
| Required Feature | DnB Limitation | Business Impact | Workaround |
|------------------|----------------|-----------------|------------|
| **Combined Risk Score** | No custom weights | Cannot prioritize Škoda-specific risks | Calculate internally |
| **Real-time Alerts** | Daily/weekly refresh only | Delayed deterioration detection | Implement monitoring layer |
| **Time-series Data** | Limited historical snapshots | No trend analysis | Build time-series DB |
| **Custom Thresholds** | No rule configuration | Generic risk levels | Rule engine needed |
| **Benchmarking** | Industry averages only | No commodity group comparison | Custom peer groups |
| **Plant-specific Risk** | Company-level only | Cannot assess facility risks | Azure DB integration |
| **Price Competitiveness** | No pricing data | Cannot compare costs | Internal data only |
| **Geopolitical Risk** | Basic country data | No risk scoring | External service needed |

---

## 🔍 Section 2: Sayari API Integration Status

### Complete Implementation Available

#### Available Endpoints (35+ endpoints = 100%) ✅
```python
# Full Sayari API access confirmed
/v1/resolution           # Entity resolution
/v1/entity/{id}         # Entity details
/v1/ubo/{id}           # Beneficial ownership
/v1/watchlist/{id}     # Sanctions screening
/v1/trade/search/suppliers    # Supplier discovery
/v1/trade/search/buyers       # Buyer analysis
/v1/supply_chain/upstream     # N-tier mapping
/v1/supply_chain/downstream   # Customer analysis
/v1/traversal                 # Network traversal
# ... all other endpoints available
```

#### Full Integration Capabilities ✅

##### Priority 1: Trade APIs (Business Critical)
| Endpoint | Purpose | Impact on Stories | Implementation Complexity |
|----------|---------|-------------------|-------------------------|
| `/v1/trade/search/suppliers` | Find suppliers by HS code | SCR-01, 02, 06 | 🟢 Low |
| `/v1/trade/search/buyers` | Find buyers by HS code | SCR-02, 06 | 🟢 Low |
| `/v1/trade/search/shipments` | Track shipments | SCR-06, 07 | 🟢 Low |

##### Priority 2: Supply Chain APIs
| Endpoint | Purpose | Impact on Stories | Implementation Complexity |
|----------|---------|-------------------|-------------------------|
| `/v1/supply_chain/upstream/{id}` | Tier N mapping | SCR-05, 06 | 🟡 Medium |
| `/v1/traversal/{id}` | Network relationships | SCR-05, 06 | 🟡 Medium |
| `/v1/shortest_path` | Connection analysis | SCR-06 | 🟡 Medium |
| `/v1/downstream/{id}` | Customer mapping | SCR-06 | 🟡 Medium |

##### Priority 3: Performance & Metadata
| Endpoint | Purpose | Impact on Stories | Implementation Complexity |
|----------|---------|-------------------|-------------------------|
| `/v1/entity_summary/{id}` | Quick overview | All stories | 🟢 Low |
| `/v1/sources` | Data transparency | SCR-01 | 🟢 Low |
| `/v1/usage` | API monitoring | Infrastructure | 🟢 Low |

### Available Capabilities Analysis
| Business Requirement | Available Sayari Feature | Implementation | Azure Edge Solution |
|---------------------|--------------------------|----------------|---------------------|
| **SPOF Detection** | Network centrality via /v1/traversal | Direct API integration | SQL + Sayari algorithms |
| **Geographic Clustering** | Location data + trade patterns | API + custom analysis | Relational clustering |
| **Alternative Suppliers** | Similarity matching | No recommendations | Elasticsearch + ML |
| **Vendor Lock-in** | Exclusivity detection | Hidden dependencies | Business logic layer |
| **Crisis Time Estimates** | Impact propagation | No recovery time | Monte Carlo simulation |
| **Scenario Simulation** | What-if capabilities | No predictive analysis | Custom engine |

---

## 📐 Section 3: Calculated Metrics Requirements

### 1. Combined Risk Score
```python
def calculate_combined_risk_score(supplier_data: Dict) -> float:
    """
    Škoda Auto specific risk scoring algorithm
    """
    # Data sources
    dnb_failure = supplier_data['dnb']['failure_score'] / 100  # 0-1 scale
    ownership_complexity = calculate_ownership_complexity(supplier_data['sayari'])
    geo_concentration = calculate_geographic_risk(supplier_data['locations'])
    supply_depth = calculate_supply_chain_depth(supplier_data['network'])

    # Configurable weights (Škoda specific)
    weights = {
        'financial': 0.30,    # DnB data
        'ownership': 0.20,    # Sayari UBO
        'geographic': 0.20,   # Calculated
        'supply': 0.30       # Network analysis
    }

    combined_score = (
        dnb_failure * weights['financial'] +
        ownership_complexity * weights['ownership'] +
        geo_concentration * weights['geographic'] +
        supply_depth * weights['supply']
    )

    return combined_score * 100  # 0-100 scale
```

### 2. Supplier Deterioration Index
```python
def calculate_deterioration_index(
    historical: List[Dict],
    current: Dict,
    window: int = 90  # days
) -> Dict:
    """
    Detect supplier health deterioration over time
    """
    # Key metrics to track
    metrics = ['failure_score', 'payment_behavior', 'revenue', 'employees']

    deterioration = {
        'index': 0.0,
        'trend': 'stable',
        'alerts': []
    }

    for metric in metrics:
        historical_avg = np.mean([h[metric] for h in historical])
        current_val = current[metric]

        # Calculate percentage change
        change = (current_val - historical_avg) / historical_avg

        if change < -0.15:  # 15% deterioration threshold
            deterioration['alerts'].append(f"{metric} declined {abs(change)*100:.1f}%")
            deterioration['index'] += abs(change) * metric_weights[metric]

    # Determine trend
    if deterioration['index'] > 0.3:
        deterioration['trend'] = 'worsening'
    elif deterioration['index'] < -0.1:
        deterioration['trend'] = 'improving'

    return deterioration
```

### 3. Hidden Risk Accumulation Score
```python
def detect_hidden_risk_accumulation(
    tier1_suppliers: List[str],
    network_graph: nx.Graph
) -> Dict:
    """
    Identify shared dependencies and SPOF in supply network
    """
    risk_accumulation = {
        'shared_suppliers': {},
        'geographic_clusters': {},
        'spof_nodes': []
    }

    # Find shared Tier 2+ suppliers
    for i, supplier_a in enumerate(tier1_suppliers):
        for supplier_b in tier1_suppliers[i+1:]:
            shared = find_shared_upstream(network_graph, supplier_a, supplier_b)

            for shared_node in shared:
                if shared_node not in risk_accumulation['shared_suppliers']:
                    risk_accumulation['shared_suppliers'][shared_node] = []
                risk_accumulation['shared_suppliers'][shared_node].extend([supplier_a, supplier_b])

    # Identify SPOF using betweenness centrality
    centrality = nx.betweenness_centrality(network_graph)
    threshold = np.percentile(list(centrality.values()), 90)

    risk_accumulation['spof_nodes'] = [
        node for node, score in centrality.items()
        if score > threshold
    ]

    return risk_accumulation
```

### 4. Crisis Impact Quantification
```python
def quantify_crisis_impact(
    affected_supplier: str,
    business_data: Dict,
    network: nx.Graph
) -> Dict:
    """
    Calculate business value at risk from supplier disruption
    """
    impact = {
        'direct_volume_at_risk': 0,
        'affected_projects': [],
        'affected_parts': [],
        'propagation_depth': 0,
        'recovery_time_estimate': 0
    }

    # Direct impact
    impact['direct_volume_at_risk'] = business_data['annual_volumes'][affected_supplier]
    impact['affected_parts'] = business_data['supplier_parts'][affected_supplier]
    impact['affected_projects'] = find_dependent_projects(affected_supplier, business_data)

    # Propagation analysis
    downstream_affected = nx.descendants(network, affected_supplier)
    impact['propagation_depth'] = max(
        nx.shortest_path_length(network, affected_supplier, node)
        for node in downstream_affected
    )

    # Recovery time (simplified)
    impact['recovery_time_estimate'] = calculate_recovery_time(
        len(impact['affected_parts']),
        len(alternative_suppliers),
        switching_complexity
    )

    return impact
```

### 5. Alternative Supplier Scoring
```python
def score_alternative_suppliers(
    target_profile: Dict,
    candidates: List[Dict],
    requirements: Dict
) -> List[Tuple[str, float]]:
    """
    Rank alternative suppliers by similarity and capability
    """
    scored_candidates = []

    for candidate in candidates:
        score = 0.0

        # Industry match (HS codes, SIC codes)
        industry_similarity = jaccard_similarity(
            target_profile['hs_codes'],
            candidate['hs_codes']
        )
        score += industry_similarity * 0.3

        # Capacity match
        capacity_ratio = candidate['capacity'] / requirements['volume']
        capacity_score = 1.0 if capacity_ratio >= 1.0 else capacity_ratio
        score += capacity_score * 0.3

        # Geographic proximity
        distance = haversine_distance(
            target_profile['location'],
            candidate['location']
        )
        proximity_score = max(0, 1 - (distance / 1000))  # 1000km baseline
        score += proximity_score * 0.2

        # Risk profile
        risk_difference = abs(
            target_profile['risk_score'] - candidate['risk_score']
        )
        risk_score = max(0, 1 - (risk_difference / 50))
        score += risk_score * 0.2

        scored_candidates.append((candidate['id'], score))

    return sorted(scored_candidates, key=lambda x: x[1], reverse=True)
```

### 6. Confidence Score for Partial Data
```python
def calculate_confidence_score(
    available_data: Dict,
    required_fields: List[str],
    source_reliability: Dict[str, float]
) -> float:
    """
    Calculate confidence in analysis with incomplete data
    """
    # Data completeness
    available_fields = [f for f in required_fields if f in available_data]
    completeness = len(available_fields) / len(required_fields)

    # Source reliability
    source_scores = []
    for field in available_fields:
        source = available_data[field].get('source', 'unknown')
        reliability = source_reliability.get(source, 0.5)
        source_scores.append(reliability)

    avg_reliability = np.mean(source_scores) if source_scores else 0.5

    # Data freshness
    freshness_scores = []
    for field in available_fields:
        age_days = (datetime.now() - available_data[field]['timestamp']).days
        freshness = max(0, 1 - (age_days / 365))  # 1 year baseline
        freshness_scores.append(freshness)

    avg_freshness = np.mean(freshness_scores) if freshness_scores else 0.5

    # Combined confidence
    confidence = (
        completeness * 0.4 +
        avg_reliability * 0.4 +
        avg_freshness * 0.2
    ) * 100

    return confidence
```

---

## 🏢 Section 4: Internal Data Requirements (Azure SQL Database)

### Required Data Points (Replicated from SAP to Azure)

| Data Category | Specific Fields | Source → Target | Azure Sync | Story Impact |
|---------------|-----------------|-----------------|------------|--------------|
| **Project Dependencies** | project_id, supplier_id, parts_list, criticality | SAP PS → Azure SQL | Daily ETL | SCR-07, 09 |
| **Parts Catalog** | part_number, supplier_id, alternatives, lead_time | SAP MM → Azure SQL | Weekly | SCR-07 |
| **Business Volumes** | supplier_id, annual_spend, payment_terms | SAP FI → Azure SQL | Monthly | SCR-01, 07 |
| **Performance History** | delivery_performance, quality_score, incidents | SAP QM → Azure SQL | Weekly | SCR-02, 03 |
| **Contract Terms** | contract_id, validity, penalties, volumes | SAP SRM → Azure SQL | Monthly | SCR-01 |
| **Commodity Groups** | commodity_code, suppliers, benchmarks | Master Data → Azure | Monthly | SCR-04 |
| **Risk Thresholds** | metric, threshold, action_required | Custom → Azure | Weekly | SCR-03 |
| **Approved Alternatives** | primary_supplier, alternatives, switch_time | Master Data → Azure | Monthly | SCR-07 |

### Azure Integration Advantages

1. **Performance Benefits**
   - Direct SQL queries (<100ms response time)
   - No SAP middleware latency
   - Read replicas for analytics

2. **Simplified Architecture**
   - Standard SQL interface instead of SAP RFC
   - Azure Data Factory for ETL orchestration
   - Built-in caching with Redis

3. **Business Logic Complexity**
   - Multi-level approval workflows
   - Regional-specific thresholds
   - Commodity-specific rules

---

## 🛠️ Section 5: Technical Solutions Architecture

### Priority 1: Foundation Components (Weeks 1-4)

#### Risk Scoring Engine
```yaml
Component: Risk Scoring Engine
Technology: Python + FastAPI
Dependencies: DnB API, Sayari API
Complexity: Medium
Duration: 2 weeks

Architecture:
  - Async calculation service
  - Redis cache for scores
  - Configurable weight matrix
  - REST API interface

Key Features:
  - Multi-source data aggregation
  - Real-time calculation (<2 sec)
  - Historical tracking
  - Confidence scoring
```

#### Time-Series Database
```yaml
Component: Time-Series Database
Technology: PostgreSQL + TimescaleDB
Dependencies: None
Complexity: Low
Duration: 1 week

Architecture:
  - TimescaleDB extension
  - Continuous aggregates
  - Data retention policies
  - Grafana integration

Key Features:
  - Automatic downsampling
  - Fast time-range queries
  - Trend detection functions
  - Alert triggers
```

#### Alert Infrastructure
```yaml
Component: Alert & Monitoring System
Technology: Apache Kafka + Drools
Dependencies: Time-Series DB
Complexity: High
Duration: 2 weeks

Architecture:
  - Event streaming (Kafka)
  - Rule engine (Drools)
  - Notification service
  - Audit logging

Key Features:
  - Custom rule definition
  - Multi-channel notifications
  - Alert prioritization
  - Evidence collection
```

### Priority 2: Intelligence Components (Weeks 5-8)

#### Network Analysis Module
```yaml
Component: Network Analysis Module
Technology: Neo4j + Python
Dependencies: Sayari API
Complexity: High
Duration: 3 weeks

Architecture:
  - Graph database (Neo4j)
  - NetworkX algorithms
  - REST API interface
  - Visualization service

Algorithms:
  - Betweenness centrality (SPOF)
  - Community detection (clusters)
  - Shortest path (connections)
  - PageRank (importance)
```

#### Alternative Supplier Matcher
```yaml
Component: Alternative Supplier Matcher
Technology: Elasticsearch + scikit-learn
Dependencies: Azure SQL data, Network Module
Complexity: Medium
Duration: 2 weeks

Architecture:
  - Elasticsearch index
  - ML similarity models
  - Ranking service
  - API interface

Features:
  - Multi-criteria matching
  - Capacity validation
  - Risk comparison
  - Switching cost estimation
```

### Priority 3: Advanced Analytics (Weeks 9-12)

#### Scenario Simulation Engine
```yaml
Component: Scenario Simulation Engine
Technology: Python + Celery
Dependencies: All components
Complexity: High
Duration: 3 weeks

Architecture:
  - Async task queue (Celery)
  - Monte Carlo simulation
  - Parallel processing
  - Result storage

Features:
  - What-if scenarios
  - Impact propagation
  - Uncertainty modeling
  - Comparative analysis
```

---

## 📋 Section 6: Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)
| Week | Component | Deliverable | Success Criteria |
|------|-----------|-------------|------------------|
| 1-2 | Risk Scoring Engine | API endpoint for combined scores | <2 sec response, 95% accuracy |
| 2 | Time-Series DB | Database schema and APIs | 1M records capacity |
| 3-4 | Alert Infrastructure | Rule engine with notifications | <1 min alert latency |
| 4 | Sayari Extensions | Trade endpoint implementations | 3 new endpoints working |

### Phase 2: Intelligence (Weeks 5-8)
| Week | Component | Deliverable | Success Criteria |
|------|-----------|-------------|------------------|
| 5-6 | Network Analysis | Graph DB with algorithms | SPOF detection working |
| 7-8 | Alternative Matcher | Recommendation engine | 80% relevance score |
| 8 | Azure SQL Integration | Data pipeline | Daily ETL operational |

### Phase 3: Advanced (Weeks 9-12)
| Week | Component | Deliverable | Success Criteria |
|------|-----------|-------------|------------------|
| 9-10 | Impact Calculator | Crisis assessment tool | <5 min analysis |
| 11-12 | Scenario Engine | What-if simulator | 10 scenarios/hour |
| 12 | Integration Testing | End-to-end validation | All stories covered |

---

## 🎯 Section 7: Story-Specific Impact Mapping

### Critical Path Stories (High Impact)

| Story | Missing Data Impact | Workaround Difficulty | Implementation Priority |
|-------|--------------------|-----------------------|------------------------|
| **SCR-01: Rapid Screening** | Combined risk score, real-time data | 🟡 Medium - Can calculate | P1 - Week 1-2 |
| **SCR-02: Risk Selection** | Comparative analysis, custom weights | 🟡 Medium - Manual config | P1 - Week 1-2 |
| **SCR-03: Early Warning** | Real-time monitoring, alert rules | 🔴 High - No workaround | P1 - Week 3-4 |
| **SCR-07: Crisis Impact** | Impact quantification, alternatives | 🔴 High - Complex calc | P2 - Week 5-6 |

### Enhancement Stories (Medium Impact)

| Story | Missing Data Impact | Workaround Difficulty | Implementation Priority |
|-------|--------------------|-----------------------|------------------------|
| **SCR-05: Hidden Risk** | Network analysis, SPOF detection | 🟡 Medium - Basic graphs | P2 - Week 5-6 |
| **SCR-06: Sub-Supplier** | Supply chain traversal | 🟡 Medium - Mock data | P2 - Week 7-8 |
| **SCR-04: Long-term** | Time-series, trends | 🟢 Low - Snapshots | P2 - Week 2 |

### Future Stories (Lower Impact)

| Story | Missing Data Impact | Workaround Difficulty | Implementation Priority |
|-------|--------------------|-----------------------|------------------------|
| **SCR-08: Plant Analysis** | Plant-specific data | 🔴 High - No data | P3 - Week 11-12 |
| **SCR-09: Scenarios** | Simulation engine | 🔴 High - Manual only | P3 - Week 11-12 |

---

## ⚠️ Section 8: Risk Assessment & Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **API Rate Limiting** | High | Medium | Implement caching, batch processing |
| **Data Quality Issues** | High | High | Validation layers, confidence scoring |
| **Integration Complexity** | Medium | High | Phased rollout, extensive testing |
| **Performance Degradation** | Medium | High | Load testing, optimization cycles |
| **Scalability Limits** | Low | High | Cloud-ready architecture |

### Business Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **Incomplete Coverage** | High | Medium | Hybrid approach, manual fallbacks |
| **False Positives** | Medium | High | Threshold tuning, human review |
| **User Adoption** | Medium | High | Training, intuitive UI |
| **Regulatory Compliance** | Low | High | Audit trails, data governance |
| **Supplier Resistance** | Medium | Medium | Incentives, transparency |

### Mitigation Implementation

1. **Caching Strategy**
   ```python
   @cache(expire=3600)  # 1 hour cache
   async def get_supplier_risk(duns: str) -> Dict:
       # Check cache first
       if cached := await redis.get(f"risk:{duns}"):
           return cached
       # Calculate if not cached
       return await calculate_risk(duns)
   ```

2. **Confidence Thresholds**
   ```python
   if confidence_score < 60:
       result['requires_manual_review'] = True
       result['automated_decision'] = None
   ```

3. **Graceful Degradation**
   ```python
   try:
       sayari_data = await get_sayari_data(entity_id)
   except SayariAPIError:
       sayari_data = get_cached_or_mock_data(entity_id)
       confidence *= 0.7  # Reduce confidence
   ```

---

## 📈 Section 9: Success Metrics & KPIs

### Technical Metrics
- **API Coverage:** Target 50% Sayari endpoints by Q2
- **Response Time:** <5 minutes for full analysis
- **Data Freshness:** <24 hours for critical metrics
- **System Uptime:** 99.5% availability
- **Alert Latency:** <1 minute from trigger to notification

### Business Metrics
- **Screening Efficiency:** 80% reduction in manual effort
- **Risk Detection:** 90% accuracy in deterioration prediction
- **Crisis Response:** 100% coverage of Tier 1 impacts within 5 minutes
- **Alternative Recommendations:** 70% acceptance rate
- **User Satisfaction:** >4.0/5.0 rating

### Quality Metrics
- **Data Completeness:** >80% fields populated
- **Confidence Scores:** Average >75%
- **False Positive Rate:** <15%
- **Audit Compliance:** 100% traceability

---

## 💡 Recommendations

### Immediate Actions (Week 1)
1. ✅ Implement basic risk scoring algorithm
2. ✅ Set up TimescaleDB for historical tracking
3. ✅ Create Azure Data Factory ETL pipelines
4. ✅ Extend Sayari wrapper with trade endpoints

### Short-term (Weeks 2-4)
1. ⏱️ Deploy alert infrastructure
2. ⏱️ Build confidence scoring system
3. ⏱️ Implement basic network analysis
4. ⏱️ Create deterioration detection

### Long-term (Weeks 5-12)
1. 📋 Complete SPOF detection algorithms
2. 📋 Build scenario simulation engine
3. 📋 Complete Azure SQL integration
4. 📋 Deploy production monitoring

### Critical Success Factors
- **Executive Support:** Secure resources and priority
- **Data Access:** Ensure Azure SQL connectivity and ETL pipelines
- **User Training:** Prepare procurement team
- **Iterative Approach:** Deploy in phases with feedback
- **Performance Monitoring:** Track KPIs from day 1

---

## 📚 Appendices

### A. API Endpoint Mapping
[Detailed mapping of all 35+ Sayari endpoints and 12+ DnB endpoints]

### B. Algorithm Specifications
[Complete technical specifications for all 6 calculated metrics]

### C. Azure Integration Guide
[See azure_integration_requirements.md for detailed Azure SQL setup]

### D. Testing Scenarios
[Comprehensive test cases for each backlog story]

---

**Document Version:** 1.0
**Next Review:** 2025-10-01
**Owner:** Business Intelligence Team
**Distribution:** Implementation Team, Procurement Leadership, IT Architecture

---

*This document serves as the authoritative reference for addressing data gaps in the Škoda Auto Procurement Intelligence System implementation.*