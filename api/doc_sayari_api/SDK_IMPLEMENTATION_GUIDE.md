# 🚀 Sayari SDK Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing Sayari API endpoints using the official Python SDK (v0.1.42) in the AI-agent-Ntier project. It focuses on practical implementation patterns aligned with our LangGraph atomic node architecture.

## 📋 Prerequisites

### Environment Setup
```bash
# 1. Install Sayari SDK with specific version
pip install sayari==0.1.42

# 2. Set environment variables
export SAYARI_CLIENT_ID="your_client_id"
export SAYARI_CLIENT_SECRET="your_client_secret"
```

### Project Structure Integration
```
src/memory_agent/
├── sayari_sdk_client.py      # New: SDK client wrapper
├── atomic_nodes_sayari.py    # New: Sayari-specific atomic nodes
├── service_implementations.py # Update: Integrate SDK client
└── enhanced_state.py         # Update: Add SDK state fields
```

## 🔧 SDK Client Wrapper Implementation

### Step 1: Create SDK Client Wrapper
```python
# src/memory_agent/sayari_sdk_client.py
import os
from typing import Optional, Dict, Any
from sayari.client import Sayari
from sayari.core import RequestOptions
import asyncio
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)

class SayariSDKClient:
    """
    Wrapper for Sayari Python SDK with enhanced error handling,
    caching, and async support for AI-agent-Ntier integration.
    """
    
    def __init__(self, client_id: Optional[str] = None, client_secret: Optional[str] = None):
        self.client_id = client_id or os.getenv('SAYARI_CLIENT_ID')
        self.client_secret = client_secret or os.getenv('SAYARI_CLIENT_SECRET')
        
        if not self.client_id or not self.client_secret:
            raise ValueError("SAYARI_CLIENT_ID and SAYARI_CLIENT_SECRET must be provided")
        
        # Initialize SDK client with automatic token management
        self.client = Sayari(
            client_id=self.client_id,
            client_secret=self.client_secret,
        )
        
        # Cache for frequently accessed data
        self._cache = {}
        
    async def resolve_entity(self, name: str, country: Optional[str] = None) -> Dict[str, Any]:
        """
        Resolve entity using SDK with async wrapper
        
        Args:
            name: Entity name to search
            country: Optional ISO-3 country code
            
        Returns:
            Resolution results with confidence scores
        """
        try:
            # Run sync SDK call in thread pool
            loop = asyncio.get_event_loop()
            resolution = await loop.run_in_executor(
                None,
                lambda: self.client.resolution.resolution(
                    name=name,
                    country=country
                )
            )
            
            return {
                "status": "success",
                "data": [
                    {
                        "entity_id": match.entity_id,
                        "label": match.label,
                        "confidence": match.score,
                        "entity_type": match.type,
                        "countries": match.countries
                    }
                    for match in resolution.data[:5]  # Top 5 matches
                ]
            }
            
        except Exception as e:
            logger.error(f"Entity resolution failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "data": []
            }
    
    async def get_entity_details(self, entity_id: str) -> Dict[str, Any]:
        """
        Get comprehensive entity details using SDK
        
        Args:
            entity_id: Sayari entity ID
            
        Returns:
            Full entity profile with attributes and relationships
        """
        try:
            loop = asyncio.get_event_loop()
            entity = await loop.run_in_executor(
                None,
                lambda: self.client.entity.get_entity(entity_id)
            )
            
            return {
                "status": "success",
                "entity_id": entity.id,
                "label": entity.label,
                "type": entity.type,
                "countries": entity.countries,
                "addresses": entity.addresses,
                "identifiers": entity.identifiers,
                "risk_factors": {
                    "sanctioned": entity.sanctioned,
                    "pep": entity.pep,
                    "closed": entity.closed
                },
                "relationships_count": entity.relationship_count,
                "trade_count": entity.trade_count
            }
            
        except Exception as e:
            logger.error(f"Get entity details failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    async def search_trade_suppliers(
        self, 
        hs_code: Optional[str] = None,
        country: Optional[str] = None,
        query: Optional[str] = None,
        limit: int = 50
    ) -> Dict[str, Any]:
        """
        Search for suppliers using trade endpoint
        
        Args:
            hs_code: Harmonized System code
            country: ISO-3 country code
            query: Search query
            limit: Maximum results
            
        Returns:
            Supplier search results with trade metadata
        """
        try:
            loop = asyncio.get_event_loop()
            
            # Build search query
            search_params = {}
            if hs_code:
                search_params['hs_code'] = hs_code
            if country:
                search_params['country'] = [country]
            if query:
                search_params['q'] = query
                
            suppliers = await loop.run_in_executor(
                None,
                lambda: self.client.trade.search_suppliers(
                    **search_params,
                    limit=limit
                )
            )
            
            return {
                "status": "success",
                "count": suppliers.size.count,
                "data": [
                    {
                        "entity_id": supplier.id,
                        "label": supplier.label,
                        "countries": supplier.countries,
                        "trade_count": supplier.trade_count,
                        "hs_codes": supplier.hs_codes if hasattr(supplier, 'hs_codes') else []
                    }
                    for supplier in suppliers.data
                ]
            }
            
        except Exception as e:
            logger.error(f"Trade supplier search failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "data": []
            }
    
    async def get_entity_summary(self, entity_id: str) -> Dict[str, Any]:
        """
        Get entity summary (lightweight version without relationships)
        
        Args:
            entity_id: Sayari entity ID
            
        Returns:
            Entity summary for performance optimization
        """
        try:
            loop = asyncio.get_event_loop()
            summary = await loop.run_in_executor(
                None,
                lambda: self.client.entity.entity_summary(entity_id)
            )
            
            return {
                "status": "success",
                "entity_id": summary.id,
                "label": summary.label,
                "type": summary.type,
                "countries": summary.countries,
                "risk_factors": {
                    "sanctioned": summary.sanctioned,
                    "pep": summary.pep
                }
            }
            
        except Exception as e:
            logger.error(f"Get entity summary failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    async def screen_entities_bulk(self, entities: list[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Bulk entity screening using SDK's CSV screening functionality
        
        Args:
            entities: List of entity dictionaries with name, country, etc.
            
        Returns:
            Screening results with risk classifications
        """
        try:
            # Convert to CSV format expected by SDK
            import tempfile
            import csv
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as tmp:
                writer = csv.DictWriter(tmp, fieldnames=['name', 'country', 'identifier'])
                writer.writeheader()
                writer.writerows(entities)
                tmp_path = tmp.name
            
            loop = asyncio.get_event_loop()
            risky, non_risky, unresolved = await loop.run_in_executor(
                None,
                lambda: self.client.screen_csv(tmp_path)
            )
            
            # Clean up temp file
            os.unlink(tmp_path)
            
            return {
                "status": "success",
                "risky_entities": risky,
                "non_risky_entities": non_risky,
                "unresolved_entities": unresolved
            }
            
        except Exception as e:
            logger.error(f"Bulk screening failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }

# Singleton instance
_sdk_client: Optional[SayariSDKClient] = None

def get_sayari_sdk_client() -> SayariSDKClient:
    """Get or create singleton SDK client instance"""
    global _sdk_client
    if _sdk_client is None:
        _sdk_client = SayariSDKClient()
    return _sdk_client
```

## 🔗 Atomic Node Integration

### Step 2: Create Sayari-specific Atomic Nodes
```python
# src/memory_agent/atomic_nodes_sayari.py
from typing import Dict, Any, Optional
from memory_agent.enhanced_state import OptimalEnhancedState
from memory_agent.sayari_sdk_client import get_sayari_sdk_client
import logging

logger = logging.getLogger(__name__)

async def resolve_entity_sdk_node(state: OptimalEnhancedState) -> OptimalEnhancedState:
    """
    Resolve entity using Sayari SDK - replaces parse_query_node for entity resolution
    
    State Updates (≤5 fields):
    1. entity_details.entity_id
    2. entity_details.entity_type
    3. entity_details.confidence_score
    4. api_metadata.endpoints_called
    5. api_status
    """
    company_name = state.get("company_name")
    country_code = state.get("country_code")
    
    if not company_name:
        return {
            **state,
            "api_status": "error",
            "error": "No company name provided for resolution"
        }
    
    try:
        sdk_client = get_sayari_sdk_client()
        result = await sdk_client.resolve_entity(company_name, country_code)
        
        if result["status"] == "success" and result["data"]:
            best_match = result["data"][0]
            
            # Update entity details group
            entity_details = state.get("entity_details", {})
            entity_details.update({
                "entity_id": best_match["entity_id"],
                "entity_type": best_match["entity_type"],
                "confidence_score": best_match["confidence"]
            })
            
            # Update API metadata
            api_metadata = state.get("api_metadata", {})
            endpoints_called = api_metadata.get("endpoints_called", [])
            endpoints_called.append("/v1/resolution")
            api_metadata["endpoints_called"] = endpoints_called
            
            return {
                **state,
                "entity_details": entity_details,
                "api_metadata": api_metadata,
                "api_status": "success"
            }
        else:
            return {
                **state,
                "api_status": "failed",
                "error": result.get("error", "No matches found")
            }
            
    except Exception as e:
        logger.error(f"Entity resolution failed: {str(e)}")
        return {
            **state,
            "api_status": "error",
            "error": str(e)
        }

async def fetch_entity_details_sdk_node(state: OptimalEnhancedState) -> OptimalEnhancedState:
    """
    Fetch comprehensive entity details using SDK
    
    State Updates (≤5 fields):
    1. entity_details (entire group update)
    2. api_metadata.endpoints_called
    3. api_metadata.response_times_ms
    4. api_status
    5. sayari_data (for backward compatibility)
    """
    entity_id = state.get("entity_details", {}).get("entity_id")
    
    if not entity_id:
        return {
            **state,
            "api_status": "error",
            "error": "No entity ID available for fetching details"
        }
    
    try:
        import time
        start_time = time.time()
        
        sdk_client = get_sayari_sdk_client()
        result = await sdk_client.get_entity_details(entity_id)
        
        response_time = int((time.time() - start_time) * 1000)
        
        if result["status"] == "success":
            # Update entity details comprehensively
            entity_details = state.get("entity_details", {})
            entity_details.update({
                "entity_id": result["entity_id"],
                "entity_type": result["type"],
                "risk_factors": result["risk_factors"],
                "attributes": {
                    "countries": result["countries"],
                    "addresses": result["addresses"],
                    "identifiers": result["identifiers"]
                },
                "relationships_count": result["relationships_count"]
            })
            
            # Update API metadata
            api_metadata = state.get("api_metadata", {})
            api_metadata["endpoints_called"] = api_metadata.get("endpoints_called", []) + ["/v1/entity"]
            api_metadata["response_times_ms"] = api_metadata.get("response_times_ms", []) + [response_time]
            
            return {
                **state,
                "entity_details": entity_details,
                "api_metadata": api_metadata,
                "sayari_data": result,  # Backward compatibility
                "api_status": "success"
            }
        else:
            return {
                **state,
                "api_status": "failed",
                "error": result.get("error", "Failed to fetch entity details")
            }
            
    except Exception as e:
        logger.error(f"Fetch entity details failed: {str(e)}")
        return {
            **state,
            "api_status": "error",
            "error": str(e)
        }

async def search_trade_suppliers_sdk_node(state: OptimalEnhancedState) -> OptimalEnhancedState:
    """
    Search for trade suppliers using SDK
    
    State Updates (≤5 fields):
    1. trade_data.suppliers
    2. trade_data.hs_codes
    3. api_metadata.endpoints_called
    4. api_metadata.total_requests
    5. api_status
    """
    # Extract search parameters from state
    hs_code = state.get("current_query", "").split("HS")[-1].strip() if "HS" in state.get("current_query", "") else None
    country_code = state.get("country_code", "CZ")  # Default to Czech Republic
    
    try:
        sdk_client = get_sayari_sdk_client()
        result = await sdk_client.search_trade_suppliers(
            hs_code=hs_code,
            country=country_code,
            limit=100
        )
        
        if result["status"] == "success":
            # Update trade data group
            trade_data = state.get("trade_data", {})
            trade_data["suppliers"] = result["data"]
            trade_data["hs_codes"] = list(set(
                hs for supplier in result["data"] 
                for hs in supplier.get("hs_codes", [])
            ))
            
            # Update API metadata
            api_metadata = state.get("api_metadata", {})
            api_metadata["endpoints_called"] = api_metadata.get("endpoints_called", []) + ["/v1/trade/search/suppliers"]
            api_metadata["total_requests"] = api_metadata.get("total_requests", 0) + 1
            
            return {
                **state,
                "trade_data": trade_data,
                "api_metadata": api_metadata,
                "api_status": "success"
            }
        else:
            return {
                **state,
                "api_status": "failed",
                "error": result.get("error", "No suppliers found")
            }
            
    except Exception as e:
        logger.error(f"Trade supplier search failed: {str(e)}")
        return {
            **state,
            "api_status": "error",
            "error": str(e)
        }
```

## 🔄 Service Implementation Updates

### Step 3: Update Service Implementations
```python
# Update src/memory_agent/service_implementations.py
from memory_agent.sayari_sdk_client import get_sayari_sdk_client

class SayariAPIService:
    """Updated to use SDK instead of direct API calls"""
    
    def __init__(self):
        self.sdk_client = get_sayari_sdk_client()
        
    async def get_company_by_name(self, company_name: str, country_code: Optional[str] = None) -> Dict[str, Any]:
        """Use SDK for entity resolution and details"""
        # First resolve entity
        resolution = await self.sdk_client.resolve_entity(company_name, country_code)
        
        if resolution["status"] == "success" and resolution["data"]:
            # Get full details for best match
            entity_id = resolution["data"][0]["entity_id"]
            details = await self.sdk_client.get_entity_details(entity_id)
            
            if details["status"] == "success":
                return details
        
        return {"status": "not_found", "error": "Company not found"}
```

## 📊 State Schema Updates

### Step 4: Update Enhanced State
```python
# Update src/memory_agent/enhanced_state.py
from typing import TypedDict, Optional, Dict, List, Any
from langchain_core.messages import BaseMessage

class SayariClientConfig(TypedDict, total=False):
    """SDK client configuration and state"""
    client_initialized: Optional[bool]
    last_auth_refresh: Optional[str]
    rate_limit_status: Optional[Dict[str, int]]

class OptimalEnhancedState(TypedDict):
    """Enhanced state with SDK integration fields"""
    
    # Core fields (existing)
    messages: List[BaseMessage]
    current_query: Optional[str]
    company_name: Optional[str]
    country_code: Optional[str]
    
    # SDK integration
    sayari_client_config: Optional[SayariClientConfig]
    
    # Grouped results (as defined in analysis)
    entity_details: Optional[EntityDetails]
    trade_data: Optional[TradeData]
    network_data: Optional[NetworkData]
    api_metadata: Optional[APIMetadata]
    
    # Legacy support
    sayari_data: Optional[Dict[str, Any]]
    api_status: Optional[str]
    result: Optional[str]
    error: Optional[str]
```

## 🚀 Implementation Examples

### Example 1: Simple Entity Resolution Flow
```python
# Complete workflow using SDK nodes
async def entity_resolution_workflow(query: str):
    # Initialize state
    state = OptimalEnhancedState(
        messages=[HumanMessage(content=query)],
        current_query=query,
        company_name="MAGNA AUTOMOTIVE",
        country_code="CZ"
    )
    
    # Step 1: Resolve entity
    state = await resolve_entity_sdk_node(state)
    
    # Step 2: Get entity details if resolution successful
    if state["api_status"] == "success":
        state = await fetch_entity_details_sdk_node(state)
    
    # Step 3: Synthesize output
    state = await synthesize_output_node(state)
    
    return state
```

### Example 2: Trade Search Implementation
```python
# HS Code supplier search
async def hs_code_supplier_search(hs_code: str, country: str = "CZ"):
    state = OptimalEnhancedState(
        current_query=f"Find suppliers for HS {hs_code}",
        country_code=country
    )
    
    # Search suppliers
    state = await search_trade_suppliers_sdk_node(state)
    
    # Process results
    if state["api_status"] == "success":
        suppliers = state["trade_data"]["suppliers"]
        logger.info(f"Found {len(suppliers)} suppliers for HS {hs_code}")
    
    return state
```

## 🔍 Testing & Validation

### Unit Test Example
```python
# tests/test_sayari_sdk_integration.py
import pytest
from memory_agent.sayari_sdk_client import SayariSDKClient

@pytest.mark.asyncio
async def test_entity_resolution():
    """Test SDK entity resolution"""
    client = SayariSDKClient()
    
    result = await client.resolve_entity("MAGNA AUTOMOTIVE", "CZ")
    
    assert result["status"] == "success"
    assert len(result["data"]) > 0
    assert result["data"][0]["confidence"] > 0.5

@pytest.mark.asyncio
async def test_trade_supplier_search():
    """Test trade supplier search"""
    client = SayariSDKClient()
    
    result = await client.search_trade_suppliers(
        hs_code="8708",
        country="CZ",
        limit=10
    )
    
    assert result["status"] == "success"
    assert "data" in result
    assert isinstance(result["data"], list)
```

## 📈 Performance Optimization

### Caching Strategy
```python
from functools import lru_cache
from datetime import datetime, timedelta

class CachedSayariClient(SayariSDKClient):
    """SDK client with intelligent caching"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._cache_ttl = timedelta(hours=1)
        self._cache = {}
    
    async def get_entity_summary(self, entity_id: str) -> Dict[str, Any]:
        """Cached entity summary for repeated queries"""
        cache_key = f"summary_{entity_id}"
        
        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            if datetime.now() - timestamp < self._cache_ttl:
                return cached_data
        
        result = await super().get_entity_summary(entity_id)
        if result["status"] == "success":
            self._cache[cache_key] = (result, datetime.now())
        
        return result
```

## 🚨 Error Handling & Monitoring

### Comprehensive Error Handler
```python
async def sayari_api_error_handler(func):
    """Decorator for consistent error handling"""
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except RateLimitError as e:
            logger.warning(f"Rate limit hit: {e}")
            # SDK handles retry automatically
            raise
        except AuthenticationError as e:
            logger.error(f"Authentication failed: {e}")
            # Trigger re-authentication
            raise
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {e}")
            raise
    return wrapper
```

## 📋 Migration Checklist

### Phase 1: Foundation (Week 1)
- [ ] Install Sayari SDK v0.1.42
- [ ] Configure environment variables
- [ ] Create SDK client wrapper
- [ ] Add unit tests for SDK client
- [ ] Update enhanced state schema

### Phase 2: Core Endpoints (Week 2)
- [ ] Implement resolution SDK node
- [ ] Implement entity details SDK node  
- [ ] Implement entity summary SDK node
- [ ] Remove mock data for these endpoints
- [ ] Update integration tests

### Phase 3: Trade Endpoints (Week 3)
- [ ] Implement supplier search SDK node
- [ ] Implement buyer search SDK node
- [ ] Implement shipment search SDK node
- [ ] Add trade data aggregation logic
- [ ] Performance testing with bulk queries

### Phase 4: Advanced Features (Week 4)
- [ ] Implement watchlist screening
- [ ] Add bulk screening capabilities
- [ ] Create async patterns for high throughput
- [ ] Add comprehensive monitoring
- [ ] Document all new patterns

## 🎯 Best Practices

1. **Always use environment variables** for credentials
2. **Leverage SDK's automatic retry** for rate limiting
3. **Use entity_summary** for performance when relationships not needed
4. **Implement caching** for frequently accessed entities
5. **Monitor API usage** to stay within limits
6. **Use async patterns** for bulk operations
7. **Group related API calls** to minimize state updates
8. **Test with real data** in development environment

---

**Implementation Support:** For questions or issues, refer to:
- [Sayari Python SDK GitHub](https://github.com/sayari-analytics/sayari-python)
- [Official API Documentation](https://documentation.sayari.com)
- Internal Slack: #sayari-integration