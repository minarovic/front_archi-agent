# 🚀 Sayari SDK Quick Start Guide

## 5-Minute Setup

### 1. Install SDK
```bash
pip install sayari==0.1.42
```

### 2. Set Environment Variables
```bash
export SAYARI_CLIENT_ID="your_client_id"
export SAYARI_CLIENT_SECRET="your_client_secret"
```

### 3. Test Connection
```python
from sayari.client import Sayari

# Create client
client = Sayari(
    client_id=os.getenv('SAYARI_CLIENT_ID'),
    client_secret=os.getenv('SAYARI_CLIENT_SECRET')
)

# Test with simple resolution
result = client.resolution.resolution(name="MAGNA AUTOMOTIVE")
print(f"Found {len(result.data)} matches")
```

## 🎯 Priority Implementation Order

Based on complexity analysis, implement in this order for maximum ROI:

### Week 1: Quick Wins (10-15h total)
1. **Entity Summary** (2h) - Simplest, high performance impact
2. **Sources List** (1h) - Static data, easy caching
3. **Entity Details** (4h) - Direct replacement, well documented
4. **Resolution** (6h) - Core functionality, good SDK support

### Week 2: Trade Endpoints (20h total)
1. **Trade Search Bundle** - Critical for HS codes
   - Suppliers (6h)
   - Buyers (6h)
   - Shipments (8h)

### Week 3: Network Analysis (25h total)
1. **Watchlist** (6h) - Compliance critical
2. **UBO** (10h) - Ownership analysis
3. **Traversal** (16h) - Complex but powerful

## 📝 Copy-Paste Implementation Templates

### Template 1: Basic Entity Resolution
```python
# src/memory_agent/sayari_quick_start.py
import os
from sayari.client import Sayari
from typing import Dict, Optional
import asyncio

class QuickSayariClient:
    """Minimal Sayari SDK wrapper for quick start"""
    
    def __init__(self):
        self.client = Sayari(
            client_id=os.getenv('SAYARI_CLIENT_ID'),
            client_secret=os.getenv('SAYARI_CLIENT_SECRET')
        )
    
    async def find_company(self, name: str, country: Optional[str] = None) -> Dict:
        """Find company with automatic async wrapper"""
        loop = asyncio.get_event_loop()
        
        # Run sync SDK call in executor
        resolution = await loop.run_in_executor(
            None,
            lambda: self.client.resolution.resolution(name=name, country=country)
        )
        
        if resolution.data:
            # Get details for best match
            entity_id = resolution.data[0].entity_id
            entity = await loop.run_in_executor(
                None,
                lambda: self.client.entity.get_entity(entity_id)
            )
            
            return {
                "found": True,
                "entity_id": entity.id,
                "name": entity.label,
                "type": entity.type,
                "countries": entity.countries,
                "risk": {
                    "sanctioned": entity.sanctioned,
                    "pep": entity.pep
                }
            }
        
        return {"found": False}

# Usage example
async def main():
    client = QuickSayariClient()
    result = await client.find_company("MAGNA AUTOMOTIVE", "CZ")
    print(result)
```

### Template 2: Trade Search Implementation
```python
# Add to QuickSayariClient class
async def search_suppliers_by_hs(self, hs_code: str, country: str = "CZ") -> Dict:
    """Search suppliers by HS code"""
    loop = asyncio.get_event_loop()
    
    suppliers = await loop.run_in_executor(
        None,
        lambda: self.client.trade.search_suppliers(
            hs_code=hs_code,
            country=[country],
            limit=100
        )
    )
    
    return {
        "count": suppliers.size.count,
        "suppliers": [
            {
                "id": s.id,
                "name": s.label,
                "countries": s.countries,
                "trade_count": s.trade_count
            }
            for s in suppliers.data
        ]
    }
```

### Template 3: Atomic Node Integration
```python
# src/memory_agent/atomic_nodes_quick.py
from memory_agent.enhanced_state import OptimalEnhancedState

async def quick_resolve_entity_node(state: OptimalEnhancedState) -> OptimalEnhancedState:
    """Quick SDK-based entity resolution node"""
    company_name = state.get("company_name")
    
    if not company_name:
        return {**state, "error": "No company name provided"}
    
    client = QuickSayariClient()
    result = await client.find_company(company_name)
    
    if result["found"]:
        return {
            **state,
            "entity_details": {
                "entity_id": result["entity_id"],
                "entity_type": result["type"],
                "risk_factors": result["risk"]
            },
            "api_status": "success"
        }
    
    return {**state, "api_status": "not_found"}
```

## ⚡ Performance Tips

### 1. Use Entity Summary for Speed
```python
# 5x faster than full entity details
summary = client.entity.entity_summary(entity_id)  # Minimal data
# vs
full = client.entity.get_entity(entity_id)  # Full relationships
```

### 2. Implement Simple Caching
```python
from functools import lru_cache
from datetime import datetime, timedelta

class CachedQuickClient(QuickSayariClient):
    def __init__(self):
        super().__init__()
        self._cache = {}
        self._cache_ttl = timedelta(hours=1)
    
    async def find_company(self, name: str, country: Optional[str] = None) -> Dict:
        cache_key = f"{name}_{country}"
        
        # Check cache
        if cache_key in self._cache:
            result, timestamp = self._cache[cache_key]
            if datetime.now() - timestamp < self._cache_ttl:
                return result
        
        # Fetch and cache
        result = await super().find_company(name, country)
        self._cache[cache_key] = (result, datetime.now())
        return result
```

### 3. Bulk Operations Pattern
```python
async def bulk_entity_screening(self, companies: List[str]) -> List[Dict]:
    """Screen multiple companies efficiently"""
    tasks = [self.find_company(name) for name in companies]
    results = await asyncio.gather(*tasks)
    
    return [
        {**result, "query": company} 
        for company, result in zip(companies, results)
    ]
```

## 🐛 Common Issues & Solutions

### Issue 1: Authentication Failures
```python
# Solution: Explicit error handling
try:
    client = Sayari(client_id=id, client_secret=secret)
except Exception as e:
    if "401" in str(e):
        print("Check your CLIENT_ID and CLIENT_SECRET")
    raise
```

### Issue 2: Rate Limiting
```python
# Solution: SDK handles automatically, but log for monitoring
import logging
logging.getLogger("sayari").setLevel(logging.INFO)
```

### Issue 3: Large Response Handling
```python
# Solution: Use pagination limits
suppliers = client.trade.search_suppliers(
    hs_code="8708",
    limit=50  # Start small
)

# Process in batches
while suppliers.has_next():
    process_batch(suppliers.data)
    suppliers = suppliers.next_page()
```

## 📊 Monitoring Implementation

### Basic Usage Tracking
```python
# Add to your client wrapper
class MonitoredClient(QuickSayariClient):
    def __init__(self):
        super().__init__()
        self.api_calls = 0
        self.start_time = datetime.now()
    
    async def find_company(self, *args, **kwargs):
        self.api_calls += 1
        result = await super().find_company(*args, **kwargs)
        
        # Log every 100 calls
        if self.api_calls % 100 == 0:
            elapsed = (datetime.now() - self.start_time).seconds
            rate = self.api_calls / (elapsed / 60) if elapsed > 0 else 0
            print(f"API calls: {self.api_calls}, Rate: {rate:.1f}/min")
        
        return result
```

## 🎯 Next Steps After Quick Start

1. **Hour 1-2**: Get basic resolution working
2. **Hour 3-4**: Add trade search
3. **Hour 5-8**: Integrate with existing nodes
4. **Day 2**: Add caching and monitoring
5. **Day 3-5**: Migrate remaining endpoints

## 💡 Pro Tips

1. **Start with read-only endpoints** - Lower risk
2. **Keep mock fallbacks initially** - Safety net
3. **Log everything during migration** - Debugging
4. **Test with known entities first** - Validation
5. **Monitor rate limits closely** - Avoid blocks

## 🚨 Emergency Rollback

If something goes wrong:
```python
# Quick fallback to mock data
class SafeClient(QuickSayariClient):
    async def find_company(self, name: str, country: Optional[str] = None) -> Dict:
        try:
            return await super().find_company(name, country)
        except Exception as e:
            logger.error(f"SDK failed, using mock: {e}")
            return self.get_mock_company_data(name)
```

---

**Ready to start?** Copy the templates above and begin with Template 1. You'll have working SDK integration in under 10 minutes!

**Need help?** Check the [detailed implementation guide](./SDK_IMPLEMENTATION_GUIDE.md) or [migration strategy](./SDK_MIGRATION_STRATEGY.md).