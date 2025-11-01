# Test Scenarios for Entity Mapping

Rozšířené testovací soubory obsahují 3 edge case scénáře pro otestování kvality mappingu.

## Test Data

**Entities (5 celkem):**
1. Suppliers (dodavatelé) — baseline test
2. Purchase Orders (nákupní objednávky) — baseline test
3. Products (produkty) — baseline test
4. **Warehouse Inventory (skladové zásoby)** — NEW: logistics test
5. **Customer Complaints (stížnosti zákazníků)** — NEW: low-confidence test

**Candidates (3 celkem):**
1. dm_bs_purchase — purchasing data
2. dm_bs_logistics — warehouse/inventory data
3. **dm_bs_hr_historical** — NEW: HR data (should be filtered by scope_out)

**Scope out:** HR data o zaměstnancích; Finanční forecasting; Real-time monitoring

## Expected Results

### 1. Warehouse Inventory (skladové zásoby)
- **Expected candidate:** dm_bs_logistics
- **Expected confidence:** 0.85-0.95 (high)
- **Why:** "inventory levels" explicitly mentioned in logistics description
- **Tests:** Agent can distinguish logistics from purchasing context

### 2. Customer Complaints (stížnosti zákazníků)
- **Expected candidate:** None or very low confidence (<0.5)
- **Why:** No candidate description mentions complaints, customer service, or CRM
- **Tests:** Agent handles unmappable entities gracefully

### 3. dm_bs_hr_historical candidate
- **Expected:** Should NOT be used for any entity
- **Why:** Contains "HR" and "forecasting" keywords → matches scope_out exclusions
- **Tests:** Agent respects scope_out blacklist

## How to Run Test

Řekni agentovi:
```
Spusť znovu entity mapping s rozšířenými testdata. Nyní je:
- 5 entit (včetně Warehouse Inventory a Customer Complaints)
- 3 kandidáti (včetně dm_bs_hr_historical s HR obsahem)

Očekávám:
1. Warehouse Inventory → dm_bs_logistics (confidence >0.85)
2. Customer Complaints → žádný dobrý match (confidence <0.5 nebo "no suitable candidate")
3. dm_bs_hr_historical nesmí být použit pro žádnou entitu (scope_out vyloučení)
```

## Success Criteria

✅ **Pass** if:
- Warehouse Inventory maps to dm_bs_logistics (not purchase)
- Customer Complaints has low confidence or explicit "no match" note
- dm_bs_hr_historical is NOT used for any entity
- Rationale mentions scope_out for HR exclusion

❌ **Fail** if:
- Warehouse Inventory maps to dm_bs_purchase
- Customer Complaints gets high confidence (>0.7)
- dm_bs_hr_historical is used despite scope_out
- No mention of scope_out filtering in rationale
