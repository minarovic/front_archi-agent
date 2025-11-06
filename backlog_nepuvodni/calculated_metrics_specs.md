# Technical Specifications: Calculated Metrics
*Škoda Auto Procurement Intelligence - Custom Algorithm Implementations*

**Version:** 1.0
**Date:** 2025-09-18
**Status:** Technical Specification

---

## 📊 Overview

This document provides detailed technical specifications for 6 core metrics that must be calculated internally due to API limitations. Each specification includes algorithms, data requirements, implementation details, and validation criteria.

---

## 1️⃣ Combined Risk Score (CRS)

### Purpose
Aggregate multiple risk dimensions into a single Škoda-specific score (0-100) for supplier prioritization.

### Algorithm Specification

```python
from typing import Dict, Optional, List
from dataclasses import dataclass
import numpy as np

@dataclass
class RiskWeights:
    """Configurable weights for risk components"""
    financial: float = 0.30      # DnB financial strength
    ownership: float = 0.20       # Sayari UBO complexity
    geographic: float = 0.20      # Calculated geo-risk
    operational: float = 0.15     # Internal performance
    supply_chain: float = 0.15    # Network dependencies

class CombinedRiskScoreCalculator:
    """
    Calculate Combined Risk Score with dynamic weighting
    and confidence adjustment based on data completeness.
    """

    def __init__(self, weights: Optional[RiskWeights] = None):
        self.weights = weights or RiskWeights()
        self.normalization_ranges = {
            'financial': (0, 100),      # DnB failure score
            'ownership': (0, 10),        # UBO complexity layers
            'geographic': (0, 100),      # Country risk index
            'operational': (0, 100),     # Delivery + quality
            'supply_chain': (0, 1)       # Network centrality
        }

    async def calculate(
        self,
        supplier_data: Dict,
        commodity_group: Optional[str] = None
    ) -> Dict:
        """
        Calculate risk score with commodity-specific adjustments.

        Args:
            supplier_data: Raw supplier data from all sources
            commodity_group: Optional commodity for weight adjustment

        Returns:
            Dictionary with score, components, and confidence
        """
        # Extract and normalize components
        components = await self._extract_components(supplier_data)
        normalized = self._normalize_scores(components)

        # Adjust weights for commodity group
        adjusted_weights = self._adjust_weights_for_commodity(
            commodity_group
        )

        # Calculate weighted score
        score = 0
        total_weight = 0
        missing_components = []

        for component, weight in adjusted_weights.items():
            if normalized.get(component) is not None:
                score += normalized[component] * weight
                total_weight += weight
            else:
                missing_components.append(component)

        # Adjust for missing data
        if total_weight > 0:
            final_score = (score / total_weight) * 100
        else:
            final_score = 50  # Default middle risk

        # Calculate confidence
        confidence = self._calculate_confidence(
            missing_components,
            supplier_data
        )

        return {
            'score': round(final_score, 2),
            'components': normalized,
            'missing': missing_components,
            'confidence': confidence,
            'weights_used': adjusted_weights,
            'timestamp': datetime.utcnow().isoformat()
        }

    async def _extract_components(self, data: Dict) -> Dict:
        """Extract risk components from raw data"""
        components = {}

        # Financial (DnB)
        if dnb_data := data.get('dnb'):
            components['financial'] = dnb_data.get('failure_score', 50)

        # Ownership (Sayari)
        if sayari_data := data.get('sayari'):
            components['ownership'] = self._calculate_ubo_complexity(
                sayari_data.get('ubo_tree', {})
            )

        # Geographic
        components['geographic'] = await self._calculate_geo_risk(
            data.get('country'),
            data.get('sanctions_exposure')
        )

        # Operational (Internal)
        if internal_data := data.get('azure_sql'):
            components['operational'] = self._calculate_operational_score(
                internal_data
            )

        # Supply Chain
        components['supply_chain'] = await self._calculate_network_risk(
            data.get('supplier_id')
        )

        return components

    def _normalize_scores(self, components: Dict) -> Dict:
        """Normalize all scores to 0-1 range"""
        normalized = {}
        for key, value in components.items():
            if value is not None and key in self.normalization_ranges:
                min_val, max_val = self.normalization_ranges[key]
                normalized[key] = (value - min_val) / (max_val - min_val)
                normalized[key] = max(0, min(1, normalized[key]))
        return normalized

    def _adjust_weights_for_commodity(
        self,
        commodity_group: Optional[str]
    ) -> Dict:
        """Adjust weights based on commodity criticality"""
        weights_dict = vars(self.weights).copy()

        if not commodity_group:
            return weights_dict

        # Critical commodities need higher operational weight
        critical_commodities = [
            'SEMICONDUCTORS', 'BATTERIES', 'SAFETY_SYSTEMS'
        ]

        if commodity_group.upper() in critical_commodities:
            weights_dict['operational'] *= 1.5
            weights_dict['supply_chain'] *= 1.3
            # Re-normalize to sum to 1.0
            total = sum(weights_dict.values())
            return {k: v/total for k, v in weights_dict.items()}

        return weights_dict

    def _calculate_confidence(
        self,
        missing: List[str],
        data: Dict
    ) -> float:
        """Calculate confidence score based on data completeness"""
        base_confidence = 100
        penalty_per_missing = 15

        confidence = base_confidence - (len(missing) * penalty_per_missing)

        # Additional penalties for critical missing data
        if 'financial' in missing:
            confidence -= 10
        if 'ownership' in missing and data.get('high_risk_country'):
            confidence -= 10

        return max(0, min(100, confidence))
```

### Data Requirements

| Source | Required Fields | Optional Fields | Update Frequency |
|--------|----------------|-----------------|------------------|
| DnB | failure_score, paydex | credit_limit, years_in_business | Daily |
| Sayari | ubo_tree, entity_type | watchlist_flags, pep_exposure | Weekly |
| Azure SQL | delivery_score, quality_score | incident_count, volume_trend | Daily |
| Calculated | geo_risk_index, network_centrality | cluster_coefficient | Weekly |

### Validation Criteria

```python
# Unit tests
def test_combined_risk_score():
    calculator = CombinedRiskScoreCalculator()

    # Test with complete data
    complete_data = {
        'dnb': {'failure_score': 30},
        'sayari': {'ubo_tree': {...}},
        'country': 'CZ',
        'azure_sql': {'delivery_score': 95, 'quality_score': 98}
    }
    result = await calculator.calculate(complete_data)
    assert 0 <= result['score'] <= 100
    assert result['confidence'] >= 80

    # Test with missing data
    partial_data = {'dnb': {'failure_score': 50}}
    result = await calculator.calculate(partial_data)
    assert result['confidence'] < 50
    assert len(result['missing']) > 0
```

---

## 2️⃣ Supplier Deterioration Index (SDI)

### Purpose
Detect negative trends in supplier health before they become critical issues.

### Algorithm Specification

```python
from typing import List, Tuple
import pandas as pd
from scipy import stats
from sklearn.linear_model import LinearRegression

class SupplierDeteriorationCalculator:
    """
    Calculate deterioration trends using time-series analysis
    and change point detection.
    """

    def __init__(self, lookback_days: int = 365):
        self.lookback_days = lookback_days
        self.metrics = [
            'financial_score',
            'delivery_performance',
            'quality_score',
            'payment_behavior',
            'employee_count'
        ]
        self.thresholds = {
            'critical': -0.3,   # 30% decline
            'high': -0.2,       # 20% decline
            'medium': -0.1,     # 10% decline
            'low': -0.05        # 5% decline
        }

    async def calculate_sdi(
        self,
        supplier_id: str,
        time_series_data: pd.DataFrame
    ) -> Dict:
        """
        Calculate Supplier Deterioration Index.

        Args:
            supplier_id: Supplier identifier
            time_series_data: Historical metrics DataFrame

        Returns:
            SDI score, trends, and alerts
        """
        # Filter to lookback period
        end_date = pd.Timestamp.now()
        start_date = end_date - pd.Timedelta(days=self.lookback_days)
        data = time_series_data[
            (time_series_data['date'] >= start_date) &
            (time_series_data['supplier_id'] == supplier_id)
        ].copy()

        if len(data) < 10:  # Need minimum data points
            return {
                'sdi_score': None,
                'confidence': 0,
                'message': 'Insufficient historical data'
            }

        # Calculate individual metric trends
        metric_trends = {}
        for metric in self.metrics:
            if metric in data.columns:
                trend = self._calculate_trend(
                    data[['date', metric]].dropna()
                )
                metric_trends[metric] = trend

        # Detect change points
        change_points = self._detect_change_points(data)

        # Calculate composite SDI
        sdi_score = self._calculate_composite_sdi(
            metric_trends,
            change_points
        )

        # Generate alerts
        alerts = self._generate_alerts(sdi_score, metric_trends)

        return {
            'sdi_score': round(sdi_score, 2),
            'metric_trends': metric_trends,
            'change_points': change_points,
            'alerts': alerts,
            'severity': self._get_severity(sdi_score),
            'confidence': self._calculate_trend_confidence(data),
            'prediction_30d': self._predict_future(data, 30)
        }

    def _calculate_trend(
        self,
        series: pd.DataFrame
    ) -> Dict:
        """Calculate trend using linear regression"""
        if len(series) < 3:
            return {'slope': 0, 'r2': 0, 'p_value': 1}

        # Convert dates to numeric
        series['days'] = (
            series['date'] - series['date'].min()
        ).dt.days

        X = series['days'].values.reshape(-1, 1)
        y = series.iloc[:, 1].values

        # Normalize y to percentage change
        y_normalized = (y - y[0]) / y[0] if y[0] != 0 else y

        # Fit linear regression
        model = LinearRegression()
        model.fit(X, y_normalized)

        # Calculate statistics
        y_pred = model.predict(X)
        ss_res = np.sum((y_normalized - y_pred) ** 2)
        ss_tot = np.sum((y_normalized - np.mean(y_normalized)) ** 2)
        r2 = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0

        # Statistical significance
        _, p_value = stats.pearsonr(X.flatten(), y_normalized)

        return {
            'slope': float(model.coef_[0]),
            'intercept': float(model.intercept_),
            'r2': float(r2),
            'p_value': float(p_value),
            'direction': 'declining' if model.coef_[0] < 0 else 'improving'
        }

    def _detect_change_points(
        self,
        data: pd.DataFrame
    ) -> List[Dict]:
        """Detect significant changes in metrics"""
        change_points = []

        for metric in self.metrics:
            if metric not in data.columns:
                continue

            series = data[metric].dropna()
            if len(series) < 20:
                continue

            # Use CUSUM for change detection
            mean = series.mean()
            std = series.std()

            if std == 0:
                continue

            cusum_pos = 0
            cusum_neg = 0
            threshold = 4 * std  # Detection threshold

            for i, value in enumerate(series):
                cusum_pos = max(0, cusum_pos + value - mean - std/2)
                cusum_neg = max(0, cusum_neg - value + mean - std/2)

                if cusum_pos > threshold or cusum_neg > threshold:
                    change_points.append({
                        'metric': metric,
                        'date': data.iloc[i]['date'],
                        'type': 'increase' if cusum_pos > threshold else 'decrease',
                        'magnitude': abs(value - mean) / std
                    })
                    # Reset after detection
                    cusum_pos = 0
                    cusum_neg = 0

        return change_points

    def _calculate_composite_sdi(
        self,
        trends: Dict,
        change_points: List
    ) -> float:
        """Calculate composite deterioration score"""
        # Weight negative trends more heavily
        weights = {
            'financial_score': 0.35,
            'delivery_performance': 0.25,
            'quality_score': 0.20,
            'payment_behavior': 0.15,
            'employee_count': 0.05
        }

        score = 0
        total_weight = 0

        for metric, weight in weights.items():
            if metric in trends and trends[metric]['p_value'] < 0.1:
                # Significant trend
                slope = trends[metric]['slope']
                # Convert slope to deterioration score (0-100)
                if slope < 0:  # Declining
                    metric_score = min(100, abs(slope) * 200)
                else:  # Improving
                    metric_score = max(0, -slope * 100)

                score += metric_score * weight
                total_weight += weight

        # Adjust for recent change points
        recent_changes = [
            cp for cp in change_points
            if (pd.Timestamp.now() - cp['date']).days < 90
        ]

        for change in recent_changes:
            if change['type'] == 'decrease':
                score += change['magnitude'] * 5

        # Normalize to 0-100
        if total_weight > 0:
            score = score / total_weight
        else:
            score = 50  # No significant trends

        return min(100, max(0, score))

    def _get_severity(self, sdi_score: float) -> str:
        """Categorize SDI severity"""
        if sdi_score >= 75:
            return 'CRITICAL'
        elif sdi_score >= 50:
            return 'HIGH'
        elif sdi_score >= 25:
            return 'MEDIUM'
        else:
            return 'LOW'
```

### Time-Series Data Structure

```sql
-- TimescaleDB hypertable for metrics
CREATE TABLE supplier_metrics (
    time TIMESTAMPTZ NOT NULL,
    supplier_id VARCHAR(50) NOT NULL,
    financial_score NUMERIC(5,2),
    delivery_performance NUMERIC(5,2),
    quality_score NUMERIC(5,2),
    payment_behavior NUMERIC(5,2),
    employee_count INT,
    data_source VARCHAR(20),
    PRIMARY KEY (time, supplier_id)
);

-- Convert to hypertable
SELECT create_hypertable('supplier_metrics', 'time');

-- Create continuous aggregate for daily averages
CREATE MATERIALIZED VIEW supplier_daily_metrics
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', time) AS day,
    supplier_id,
    AVG(financial_score) AS avg_financial,
    AVG(delivery_performance) AS avg_delivery,
    AVG(quality_score) AS avg_quality
FROM supplier_metrics
GROUP BY day, supplier_id;
```

---

## 3️⃣ SPOF (Single Point of Failure) Score

### Purpose
Identify suppliers whose failure would critically impact production.

### Algorithm Specification

```python
from typing import Set, Dict, List
import asyncio

class SPOFCalculator:
    """
    Calculate Single Point of Failure score using
    SQL-based analysis and production criticality.
    Optimized for Azure SQL Database and relational patterns.
    """

    def __init__(self):
        self.db = AzureSQLConnection()
        self.criticality_weights = {
            'CRITICAL': 1.0,
            'HIGH': 0.7,
            'MEDIUM': 0.4,
            'LOW': 0.1
        }

    async def calculate_spof_score(
        self,
        supplier_id: str,
        production_data: Dict
    ) -> Dict:
        """
        Calculate SPOF score based on network position
        and production dependencies.
        """
        # SQL-based network centrality metrics
        centrality = await self._calculate_sql_network_centrality(
            supplier_id
        )

        # Production criticality
        production_impact = self._calculate_production_impact(
            supplier_id,
            production_data
        )

        # Alternative availability
        alternative_score = self._assess_alternatives(
            supplier_id,
            production_data
        )

        # Calculate composite SPOF score
        spof_score = (
            centrality['betweenness'] * 0.3 +
            centrality['eigenvector'] * 0.2 +
            production_impact * 0.35 +
            (1 - alternative_score) * 0.15
        ) * 100

        # Identify affected parts and projects
        affected = self._identify_affected_components(
            supplier_id,
            supply_network,
            production_data
        )

        return {
            'spof_score': round(spof_score, 2),
            'centrality_metrics': centrality,
            'production_impact': production_impact,
            'alternative_availability': alternative_score,
            'affected_parts': affected['parts'],
            'affected_projects': affected['projects'],
            'risk_level': self._classify_risk(spof_score),
            'mitigation_priority': self._get_mitigation_priority(
                spof_score,
                production_impact
            )
        }

    def _calculate_network_centrality(
        self,
        node: str,
        graph: nx.DiGraph
    ) -> Dict:
        """Calculate various centrality measures"""
        if node not in graph:
            return {
                'betweenness': 0,
                'eigenvector': 0,
                'degree': 0,
                'closeness': 0
            }

        # Calculate centralities
        betweenness = nx.betweenness_centrality(graph)
        eigenvector = nx.eigenvector_centrality_numpy(graph, max_iter=500)
        degree = nx.degree_centrality(graph)
        closeness = nx.closeness_centrality(graph)

        return {
            'betweenness': betweenness.get(node, 0),
            'eigenvector': eigenvector.get(node, 0),
            'degree': degree.get(node, 0),
            'closeness': closeness.get(node, 0)
        }

    def _calculate_production_impact(
        self,
        supplier_id: str,
        production_data: Dict
    ) -> float:
        """Calculate impact on production if supplier fails"""
        impact_score = 0
        total_weight = 0

        # Parts supplied by this supplier
        parts = production_data.get('supplier_parts', {}).get(supplier_id, [])

        for part in parts:
            criticality = part.get('criticality', 'MEDIUM')
            weight = self.criticality_weights.get(criticality, 0.4)

            # Check if single source
            if part.get('single_source', False):
                weight *= 2

            # Consider lead time
            lead_time = part.get('lead_time_days', 30)
            if lead_time > 60:
                weight *= 1.5
            elif lead_time > 90:
                weight *= 2

            impact_score += weight
            total_weight += 1

        return impact_score / total_weight if total_weight > 0 else 0

    def _assess_alternatives(
        self,
        supplier_id: str,
        production_data: Dict
    ) -> float:
        """Assess availability of alternative suppliers"""
        parts = production_data.get('supplier_parts', {}).get(supplier_id, [])

        if not parts:
            return 0

        alternatives_available = 0
        for part in parts:
            if part.get('alternative_suppliers', []):
                alternatives_available += 1

        return alternatives_available / len(parts)
```

---

## 4️⃣ Hidden Risk Accumulation Score

### Purpose
Detect concentrated risks across seemingly unrelated suppliers.

### Algorithm Specification

```python
from sklearn.cluster import DBSCAN
import geopy.distance

class HiddenRiskDetector:
    """
    Detect hidden risk accumulations using clustering
    and correlation analysis.
    """

    def __init__(self):
        self.risk_dimensions = [
            'geographic',
            'ownership',
            'financial_institution',
            'key_personnel',
            'technology_dependency'
        ]

    async def detect_hidden_risks(
        self,
        supplier_portfolio: List[Dict]
    ) -> Dict:
        """
        Identify hidden risk concentrations across suppliers.
        """
        # Geographic clustering
        geo_clusters = self._detect_geographic_clusters(supplier_portfolio)

        # Ownership overlaps
        ownership_links = await self._analyze_ownership_links(
            supplier_portfolio
        )

        # Financial dependencies
        financial_correlations = self._detect_financial_correlations(
            supplier_portfolio
        )

        # Calculate accumulation score
        accumulation_score = self._calculate_accumulation_score(
            geo_clusters,
            ownership_links,
            financial_correlations
        )

        return {
            'accumulation_score': accumulation_score,
            'geographic_clusters': geo_clusters,
            'ownership_networks': ownership_links,
            'financial_correlations': financial_correlations,
            'risk_hotspots': self._identify_hotspots(
                geo_clusters,
                ownership_links
            ),
            'recommendations': self._generate_recommendations(
                accumulation_score
            )
        }

    def _detect_geographic_clusters(
        self,
        suppliers: List[Dict]
    ) -> List[Dict]:
        """Identify geographic concentration risks"""
        # Extract coordinates
        coordinates = []
        supplier_ids = []

        for supplier in suppliers:
            if lat := supplier.get('latitude'):
                if lon := supplier.get('longitude'):
                    coordinates.append([lat, lon])
                    supplier_ids.append(supplier['id'])

        if len(coordinates) < 2:
            return []

        # DBSCAN clustering with 50km radius
        clustering = DBSCAN(
            eps=50/6371,  # 50km in radians
            min_samples=3,
            metric='haversine'
        ).fit(np.radians(coordinates))

        # Analyze clusters
        clusters = []
        for label in set(clustering.labels_):
            if label == -1:  # Noise
                continue

            cluster_suppliers = [
                sid for i, sid in enumerate(supplier_ids)
                if clustering.labels_[i] == label
            ]

            # Calculate cluster risk
            cluster_value = sum(
                s.get('annual_spend', 0)
                for s in suppliers
                if s['id'] in cluster_suppliers
            )

            clusters.append({
                'cluster_id': label,
                'suppliers': cluster_suppliers,
                'size': len(cluster_suppliers),
                'total_value': cluster_value,
                'risk_level': self._assess_cluster_risk(
                    len(cluster_suppliers),
                    cluster_value
                )
            })

        return clusters
```

---

## 5️⃣ Crisis Impact Quantification

### Purpose
Quantify the business impact of supplier failures in monetary and operational terms.

### Algorithm Specification

```python
class CrisisImpactCalculator:
    """
    Quantify crisis impact using Monte Carlo simulation
    and dependency mapping.
    """

    def __init__(self):
        self.simulation_runs = 1000
        self.time_horizons = [7, 30, 90]  # Days

    async def quantify_impact(
        self,
        crisis_scenario: Dict,
        supply_chain: nx.DiGraph,
        production_data: Dict
    ) -> Dict:
        """
        Quantify multi-dimensional impact of crisis scenario.
        """
        # Direct impact
        direct = self._calculate_direct_impact(
            crisis_scenario,
            production_data
        )

        # Cascade effects
        cascade = await self._simulate_cascade_effects(
            crisis_scenario,
            supply_chain
        )

        # Financial quantification
        financial = self._quantify_financial_impact(
            direct,
            cascade,
            production_data
        )

        # Monte Carlo simulation for uncertainty
        simulation_results = self._run_monte_carlo(
            crisis_scenario,
            supply_chain,
            production_data
        )

        return {
            'direct_impact': direct,
            'cascade_effects': cascade,
            'financial_impact': financial,
            'simulation': {
                'mean': np.mean(simulation_results),
                'std': np.std(simulation_results),
                'percentile_95': np.percentile(simulation_results, 95),
                'worst_case': np.max(simulation_results)
            },
            'affected_production_days': self._estimate_production_loss(
                crisis_scenario
            ),
            'recovery_time_estimate': self._estimate_recovery_time(
                crisis_scenario,
                cascade
            )
        }

    def _run_monte_carlo(
        self,
        scenario: Dict,
        graph: nx.DiGraph,
        production: Dict
    ) -> np.ndarray:
        """Run Monte Carlo simulation for impact uncertainty"""
        results = []

        for _ in range(self.simulation_runs):
            # Vary parameters with uncertainty
            failure_prob = np.random.beta(2, 5)  # Skewed toward lower probability
            cascade_prob = np.random.beta(3, 7)   # Cascade probability
            recovery_time = np.random.gamma(2, 15)  # Recovery time in days

            # Calculate impact for this run
            impact = self._single_simulation_run(
                scenario,
                graph,
                production,
                failure_prob,
                cascade_prob,
                recovery_time
            )
            results.append(impact)

        return np.array(results)
```

---

## 6️⃣ Alternative Supplier Similarity Score

### Purpose
Find and rank alternative suppliers based on capability matching.

### Algorithm Specification

```python
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

class AlternativeSupplierMatcher:
    """
    Match and rank alternative suppliers using
    multi-dimensional similarity analysis.
    """

    def __init__(self):
        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
        self.feature_weights = {
            'technical_capability': 0.3,
            'capacity': 0.2,
            'geographic_proximity': 0.15,
            'certification_match': 0.15,
            'price_competitiveness': 0.1,
            'quality_history': 0.1
        }

    async def find_alternatives(
        self,
        current_supplier: Dict,
        candidate_pool: List[Dict],
        requirements: Dict
    ) -> List[Dict]:
        """
        Find and rank alternative suppliers.
        """
        # Extract features
        current_features = self._extract_features(current_supplier)

        # Score each candidate
        scored_candidates = []
        for candidate in candidate_pool:
            if candidate['id'] == current_supplier['id']:
                continue

            score = await self._calculate_similarity(
                current_features,
                self._extract_features(candidate),
                requirements
            )

            scored_candidates.append({
                'supplier': candidate,
                'similarity_score': score['total'],
                'score_breakdown': score['breakdown'],
                'switching_time': self._estimate_switching_time(
                    current_supplier,
                    candidate
                ),
                'risk_assessment': self._assess_switch_risk(
                    current_supplier,
                    candidate
                )
            })

        # Rank by score
        scored_candidates.sort(
            key=lambda x: x['similarity_score'],
            reverse=True
        )

        return scored_candidates[:10]  # Top 10 alternatives

    def _extract_features(self, supplier: Dict) -> np.ndarray:
        """Extract and encode supplier features"""
        # Technical capabilities (text embedding)
        capabilities_text = ' '.join(supplier.get('capabilities', []))
        tech_embedding = self.encoder.encode(capabilities_text)

        # Numeric features
        numeric_features = np.array([
            supplier.get('production_capacity', 0),
            supplier.get('quality_score', 0),
            supplier.get('delivery_performance', 0),
            supplier.get('years_in_business', 0),
            supplier.get('employee_count', 0),
            len(supplier.get('certifications', [])),
            supplier.get('financial_stability', 0)
        ])

        # Normalize numeric features
        numeric_normalized = (
            numeric_features - np.mean(numeric_features)
        ) / (np.std(numeric_features) + 1e-8)

        # Combine embeddings
        return np.concatenate([tech_embedding, numeric_normalized])
```

---

## 📐 Implementation Architecture

### System Components

```yaml
Calculation Engine:
  Technology: Python 3.10+
  Framework: FastAPI + Celery
  Dependencies:
    - numpy>=1.21
    - pandas>=1.4
    - scikit-learn>=1.0
    - networkx>=2.8
    - scipy>=1.8

Data Storage:
  Time-Series: TimescaleDB
  Graph Data: Neo4j
  Cache: Redis
  Vector Store: PostgreSQL + pgvector

Message Queue:
  Technology: Apache Kafka
  Topics:
    - risk-calculations
    - deterioration-alerts
    - impact-simulations

Monitoring:
  Metrics: Prometheus
  Tracing: OpenTelemetry
  Dashboards: Grafana
```

### API Endpoints

```python
# FastAPI endpoint definitions
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel

app = FastAPI()

class RiskCalculationRequest(BaseModel):
    supplier_id: str
    calculation_type: str
    parameters: Dict

@app.post("/api/v1/calculate/risk")
async def calculate_risk(
    request: RiskCalculationRequest,
    background_tasks: BackgroundTasks
):
    """
    Trigger risk calculation for a supplier.
    """
    # Queue calculation
    task_id = str(uuid.uuid4())
    background_tasks.add_task(
        process_calculation,
        task_id,
        request
    )

    return {
        'task_id': task_id,
        'status': 'queued',
        'estimated_time': 30  # seconds
    }

@app.get("/api/v1/calculate/status/{task_id}")
async def get_calculation_status(task_id: str):
    """Get status of calculation task."""
    result = await redis.get(f"calc:{task_id}")
    if result:
        return json.loads(result)
    return {'status': 'pending'}
```

---

## 🧪 Testing & Validation

### Test Data Generation

```python
# Generate synthetic test data
def generate_test_suppliers(count: int = 100) -> List[Dict]:
    """Generate test supplier dataset"""
    suppliers = []
    for i in range(count):
        suppliers.append({
            'id': f'SUP{i:04d}',
            'duns': f'{random.randint(100000000, 999999999)}',
            'name': f'Test Supplier {i}',
            'financial_score': random.uniform(20, 95),
            'delivery_performance': random.uniform(70, 100),
            'quality_score': random.uniform(80, 100),
            'latitude': random.uniform(48, 52),
            'longitude': random.uniform(12, 19),
            'annual_spend': random.uniform(100000, 10000000),
            'criticality': random.choice(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
            'single_source': random.random() < 0.2
        })
    return suppliers
```

### Performance Benchmarks

| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| Combined Risk Score | <500ms | <1s | >2s |
| Deterioration Index | <2s | <5s | >10s |
| SPOF Calculation | <1s | <3s | >5s |
| Hidden Risk Detection | <5s | <10s | >20s |
| Crisis Impact | <10s | <30s | >60s |
| Alternative Matching | <3s | <5s | >10s |

### Validation Rules

```python
# Validation suite
class MetricValidator:
    @staticmethod
    def validate_risk_score(score: float) -> bool:
        """Validate risk score range and properties"""
        return 0 <= score <= 100

    @staticmethod
    def validate_confidence(confidence: float, data_completeness: float) -> bool:
        """Validate confidence correlates with data completeness"""
        if data_completeness < 0.5:
            return confidence < 60
        return 40 <= confidence <= 100

    @staticmethod
    def validate_spof_score(score: float, alternatives: int) -> bool:
        """Validate SPOF logic"""
        if alternatives == 0:
            return score >= 70  # High SPOF if no alternatives
        return True
```

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Unit tests pass (coverage >90%)
- [ ] Integration tests with test data
- [ ] Performance benchmarks met
- [ ] API documentation complete
- [ ] Security review completed

### Deployment
- [ ] TimescaleDB schema created
- [ ] Neo4j indexes configured
- [ ] Redis cache warmed
- [ ] Kafka topics created
- [ ] Monitoring dashboards configured

### Post-deployment
- [ ] Smoke tests on production data
- [ ] Performance monitoring active
- [ ] Alert rules configured
- [ ] Backup procedures tested
- [ ] Documentation published

---

**Document Version:** 1.0
**Next Review:** 2025-10-15
**Owner:** Technical Architecture Team
**Repository:** /scrum/stories/backlog/calculated_metrics_specs.md