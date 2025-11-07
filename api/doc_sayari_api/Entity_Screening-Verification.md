## Introduction

Automate Entity Screening and Business Verification with Sayari APIs. Our three-step workflow delivers comprehensive entity intelligence, empowering your organization to make confident decisions and mitigate risks effectively at scale.

![screening_verification.png](https://fern-doc-assets.s3.amazonaws.com/screening_verification.png)

<Steps>

 ### Match & Validate
   Via the [Resolution Endpoint](/api/api-reference/resolution/resolution), automate entity mapping and verification using Sayari's matching algorithms. This step:
   - Maps your client data to Sayari's extensive, global knowledge graph
   - Returns a unique `entity_id` for matched entities
   - Provides match quality scores for confident decision-making, and workflow management

   <AccordionGroup>
     <Accordion title="Request">
     ```json
     curl -X POST "https://api.sayari.com/v1/resolution" \
          -H "Authorization: Bearer <token>" \
          -H "Content-Type: application/json" \
          -d '{
       "name": [
         "Thomas Bangalter"
       ],
       "address": [
         "8 AVENUE RACHEL"
       ],
       "country": [
         "FRA"
       ]
     }'
     ```
     </Accordion>
     <Accordion title="Response">
     ```json
     {
         "fields": {
             "name": [
                 "Thomas Bangalter"
             ],
             "address": [
                 "8 AVENUE RACHEL"
             ],
             "country": [
                 "FRA"
             ]
         },
         "data": [
             {
                 "profile": "corporate",
                 "score": 294.50284,
                 "entity_id": "1nOeH5G2EhmRVtmeVqO2Lw",
                 "label": "Mr Thomas Bangalter",
                 "type": "person",
                 "identifiers": [
                     {
                         "type": "uk_person_number",
                         "value": "053673450003",
                         "label": "Uk Person Number"
                     },
                     {
                         "type": "uk_person_number",
                         "value": "053673450002",
                         "label": "Uk Person Number"
                     }
                 ],
                 "addresses": [
                     "5TH FLOOR 104 OXFORD STREET, W1D 1LP, LONDON, UNITED KINGDOM",
                     "Oxford Street, London, W1D 1LP",
                     "8 AVENUE RACHEL, 75018, FRANCE",
                     "4th Floor, 205 Wardour Street, London, W1F 8ZJ",
                     "MSE BUSINESS MANAGEMENT LLP 4TH FLOOR, 205 WARDOUR STREET, W1F 8ZJ, UNITED KINGDOM"
                 ],
                 "countries": [
                     "FRA",
                     "GBR"
                 ],
                 "sources": [
                     "ecdfb3f2ecc8c3797e77d5795a8066ef",
                     "4ea8bac1bed868e1510ffd21842e9551"
                 ],
                 "typed_matched_queries": [
                     "address|sub|phraseStripped|0",
                     "name|100match|0",
                     "address|subclause|0",
                     "address|numericFirst|0",
                     "address|numericFull|0",
                     "address|V2|Strict|0",
                     "name|StrictV2|0",
                     "address|V3|0",
                     "name|100phrase|0",
                     "country|0",
                     "address|sub|cleanedAddress|0",
                     "address|sub|phraseFirstHalf|0"
                 ],
                 "matched_queries": [
                     "address",
                     "name",
                     "country"
                 ],
                 "highlight": {
                     "name": [
                         "Mr <em>Thomas</em> <em>Bangalter</em>"
                     ],
                     "address": [
                         "<em>8</em> <em>AVENUE</em> <em>RACHEL</em>, 75018, FRANCE"
                     ],
                     "country": [
                         "<em>FRA</em>"
                     ]
                 },
                 "explanation": {
                     "name": [
                         {
                             "matched": "Mr <em>Thomas</em> <em>Bangalter</em>",
                             "uploaded": "Thomas Bangalter",
                             "high_quality_match_name": true,
                             "scores": {
                                 "tf": 0.35648895767689204,
                                 "lv": 0.9142857142857143,
                                 "fz": 0.8421052631578947,
                                 "l1": 1,
                                 "l2": 1
                             },
                             "n_common_term_matches": 1,
                             "n_uncommon_term_matches": 1
                         }
                     ],
                     "address": [
                         {
                             "matched": "<em>8</em> <em>AVENUE</em> <em>RACHEL</em>, 75018, FRANCE",
                             "uploaded": "8 AVENUE RACHEL",
                             "match_quality": "medium",
                             "scores": {
                                 "9p": 0.47058823529411764
                             }
                         }
                     ],
                     "country": [
                         {
                             "matched": "<em>FRA</em>",
                             "uploaded": "FRA"
                         }
                     ]
                 },
                 "match_strength": {
                     "value": "strong"
                 }
             }
         ]
     }
     ```
     </Accordion>
   </AccordionGroup>

   ### Review
   Using the [Entity Endpoint](/api/api-reference/entity/get-entity), access comprehensive entitiy profiles including:
   - Full attribute set
   - First-order relationships
   - Seed & Network risk factors
   - Source documents
   - Possibly Same As Entities
   - Comprehensive L1 PDF Reports

   <AccordionGroup>
     <Accordion title="Request">
     ```json
     curl -X GET "https://api.sayari.com/v1/entity/1nOeH5G2EhmRVtmeVqO2Lw" \
          -H "Authorization: Bearer <token>"
     ```
     </Accordion>
     <Accordion title="Response">
     ```json
     {
       "id": "1nOeH5G2EhmRVtmeVqO2Lw",
       "label": "Mr Thomas Bangalter",
       "degree": 1,
       "entity_url": "/v1/entity/1nOeH5G2EhmRVtmeVqO2Lw",
       "pep": false,
       "psa_count": 0,
       "sanctioned": false,
       "closed": false,
       "trade_count": {
         "sent": 0,
         "received": 0
       },
       "type": "person",
       "identifiers": [
         {
           "value": "053673450003",
           "type": "uk_person_number",
           "label": "Uk Person Number"
         },
         {
           "value": "053673450002",
           "type": "uk_person_number",
           "label": "Uk Person Number"
         }
       ],
       "addresses": [
         "5TH FLOOR 104 OXFORD STREET, W1D 1LP, LONDON, UNITED KINGDOM",
         "Oxford Street, London, W1D 1LP",
         "8 AVENUE RACHEL, 75018, FRANCE"
       ],
       "date_of_birth": "1975-01",
       "countries": [
         "FRA",
         "GBR"
       ],
       "relationship_count": {
         "registered_agent_of": 1,
         "shareholder_of": 1,
         "director_of": 1
       },
       "source_count": {
         "4ea8bac1bed868e1510ffd21842e9551": {
           "count": 28,
           "label": "UK Persons with Significant Control"
         },
         "ecdfb3f2ecc8c3797e77d5795a8066ef": {
           "count": 17,
           "label": "UK Corporate Registry"
         }
       },
       "risk": {
         "basel_aml": {
           "value": 3.67,
           "metadata": {
             "country": [
               "GBR"
             ]
           },
           "level": "relevant"
         },
         "cpi_score": {
           "value": 71,
           "metadata": {
             "country": [
               "FRA"
             ]
           },
           "level": "relevant"
         }
       },
       "user_attribute_counts": {},
       "user_attribute_count": {},
       "user_record_count": 0,
       "user_related_entities_count": 0,
       "user_relationship_count": {},
       "related_entities_count": 1,
       "attribute_counts": {
         "name": 1,
         "identifier": 2,
         "additional_information": 2,
         "country": 4,
         "date_of_birth": 1,
         "address": 5
       },
       "attribute_count": {
         "name": 1,
         "identifier": 2,
         "additional_information": 2,
         "country": 4,
         "date_of_birth": 1,
         "address": 5
       },
       "reference_id": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000:9030330caf25555c42c0bc0d84ea4aa1",
       "attributes": {
         "additional_information": {
           "limit": 1,
           "next": "-ZxT52B_NysiUJbONmirSA",
           "size": {
             "count": 2,
             "qualifier": "eq"
           },
           "data": [
             {
               "properties": {
                 "value": "Individual Person With Significant Control",
                 "type": "Kind"
               },
               "record": [
                 "4ea8bac1bed868e1510ffd21842e9551/03389614/1560176240192"
               ],
               "record_count": 28,
               "editable": false
             }
           ]
         },
         "address": {
           "limit": 1,
           "next": "2CDkfB3w9fsqU7Na2_fnGQ",
           "size": {
             "count": 5,
             "qualifier": "eq"
           },
           "data": [
             {
               "properties": {
                 "value": "MSE BUSINESS MANAGEMENT LLP 4TH FLOOR, 205 WARDOUR STREET, W1F 8ZJ, UNITED KINGDOM",
                 "house": "Mse Business Management Llp",
                 "house_number": "205",
                 "level": "4th Floor",
                 "road": "Wardour Street",
                 "postcode": "W1F 8ZJ",
                 "country": "GBR",
                 "x": -0.13569739117644306,
                 "y": 51.51553922917637,
                 "precision_code": "2",
                 "normalized": "205 4TH 8ZJ BUSINESS FLOOR KINGDOM LLP MANAGEMENT MSE ST UNITED W1F WARDOUR",
                 "Geocoding Added By": "Sayari",
                 "Geocoding Information": "Geocoded with ArcGIS World Geocoder"
               },
               "record": [
                 "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000"
               ],
               "record_count": 1,
               "editable": false
             }
           ]
         },
         "country": {
           "limit": 1,
           "next": "fErzlSvnZUo2iDOyfmSjVw",
           "size": {
             "count": 4,
             "qualifier": "eq"
           },
           "data": [
             {
               "properties": {
                 "value": "FRA",
                 "context": "nationality"
               },
               "record": [
                 "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000"
               ],
               "record_count": 45,
               "editable": false
             }
           ]
         },
         "date_of_birth": {
           "limit": 100,
           "size": {
             "count": 1,
             "qualifier": "eq"
           },
           "data": [
             {
               "properties": {
                 "value": "1975-01"
               },
               "record": [
                 "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000"
               ],
               "record_count": 45,
               "editable": false
             }
           ]
         },
         "identifier": {
           "limit": 1,
           "next": "ioLvt9gHqE94Xh5txHIjTg",
           "size": {
             "count": 2,
             "qualifier": "eq"
           },
           "data": [
             {
               "properties": {
                 "value": "053673450003",
                 "type": "uk_person_number"
               },
               "record": [
                 "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000"
               ],
               "record_count": 17,
               "editable": false
             }
           ]
         },
         "name": {
           "limit": 1,
           "size": {
             "count": 1,
             "qualifier": "eq"
           },
           "data": [
             {
               "properties": {
                 "value": "Mr Thomas Bangalter",
                 "context": "primary"
               },
               "record": [
                 "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000"
               ],
               "record_count": 45,
               "editable": false
             }
           ]
         }
       },
       "relationships": {
         "limit": 1,
         "size": {
           "count": 1,
           "qualifier": "eq"
         },
         "data": [
           {
             "target": {
               "id": "0SI0bJruBfTw9Pkp7l3x9A",
               "label": "DAFT LIFE LIMITED",
               "degree": 6,
               "entity_url": "/v1/entity/0SI0bJruBfTw9Pkp7l3x9A",
               "pep": false,
               "psa_id": "7765300939072",
               "psa_count": 1,
               "sanctioned": false,
               "closed": false,
               "company_type": "Private Limited Company",
               "registration_date": "Incorporated 1997-06-20",
               "latest_status": {
                 "status": "active"
               },
               "trade_count": {
                 "sent": 0,
                 "received": 0
               },
               "type": "company",
               "identifiers": [
                 {
                   "value": "03389614",
                   "type": "uk_company_number",
                   "label": "Uk Company Number"
                 }
               ],
               "addresses": [
                 "5TH FLOOR, 104 OXFORD STREET, FITZROVIA, LONDON, W1D 1LP, UNITED KINGDOM"
               ],
               "countries": [
                 "GBR"
               ],
               "relationship_count": {
                 "has_shareholder": 3,
                 "has_registered_agent": 3,
                 "has_director": 3
               },
               "source_count": {
                 "2b618f1996252fe537a6d998ae14c9b2": {
                   "count": 1,
                   "label": "UK Corporate Registry Confirmation Statements"
                 },
                 "ecdfb3f2ecc8c3797e77d5795a8066ef": {
                   "count": 48,
                   "label": "UK Corporate Registry"
                 },
                 "4ea8bac1bed868e1510ffd21842e9551": {
                   "count": 82,
                   "label": "UK Persons with Significant Control"
                 }
               },
               "risk": {},
               "user_attribute_counts": {},
               "user_attribute_count": {},
               "user_record_count": 0,
               "user_related_entities_count": 0,
               "user_relationship_count": {},
               "related_entities_count": 6,
               "attribute_counts": {
                 "company_type": 1,
                 "name": 1,
                 "business_purpose": 3,
                 "identifier": 1,
                 "country": 2,
                 "status": 2,
                 "address": 1,
                 "financials": 12
               },
               "attribute_count": {
                 "company_type": 1,
                 "name": 1,
                 "business_purpose": 3,
                 "identifier": 1,
                 "country": 2,
                 "status": 2,
                 "address": 1,
                 "financials": 12
               },
               "reference_id": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000:ac8b56c9882f34c8520ff458c6dbaa56"
             },
             "types": {
               "director_of": [
                 {
                   "editable": false,
                   "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1725062400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2024-08-31"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1715040000000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2024-05-07",
                   "publication_date": "2024-05-07"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1712016000000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2024-04-02",
                   "publication_date": "2024-04-02"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1706054400000",
                   "attributes": {
                     "position": [
                       {
                         "value": "Secretary"
                       }
                     ]
                   },
                   "from_date": "1997-06-20",
                   "acquisition_date": "2024-01-24",
                   "publication_date": "2024-01-24"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1680566400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2023-04-04",
                   "publication_date": "2023-04-04"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1677542400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2023-02-28",
                   "publication_date": "2023-02-28"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1667433600000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2022-11-03",
                   "publication_date": "2022-11-03"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1660694400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2022-08-17",
                   "publication_date": "2022-08-17"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1650844800000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2022-04-25",
                   "publication_date": "2022-04-25"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1643328000000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2022-01-28",
                   "publication_date": "2022-01-28"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1634774400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2021-10-21",
                   "publication_date": "2021-10-21"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1626307200000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2021-07-15",
                   "publication_date": "2021-07-15"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1618358400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2021-04-14",
                   "publication_date": "2021-04-14"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1611100800000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2021-01-20",
                   "publication_date": "2021-01-20"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1601424000000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2020-09-30",
                   "publication_date": "2020-09-30"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1594166400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2020-07-08",
                   "publication_date": "2020-07-08"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1588723200000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "acquisition_date": "2020-05-06",
                   "publication_date": "2020-05-06"
                 },
                 {
                   "editable": false,
                   "record": "4ea8bac1bed868e1510ffd21842e9551/03389614/1560176240192",
                   "attributes": {
                     "position": [
                       {
                         "value": "Owns 25-50% of shares"
                       }
                     ]
                   },
                   "from_date": "1997-06-20",
                   "acquisition_date": "2019-06-10"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000",
                   "attributes": {
                     "position": [
                       {
                         "value": "Director"
                       }
                     ]
                   },
                   "from_date": "1997-06-20",
                   "acquisition_date": "2018-10-23",
                   "publication_date": "2018-10-23"
                 }
               ],
               "registered_agent_of": [
                 {
                   "editable": false,
                   "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1725062400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2024-08-31"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1715040000000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2024-05-07",
                   "publication_date": "2024-05-07"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1712016000000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2024-04-02",
                   "publication_date": "2024-04-02"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1706054400000",
                   "attributes": {
                     "position": [
                       {
                         "value": "Secretary"
                       }
                     ]
                   },
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2024-01-24",
                   "publication_date": "2024-01-24"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1680566400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2023-04-04",
                   "publication_date": "2023-04-04"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1677542400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2023-02-28",
                   "publication_date": "2023-02-28"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1667433600000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2022-11-03",
                   "publication_date": "2022-11-03"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1660694400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2022-08-17",
                   "publication_date": "2022-08-17"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1650844800000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2022-04-25",
                   "publication_date": "2022-04-25"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1643328000000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2022-01-28",
                   "publication_date": "2022-01-28"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1634774400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2021-10-21",
                   "publication_date": "2021-10-21"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1626307200000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2021-07-15",
                   "publication_date": "2021-07-15"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1618358400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2021-04-14",
                   "publication_date": "2021-04-14"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1611100800000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2021-01-20",
                   "publication_date": "2021-01-20"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1601424000000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2020-09-30",
                   "publication_date": "2020-09-30"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1594166400000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2020-07-08",
                   "publication_date": "2020-07-08"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1588723200000",
                   "attributes": {},
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2020-05-06",
                   "publication_date": "2020-05-06"
                 },
                 {
                   "editable": false,
                   "record": "4ea8bac1bed868e1510ffd21842e9551/03389614/1560176240192",
                   "attributes": {
                     "position": [
                       {
                         "value": "Owns 25-50% of shares"
                       }
                     ]
                   },
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2019-06-10"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000",
                   "attributes": {
                     "position": [
                       {
                         "value": "Director"
                       }
                     ]
                   },
                   "from_date": "1997-06-20",
                   "to_date": "1997-06-21",
                   "former": true,
                   "acquisition_date": "2018-10-23",
                   "publication_date": "2018-10-23"
                 }
               ],
               "shareholder_of": [
                 {
                   "editable": false,
                   "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1725062400000",
                   "attributes": {},
                   "acquisition_date": "2024-08-31"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1715040000000",
                   "attributes": {},
                   "acquisition_date": "2024-05-07",
                   "publication_date": "2024-05-07"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1712016000000",
                   "attributes": {},
                   "acquisition_date": "2024-04-02",
                   "publication_date": "2024-04-02"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1706054400000",
                   "attributes": {
                     "position": [
                       {
                         "value": "Secretary"
                       }
                     ]
                   },
                   "acquisition_date": "2024-01-24",
                   "publication_date": "2024-01-24"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1680566400000",
                   "attributes": {},
                   "acquisition_date": "2023-04-04",
                   "publication_date": "2023-04-04"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1677542400000",
                   "attributes": {},
                   "acquisition_date": "2023-02-28",
                   "publication_date": "2023-02-28"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1667433600000",
                   "attributes": {},
                   "acquisition_date": "2022-11-03",
                   "publication_date": "2022-11-03"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1660694400000",
                   "attributes": {},
                   "acquisition_date": "2022-08-17",
                   "publication_date": "2022-08-17"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1650844800000",
                   "attributes": {},
                   "acquisition_date": "2022-04-25",
                   "publication_date": "2022-04-25"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1643328000000",
                   "attributes": {},
                   "acquisition_date": "2022-01-28",
                   "publication_date": "2022-01-28"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1634774400000",
                   "attributes": {},
                   "acquisition_date": "2021-10-21",
                   "publication_date": "2021-10-21"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1626307200000",
                   "attributes": {},
                   "acquisition_date": "2021-07-15",
                   "publication_date": "2021-07-15"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1618358400000",
                   "attributes": {},
                   "acquisition_date": "2021-04-14",
                   "publication_date": "2021-04-14"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1611100800000",
                   "attributes": {},
                   "acquisition_date": "2021-01-20",
                   "publication_date": "2021-01-20"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1601424000000",
                   "attributes": {},
                   "acquisition_date": "2020-09-30",
                   "publication_date": "2020-09-30"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1594166400000",
                   "attributes": {},
                   "acquisition_date": "2020-07-08",
                   "publication_date": "2020-07-08"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1588723200000",
                   "attributes": {},
                   "acquisition_date": "2020-05-06",
                   "publication_date": "2020-05-06"
                 },
                 {
                   "editable": false,
                   "record": "4ea8bac1bed868e1510ffd21842e9551/03389614/1560176240192",
                   "attributes": {
                     "position": [
                       {
                         "value": "Owns 25-50% of shares"
                       }
                     ],
                     "shares": [
                       {
                         "percentage": 25
                       }
                     ]
                   },
                   "acquisition_date": "2019-06-10"
                 },
                 {
                   "editable": false,
                   "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000",
                   "attributes": {
                     "position": [
                       {
                         "value": "Director"
                       }
                     ]
                   },
                   "acquisition_date": "2018-10-23",
                   "publication_date": "2018-10-23"
                 }
               ]
             },
             "dates": [
               "2016-04-06"
             ],
             "first_observed": "1997-06-20",
             "last_observed": "1997-06-21",
             "start_date": "1997-06-20",
             "end_date": "1997-06-21"
           }
         ]
       },
       "possibly_same_as": {
         "limit": 1,
         "size": {
           "count": 0,
           "qualifier": "eq"
         },
         "data": []
       },
       "referenced_by": {
         "limit": 1,
         "size": {
           "count": 45,
           "qualifier": "eq"
         },
         "next": "R0JSfHVrX2NvbXBhbmllc19ob3VzZXxmfDIwMjQtMDUtMDd8MDMzODk2MTR8MTcxNTA0MDAwMDAwMA",
         "data": [
           {
             "record": {
               "id": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1715040000000",
               "label": "Company Record from UK Corporate Registry",
               "source": "ecdfb3f2ecc8c3797e77d5795a8066ef",
               "publication_date": "2024-05-07",
               "acquisition_date": "2024-05-07",
               "references_count": 6,
               "record_url": "/record/ecdfb3f2ecc8c3797e77d5795a8066ef%2F03389614%2F1715040000000",
               "source_url": "https://beta.companieshouse.gov.uk/company/"
             },
             "type": "mentions"
           }
         ]
       }
     }
     ```
     </Accordion>
   </AccordionGroup>

 ### Explore
   Through the [Traversal Endpoint](/api/api-reference/traversal/traversal), go beyond direct relationships to expose hidden risks and relationships. With traversals:
   - Understand complete corporate structures and their controlling entities
   - Uncover beneficial ownership through complex holding structures
   - Map upstream supply-chain networks
   - Identify and comprehend indirect exposure to network risks

   <AccordionGroup>
     <Accordion title="Request">
     ```json
     curl -X GET "https://api.sayari.com/v1/traversal/1nOeH5G2EhmRVtmeVqO2Lw" \
          -H "Authorization: Bearer <token>"
          -d limit=1
     ```
     </Accordion>
     <Accordion title="Response">
     ```json
     {
         "min_depth": 1,
         "max_depth": 4,
         "relationships": [],
         "countries": [],
         "types": [],
         "name": "",
         "watchlist": false,
         "psa": true,
         "offset": 0,
         "limit": 1,
         "partial_results": false,
         "next": true,
         "explored_count": 9999999,
         "data": [
             {
                 "source": "1nOeH5G2EhmRVtmeVqO2Lw",
                 "target": {
                     "id": "0SI0bJruBfTw9Pkp7l3x9A",
                     "label": "DAFT LIFE LIMITED",
                     "degree": 6,
                     "entity_url": "/v1/entity/0SI0bJruBfTw9Pkp7l3x9A",
                     "pep": false,
                     "psa_id": "7765300939072",
                     "psa_count": 1,
                     "sanctioned": false,
                     "closed": false,
                     "company_type": "Private Limited Company",
                     "registration_date": "Incorporated 1997-06-20",
                     "latest_status": {
                         "status": "active"
                     },
                     "trade_count": {
                         "sent": 0,
                         "received": 0
                     },
                     "type": "company",
                     "identifiers": [
                         {
                             "value": "03389614",
                             "type": "uk_company_number",
                             "label": "Uk Company Number"
                         }
                     ],
                     "addresses": [
                         "5TH FLOOR, 104 OXFORD STREET, FITZROVIA, LONDON, W1D 1LP, UNITED KINGDOM"
                     ],
                     "countries": [
                         "GBR"
                     ],
                     "relationship_count": {
                         "has_shareholder": 3,
                         "has_registered_agent": 3,
                         "has_director": 3
                     },
                     "source_count": {
                         "2b618f1996252fe537a6d998ae14c9b2": {
                             "count": 1,
                             "label": "UK Corporate Registry Confirmation Statements"
                         },
                         "ecdfb3f2ecc8c3797e77d5795a8066ef": {
                             "count": 48,
                             "label": "UK Corporate Registry"
                         },
                         "4ea8bac1bed868e1510ffd21842e9551": {
                             "count": 82,
                             "label": "UK Persons with Significant Control"
                         }
                     },
                     "risk": {},
                     "user_attribute_counts": {},
                     "user_attribute_count": {},
                     "user_record_count": 0,
                     "user_related_entities_count": 0,
                     "user_relationship_count": {},
                     "related_entities_count": 6,
                     "attribute_counts": {
                         "company_type": 1,
                         "name": 1,
                         "business_purpose": 3,
                         "identifier": 1,
                         "country": 2,
                         "status": 2,
                         "address": 1,
                         "financials": 12
                     },
                     "attribute_count": {
                         "company_type": 1,
                         "name": 1,
                         "business_purpose": 3,
                         "identifier": 1,
                         "country": 2,
                         "status": 2,
                         "address": 1,
                         "financials": 12
                     },
                     "reference_id": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000:ac8b56c9882f34c8520ff458c6dbaa56"
                 },
                 "path": [
                     {
                         "field": "director_of",
                         "entity": {
                             "id": "0SI0bJruBfTw9Pkp7l3x9A",
                             "label": "DAFT LIFE LIMITED",
                             "degree": 6,
                             "entity_url": "/v1/entity/0SI0bJruBfTw9Pkp7l3x9A",
                             "pep": false,
                             "psa_id": "7765300939072",
                             "psa_count": 1,
                             "sanctioned": false,
                             "closed": false,
                             "company_type": "Private Limited Company",
                             "registration_date": "Incorporated 1997-06-20",
                             "latest_status": {
                                 "status": "active"
                             },
                             "trade_count": {
                                 "sent": 0,
                                 "received": 0
                             },
                             "type": "company",
                             "identifiers": [
                                 {
                                     "value": "03389614",
                                     "type": "uk_company_number",
                                     "label": "Uk Company Number"
                                 }
                             ],
                             "addresses": [
                                 "5TH FLOOR, 104 OXFORD STREET, FITZROVIA, LONDON, W1D 1LP, UNITED KINGDOM"
                             ],
                             "countries": [
                                 "GBR"
                             ],
                             "relationship_count": {
                                 "has_shareholder": 3,
                                 "has_registered_agent": 3,
                                 "has_director": 3
                             },
                             "source_count": {
                                 "2b618f1996252fe537a6d998ae14c9b2": {
                                     "count": 1,
                                     "label": "UK Corporate Registry Confirmation Statements"
                                 },
                                 "ecdfb3f2ecc8c3797e77d5795a8066ef": {
                                     "count": 48,
                                     "label": "UK Corporate Registry"
                                 },
                                 "4ea8bac1bed868e1510ffd21842e9551": {
                                     "count": 82,
                                     "label": "UK Persons with Significant Control"
                                 }
                             },
                             "risk": {},
                             "user_attribute_counts": {},
                             "user_attribute_count": {},
                             "user_record_count": 0,
                             "user_related_entities_count": 0,
                             "user_relationship_count": {},
                             "related_entities_count": 6,
                             "attribute_counts": {
                                 "company_type": 1,
                                 "name": 1,
                                 "business_purpose": 3,
                                 "identifier": 1,
                                 "country": 2,
                                 "status": 2,
                                 "address": 1,
                                 "financials": 12
                             },
                             "attribute_count": {
                                 "company_type": 1,
                                 "name": 1,
                                 "business_purpose": 3,
                                 "identifier": 1,
                                 "country": 2,
                                 "status": 2,
                                 "address": 1,
                                 "financials": 12
                             },
                             "reference_id": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000:ac8b56c9882f34c8520ff458c6dbaa56"
                         },
                         "relationships": {
                             "director_of": {
                                 "values": [
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2018-10-23",
                                         "publication_date": "2018-10-23",
                                         "attributes": {
                                             "position": [
                                                 {
                                                     "value": "Director"
                                                 }
                                             ]
                                         }
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/03389614/1560176240192",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2019-06-10",
                                         "attributes": {
                                             "position": [
                                                 {
                                                     "value": "Owns 25-50% of shares"
                                                 }
                                             ]
                                         }
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1586822400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2020-04-14",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1588723200000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2020-05-06",
                                         "publication_date": "2020-05-06",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1594166400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2020-07-08",
                                         "publication_date": "2020-07-08",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1601424000000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2020-09-30",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1601424000000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2020-09-30",
                                         "publication_date": "2020-09-30",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1611100800000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2021-01-20",
                                         "publication_date": "2021-01-20",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1616630400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2021-03-25",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1618358400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2021-04-14",
                                         "publication_date": "2021-04-14",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1626307200000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2021-07-15",
                                         "publication_date": "2021-07-15",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1634169600000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2021-10-14",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1634774400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2021-10-21",
                                         "publication_date": "2021-10-21",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1643328000000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2022-01-28",
                                         "publication_date": "2022-01-28",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1649894400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2022-04-14",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1650844800000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2022-04-25",
                                         "publication_date": "2022-04-25",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1660694400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2022-08-17",
                                         "publication_date": "2022-08-17",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1667433600000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2022-11-03",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1667433600000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2022-11-03",
                                         "publication_date": "2022-11-03",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1675123200000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-01-31",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1676505600000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-02-16",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1677542400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-02-28",
                                         "publication_date": "2023-02-28",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1678320000000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-03-09",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1680566400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-04-04",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1680566400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-04-04",
                                         "publication_date": "2023-04-04",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1682899200000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-05-01",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1685577600000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-06-01",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1689033600000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-07-11",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1692662400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-08-22",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1694476800000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-09-12",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1696896000000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-10-10",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1699488000000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-11-09",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1702252800000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2023-12-11",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1704067200000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-01-01",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1706054400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-01-24",
                                         "publication_date": "2024-01-24",
                                         "attributes": {
                                             "position": [
                                                 {
                                                     "value": "Secretary"
                                                 }
                                             ]
                                         }
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1706832000000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-02-02",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1709596800000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-03-05",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1711843200000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-03-31",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1712016000000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-04-02",
                                         "publication_date": "2024-04-02",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1714435200000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-04-30",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1715040000000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-05-07",
                                         "publication_date": "2024-05-07",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1717113600000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-05-31",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1719705600000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-06-30",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1722384000000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-07-31",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1725062400000",
                                         "from_date": "1997-06-20",
                                         "acquisition_date": "2024-08-31",
                                         "attributes": {}
                                     }
                                 ],
                                 "start_date": "1997-06-20",
                                 "end_date": "1997-06-21",
                                 "last_observed": "2024-08-31"
                             },
                             "registered_agent_of": {
                                 "values": [
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2018-10-23",
                                         "publication_date": "2018-10-23",
                                         "former": true,
                                         "attributes": {
                                             "position": [
                                                 {
                                                     "value": "Director"
                                                 }
                                             ]
                                         }
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/03389614/1560176240192",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2019-06-10",
                                         "former": true,
                                         "attributes": {
                                             "position": [
                                                 {
                                                     "value": "Owns 25-50% of shares"
                                                 }
                                             ]
                                         }
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1586822400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2020-04-14",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1588723200000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2020-05-06",
                                         "publication_date": "2020-05-06",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1594166400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2020-07-08",
                                         "publication_date": "2020-07-08",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1601424000000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2020-09-30",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1601424000000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2020-09-30",
                                         "publication_date": "2020-09-30",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1611100800000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2021-01-20",
                                         "publication_date": "2021-01-20",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1616630400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2021-03-25",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1618358400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2021-04-14",
                                         "publication_date": "2021-04-14",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1626307200000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2021-07-15",
                                         "publication_date": "2021-07-15",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1634169600000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2021-10-14",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1634774400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2021-10-21",
                                         "publication_date": "2021-10-21",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1643328000000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2022-01-28",
                                         "publication_date": "2022-01-28",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1649894400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2022-04-14",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1650844800000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2022-04-25",
                                         "publication_date": "2022-04-25",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1660694400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2022-08-17",
                                         "publication_date": "2022-08-17",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1667433600000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2022-11-03",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1667433600000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2022-11-03",
                                         "publication_date": "2022-11-03",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1675123200000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-01-31",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1676505600000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-02-16",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1677542400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-02-28",
                                         "publication_date": "2023-02-28",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1678320000000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-03-09",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1680566400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-04-04",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1680566400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-04-04",
                                         "publication_date": "2023-04-04",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1682899200000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-05-01",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1685577600000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-06-01",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1689033600000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-07-11",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1692662400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-08-22",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1694476800000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-09-12",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1696896000000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-10-10",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1699488000000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-11-09",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1702252800000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2023-12-11",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1704067200000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-01-01",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1706054400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-01-24",
                                         "publication_date": "2024-01-24",
                                         "former": true,
                                         "attributes": {
                                             "position": [
                                                 {
                                                     "value": "Secretary"
                                                 }
                                             ]
                                         }
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1706832000000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-02-02",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1709596800000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-03-05",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1711843200000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-03-31",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1712016000000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-04-02",
                                         "publication_date": "2024-04-02",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1714435200000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-04-30",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1715040000000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-05-07",
                                         "publication_date": "2024-05-07",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1717113600000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-05-31",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1719705600000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-06-30",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1722384000000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-07-31",
                                         "former": true,
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1725062400000",
                                         "from_date": "1997-06-20",
                                         "to_date": "1997-06-21",
                                         "acquisition_date": "2024-08-31",
                                         "former": true,
                                         "attributes": {}
                                     }
                                 ],
                                 "start_date": "1997-06-20",
                                 "end_date": "1997-06-21",
                                 "last_observed": "2024-08-31"
                             },
                             "shareholder_of": {
                                 "values": [
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1540252800000",
                                         "date": "2018-10-23",
                                         "acquisition_date": "2018-10-23",
                                         "publication_date": "2018-10-23",
                                         "attributes": {
                                             "position": [
                                                 {
                                                     "value": "Director"
                                                 }
                                             ]
                                         }
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/03389614/1560176240192",
                                         "acquisition_date": "2019-06-10",
                                         "attributes": {
                                             "position": [
                                                 {
                                                     "value": "Owns 25-50% of shares"
                                                 }
                                             ],
                                             "shares": [
                                                 {
                                                     "percentage": 25
                                                 }
                                             ]
                                         }
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1586822400000",
                                         "acquisition_date": "2020-04-14",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1588723200000",
                                         "date": "2020-05-06",
                                         "acquisition_date": "2020-05-06",
                                         "publication_date": "2020-05-06",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1594166400000",
                                         "date": "2020-07-08",
                                         "acquisition_date": "2020-07-08",
                                         "publication_date": "2020-07-08",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1601424000000",
                                         "acquisition_date": "2020-09-30",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1601424000000",
                                         "date": "2020-09-30",
                                         "acquisition_date": "2020-09-30",
                                         "publication_date": "2020-09-30",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1611100800000",
                                         "date": "2021-01-20",
                                         "acquisition_date": "2021-01-20",
                                         "publication_date": "2021-01-20",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1616630400000",
                                         "acquisition_date": "2021-03-25",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1618358400000",
                                         "date": "2021-04-14",
                                         "acquisition_date": "2021-04-14",
                                         "publication_date": "2021-04-14",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1626307200000",
                                         "date": "2021-07-15",
                                         "acquisition_date": "2021-07-15",
                                         "publication_date": "2021-07-15",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1634169600000",
                                         "acquisition_date": "2021-10-14",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1634774400000",
                                         "date": "2021-10-21",
                                         "acquisition_date": "2021-10-21",
                                         "publication_date": "2021-10-21",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1643328000000",
                                         "date": "2022-01-28",
                                         "acquisition_date": "2022-01-28",
                                         "publication_date": "2022-01-28",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1649894400000",
                                         "acquisition_date": "2022-04-14",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1650844800000",
                                         "date": "2022-04-25",
                                         "acquisition_date": "2022-04-25",
                                         "publication_date": "2022-04-25",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1660694400000",
                                         "date": "2022-08-17",
                                         "acquisition_date": "2022-08-17",
                                         "publication_date": "2022-08-17",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1667433600000",
                                         "acquisition_date": "2022-11-03",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1667433600000",
                                         "date": "2022-11-03",
                                         "acquisition_date": "2022-11-03",
                                         "publication_date": "2022-11-03",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1675123200000",
                                         "acquisition_date": "2023-01-31",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1676505600000",
                                         "acquisition_date": "2023-02-16",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1677542400000",
                                         "date": "2023-02-28",
                                         "acquisition_date": "2023-02-28",
                                         "publication_date": "2023-02-28",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1678320000000",
                                         "acquisition_date": "2023-03-09",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1680566400000",
                                         "acquisition_date": "2023-04-04",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1680566400000",
                                         "date": "2023-04-04",
                                         "acquisition_date": "2023-04-04",
                                         "publication_date": "2023-04-04",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1682899200000",
                                         "acquisition_date": "2023-05-01",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1685577600000",
                                         "acquisition_date": "2023-06-01",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1689033600000",
                                         "acquisition_date": "2023-07-11",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1692662400000",
                                         "acquisition_date": "2023-08-22",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1694476800000",
                                         "acquisition_date": "2023-09-12",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1696896000000",
                                         "acquisition_date": "2023-10-10",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1699488000000",
                                         "acquisition_date": "2023-11-09",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1702252800000",
                                         "acquisition_date": "2023-12-11",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1704067200000",
                                         "acquisition_date": "2024-01-01",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1706054400000",
                                         "date": "2024-01-24",
                                         "acquisition_date": "2024-01-24",
                                         "publication_date": "2024-01-24",
                                         "attributes": {
                                             "position": [
                                                 {
                                                     "value": "Secretary"
                                                 }
                                             ]
                                         }
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1706832000000",
                                         "acquisition_date": "2024-02-02",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1709596800000",
                                         "acquisition_date": "2024-03-05",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1711843200000",
                                         "acquisition_date": "2024-03-31",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1712016000000",
                                         "date": "2024-04-02",
                                         "acquisition_date": "2024-04-02",
                                         "publication_date": "2024-04-02",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1714435200000",
                                         "acquisition_date": "2024-04-30",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "ecdfb3f2ecc8c3797e77d5795a8066ef/03389614/1715040000000",
                                         "date": "2024-05-07",
                                         "acquisition_date": "2024-05-07",
                                         "publication_date": "2024-05-07",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1717113600000",
                                         "acquisition_date": "2024-05-31",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1719705600000",
                                         "acquisition_date": "2024-06-30",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1722384000000",
                                         "acquisition_date": "2024-07-31",
                                         "attributes": {}
                                     },
                                     {
                                         "record": "4ea8bac1bed868e1510ffd21842e9551/cabb26d426967517138404fa9abb400b/1725062400000",
                                         "acquisition_date": "2024-08-31",
                                         "attributes": {}
                                     }
                                 ],
                                 "start_date": "1997-06-20",
                                 "end_date": "1997-06-21",
                                 "last_observed": "2024-08-31"
                             }
                         }
                     }
                 ]
             }
         ]
     }
     ```
     </Accordion>
   </AccordionGroup>
</Steps>
