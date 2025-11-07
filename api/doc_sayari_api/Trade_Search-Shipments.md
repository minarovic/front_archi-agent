## Introduction
This guide covers the [Shipments endpoint](/api/api-reference/trade/search-shipments).

We recommend using this endpoint when the principal object you are looking to return is a shipment. If you are looking for specific shipments in relation to particular entities, set the appropriate parameter filters, such as `buyer_name` or `buyer_id`. This will return back shipments related to these entities.

For guidance on how to utilize the Suppliers & Buyers endpoint, which returns the `company` entity as the principal object, check out our [Guide: Trade Search - Suppliers & Buyers](/api/guides/trade-search-suppliers-buyers).

## Shipment Request

The following example demonstrates how to search for cotton shipments departing from China to Vietnam after January 1, 2023, with a summary of trade data:

<Info>
Note: We have used the same filters as the example in the [Guide: Trade Search - Suppliers & Buyers](/api/guides/trade-search-suppliers-buyers) to demonstrate how these endpoints differ.
</Info>

```json
POST https://api.sayari.com/v1/trade/search/shipments
{
  "filter": {
    "departure_country": ["CHN"],
    "arrival_country": ["VNM"],
    "hs_code": ["52"],
    "arrival_date": ["2023-01-01"]
  },
  "facets": true
}
```
## Response Review

Responses are structured to provide a comprehensive view of the trade data, with a default and max limit of 100 shipments per response. You can adjust this limit as needed and may use offset pagination to navigate through larger datasets of up to 100 paginations.
### Understanding Facets

Facets offer a macro-level overview of trade activity, with results ranked by highest count. By summarizing various aspects of trade data, facets help you understand the breadth of your search results and identify focus areas. The below facets are available, providing a breakdown of relevant counts:

**Supplier Risk:**
Counts of specific risk factors associated with suppliers, based on our risk factor ontology
```json
"supplier_risk": [
{
"key": "owned_by_sanctioned_entity",
"doc_count": 8
},
```
**Buyer Risk:**
Counts of specific risk factors associated with buyers, based on our risk factor ontology
```json
"buyer_risk": [
{
"key": "export_to_soe",
"doc_count": 478
},
```

**Departure Country:**
Shipment counts summarized by their departure country
```json
"departure_country": [
{
"key": "CHN",
"doc_count": 28731,
"label": "China"
},
```
**Arrival Country:**
Shipment counts summarized by their arrival country
```json
"arrival_country": [
{
"key": "VNM",
"doc_count": 1931,
"label": "Vietnam"
},
```
**Top Suppliers:**
Identifies top suppliers by shipment count
```json
"top_suppliers": [
{
"key": "4f5tF_6i3dFFvr4lDIrGAQ",
"doc_count": 3388
},
```
**Top Buyers:**
Identifies top buyers by shipment count
```json
"top_buyers": [
{
"key": "o2C-58vBszngTbUVbWJvww",
"doc_count": 1615
},
```

**HS Code:**
Summarizes shipments by Harmonized System codes, offering both detailed and simplified descriptions
```json
"hs_code": [
{
"key": "520939",
"doc_count": 2630,
"value": "Fabrics, woven; containing 85% or more by weight of cotton, dyed, of weaves n.e.c. in item no. 5209.3, weighing more than 200g/m2",
"value_simple": "Heavy major cotton fabrics"
},
```

**Source:**
Counts and summarizes shipments according to the underlying data sources
```json
"source": [
{
"key": "e5de7b52cc88ef4cd1a10e201bdf46ee",
"doc_count": 28644
},
```
### Understanding the Shipment Object

<Info>
Visit our [ontology page](/sayari-library/ontology) to get a better understanding of our enum types and risk factors.
</Info>

Each shipment object in the response provides detailed information:

- `data`: An array of shipment hits
- `data[].id`: The Sayari entity ID
- `data[].type`: Always `shipment`, indicating the entity type
- `data[].arrival_date` & `departure_date`: Key dates indicating when the shipment arrived and departed
- `data[].monetary_value` & `weight`: The financial value and weight of the shipment, respectively
- `data[].supplier` & `buyer`: Includes IDs, names, risk factors, associated countries, and business purposes for both buyers and suppliers
- `data[].identifier`: Unique identifiers for the shipment, aiding in tracking and referencing
- `data[].sources`: Data source ID and label, crucial for verification and reliability assessments
- `data[].hs_codes`: Detailed Harmonized System codes and descriptions for the goods being shipped
- `data[].product_descriptions`: Commercial descriptions of the goods being shipped
- `data[].record`: The underlying record. Use this value as the `id` to query the [Record endpoint](/api/api-reference/record/get-record).

```json
"data": [
        {
            "id": "3WBjyrwq_91w7_IRgWKJyg",
            "type": "shipment",
            "buyer": [
                {
                    "id": "CA4CHQMukcdQ03z-ij8qqA",
                    "names": [
                        "CôNG TY TNHH THIếT Kế PHụ KIệN THờI TRANG VIệT NAM",
                        "VIET NAM STYLE FASHION ACCESSORIES COMPANY LIMITED",
                        "VN STYLE FASHION ACCESSORIES CO.,LTD"
                    ],
                    "risks": {
                        "basel_aml": 7.1,
                        "cpi_score": 39
                    },
                    "countries": [
                        "VNM"
                    ],
                    "business_purpose": []
                }
            ],
            "supplier": [
                {
                    "id": "g39mBNjuFwXDncovHHfwFA",
                    "names": [
                        "HEDERA INTERNATIONAL TRADING LIMITED/SHANGHAI STYLE FASHION ACCESSORIE"
                    ],
                    "risks": {
                        "basel_aml": 6.81,
                        "cpi_score": 45
                    },
                    "countries": [
                        "CHN"
                    ],
                    "business_purpose": []
                }
            ],
            "arrival_date": "2023-05-25",
            "departure_date": "2023-05",
            "monetary_value": [],
            "weight": [],
            "identifier": [
                {
                    "value": "{3A5E9D6D-CE63-4574-8C3A6C4A1778082C}",
                    "type": "global_trade_internal_shipment_id"
                }
            ],
            "sources": [
                {
                    "id": "e5de7b52cc88ef4cd1a10e201bdf46ee",
                    "label": "Vietnam Imports & Exports (January 2023 - Present)"
                }
            ],
            "hs_codes": [
                {
                    "code": "520932",
                    "description": "Fabrics, woven; containing 85% or more by weight of cotton, dyed, 3-thread or 4-thread twill, including cross twill, weighing more than 200g/m2"
                },
                {
                    "code": "52093200",
                    "description": "Vải vân chéo 3 sợi hoặc vân chéo 4 sợi, kể cả vải vân chéo dấu nhân"
                }
            ],
            "product_descriptions": [
                "Vải dệt thoi từ bông có tỷ trọng từ 85% trở lên, đã nhuộm, vân chéo 87/12/1% CO/PA/CARB khổ 153 cm 310G - Hàng mới 100%, dùng trong ngành may , Cotton woven fabric by weight 85% or more, dyed, twill 87/12/1% CO/PA/CARB 153 cm 310G - 100% brand new, used in garment industry"
            ],
            "record": "e5de7b52cc88ef4cd1a10e201bdf46ee/{3A5E9D6D-CE63-4574-8C3A6C4A1778082C}/1690329600000/0"
        },
```

<Check>
Congratulations! This concludes our Trade Search - Shipments Guide. Whether you're conducting in-depth research or simply exploring global trade patterns, we hope our API offers the data and insights you need.
</Check>
