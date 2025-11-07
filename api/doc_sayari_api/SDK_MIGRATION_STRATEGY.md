# 🔄 Sayari SDK Migration Strategy

## Executive Summary

This document outlines the migration strategy from our current custom Sayari API implementation to the official Python SDK (v0.1.42). The migration will be executed in phases to minimize risk while maximizing the benefits of SDK adoption.

**Key Benefits:**
- 70% reduction in authentication code
- Automatic rate limiting and retry logic
- Built-in pagination handling
- Type-safe request/response models
- Reduced maintenance burden

## 📊 Current State Analysis

### Existing Implementation Assessment
```yaml
Current Architecture:
- Location: src/memory_agent/sayari_sdk_wrapper.py
- Pattern: Custom API wrapper with mock fallbacks
- Authentication: Manual OAuth token management
- Error Handling: Basic try/catch blocks
- Pagination: Not implemented
- Rate Limiting: Not implemented
- Async Support: Partial (asyncio wrappers)
```

### Code Inventory
| Component | Lines of Code | SDK Replacement | Migration Effort |
|-----------|--------------|-----------------|------------------|
| OAuth Authentication | ~150 lines | ✅ Automatic | Remove code |
| API Request Handling | ~200 lines | ✅ SDK methods | Adapt calls |
| Error Handling | ~100 lines | ✅ Built-in | Simplify |
| Mock Data Fallbacks | ~500 lines | ❌ Keep for dev | Refactor |
| Response Parsing | ~300 lines | ✅ Type models | Remove code |
| **Total** | **~1250 lines** | **~400 lines** | **68% reduction** |

## 🎯 Migration Phases

### Phase 1: Foundation Setup (Week 1, 8-12h)

#### Objectives:
- Set up SDK without breaking existing functionality
- Create parallel implementation for testing
- Establish monitoring and rollback procedures

#### Tasks:
```python
# 1. Install SDK with version pinning
pip install sayari==0.1.42

# 2. Create SDK configuration module
# src/memory_agent/config/sayari_config.py
from dataclasses import dataclass
from typing import Optional

@dataclass
class SayariConfig:
    """Configuration for Sayari SDK migration"""
    use_sdk: bool = False  # Feature flag
    sdk_version: str = "0.1.42"
    client_id: Optional[str] = None
    client_secret: Optional[str] = None
    enable_caching: bool = True
    cache_ttl_seconds: int = 3600
    
# 3. Environment-based configuration
import os

def get_sayari_config() -> SayariConfig:
    return SayariConfig(
        use_sdk=os.getenv("USE_SAYARI_SDK", "false").lower() == "true",
        client_id=os.getenv("SAYARI_CLIENT_ID"),
        client_secret=os.getenv("SAYARI_CLIENT_SECRET")
    )
```

#### Feature Flag Implementation:
```python
# src/memory_agent/service_factory.py
from memory_agent.config.sayari_config import get_sayari_config

def get_sayari_service():
    """Factory method to return appropriate Sayari service"""
    config = get_sayari_config()
    
    if config.use_sdk:
        from memory_agent.sayari_sdk_service import SayariSDKService
        return SayariSDKService(config)
    else:
        from memory_agent.sayari_legacy_service import SayariLegacyService
        return SayariLegacyService()
```

### Phase 2: Core Endpoints Migration (Week 2, 20-30h)

#### Priority Order:
1. **Entity Resolution** (4h)
   - Highest usage endpoint
   - Simple request/response structure
   - Clear SDK mapping

2. **Entity Details** (4h)
   - Direct SDK support
   - Minimal data transformation

3. **Entity Summary** (2h)
   - Performance optimization
   - Simple implementation

#### Migration Pattern:
```python
# Before (Custom Implementation)
async def get_company_by_name(self, company_name: str) -> Dict:
    headers = await self._get_auth_headers()  # Manual auth
    params = {"name": company_name}
    
    try:
        response = await self.session.get(
            f"{self.base_url}/resolution",
            headers=headers,
            params=params
        )
        
        if response.status == 429:  # Manual retry
            await asyncio.sleep(10)
            return await self.get_company_by_name(company_name)
            
        data = await response.json()
        return self._parse_resolution_response(data)  # Manual parsing
        
    except Exception as e:
        logger.error(f"API request failed: {e}")
        return self._get_mock_data("resolution")  # Fallback

# After (SDK Implementation)
async def get_company_by_name(self, company_name: str) -> Dict:
    try:
        # SDK handles auth, retry, parsing automatically
        resolution = await self._run_async(
            self.sdk_client.resolution.resolution,
            name=company_name
        )
        
        return {
            "status": "success",
            "data": [self._transform_resolution_match(m) for m in resolution.data]
        }
        
    except Exception as e:
        logger.error(f"SDK request failed: {e}")
        if self.enable_mock_fallback:
            return self._get_mock_data("resolution")
        raise
```

### Phase 3: Trade Endpoints Migration (Week 3, 20-30h)

#### Complex Migration Considerations:
```yaml
Trade Endpoints Special Handling:
- Large response sizes (pagination critical)
- HS code parameter formatting
- Faceted search aggregations
- Response transformation for backward compatibility
```

#### Implementation Strategy:
```python
# Pagination wrapper for trade endpoints
async def search_all_suppliers(self, hs_code: str) -> List[Dict]:
    """
    Fetch all suppliers with automatic pagination
    SDK handles pagination tokens internally
    """
    all_suppliers = []
    
    # Initial request
    response = await self._run_async(
        self.sdk_client.trade.search_suppliers,
        hs_code=hs_code,
        limit=1000  # Maximum per page
    )
    
    all_suppliers.extend(response.data)
    
    # SDK automatically provides pagination methods
    while response.has_next():
        response = await self._run_async(response.next_page)
        all_suppliers.extend(response.data)
    
    return all_suppliers
```

### Phase 4: Advanced Features (Week 4, 15-20h)

#### Network Traversal Endpoints:
```python
# Complex response handling for traversal
async def get_ownership_structure(self, entity_id: str) -> Dict:
    """
    UBO endpoint with complex nested responses
    """
    try:
        ubo_data = await self._run_async(
            self.sdk_client.traversal.ubo,
            entity_id=entity_id,
            max_depth=10
        )
        
        # Transform SDK response to our schema
        return {
            "ownership_tree": self._build_ownership_tree(ubo_data),
            "ultimate_owners": self._extract_ultimate_owners(ubo_data),
            "ownership_percentages": self._calculate_percentages(ubo_data)
        }
        
    except Exception as e:
        logger.error(f"UBO analysis failed: {e}")
        raise
```

#### Performance Optimizations:
```python
# Implement caching layer
from functools import lru_cache
from aiocache import cached

class CachedSayariSDKService(SayariSDKService):
    
    @cached(ttl=3600)  # 1 hour cache
    async def get_entity_summary(self, entity_id: str) -> Dict:
        """Cached entity summary for repeated queries"""
        return await super().get_entity_summary(entity_id)
    
    @cached(ttl=86400)  # 24 hour cache for static data
    async def get_sources_list(self) -> List[Dict]:
        """Cache source list as it rarely changes"""
        return await super().get_sources_list()
```

## 🔧 Technical Implementation Details

### Async Pattern Adaptation
```python
# Helper for running sync SDK methods in async context
import asyncio
from concurrent.futures import ThreadPoolExecutor

class AsyncSDKWrapper:
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=10)
    
    async def _run_async(self, sync_method, *args, **kwargs):
        """Run synchronous SDK method in thread pool"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            lambda: sync_method(*args, **kwargs)
        )
```

### Error Handling Strategy
```python
# Unified error handling for SDK migration
from enum import Enum
from typing import Optional

class SayariErrorType(Enum):
    AUTHENTICATION = "authentication"
    RATE_LIMIT = "rate_limit"
    NOT_FOUND = "not_found"
    NETWORK = "network"
    UNKNOWN = "unknown"

class SayariSDKError(Exception):
    def __init__(self, error_type: SayariErrorType, message: str, retry_after: Optional[int] = None):
        self.error_type = error_type
        self.message = message
        self.retry_after = retry_after
        super().__init__(message)

def handle_sdk_error(func):
    """Decorator for consistent SDK error handling"""
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except SayariException as e:
            if "401" in str(e):
                raise SayariSDKError(SayariErrorType.AUTHENTICATION, "Invalid credentials")
            elif "429" in str(e):
                # SDK handles retry automatically, this is for logging
                logger.warning(f"Rate limit encountered, SDK will retry")
                raise
            elif "404" in str(e):
                raise SayariSDKError(SayariErrorType.NOT_FOUND, "Resource not found")
            else:
                raise SayariSDKError(SayariErrorType.UNKNOWN, str(e))
    return wrapper
```

### Backward Compatibility Layer
```python
# Maintain API compatibility during migration
class SayariBackwardCompatibilityMixin:
    """Ensures old code continues to work with SDK responses"""
    
    def _transform_to_legacy_format(self, sdk_response: Any) -> Dict:
        """Transform SDK response to match legacy format"""
        if hasattr(sdk_response, 'data'):
            return {
                "success": True,
                "data": [self._entity_to_legacy(item) for item in sdk_response.data],
                "count": getattr(sdk_response.size, 'count', len(sdk_response.data))
            }
        return {"success": False, "data": []}
    
    def _entity_to_legacy(self, sdk_entity: Any) -> Dict:
        """Convert SDK entity model to legacy dictionary"""
        return {
            "id": getattr(sdk_entity, 'entity_id', None),
            "name": getattr(sdk_entity, 'label', None),
            "type": getattr(sdk_entity, 'type', None),
            "countries": getattr(sdk_entity, 'countries', []),
            # Map other fields as needed
        }
```

## 📋 Migration Checklist

### Pre-Migration (Week 0)
- [ ] Audit current implementation
- [ ] Document all custom behaviors
- [ ] Set up monitoring dashboards
- [ ] Create rollback plan
- [ ] Notify stakeholders

### Phase 1 Checklist
- [ ] Install SDK with version lock
- [ ] Create configuration module
- [ ] Implement feature flags
- [ ] Set up parallel testing
- [ ] Deploy to staging

### Phase 2 Checklist
- [ ] Migrate resolution endpoint
- [ ] Migrate entity endpoints
- [ ] Update unit tests
- [ ] Performance benchmarking
- [ ] A/B testing in production

### Phase 3 Checklist
- [ ] Migrate trade endpoints
- [ ] Handle pagination properly
- [ ] Update integration tests
- [ ] Load testing
- [ ] Monitor API usage

### Phase 4 Checklist
- [ ] Migrate traversal endpoints
- [ ] Implement caching
- [ ] Remove legacy code
- [ ] Update documentation
- [ ] Team training

## 🚨 Risk Mitigation

### Rollback Strategy
```yaml
Rollback Triggers:
- Error rate > 5%
- Response time degradation > 20%
- Authentication failures
- Data inconsistencies

Rollback Procedure:
1. Switch feature flag to false
2. Monitor error rates
3. Investigate root cause
4. Fix and redeploy
```

### Testing Strategy
```python
# Parallel testing framework
class ParallelTestHarness:
    async def compare_implementations(self, test_cases: List[Dict]):
        """Run same query through both implementations"""
        results = []
        
        for test in test_cases:
            legacy_result = await self.legacy_service.query(test)
            sdk_result = await self.sdk_service.query(test)
            
            comparison = {
                "test": test,
                "legacy": legacy_result,
                "sdk": sdk_result,
                "match": self._results_match(legacy_result, sdk_result)
            }
            
            results.append(comparison)
        
        return results
```

## 📊 Success Metrics

### Technical Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Code Reduction | >60% | Lines of code |
| Response Time | <10% increase | P95 latency |
| Error Rate | <1% | Failed requests |
| Test Coverage | >90% | Unit + Integration |

### Business Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| API Costs | -20% | Monthly billing |
| Development Velocity | +30% | Story points |
| Incident Rate | -50% | Production issues |
| Feature Delivery | +40% | Features per sprint |

## 🎯 Post-Migration

### Cleanup Tasks
1. Remove legacy implementation
2. Remove mock data files
3. Update all documentation
4. Archive old tests
5. Update CI/CD pipelines

### Optimization Opportunities
1. Implement intelligent caching
2. Add request batching
3. Optimize state management
4. Add performance monitoring
5. Create usage analytics

## 📚 Resources

- [SDK Migration Runbook](./runbooks/sdk-migration.md)
- [Testing Procedures](./testing/sdk-tests.md)
- [Rollback Procedures](./runbooks/rollback.md)
- [Performance Benchmarks](./benchmarks/sdk-performance.md)

---

**Migration Lead:** Engineering Team  
**Timeline:** 4 weeks  
**Status:** Planning Phase  
**Last Updated:** January 2025