




Risk factors are included on entity profiles in Sayari Graph to provide enhanced insight into risk type and severity. This page documents the different levels and types of risk in Sayari Graph.
<Note>
**[Implementation Guide](/api/guides/risk-factors)** - Risk methodology and best practices
**[Download CSV](https://fern-doc-assets.s3.us-east-1.amazonaws.com/risks.csv)** - Complete list of risk factors
</Note>

## Adverse Media Risk Factors

### Bribery and Corruption (from Adverse Media)
Key: `reputational_risk_bribery_and_corruption`
Level: `elevated`
Category: `adverse_media`
Visibility: `seed`

The entity has been mentioned by official government websites or mass media outlets as wanted, charged, indicted, prosecuted, convicted, or sentenced for criminal activity related to bribery and corruption.

### Cybercrime (from Adverse Media)
Key: `reputational_risk_cybercrime`
Level: `elevated`
Category: `adverse_media`
Visibility: `seed`

The entity has been mentioned by official government websites or mass media outlets as wanted, charged, indicted, prosecuted, convicted, or sentenced for criminal activity related to cybercrime.

### Financial Crime (from Adverse Media)
Key: `reputational_risk_financial_crime`
Level: `elevated`
Category: `adverse_media`
Visibility: `seed`

The entity has been mentioned by official government websites or mass media outlets as wanted, charged, indicted, prosecuted, convicted, or sentenced for criminal activity related to financial crime.

### Forced Labor and Modern Slavery (from Adverse Media)
Key: `reputational_risk_forced_labor`
Level: `elevated`
Category: `adverse_media`
Visibility: `seed`

The entity has been mentioned by official government websites or mass media outlets as wanted, charged, indicted, prosecuted, convicted, or sentenced for criminal activity related to forced labor and modern slavery.

### Law Enforcement Action (from Adverse Media)
Key: `law_enforcement_action`
Level: `elevated`
Category: `adverse_media`
Visibility: `seed`

The entity has been mentioned by official government websites or mass media outlets as wanted, charged, indicted, prosecuted, convicted, or sentenced in relation to a law enforcement action.

### Organized Crime (from Adverse Media)
Key: `reputational_risk_organized_crime`
Level: `elevated`
Category: `adverse_media`
Visibility: `seed`

The entity has been mentioned by official government websites or mass media outlets as wanted, charged, indicted, prosecuted, convicted, or sentenced for criminal activity related to organized crime.

### Other Reputational Risk (from Adverse Media)
Key: `reputational_risk_other`
Level: `elevated`
Category: `adverse_media`
Visibility: `seed`

The entity has been mentioned by official government websites or mass media outlets as wanted, charged, indicted, prosecuted, convicted, or sentenced for criminal activity related to other reputational risk.

### Terrorism (from Adverse Media)
Key: `reputational_risk_terrorism`
Level: `elevated`
Category: `adverse_media`
Visibility: `seed`

The entity has been mentioned by official government websites or mass media outlets as wanted, charged, indicted, prosecuted, convicted, or sentenced for criminal activity related to terrorism.

## Environmental Risk Risk Factors

### Exports Cattle from High-Risk Country for Deforestation (EUDR)
Key: `exports_eudr_shipment_cattle`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports cattle or cattle products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for cattle may include Paraguay, Bolivia, Nigeria, Colombia, Democratic Republic of the Congo, Angola, Mexico, Argentina, Myanmar, Brazil.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025.

### Exports Cattle from High-Risk Country for Deforestation (EUDR) (May Include 'PSA' Path)
Key: `psa_exports_eudr_shipment_cattle`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports cattle or cattle products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for cattle may include Paraguay, Bolivia, Nigeria, Colombia, Democratic Republic of the Congo, Angola, Mexico, Argentina, Myanmar, Brazil.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports Cocoa from High-Risk Country for Deforestation (EUDR)
Key: `exports_eudr_shipment_cocoa`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports cocoa or cocoa products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for cocoa may include Côte d'Ivoire, Ghana, Colombia, Republic of the Congo, Papua New Guinea, Cameroon, Peru.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025.

### Exports Cocoa from High-Risk Country for Deforestation (EUDR) (May Include 'PSA' Path)
Key: `psa_exports_eudr_shipment_cocoa`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports cocoa or cocoa products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for cocoa may include Côte d'Ivoire, Ghana, Colombia, Republic of the Congo, Papua New Guinea, Cameroon, Peru.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports Coffee from High-Risk Country for Deforestation (EUDR)
Key: `exports_eudr_shipment_coffee`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports coffee or coffee products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for coffee may include Mexico, Uganda, Tanzania, Peru, Vietnam, Brazil, Honduras, Costa Rica.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025.

### Exports Coffee from High-Risk Country for Deforestation (EUDR) (May Include 'PSA' Path)
Key: `psa_exports_eudr_shipment_coffee`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports coffee or coffee products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for coffee may include Mexico, Uganda, Tanzania, Peru, Vietnam, Brazil, Honduras, Costa Rica.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports Palm Oil from High-Risk Country for Deforestation (EUDR)
Key: `exports_eudr_shipment_palm_oil`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports palm oil or palm oil products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for palm oil may include Papua New Guinea, Cambodia, Ecuador, Indonesia, Malaysia, Peru.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025.

### Exports Palm Oil from High-Risk Country for Deforestation (EUDR) (May Include 'PSA' Path)
Key: `psa_exports_eudr_shipment_palm_oil`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports palm oil or palm oil products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for palm oil may include Papua New Guinea, Cambodia, Ecuador, Indonesia, Malaysia, Peru.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports Rubber from High-Risk Country for Deforestation (EUDR)
Key: `exports_eudr_shipment_rubber`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports rubber or rubber products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for rubber may include Philippines, Liberia, Cambodia, Vietnam, Colombia, Thailand.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025.

### Exports Rubber from High-Risk Country for Deforestation (EUDR) (May Include 'PSA' Path)
Key: `psa_exports_eudr_shipment_rubber`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports rubber or rubber products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for rubber may include Philippines, Liberia, Cambodia, Vietnam, Colombia, Thailand.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports Soya from High-Risk Country for Deforestation (EUDR)
Key: `exports_eudr_shipment_soya`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports soy or soy products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for soy may include Brazil, Argentina, and Bolivia.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025.

### Exports Soya from High-Risk Country for Deforestation (EUDR) (May Include 'PSA' Path)
Key: `psa_exports_eudr_shipment_soya`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports soy or soy products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for soy may include Brazil, Argentina, and Bolivia.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports Wood from High-Risk Country for Deforestation (EUDR)
Key: `exports_eudr_shipment_wood`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports wood or wood products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for wood may include Vietnam, Indonesia, Cambodia, China, Brazil, India.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025.

### Exports Wood from High-Risk Country for Deforestation (EUDR) (May Include 'PSA' Path)
Key: `psa_exports_eudr_shipment_wood`
Level: `elevated`
Category: `environmental_risk`
Visibility: `seed`
Learn more [here](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1115)

This entity exports wood or wood products from one or more countries where its production may be associated with high risk under the EUDR, based on country measures of commodity-driven deforestation, biodiversity loss, and governance. Countries with high EUDR risk for wood may include Vietnam, Indonesia, Cambodia, China, Brazil, India.
Countries identified as high-risk by Sayari may not conform with those specified by the EU. The EU is expected to finalize its country risk benchmarking system by June 30, 2025; the regulation will take effect on December 30, 2025. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

## Export Controls Risk Factors

### Direct Exports of Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List
Key: `exports_bis_high_priority_items_direct`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['imports_bis_high_priority_items']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity may have directly exported to Russia, Belarus, or Iran one or more shipments with Harmonized System (HS) codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes listed in Tier 1 and Tier 2 of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL) are subject to the most comprehensive controls under the Export Administration Regulations (15 CFR Parts 730 – 774) (EAR), meaning a license is required for items associated with these HS codes destined for these jurisdictions, including certain foreign-produced items. The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom.

### Direct Exports of Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List (May Include 'PSA' Path)
Key: `psa_exports_bis_high_priority_items_direct`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['psa_imports_bis_high_priority_items']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity may have directly exported to Russia, Belarus, or Iran one or more shipments with Harmonized System (HS) codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes listed in Tier 1 and Tier 2 of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL) are subject to the most comprehensive controls under the Export Administration Regulations (15 CFR Parts 730 – 774) (EAR), meaning a license is required for items associated with these HS codes destined for these jurisdictions, including certain foreign-produced items. The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Direct Exports of Critical Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List
Key: `exports_bis_high_priority_items_critical_components_direct`
Level: `high`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['imports_bis_high_priority_items_critical_components']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity may have directly exported to Russia, Belarus, or Iran one or more shipments with Harmonized System (HS) codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes listed in Tier 1 and Tier 2 of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL) are subject to the most comprehensive controls under the Export Administration Regulations (15 CFR Parts 730 – 774) (EAR), meaning a license is required for items associated with these HS codes destined for these jurisdictions, including certain foreign-produced items. The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom.

### Direct Exports of Critical Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List (May Include 'PSA' Path)
Key: `psa_exports_bis_high_priority_items_critical_components_direct`
Level: `high`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['psa_imports_bis_high_priority_items_critical_components']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity may have directly exported to Russia, Belarus, or Iran one or more shipments with Harmonized System (HS) codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes listed in Tier 1 and Tier 2 of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL) are subject to the most comprehensive controls under the Export Administration Regulations (15 CFR Parts 730 – 774) (EAR), meaning a license is required for items associated with these HS codes destined for these jurisdictions, including certain foreign-produced items. The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Entity Displays Active License from Federal Security Service of the Russian Federation (FSB RF)
Key: `entity_licensed_with_fsb_rf`
Level: `high`
Category: `export_controls`
Visibility: `seed`
Learn more [here](https://www.fincen.gov/sites/default/files/2022-06/FinCEN%20and%20Bis%20Joint%20Alert%20FINAL.pdf)

The entity displays an active license from the Federal Security Service of the Russian Federation (FSB RF), which allows companies to work on projects classified as a state secret.

### Entity Exports to Entity that Displays Active License from FSB RF
Key: `exports_to_entity_licensed_with_fsb_rf`
Level: `high`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.fincen.gov/sites/default/files/2022-06/FinCEN%20and%20Bis%20Joint%20Alert%20FINAL.pdf)
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['entity_licensed_with_fsb_rf']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity has possibly directly exported to an entity that displays an active license from the Federal Security Service of the Russian Federation (FSB RF), which allows companies to work on projects classified as a state secret (1 hop away). Per FinCEN and the U.S. Department of Commerce's Bureau of Industry and Security (BIS), transactions with these companies is a potential red flag indicator of export control evasion in effort to procure EAR99 items. Consideration of this indicator, in conjunction with conducting appropriate risk-based customer and transactional due diligence, will assist in determining whether an identified activity may be connected to export control evasion.

### Entity Exports to Entity that Displays Active License from FSB RF (May Include 'PSA' Path)
Key: `psa_exports_to_entity_licensed_with_fsb_rf`
Level: `high`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.fincen.gov/sites/default/files/2022-06/FinCEN%20and%20Bis%20Joint%20Alert%20FINAL.pdf)
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['entity_licensed_with_fsb_rf']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity has possibly directly exported to an entity that displays an active license from the Federal Security Service of the Russian Federation (FSB RF), which allows companies to work on projects classified as a state secret (1 hop away). Per FinCEN and the U.S. Department of Commerce's Bureau of Industry and Security (BIS), transactions with these companies is a potential red flag indicator of export control evasion in effort to procure EAR99 items. Consideration of this indicator, in conjunction with conducting appropriate risk-based customer and transactional due diligence, will assist in determining whether an identified activity may be connected to export control evasion. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Export Control Lists
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `export_controls`
Level: `critical`
Category: `export_controls`
Visibility: `seed`

The entity is subject to trade restrictions per the U.S. Consolidated Screening List, a list of parties for which the United States government maintains restrictions on certain exports, reexports, or transfers of items.

### Exports to AECA Debarred List Entity
Key: `exports_to_usa_aeca_debarred_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['usa_aeca_debarred']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the AECA Debarred List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to AECA Debarred List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_usa_aeca_debarred_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['usa_aeca_debarred']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the AECA Debarred List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to BIS Denied Persons List Entity
Key: `exports_to_usa_bis_denied_persons_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['usa_bis_denied_persons']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the BIS Denied Persons List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to BIS Denied Persons List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_usa_bis_denied_persons_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['usa_bis_denied_persons']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the BIS Denied Persons List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to BIS Military End User (MEU) List Entity
Key: `exports_to_usa_bis_meu_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['usa_bis_meu']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the BIS Military End User (MEU) List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to BIS Military End User (MEU) List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_usa_bis_meu_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['usa_bis_meu']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the BIS Military End User (MEU) List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to BIS Unverified List Entity
Key: `exports_to_usa_bis_unverified_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['usa_bis_unverified']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the BIS Unverified List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to BIS Unverified List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_usa_bis_unverified_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['usa_bis_unverified']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the BIS Unverified List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Entity in BIS Entity List
Key: `exports_to_usa_bis_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['usa_bis']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the BIS Entity List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Entity in BIS Entity List (May Include 'PSA' Path)
Key: `psa_exports_to_usa_bis_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['usa_bis']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the BIS Entity List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to ISN Nonproliferation Sanctions List Entity
Key: `exports_to_usa_isn_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['usa_isn']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the ISN Nonproliferation Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to ISN Nonproliferation Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_usa_isn_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['usa_isn']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the ISN Nonproliferation Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Japan METI End User List Entity
Key: `exports_to_jpn_meti_end_user_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['jpn_meti_end_user']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the Japan METI End User List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Japan METI End User List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_jpn_meti_end_user_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['jpn_meti_end_user']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the Japan METI End User List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Japan MOFA Export Ban List Entity
Key: `exports_to_jpn_mofa_export_ban_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['jpn_mofa_export_ban']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the Japan MOFA Export Ban List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Japan MOFA Export Ban List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_jpn_mofa_export_ban_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['jpn_mofa_export_ban']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the Japan MOFA Export Ban List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to USA NDAA Section 1260H List Entity
Key: `exports_to_usa_section_1260h_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['usa_section_1260h']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the USA NDAA Section 1260H List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to USA NDAA Section 1260H List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_usa_section_1260h_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['usa_section_1260h']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has exported one or more goods to an entity that has been added to the USA NDAA Section 1260H List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Imports Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List
Key: `imports_bis_high_priority_items`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['exports_bis_high_priority_items']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity has imported one or more shipments with HS codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes are listed in Tiers 3.A, 3.B, 4.A, and 4.B of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL). The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom.

### Imports Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List (May Include 'PSA' Path)
Key: `psa_imports_bis_high_priority_items`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['psa_exports_bis_high_priority_items']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity has imported one or more shipments with HS codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes are listed in Tiers 3.A, 3.B, 4.A, and 4.B of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL). The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Imports Critical Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List
Key: `imports_bis_high_priority_items_critical_components`
Level: `high`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['exports_bis_high_priority_items_critical_components']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity has imported one or more shipments with HS codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes listed in Tier 1 and Tier 2 of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL) are subject to the most comprehensive controls under the Export Administration Regulations (15 CFR Parts 730 – 774) (EAR), meaning a license is required for items associated with these HS codes destined for these jurisdictions, including certain foreign-produced items. The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom.

### Imports Critical Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List (May Include 'PSA' Path)
Key: `psa_imports_bis_high_priority_items_critical_components`
Level: `high`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['psa_exports_bis_high_priority_items_critical_components']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity has imported one or more shipments with HS codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes listed in Tier 1 and Tier 2 of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL) are subject to the most comprehensive controls under the Export Administration Regulations (15 CFR Parts 730 – 774) (EAR), meaning a license is required for items associated with these HS codes destined for these jurisdictions, including certain foreign-produced items. The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Indirect Exports of Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List
Key: `exports_bis_high_priority_items_indirect`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['imports_bis_high_priority_items']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity may have been involved, knowingly or unknowingly, in indirect exports to Russia, Belarus, or Iran through intermediate countries (2-3 hops away) of shipments with Harmonized System (HS) codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes are listed in Tiers 3.A, 3.B, 4.A, and 4.B of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL). The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom.

### Indirect Exports of Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List (May Include 'PSA' Path)
Key: `psa_exports_bis_high_priority_items_indirect`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['psa_imports_bis_high_priority_items']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity may have been involved, knowingly or unknowingly, in indirect exports to Russia, Belarus, or Iran through intermediate countries (2-3 hops away) of shipments with Harmonized System (HS) codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes are listed in Tiers 3.A, 3.B, 4.A, and 4.B of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL). The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Indirect Exports of Critical Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List
Key: `exports_bis_high_priority_items_critical_components_indirect`
Level: `high`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['imports_bis_high_priority_items_critical_components']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity may have been involved, knowingly or unknowingly, in indirect exports to Russia, Belarus, or Iran through intermediate countries (2-3 hops away) of shipments with Harmonized System (HS) codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes listed in Tier 1 and Tier 2 of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL) are subject to the most comprehensive controls under the Export Administration Regulations (15 CFR Parts 730 – 774) (EAR). The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom.

### Indirect Exports of Critical Components in USA Bureau of Industry and Security (BIS) Common High Priority Items List (May Include 'PSA' Path)
Key: `psa_exports_bis_high_priority_items_critical_components_indirect`
Level: `high`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://www.bis.doc.gov/index.php/all-articles/13-policy-guidance/country-guidance/2172-russia-export-controls-list-of-common-high-priority-items)
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['psa_imports_bis_high_priority_items_critical_components']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity may have been involved, knowingly or unknowingly, in indirect exports to Russia, Belarus, or Iran through intermediate countries (2-3 hops away) of shipments with Harmonized System (HS) codes corresponding to critical U.S. components that Russia relies on for its weapons systems. These HS codes listed in Tier 1 and Tier 2 of the U.S. Bureau of Industry and Security's Common High Priority List (CHPL) are subject to the most comprehensive controls under the Export Administration Regulations (15 CFR Parts 730 – 774) (EAR). The BIS has developed the CHPL in collaboration with the European Union, Japan, and the United Kingdom. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Listed on USA Dept. of Defense National Defense Authorization Act (NDAA) of 2021 Section 1260H List
Key: `export_controls_section_1260h`
Level: `high`
Category: `export_controls`
Visibility: `seed`

The entity is listed on the USA Dept. of Defense's National Defense Authorization Act (NDAA) of 2021 - Section 1260H List, which identifies foreign companies and organizations with ties to the Chinese military or defense sector. This list was created to address national security risks posed by entities that support the Chinese military's modernization efforts, including through the development of advanced technologies with potential military applications. Exporters may face heightened scrutiny.

### Majority Owned by BIS Military End User (MEU) List Entity
Key: `export_controls_bis_meu_50_percent_rule`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['export_controls_bis_meu']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly majority owned by one or more entities currently subject to US export controls through listing on the USA Dept. of Commerce BIS Military End User List up to 4 hops away with an aggregate of 50% or more controlling interest (per OFAC’s 50% rule) via direct shareholding relationships. These relationships include shareholder or subsidiary. Applicable to entities globally.

### Majority Owned by BIS Military End User (MEU) List Entity (May Include 'PSA' Path)
Key: `psa_export_controls_bis_meu_50_percent_rule`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['export_controls_bis_meu']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly majority owned by one or more entities currently subject to US export controls through listing on the USA Dept. of Commerce BIS Military End User List up to 4 hops away with an aggregate of 50% or more controlling interest (per OFAC’s 50% rule) via direct shareholding relationships. These relationships include shareholder or subsidiary. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Majority Owned by Entity in BIS Entity List
Key: `usa_bis_50_percent_rule`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['usa_bis']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly majority owned by one or more entities currently subject to US export controls through listing on the BIS Entity List up to 6 hops away with an aggregate of 50% or more controlling interest (per OFAC’s 50% rule) via direct shareholding relationships. These relationships include shareholder or subsidiary. Applicable to entities globally.

### Majority Owned by Entity in BIS Entity List (May Include 'PSA' Path)
Key: `psa_usa_bis_50_percent_rule`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_bis']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly majority owned by one or more entities currently subject to US export controls through listing on the BIS Entity List up to 6 hops away with an aggregate of 50% or more controlling interest (per OFAC’s 50% rule) via direct shareholding relationships. These relationships include shareholder or subsidiary. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Military End Use Keywords
Key: `military_end_use_china_keywords`
Level: `elevated`
Category: `export_controls`
Visibility: `seed`

This entity may be engaged in Military End Use related activities in China, based on keywords in an official company business purpose reported in Chinese corporate records. Keywords include Chinese terms for “weapons”, “military industry” and “military products”.

### Military-Civil Fusion (MCF) Entity
Key: `military_civil_fusion`
Level: `high`
Category: `export_controls`
Visibility: `seed`
Learn more [here](https://2017-2021.state.gov/wp-content/uploads/2020/06/What-is-MCF-One-Pager.pdf)

The entity is a Chinese company possibly associated with China's Military-Civil Fusion (MCF) program based on keywords found in the company's name, address, or business purpose. MCF is the Chinese Communist Party (CCP) national strategy to develop the People's Liberation Army (PLA) into a "world class military" by 2049 through the elimination of barriers between China's civilian and defense sectors.

### National Defense Authorization Act Section 889 Covered Entities
Key: `ndaa_889_covered_entities`
Level: `high`
Category: `export_controls`
Visibility: `seed`

The entity is subject to US public procurement restrictions per section 889 of the John S. McCain National Defense Authorization Act, which prohibits the government from obtaining certain telecommunications equipment produced by covered entities and from contracting with any entity that uses such equipment.

### Owned by AECA Debarred List Entity
Key: `owned_by_usa_aeca_debarred_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['usa_aeca_debarred']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the AECA Debarred List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by AECA Debarred List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_usa_aeca_debarred_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_aeca_debarred']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the AECA Debarred List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by BIS Denied Persons List Entity
Key: `owned_by_usa_bis_denied_persons_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['usa_bis_denied_persons']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the BIS Denied Persons List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by BIS Denied Persons List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_usa_bis_denied_persons_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_bis_denied_persons']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the BIS Denied Persons List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by BIS Military End User (MEU) List Entity
Key: `owned_by_usa_bis_meu_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['usa_bis_meu']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the BIS Military End User (MEU) List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by BIS Military End User (MEU) List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_usa_bis_meu_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_bis_meu']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the BIS Military End User (MEU) List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by BIS Unverified List Entity
Key: `owned_by_usa_bis_unverified_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['usa_bis_unverified']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the BIS Unverified List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by BIS Unverified List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_usa_bis_unverified_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_bis_unverified']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the BIS Unverified List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Entity in BIS Entity List
Key: `owned_by_usa_bis_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['usa_bis']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the BIS Entity List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Entity in BIS Entity List (May Include 'PSA' Path)
Key: `psa_owned_by_usa_bis_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_bis']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the BIS Entity List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Entity in Export Controls List
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `owned_by_entity_in_export_controls`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['export_controls']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity in an export controls list up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Entity in Export Controls List (May Include 'PSA' Path)
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `psa_owned_by_entity_in_export_controls`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['export_controls']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity in an export controls list up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by ISN Nonproliferation Sanctions List Entity
Key: `owned_by_usa_isn_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['usa_isn']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the ISN Nonproliferation Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by ISN Nonproliferation Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_usa_isn_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_isn']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the ISN Nonproliferation Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Japan METI End User List Entity
Key: `owned_by_jpn_meti_end_user_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['jpn_meti_end_user']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Japan METI End User List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Japan METI End User List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_jpn_meti_end_user_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['jpn_meti_end_user']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Japan METI End User List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Japan MOFA Export Ban List Entity
Key: `owned_by_jpn_mofa_export_ban_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['jpn_mofa_export_ban']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Japan MOFA Export Ban List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Japan MOFA Export Ban List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_jpn_mofa_export_ban_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['jpn_mofa_export_ban']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Japan MOFA Export Ban List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Listed on Non-SDN Chinese Military-Industrial Complex Companies (NS-CMIC) List
Key: `owned_by_cmic_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://home.treasury.gov/policy-issues/financial-sanctions/consolidated-sanctions-list/ns-cmic-list)
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['cmic_entity']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the USA Department of the Treasury Non-SDN Chinese Military-Industrial Complex Companies List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Listed on Non-SDN Chinese Military-Industrial Complex Companies (NS-CMIC) List (May Include 'PSA' Path)
Key: `psa_owned_by_cmic_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
Learn more [here](https://home.treasury.gov/policy-issues/financial-sanctions/consolidated-sanctions-list/ns-cmic-list)
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['cmic_entity']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the USA Department of the Treasury Non-SDN Chinese Military-Industrial Complex Companies List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Military-Civil Fusion (MCF) Entity
Key: `owned_by_military_civil_fusion`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['military_civil_fusion']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by a Chinese company possibly associated with China's Military-Civil Fusion (MCF) program, based on keywords found in the company's name, address, or business purpose, up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Military-Civil Fusion (MCF) Entity (May Include 'PSA' Path)
Key: `psa_owned_by_military_civil_fusion`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['military_civil_fusion']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by a Chinese company possibly associated with China's Military-Civil Fusion (MCF) program, based on keywords found in the company's name, address, or business purpose, up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by USA NDAA Section 1260H List Entity
Key: `owned_by_usa_section_1260h_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['usa_section_1260h']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the USA NDAA Section 1260H List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by USA NDAA Section 1260H List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_usa_section_1260h_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_section_1260h']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the USA NDAA Section 1260H List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of AECA Debarred List Entity
Key: `owner_of_usa_aeca_debarred_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['usa_aeca_debarred']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the AECA Debarred List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of AECA Debarred List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_usa_aeca_debarred_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_aeca_debarred']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the AECA Debarred List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of BIS Denied Persons List Entity
Key: `owner_of_usa_bis_denied_persons_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['usa_bis_denied_persons']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the BIS Denied Persons List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of BIS Denied Persons List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_usa_bis_denied_persons_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_bis_denied_persons']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the BIS Denied Persons List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of BIS Military End User (MEU) List Entity
Key: `owner_of_usa_bis_meu_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['usa_bis_meu']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the BIS Military End User (MEU) List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of BIS Military End User (MEU) List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_usa_bis_meu_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_bis_meu']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the BIS Military End User (MEU) List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of BIS Unverified List Entity
Key: `owner_of_usa_bis_unverified_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['usa_bis_unverified']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the BIS Unverified List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of BIS Unverified List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_usa_bis_unverified_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_bis_unverified']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the BIS Unverified List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Entity in BIS Entity List
Key: `owner_of_usa_bis_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['usa_bis']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the BIS Entity List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Entity in BIS Entity List (May Include 'PSA' Path)
Key: `psa_owner_of_usa_bis_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_bis']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the BIS Entity List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Entity in Export Controls List
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `owner_of_export_controls_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['export_controls']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an export-controlled entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Entity in Export Controls List (May Include 'PSA' Path)
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `psa_owner_of_export_controls_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['export_controls']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an export-controlled entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of ISN Nonproliferation Sanctions List Entity
Key: `owner_of_usa_isn_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['usa_isn']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the ISN Nonproliferation Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of ISN Nonproliferation Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_usa_isn_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_isn']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the ISN Nonproliferation Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Japan METI End User List Entity
Key: `owner_of_jpn_meti_end_user_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['jpn_meti_end_user']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Japan METI End User List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Japan METI End User List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_jpn_meti_end_user_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['jpn_meti_end_user']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Japan METI End User List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Japan MOFA Export Ban List Entity
Key: `owner_of_jpn_mofa_export_ban_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['jpn_mofa_export_ban']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Japan MOFA Export Ban List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Japan MOFA Export Ban List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_jpn_mofa_export_ban_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['jpn_mofa_export_ban']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Japan MOFA Export Ban List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of USA NDAA Section 1260H List Entity
Key: `owner_of_usa_section_1260h_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['usa_section_1260h']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the USA NDAA Section 1260H List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of USA NDAA Section 1260H List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_usa_section_1260h_entity`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['usa_section_1260h']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the USA NDAA Section 1260H List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Possibly the Same As (PSA) Entity Displays Active License from Federal Security Service of the Russian Federation (FSB RF)
Key: `psa_entity_licensed_with_fsb_rf`
Level: `high`
Category: `export_controls`
Visibility: `psa`
Learn more [here](https://www.fincen.gov/sites/default/files/2022-06/FinCEN%20and%20Bis%20Joint%20Alert%20FINAL.pdf)

The entity is possibly the same as an entity that displays an active license from the Federal Security Service of the Russian Federation (FSB RF), which allows companies to work on projects classified as a state secret. The entities did not meet the threshold required to merge them into a single entity, but they may be the same.

### Possibly the Same As (PSA) Entity in Export Controls List
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `psa_export_controls`
Level: `critical`
Category: `export_controls`
Visibility: `psa`

The entity is Possibly the Same As (PSA) an entity subject to export controls. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Military-Civil Fusion Entity
Key: `psa_military_civil_fusion`
Level: `high`
Category: `export_controls`
Visibility: `psa`

The entity is possibly the same as an entity that is a Chinese company possibly associated with China's Military-Civil Fusion (MCF) program based on keywords found in the company's name, address, or business purpose. The entities did not meet the threshold required to merge them into a single entity, but they may be the same.

### Possibly the Same As (PSA) USA BIS Boycott Requester List Entity
Key: `psa_bis_boycott_requester_list`
Level: `elevated`
Category: `export_controls`
Visibility: `psa`

The entity is possibly the same as an entity listed on the USA BIS Boycott Requester List as having made a boycott-related request in connection with a transaction in the interstate or foreign commerce of the United States and has been reported to BIS as required by Section 760.5 of the EAR. The entities did not meet the threshold required to merge them into a single entity, but they may be the same.

### Procurement Activity in High-Risk Jurisdiction
Key: `meu_list_contractors`
Level: `high`
Category: `export_controls`
Visibility: `seed`

This entity appears in government procurement records — either as a contractor or agency — in China, Russia, or Venezuela. These jurisdictions are subject to U.S. export controls under §744.21 of the Export Administration Regulations (EAR), which imposes licensing requirements on certain items destined for military end uses or end users in countries classified under Country Group D:5. These countries are also frequently associated with broader sanctions exposure and state-driven industrial policy. Presence in this procurement context may warrant further review for potential diversion, compliance risk, or geopolitical sensitivity.

### Related to Export Controls
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `export_controls_adjacent`
Level: `elevated`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['export_controls']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from an entity subject to export controls. Applies to all relationship types that do not signify ownership.

### Subsidiary or Affiliate of USA National Defense Authorization Act Section 889 Covered Entities
Key: `subsidiary_of_ndaa_889_covered_entities`
Level: `high`
Category: `export_controls`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['ndaa_889_covered_entities']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity may be subject to US public procurement restrictions per section 889 of the John S. McCain National Defense Authorization Act as it is a subsidiary or affiliate of a covered entity. Subsidiaries and affiliates of covered entities are subject to the same restrictions as their parent companies and the regulation prohibits the government from obtaining certain telecommunications equipment produced by these entities and from contracting with any entity that uses such equipment.

### USA BIS Boycott Requester List Entity
Key: `bis_boycott_requester_list`
Level: `elevated`
Category: `export_controls`
Visibility: `seed`

The entity is listed on the USA BIS Boycott Requester List as having made a boycott-related request in connection with a transaction in the interstate or foreign commerce of the United States and has been reported to BIS as required by Section 760.5 of the EAR.

## Forced Labor Risk Factors

### Conflict Minerals Risk
Key: `exports_conflict_minerals`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['imports_conflict_minerals']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity may have exported Tin, Tantalum, Tungsten, or Gold (3TG) from a country classified as a conflict-affected and high-risk area (CAHRA) under the EU Conflict Minerals Regulation

### Conflict Minerals Risk (May Include 'PSA' Path)
Key: `psa_exports_conflict_minerals`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['psa_imports_conflict_minerals']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity may have exported Tin, Tantalum, Tungsten, or Gold (3TG) from a country classified as a conflict-affected and high-risk area (CAHRA) under the EU Conflict Minerals Regulation This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Direct Trade History with ASPI Entity
Key: `forced_labor_aspi_origin_direct`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['aspi_uyghur_forced_labor_report_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity possibly traded directly with an entity mentioned in the following forced labor report: "Uyghurs for sale: ‘Re-education’, forced labour and surveillance beyond Xinjiang" by Australian Strategic Policy Institute, that was identified in tier 1 of their supplier network using global import & export data.

### Direct Trade History with ASPI Entity (May Include 'PSA' Path)
Key: `psa_forced_labor_aspi_origin_direct`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['aspi_uyghur_forced_labor_report_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity possibly traded directly with an entity mentioned in the following forced labor report: "Uyghurs for sale: ‘Re-education’, forced labour and surveillance beyond Xinjiang" by Australian Strategic Policy Institute, that was identified in tier 1 of their supplier network using global import & export data. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Direct Trade History with Entity from Sheffield Hallam University Forced Labor Reports
Key: `forced_labor_sheffield_hallam_university_reports_origin_direct`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sheffield_hallam_university_forced_labor_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity possibly traded directly with an entity mentioned in Sheffield Hallam University Forced Labor Reports that was identified in tier 1 of their supplier network using global import & export data.

### Direct Trade History with Entity from Sheffield Hallam University Forced Labor Reports (May Include 'PSA' Path)
Key: `psa_forced_labor_sheffield_hallam_university_reports_origin_direct`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sheffield_hallam_university_forced_labor_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity possibly traded directly with an entity mentioned in Sheffield Hallam University Forced Labor Reports that was identified in tier 1 of their supplier network using global import & export data. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Direct Trade History with UFLPA Entity
Key: `forced_labor_uflpa_origin_direct`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['forced_labor_xinjiang_uflpa']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity possibly traded directly  with an entity mentioned in the U.S. Department of Homeland Security’s “Strategy to Prevent the Importation of Goods Mined, Produced, or  Manufactured with Forced Labor in the People’s Republic of China,” also known as  the Uyghur Forced Labor Prevention Act (UFLPA) Entity List, that was identified  in tier 1 of their supplier network using global import & export data.

### Direct Trade History with UFLPA Entity (May Include 'PSA' Path)
Key: `psa_forced_labor_uflpa_origin_direct`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['forced_labor_xinjiang_uflpa']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity possibly traded directly  with an entity mentioned in the U.S. Department of Homeland Security’s “Strategy to Prevent the Importation of Goods Mined, Produced, or  Manufactured with Forced Labor in the People’s Republic of China,” also known as  the Uyghur Forced Labor Prevention Act (UFLPA) Entity List, that was identified  in tier 1 of their supplier network using global import & export data. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Direct Trade History with WRO Entity
Key: `forced_labor_wro_origin_direct`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['wro_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity possibly traded directly with an entity mentioned in the U.S. Customs and Border Protection (CBP) Withhold Release Orders (WRO) and Findings List that was identified in tier 1 of their supplier network using global import & export data.

### Direct Trade History with WRO Entity (May Include 'PSA' Path)
Key: `psa_forced_labor_wro_origin_direct`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['wro_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity possibly traded directly with an entity mentioned in the U.S. Customs and Border Protection (CBP) Withhold Release Orders (WRO) and Findings List that was identified in tier 1 of their supplier network using global import & export data. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Direct Trade History with Xinjiang-Based Entity
Key: `forced_labor_xinjiang_origin_direct`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['forced_labor_xinjiang_geospatial', 'forced_labor_xinjiang_name', 'forced_labor_xinjiang_registration']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity possibly traded directly with a Xinjiang-based entity that was identified in tier 1 of their supplier network using global import & export data. The Xinjiang-based entity was assessed with geospatial and/or keyword methodology as possibly located, registered, or conducting business in Xinjiang.

### Direct Trade History with Xinjiang-Based Entity (May Include 'PSA' Path)
Key: `psa_forced_labor_xinjiang_origin_direct`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['forced_labor_xinjiang_geospatial', 'forced_labor_xinjiang_name', 'forced_labor_xinjiang_registration']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity possibly traded directly with a Xinjiang-based entity that was identified in tier 1 of their supplier network using global import & export data. The Xinjiang-based entity was assessed with geospatial and/or keyword methodology as possibly located, registered, or conducting business in Xinjiang. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Entity from ASPI Forced Labor Report
Key: `aspi_uyghur_forced_labor_report_entity`
Level: `elevated`
Category: `forced_labor`
Visibility: `seed`
Learn more [here](https://www.aspi.org.au/report/uyghurs-sale)

The entity is named in the Australian Strategic Policy Institute's report, "Uyghurs for sale: ‘Re-education’, forced labour and surveillance beyond Xinjiang." The ASPI has identified entities that are using Uyghur labour transferred from Xinjiang since 2017.

### Entity from Sheffield Hallam University Forced Labor Reports
Key: `sheffield_hallam_university_forced_labor_entity`
Level: `critical`
Category: `forced_labor`
Visibility: `seed`

The entity is named in Sheffield Hallam University Forced Labor Reports for having reasonable evidence of the use of forced labor in the XUAR (Xinjiang Uygur Autonomous Region) through the manufacturing or production of goods.

### Entity with Chinese Prison Labor Keyword
Key: `forced_labor_china_keywords`
Level: `high`
Category: `forced_labor`
Visibility: `seed`

The company name, address, or business purpose contains keywords that reference potential prison labor: "prison" or "laogai". Applicable to China-based entities only.

### Entity with Xinjiang Keyword
Key: `forced_labor_xinjiang_name`
Level: `high`
Category: `forced_labor`
Visibility: `seed`

The company name suggests the entity may conduct business in Xinjiang, a region designated as high risk for forced labor practices. Applied to entities derived from Chinese and trade data sources.

### Entity with Xinjiang Operations
Key: `forced_labor_xinjiang_operations`
Level: `high`
Category: `forced_labor`
Visibility: `seed`

The entity has authorization to conduct operations and/or is involved in contracting activities in Xinjiang, a region designated as high risk for forced labor practices.

### Exports Goods with ILAB Child Labor Risk
Key: `exports_ilab_child_labor`
Level: `elevated`
Category: `forced_labor`
Visibility: `seed`

The entity exported a shipment with an HS code and country of origin covered by the U.S. Department of Labor List of Products Produced by Child Labor.

### Exports Goods with ILAB Child Labor Risk (May Include 'PSA' Path)
Key: `psa_exports_ilab_child_labor`
Level: `elevated`
Category: `forced_labor`
Visibility: `seed`

The entity exported a shipment with an HS code and country of origin covered by the U.S. Department of Labor List of Products Produced by Child Labor. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports Goods with ILAB Forced Labor Risk
Key: `exports_ilab_forced_labor`
Level: `elevated`
Category: `forced_labor`
Visibility: `seed`

The entity exported a shipment with an HS code and country of origin covered by the U.S. Department of Labor List of Products Produced by Forced Labor.

### Exports Goods with ILAB Forced Labor Risk (May Include 'PSA' Path)
Key: `psa_exports_ilab_forced_labor`
Level: `elevated`
Category: `forced_labor`
Visibility: `seed`

The entity exported a shipment with an HS code and country of origin covered by the U.S. Department of Labor List of Products Produced by Forced Labor. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Forced Labor and Modern Slavery (from Adverse Media)
Key: `reputational_risk_forced_labor`
Level: `elevated`
Category: `forced_labor`
Visibility: `seed`

The entity has been mentioned by official government websites or mass media outlets as wanted, charged, indicted, prosecuted, convicted, or sentenced for criminal activity related to forced labor and modern slavery.

### Former WRO Entity
Key: `former_wro_entity`
Level: `high`
Category: `forced_labor`
Visibility: `seed`
Learn more [here](https://www.cbp.gov/trade/forced-labor/withhold-release-orders-and-findings)

The entity was formerly subject to trade restrictions per the U.S. Customs and Border Protection (CBP) Withhold Release Orders (WRO) and Findings List, a list of parties for which the United States Government has reasonable evidence of the use of forced labor in the manufacturing or production of a good or goods entering the U.S. supply chain.

### Intermediary Entity from Sheffield Hallam University Forced Labor Reports
Key: `sheffield_hallam_university_forced_labor_reports_intermediary_entity`
Level: `high`
Category: `forced_labor`
Visibility: `seed`

The entity is named in Sheffield Hallam University Forced Labor Reports for having reasonable evidence of serving as an intermediary manufacturer and/or downstream customer with one or more trading relationships with Chinese companies sourcing materials from the XUAR (Xinjiang Uygur Autonomous Region).

### Owned by ASPI Forced Labor Report Entity
Key: `owned_by_aspi_forced_labor_entity`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['aspi_uyghur_forced_labor_report_entity']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity named in the Australian Strategic Policy Institute's report, "Uyghurs for sale: ‘Re-education’, forced labour and surveillance beyond Xinjiang," up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by ASPI Forced Labor Report Entity (May Include 'PSA' Path)
Key: `psa_owned_by_aspi_forced_labor_entity`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['aspi_uyghur_forced_labor_report_entity']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity named in the Australian Strategic Policy Institute's report, "Uyghurs for sale: ‘Re-education’, forced labour and surveillance beyond Xinjiang," up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Entity from Sheffield Hallam University Forced Labor Reports
Key: `owned_by_sheffield_hallam_university_reports_forced_labor_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sheffield_hallam_university_forced_labor_entity']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity named in Sheffield Hallam University Forced Labor Reports up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Entity from Sheffield Hallam University Forced Labor Reports (May Include 'PSA' Path)
Key: `psa_owned_by_sheffield_hallam_university_reports_forced_labor_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sheffield_hallam_university_forced_labor_entity']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity named in Sheffield Hallam University Forced Labor Reports up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by UFLPA Entity
Key: `owned_by_forced_labor_xinjiang_uflpa`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['forced_labor_xinjiang_uflpa']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the U.S. Department of Homeland Security's “Strategy to Prevent the Importation of Goods Mined, Produced, or Manufactured with Forced Labor in the People’s Republic of China,” also known as the Uyghur Forced Labor Prevention Act (UFLPA) Entity List, up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch.

### Owned by UFLPA Entity (May Include 'PSA' Path)
Key: `psa_owned_by_forced_labor_xinjiang_uflpa`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['forced_labor_xinjiang_uflpa']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the U.S. Department of Homeland Security's “Strategy to Prevent the Importation of Goods Mined, Produced, or Manufactured with Forced Labor in the People’s Republic of China,” also known as the Uyghur Forced Labor Prevention Act (UFLPA) Entity List, up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by WRO Entity
Key: `owned_by_wro_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['wro_entity']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by a Withhold Release Orders (WRO) entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by WRO Entity (May Include 'PSA' Path)
Key: `psa_owned_by_wro_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['wro_entity']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by a Withhold Release Orders (WRO) entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Xinjiang-Based Entity
Key: `owned_by_xinjiang_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['forced_labor_xinjiang_geospatial', 'forced_labor_xinjiang_name', 'forced_labor_xinjiang_registration']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by a Xinjiang-based entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Xinjiang-Based Entity (May Include 'PSA' Path)
Key: `psa_owned_by_xinjiang_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['forced_labor_xinjiang_geospatial', 'forced_labor_xinjiang_name', 'forced_labor_xinjiang_registration']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by a Xinjiang-based entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of ASPI Forced Labor Report Entity
Key: `owner_of_aspi_forced_labor_entity`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['aspi_uyghur_forced_labor_report_entity']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly own (minority, majority, or wholly) an entity named in the Australian Strategic Policy Institute's report, "Uyghurs for sale: ‘Re-education’, forced labour and surveillance beyond Xinjiang," up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of ASPI Forced Labor Report Entity (May Include 'PSA' Path)
Key: `psa_owner_of_aspi_forced_labor_entity`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['aspi_uyghur_forced_labor_report_entity']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly own (minority, majority, or wholly) an entity named in the Australian Strategic Policy Institute's report, "Uyghurs for sale: ‘Re-education’, forced labour and surveillance beyond Xinjiang," up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Entity from Sheffield Hallam University Forced Labor Reports
Key: `owner_of_sheffield_hallam_university_reports_forced_labor_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sheffield_hallam_university_forced_labor_entity']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity named in Sheffield Hallam University Forced Labor Reports up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Entity from Sheffield Hallam University Forced Labor Reports (May Include 'PSA' Path)
Key: `psa_owner_of_sheffield_hallam_university_reports_forced_labor_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sheffield_hallam_university_forced_labor_entity']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity named in Sheffield Hallam University Forced Labor Reports up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of UFLPA Entity
Key: `owner_of_forced_labor_xinjiang_uflpa`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['forced_labor_xinjiang_uflpa']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the U.S. Department of Homeland Security's "Strategy to Prevent the Importation of Goods Mined, Produced, or Manufactured with Forced Labor in the People’s Republic of China", also known as the Uyghur Forced Labor Prevention Act (UFLPA) Entity List, up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch.

### Owner of UFLPA Entity (May Include 'PSA' Path)
Key: `psa_owner_of_forced_labor_xinjiang_uflpa`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['forced_labor_xinjiang_uflpa']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the U.S. Department of Homeland Security's "Strategy to Prevent the Importation of Goods Mined, Produced, or Manufactured with Forced Labor in the People’s Republic of China", also known as the Uyghur Forced Labor Prevention Act (UFLPA) Entity List, up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of WRO Entity
Key: `owner_of_wro_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['wro_entity']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) a Withhold Release Orders (WRO) entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of WRO Entity (May Include 'PSA' Path)
Key: `psa_owner_of_wro_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['wro_entity']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) a Withhold Release Orders (WRO) entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Xinjiang-Based Entity
Key: `owner_of_forced_labor_xinjiang_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['forced_labor_xinjiang_geospatial', 'forced_labor_xinjiang_name', 'forced_labor_xinjiang_registration']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) a Xinjiang-based entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Xinjiang-Based Entity (May Include 'PSA' Path)
Key: `psa_owner_of_forced_labor_xinjiang_entity`
Level: `high`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['forced_labor_xinjiang_geospatial', 'forced_labor_xinjiang_name', 'forced_labor_xinjiang_registration']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) a Xinjiang-based entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Possibly the Same As (PSA) ASPI Forced Labor Report Entity
Key: `psa_forced_labor_aspi_uyghur`
Level: `elevated`
Category: `forced_labor`
Visibility: `psa`

The entity is Possibly the Same As (PSA) an entity named in the Australian Strategic Policy Institute's report, "Uyghurs for sale: ‘Re-education’, forced labour and surveillance beyond Xinjiang." The ASPI has identified entities that are using Uyghur labour transferred from Xinjiang since 2017.

### Possibly the Same As (PSA) Entity with Xinjiang Keyword
Key: `psa_forced_labor_xinjiang_name`
Level: `high`
Category: `forced_labor`
Visibility: `psa`

The entity is Possibly the Same As (PSA) an entity with a company name that suggests the entity may conduct business in Xinjiang, a region designated as high risk for forced labor practices. The entities did not meet the threshold required to merge into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Entity with Xinjiang Operations
Key: `psa_forced_labor_xinjiang_operations`
Level: `high`
Category: `forced_labor`
Visibility: `psa`

The entity is Possibly the Same As (PSA) an entity that has authorization to conduct operations and/or is involved in contracting activities in Xinjiang, a region designated as high risk for forced labor practices. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Intermediary Entity from Sheffield Hallam University Forced Labor Reports
Key: `psa_sheffield_hallam_university_intermediary_entity`
Level: `high`
Category: `forced_labor`
Visibility: `psa`

This entity is possibly the same as an entity named in Sheffield Hallam University Forced Labor Reports for having reasonable evidence of serving as an intermediary manufacturer and/or a downstream customer with trading relationships with one or more Chinese companies sourcing materials from the XUAR (Xinjiang Uygur Autonomous Region). The entities did not meet the threshold required to merge them into a single entity, but they may be the same.

### Possibly the Same As (PSA) Sheffield Hallam University Forced Labor Reports Entity
Key: `psa_sheffield_hallam_university_forced_labor_entity`
Level: `critical`
Category: `forced_labor`
Visibility: `psa`

The entity is Possibly the Same As (PSA) an entity named in Sheffield Hallam University Forced Labor Reports for having reasonable evidence of the use of forced labor in the XUAR (Xinjiang Uygur Autonomous Region) through the manufacturing or production of goods. The entities did not meet the threshold required to merge them into a single entity, but they may be the same.

### Possibly the Same As (PSA) UFLPA Entity
Key: `psa_forced_labor_xinjiang_uflpa`
Level: `critical`
Category: `forced_labor`
Visibility: `psa`

The entity is Possibly the Same As (PSA) an entity listed in the USA Department of Homeland Security's “Strategy to Prevent the Importation of Goods Mined, Produced, or Manufactured with Forced Labor in the People’s Republic of China,” also known as the Uyghur Forced Labor Prevention Act (UFLPA) Entity List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) WRO Entity
Key: `psa_wro_entity`
Level: `critical`
Category: `forced_labor`
Visibility: `psa`

The entity is Possibly the Same As (PSA) an entity subject to trade restrictions per the U.S. Customs and Border Protection (CBP) Withhold Release Orders and Findings List, a list of parties for which the United States Government has reasonable evidence of the use of forced labor in the manufacturing or production of a good or goods entering the U.S. supply chain.

### Possibly the Same As (PSA) Xinjiang Cotton Industry Entity
Key: `psa_forced_labor_xinjiang_cotton_entity`
Level: `elevated`
Category: `forced_labor`
Visibility: `psa`

The entity is possibly the same as an entity identified in e-commerce listings to be involved in the manufacture, trade, or storage of Xinjiang-produced cotton, a high priority sector for enforcement under the Strategy to Prevent Importation of Goods Mined, Produced or Manufactured with Forced Labor in the People’s Republic of China. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Xinjiang-Geolocated Entity
Key: `psa_forced_labor_xinjiang_geospatial`
Level: `high`
Category: `forced_labor`
Visibility: `psa`

The entity is Possibly the Same As (PSA) an entity with geographic coordinates which indicate that the entity is based in Xinjiang, China, a region designated as high risk for forced labor practices. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Xinjiang-Registered Entity
Key: `psa_forced_labor_xinjiang_registration`
Level: `high`
Category: `forced_labor`
Visibility: `psa`

The entity is Possibly the Same As (PSA) an entity with a Uniform Social Credit Code (USCC) and/or registration number that indicates the entity is registered in Xinjiang, a region designated as high risk for forced labor practices. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Related to Entity from ASPI Forced Labor Report
Key: `aspi_uyghur_forced_labor_report_entity_adjacent`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['aspi_uyghur_forced_labor_report_entity']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from an entity named in the Australian Strategic Policy Institute's report, "Uyghurs for sale: ‘Re-education’, forced labour and surveillance beyond Xinjiang." Applies to all relationship types.

### Related to Entity from Sheffield Hallam University Forced Labor Reports
Key: `sheffield_hallam_university_forced_labor_reports_entity_adjacent`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sheffield_hallam_university_forced_labor_entity']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from an entity named in Sheffield Hallam University Forced Labor Reports. Applies to all relationship types.

### Related to UFLPA Entity
Key: `forced_labor_xinjiang_uflpa_adjacent`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['forced_labor_xinjiang_uflpa']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from an entity listed in the U.S. Department of Homeland Security's “Strategy to Prevent the Importation of Goods Mined, Produced, or Manufactured with Forced Labor in the People’s Republic of China,” also known as the Uyghur Forced Labor Prevention Act (UFLPA) Entity List. Applies to all relationship types that do not signify ownership.

### Related to WRO Entity
Key: `wro_entity_adjacent`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['wro_entity']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from an entity subject to trade restrictions per the U.S. Customs and Border Protection (CBP) Withhold Release Orders (WRO) and Findings List. Applies to all relationship types.

### Supplier Network with ASPI Entity
Key: `forced_labor_aspi_origin_subtier`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['aspi_uyghur_forced_labor_report_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has a third-party entity mentioned in the following forced labor report: “Uyghurs for Sale: ‘Re-education’, Forced Labor, and Surveillance beyond Xinjiang” by Australian Strategic Policy Institute, that was identified in tier 2 or 3 of their supplier network using global import & export data.

### Supplier Network with ASPI Entity (May Include 'PSA' Path)
Key: `psa_forced_labor_aspi_origin_subtier`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['aspi_uyghur_forced_labor_report_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has a third-party entity mentioned in the following forced labor report: “Uyghurs for Sale: ‘Re-education’, Forced Labor, and Surveillance beyond Xinjiang” by Australian Strategic Policy Institute, that was identified in tier 2 or 3 of their supplier network using global import & export data. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Supplier Network with Entity from Sheffield Hallam University Forced Labor Reports
Key: `forced_labor_sheffield_hallam_university_reports_origin_subtier`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sheffield_hallam_university_forced_labor_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has a third-party entity mentioned in Sheffield Hallam University Forced Labor Reports that was identified in tier 2 or 3 of their supplier network using global import & export data.

### Supplier Network with Entity from Sheffield Hallam University Forced Labor Reports (May Include 'PSA' Path)
Key: `psa_forced_labor_sheffield_hallam_university_reports_origin_subtier`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sheffield_hallam_university_forced_labor_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has a third-party entity mentioned in Sheffield Hallam University Forced Labor Reports that was identified in tier 2 or 3 of their supplier network using global import & export data. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Supplier Network with UFLPA Entity
Key: `forced_labor_uflpa_origin_subtier`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['forced_labor_xinjiang_uflpa']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has a third-party entity  mentioned in the U.S. Department of Homeland Security’s “Strategy to Prevent  the Importation of Goods Mined, Produced, or Manufactured with Forced Labor  in the People’s Republic of China,” also known as the Uyghur Forced Labor  Prevention Act (UFLPA) Entity List, that was identified in tier 2 or 3 of  their supplier network using global import & export data.

### Supplier Network with UFLPA Entity (May Include 'PSA' Path)
Key: `psa_forced_labor_uflpa_origin_subtier`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['forced_labor_xinjiang_uflpa']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has a third-party entity  mentioned in the U.S. Department of Homeland Security’s “Strategy to Prevent  the Importation of Goods Mined, Produced, or Manufactured with Forced Labor  in the People’s Republic of China,” also known as the Uyghur Forced Labor  Prevention Act (UFLPA) Entity List, that was identified in tier 2 or 3 of  their supplier network using global import & export data. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Supplier Network with WRO Entity
Key: `forced_labor_wro_origin_subtier`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['wro_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has a third-party entity actively subject to trade restrictions per the U.S. Customs and Border Protection (CBP) Withhold Release Orders (WRO) and Findings List that was identified in tier 2 or 3 of their supplier network using global import & export data.

### Supplier Network with WRO Entity (May Include 'PSA' Path)
Key: `psa_forced_labor_wro_origin_subtier`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['wro_entity']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has a third-party entity actively subject to trade restrictions per the U.S. Customs and Border Protection (CBP) Withhold Release Orders (WRO) and Findings List that was identified in tier 2 or 3 of their supplier network using global import & export data. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Supplier Network with Xinjiang-Based Entity
Key: `forced_labor_xinjiang_origin_subtier`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['forced_labor_xinjiang_geospatial', 'forced_labor_xinjiang_name', 'forced_labor_xinjiang_registration']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has a third-party Xinjiang-based entity that was identified in tier 2 or 3 of their supplier network using global import & export data. The Xinjiang-based entity was assessed with geospatial and/or keyword methodology as possibly located, registered, or conducting business in Xinjiang.

### Supplier Network with Xinjiang-Based Entity (May Include 'PSA' Path)
Key: `psa_forced_labor_xinjiang_origin_subtier`
Level: `elevated`
Category: `forced_labor`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['forced_labor_xinjiang_geospatial', 'forced_labor_xinjiang_name', 'forced_labor_xinjiang_registration']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

Historical shipment records suggest that the entity has a third-party Xinjiang-based entity that was identified in tier 2 or 3 of their supplier network using global import & export data. The Xinjiang-based entity was assessed with geospatial and/or keyword methodology as possibly located, registered, or conducting business in Xinjiang. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### UFLPA Entity
Key: `forced_labor_xinjiang_uflpa`
Level: `critical`
Category: `forced_labor`
Visibility: `seed`
Learn more [here](https://www.dhs.gov/uflpa-entity-list)

The entity is listed in the U.S. Department of Homeland Security's "Strategy to Prevent the Importation of Goods Mined, Produced, or Manufactured with Forced Labor in the People’s Republic of China," also known as the Uyghur Forced Labor Prevention Act (UFLPA) Entity List. Entities in the United States are prohibited from importing goods made wholly or in part with forced labor into the United States in an effort to end the systematic use of forced labor in the Xinjiang Uyghur Autonomous Region.

### WRO Entity
Key: `wro_entity`
Level: `critical`
Category: `forced_labor`
Visibility: `seed`
Learn more [here](https://www.cbp.gov/trade/forced-labor/withhold-release-orders-and-findings)

The entity is actively subject to trade restrictions per the U.S. Customs and Border Protection (CBP) Withhold Release Orders (WRO) and Findings List, a list of parties for which the United States government has reasonable evidence of the use of forced labor in the manufacturing or production of a good or goods entering the U.S. supply chain.

### Xinjiang Cotton Industry Entity
Key: `forced_labor_xinjiang_cotton_entity`
Level: `elevated`
Category: `forced_labor`
Visibility: `seed`
Learn more [here](https://www.dhs.gov/sites/default/files/2022-06/22_0617_fletf_uflpa-strategy.pdf)

E-commerce listings indicate that the entity is involved in the manufacture, trade, or storage of Xinjiang-produced cotton, a high priority sector for enforcement under the Strategy to Prevent Importation of Goods Mined, Produced or Manufactured with Forced Labor in the People’s Republic of China.

### Xinjiang Production and Construction Corps (XPCC) Contractor
Key: `forced_labor_xinjiang_contractors`
Level: `high`
Category: `forced_labor`
Visibility: `seed`

The entity appears on a government list of entities authorized to procure and contract with the Xinjiang Production and Construction Corps (XPCC). The U.S. Department of the Treasury has designated the XPCC a paramilitary organization subordinate to the Chinese Communist Party (CCP) engaged in human rights abuses in Xinjiang, including forced labor.

### Xinjiang-Geolocated Entity
Key: `forced_labor_xinjiang_geospatial`
Level: `high`
Category: `forced_labor`
Visibility: `seed`

Geographic coordinates indicate that the entity is based in Xinjiang, China, a region designated as high risk for forced labor practices. Excludes entities exclusively derived from trade data sources.

### Xinjiang-Registered Entity
Key: `forced_labor_xinjiang_registration`
Level: `high`
Category: `forced_labor`
Visibility: `seed`

The entity has a Uniform Social Credit Code (USCC) and/or registration number that indicates the entity is registered in Xinjiang, China, a region designated as high risk for forced labor practices. Applicable to entities globally.

## Political Exposure Risk Factors

### Chinese State-Owned Enterprise
Key: `chinese_state_owned`
Level: `high`
Category: `political_exposure`
Visibility: `seed`

This risk factor flags entities identified as Chinese State-Owned Enterprises (SOEs) based on established patterns in Chinese-language corporate naming conventions. Entities are included where company names begin with “中国” (China) or “中华” (Chinese), reference the State-owned Assets Supervision and Administration Commission (“国务院国资委” or “国有资产监督管理委员会”), or include the term “国企” (state-owned enterprise) alongside other characters. These naming elements are formally associated with state ownership and oversight in China, providing a reliable basis for SOE classification.

### Export to Chinese State-Owned Enterprise (SOE)
Key: `export_to_chinese_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['state_owned']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that is a Chinese State-Owned Enterprise (SOE).

### Export to Chinese State-Owned Enterprise (SOE) (May Include 'PSA' Path)
Key: `psa_export_to_chinese_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['state_owned']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that is a Chinese State-Owned Enterprise (SOE). This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Export to State-Owned Enterprise (SOE)
Key: `export_to_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['state_owned']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that is a State-Owned Enterprise (SOE).

### Export to State-Owned Enterprise (SOE) (May Include 'PSA' Path)
Key: `psa_export_to_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['state_owned']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that is a State-Owned Enterprise (SOE). This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Former State-Owned Enterprise (SOE)
Key: `former_soe`
Level: `elevated`
Category: `political_exposure`
Visibility: `seed`

The entity was formerly a state-owned enterprise (SOE). According to the Organisation for Economic Co-operation and Development (OECD), a state-owned enterprise is defined as any corporate entity recognized by national law as an enterprise, and in which the state exercises ownership or control through full, majority, or significant minority ownership. Applicable to entities derived from risk intelligence data.

### Majority-Owned by Venezuelan SOE
Key: `ven_soe_50_percent`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['state_owned_ven']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity may be majority-owned by one or more Venezuelan State-Owned Enterprise(s). Majority ownership is determined by assessing up to four levels of ownership, with a threshold of 50 percent aggregate ownership across these levels.

### Majority-Owned by Venezuelan SOE (May Include 'PSA' Path)
Key: `psa_ven_soe_50_percent`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['state_owned_ven']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity may be majority-owned by one or more Venezuelan State-Owned Enterprise(s). Majority ownership is determined by assessing up to four levels of ownership, with a threshold of 50 percent aggregate ownership across these levels. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Chinese State-Owned Enterprise
Key: `owned_by_chinese_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['chinese_state_owned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned by (minority, majority, or wholly) a Chinese state-owned enterprise (SOE) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Chinese State-Owned Enterprise (May Include 'PSA' Path)
Key: `psa_owned_by_chinese_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['chinese_state_owned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned by (minority, majority, or wholly) a Chinese state-owned enterprise (SOE) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by State-Owned Enterprise (SOE)
Key: `owned_by_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['state_owned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned by (minority, majority, or wholly) a Chinese state-owned enterprise (SOE) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by State-Owned Enterprise (SOE) (May Include 'PSA' Path)
Key: `psa_owned_by_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['state_owned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned by (minority, majority, or wholly) a Chinese state-owned enterprise (SOE) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Chinese State-Owned Enterprise
Key: `owner_of_chinese_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['chinese_state_owned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) a Chinese state-owned enterprise (SOE) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Chinese State-Owned Enterprise (May Include 'PSA' Path)
Key: `psa_owner_of_chinese_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['chinese_state_owned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) a Chinese state-owned enterprise (SOE) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of State-Owned Enterprise (SOE)
Key: `owner_of_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['state_owned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) a state-owned enterprise (SOE) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of State-Owned Enterprise (SOE) (May Include 'PSA' Path)
Key: `psa_owner_of_soe`
Level: `high`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['state_owned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) a state-owned enterprise (SOE) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Politically Exposed Person (PEP)
Key: `pep`
Level: `high`
Category: `political_exposure`
Visibility: `seed`

According to the Financial Action Task Force (FATF), politically exposed persons (PEPs) are individuals who are or have been entrusted with prominent public functions. Examples include heads of state or of government, senior politicians, senior government officials, judicial or military officials, senior executives of state-owned corporations, and important political party officials. Applicable to entities derived from Acuris Risk Intelligence and PEP, politician, and public servant data.

### Possibly the Same As (PSA) Venezuelan State-Owned Enterprise
Key: `psa_state_owned_ven`
Level: `high`
Category: `political_exposure`
Visibility: `psa`

This entity is Possibly the Same as a state-owned enterprise, as identified by Transparency Venezuela. According to the OECD, a state-owned enterprise is defined as any corporate entity recognized by national law as an enterprise, and in which the state exercises ownership or control through full, majority, or significant minority ownership.

### Possibly the Same as (PSA) Chinese State-Owned Enterprise (SOE)
Key: `psa_chinese_state_owned`
Level: `high`
Category: `political_exposure`
Visibility: `psa`

The entity is Possibly the Same As (PSA) a Chinese State-Owned Enterprise (SOE).

### Possibly the Same as (PSA) State-Owned Enterprise (SOE)
Key: `psa_state_owned`
Level: `high`
Category: `political_exposure`
Visibility: `psa`

The entity is Possibly the Same As (PSA) a state-owned enterprise (SOE). According to the Organization for Economic Cooperation and Development (OECD), a state-owned enterprise is defined as any corporate entity recognized by national law as an enterprise, and in which the state exercises ownership or control through full, majority, or significant minority ownership. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same as a Politically Exposed Person (PEP)
Key: `psa_pep`
Level: `high`
Category: `political_exposure`
Visibility: `psa`

The entity is Possibly the Same As (PSA) one or multiple other entities that are Politically Exposed Persons (PEPs). The entities did not meet the threshold required to merge them into a single entity, but they may be the same.

### Related to Chinese State-Owned Enterprise
Key: `chinese_soe_adjacent`
Level: `elevated`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['chinese_state_owned']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from a Chinese State-Owned Enterprise (SOE). Applies to all relationship types.

### Related to Politically Exposed Person (PEP)
Key: `pep_adjacent`
Level: `elevated`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['pep']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from a politically exposed person (PEP). Applies to all relationship types.

### Related to State-Owned Enterprise (SOE)
Key: `soe_adjacent`
Level: `elevated`
Category: `political_exposure`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['state_owned']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from a state-owned enterprise (SOE). Applies to all relationship types.

### State-Owned Enterprise (SOE)
Key: `state_owned`
Level: `high`
Category: `political_exposure`
Visibility: `seed`

According to the Organisation for Economic Co-operation and Development (OECD), a state-owned enterprise is defined as any corporate entity recognized by national law as an enterprise, and in which the state exercises ownership or control through full, majority, or significant minority ownership. Applicable to entities derived from Acuris Risk Intelligence.

### Venezuelan State-Owned Enterprise(s)
Key: `state_owned_ven`
Level: `high`
Category: `political_exposure`
Visibility: `seed`

This entity is a state-owned enterprise, as identified by Transparency Venezuela. According to the OECD, a state-owned enterprise is defined as any corporate entity recognized by national law as an enterprise, and in which the state exercises ownership or control through full, majority, or significant minority ownership.

## Regulatory Action Risk Factors

### Law Enforcement Action (from Adverse Media)
Key: `law_enforcement_action`
Level: `elevated`
Category: `regulatory_action`
Visibility: `seed`

The entity has been mentioned by official government websites or mass media outlets as wanted, charged, indicted, prosecuted, convicted, or sentenced in relation to a law enforcement action.

### Owner of Entity Subject to Regulatory Action
Key: `owner_of_regulatory_action_entity`
Level: `high`
Category: `regulatory_action`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['regulatory_action']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity that has been listed as subject to enforcement action by regulatory authorities, law enforcement/anti-corruption agencies, or other disciplinary bodies and is up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Entity Subject to Regulatory Action (May Include 'PSA' Path)
Key: `psa_owner_of_regulatory_action_entity`
Level: `high`
Category: `regulatory_action`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['regulatory_action']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity that has been listed as subject to enforcement action by regulatory authorities, law enforcement/anti-corruption agencies, or other disciplinary bodies and is up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Possibly the Same As (PSA) an Entity Subject to Regulatory Action
Key: `psa_regulatory_action`
Level: `high`
Category: `regulatory_action`
Visibility: `psa`

The entity is Possibly the Same As (PSA) one or multiple other entities that have been listed as subject to enforcement action by regulatory authorities, law enforcement/anti-corruption agencies, and other disciplinary bodies. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Regulatory Action
Key: `regulatory_action`
Level: `high`
Category: `regulatory_action`
Visibility: `seed`

The entity has been listed as subject to enforcement action by regulatory authorities, law enforcement/anti-corruption agencies, or other disciplinary bodies.

## Relevant Risk Factors

### Basel AML Index
Key: `basel_aml`
Level: `relevant`
Category: `relevant`
Visibility: `seed`
Learn more [here](https://baselgovernance.org/basel-aml-index)

The Basel Anti-Money Laundering (AML) Index is an annual ranking that assesses the risk of money laundering and terrorist financing around the world and is maintained by the Basel Institute on Governance. The ranking displayed here ranks jurisdictions on a scale of 0 (lowest risk) to 10 (highest risk).

### Corruption Perceptions Index
Key: `cpi_score`
Level: `relevant`
Category: `relevant`
Visibility: `seed`
Learn more [here](https://www.transparency.org/en/cpi/2021)

The Corruption Perceptions Index (CPI) is published yearly by Transparency International and ranks 180 countries and territories around the world by their perceived levels of public sector corruption. The results are given on a scale of 0 (highly corrupt) to 100 (very clean). If the entity is referenced with multiple countries, the country with the highest score will be used.

### EU High-Risk Third Countries
Key: `eu_high_risk_third`
Level: `relevant`
Category: `relevant`
Visibility: `seed`
Learn more [here](https://ec.europa.eu/info/business-economy-euro/banking-and-finance/financial-supervision-and-risk-management/anti-money-laundering-and-countering-financing-terrorism/eu-policy-high-risk-third-countries_en)

This entity operates in a country identified by the European Commission as high risk due to strategic deficiencies in their regime related to anti-money laundering and countering the financing of terrorism.

## Sanctions Risk Factors

### Controlled by Australia Sanctioned Entity
Key: `controlled_by_aus_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['aus_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated via the Australia Consolidated Sanctions List. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by EU Sanctioned Entity
Key: `controlled_by_eu_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['eu_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated via the EU Financial Sanctions List and/or the EU Sanctions Map List. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by Foreign Persons Involved in the Global Illicit Drug Trade (EO 14059)
Key: `controlled_by_ofac_illicit_drugs_eo14059_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['ofac_illicit_drugs_eo14059_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated under the OFAC SDN Foreign Persons Involved in the Global Illicit Drug Trade program. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by Foreign Terrorist Organisation
Key: `controlled_by_ofac_fto_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['ofac_fto_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated under the OFAC SDN Foreign Terrorist Organization program. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by Japan Sanctioned Entity
Key: `controlled_by_jpn_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['jpn_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated via the Japan Ministry of Finance Economic Sanctions List. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by OFAC SDN Entities
Key: `controlled_by_ofac_sdn`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['ofac_sdn']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated via the USA OFAC SDN List. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by Specially Designated Narcotics Trafficker
Key: `controlled_by_ofac_sdnt_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['ofac_sdnt_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated under the OFAC SDN Specially Designated Narcotics Trafficker program. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by Specially Designated Narcotics Trafficker Kingpin
Key: `controlled_by_ofac_sdntk_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['ofac_sdntk_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated under the OFAC SDN Specially Designated Narcotics Trafficker Kingpin program. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by Specially Designated Terrorist
Key: `controlled_by_ofac_sdgt_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['ofac_sdgt_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated under the OFAC SDN Specially Designated Global Terrorist program. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by UK Sanctioned Entity
Key: `controlled_by_uk_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['uk_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated via the UK Consolidated Sanctions List. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by UN Sanctioned Entity
Key: `controlled_by_un_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['un_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated via the UN Security Council Sanctions. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Controlled by Ukraine Sanctioned Entity
Key: `controlled_by_ukr_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['ukr_sanctioned']`
Relationships: `['has_director', 'has_founder', 'has_manager', 'has_member_of_the_board', 'has_officer']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This company may be controlled by a sanctioned party designated via the Ukraine Sanctions List. Companies flagged with this risk factor may have one or more directors, founders, managers, officers or members of the board that have been designated by the listed authority.

### Export to Sanctioned Entity
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `export_to_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity may have exported to an entity that is currently subject to trade, transport, immigration, and/or financial sanctions in one or several international sanctions lists. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Export to Sanctioned Entity (May Include 'PSA' Path)
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `psa_export_to_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity may have exported to an entity that is currently subject to trade, transport, immigration, and/or financial sanctions in one or several international sanctions lists. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports Items of Significant Importance to Russian Economy
Key: `exports_russian_important_good`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['imports_russian_important_good']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

International trade records indicate that the entity may have exported to Russia one or more shipments with Harmonized System (HS) codes corresponding to items of significant importance to Russian economy listed in Schedule 3E of The Russia (Sanctions) (EU Exit) (Amendment) (No. 14) Regulations 2022 after the regulation came into effect on 21 July, 2022. This restriction and risk factor applies exclusively to UK entities or branches of UK entities.

### Exports Items of Significant Importance to Russian Economy (Possibly Same As)
Key: `psa_exports_russian_important_good`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['imports_russian_important_good']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

International trade records indicate that the entity may have exported to Russia one or more shipments with Harmonized System (HS) codes corresponding to items of significant importance to Russian economy listed in Schedule 3E of The Russia (Sanctions) (EU Exit) (Amendment) (No. 14) Regulations 2022 after the regulation came into effect on 21 July, 2022. This restriction and risk factor applies exclusively to UK entities or branches of UK entities.

### Exports to Argentina Public Registry of Terrorism List Entity
Key: `exports_to_sanctioned_arg_repet_jus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_arg_repet_jus']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Argentina Public Registry of Terrorism List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Argentina Public Registry of Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_arg_repet_jus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_arg_repet_jus']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Argentina Public Registry of Terrorism List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Belgium National Financial Sanctions List Entity
Key: `exports_to_sanctioned_bel_fpsf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_bel_fpsf']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Belgium National Financial Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Belgium National Financial Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_bel_fpsf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_bel_fpsf']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Belgium National Financial Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Consolidated Australian Sanctions List Entity
Key: `exports_to_sanctioned_aus_dfat_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_aus_dfat']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Consolidated Australian Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Consolidated Australian Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_aus_dfat_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_aus_dfat']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Consolidated Australian Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Consolidated Canadian Autonomous Sanctions List Entity
Key: `exports_to_sanctioned_can_gac_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_can_gac']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Consolidated Canadian Autonomous Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Consolidated Canadian Autonomous Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_can_gac_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_can_gac']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Consolidated Canadian Autonomous Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Czech Republic National Sanctions List Entity
Key: `exports_to_sanctioned_cze_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_cze_mof']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Czech Republic National Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Czech Republic National Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_cze_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_cze_mof']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Czech Republic National Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to EBRD Ineligible Entities List Entity
Key: `exports_to_sanctioned_xxx_ebrd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_xxx_ebrd']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the EBRD Ineligible Entities List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to EBRD Ineligible Entities List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_xxx_ebrd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_xxx_ebrd']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the EBRD Ineligible Entities List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to EU Financial Sanctions List Entity
Key: `exports_to_sanctioned_eu_dg_fisma_ec_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_eu_dg_fisma_ec']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the EU Financial Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to EU Financial Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_eu_dg_fisma_ec_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_eu_dg_fisma_ec']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the EU Financial Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to EU Sanctions Map List Entity
Key: `exports_to_sanctioned_eu_ec_sanctions_map_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_eu_ec_sanctions_map']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the EU Sanctions Map List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to EU Sanctions Map List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_eu_ec_sanctions_map_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_eu_ec_sanctions_map']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the EU Sanctions Map List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to EU Sanctions – Russia (Regulation 833/2014) List Entity
Key: `exports_to_sanctioned_eu_ec_regulation_833_2014_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_eu_ec_regulation_833_2014']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the EU Sanctions – Russia (Regulation 833/2014) List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to EU Sanctions – Russia (Regulation 833/2014) List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_eu_ec_regulation_833_2014_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_eu_ec_regulation_833_2014']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the EU Sanctions – Russia (Regulation 833/2014) List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to France National Asset Freeze Register List Entity
Key: `exports_to_sanctioned_fra_dgt_mefids_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_fra_dgt_mefids']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the France National Asset Freeze Register List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to France National Asset Freeze Register List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_fra_dgt_mefids_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_fra_dgt_mefids']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the France National Asset Freeze Register List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Inter-American Development Bank Sanctions List Entity
Key: `exports_to_sanctioned_xxx_iabd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_xxx_iabd']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Inter-American Development Bank Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Inter-American Development Bank Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_xxx_iabd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_xxx_iabd']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Inter-American Development Bank Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Israel National Bureau for Counter-Terror Financing Designation List Entity
Key: `exports_to_sanctioned_isr_mod_nbctf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_isr_mod_nbctf']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Israel National Bureau for Counter-Terror Financing Designation List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Israel National Bureau for Counter-Terror Financing Designation List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_isr_mod_nbctf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_isr_mod_nbctf']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Israel National Bureau for Counter-Terror Financing Designation List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Japan Ministry of Finance Economic Sanctions List Entity
Key: `exports_to_sanctioned_jpn_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_jpn_mof']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Japan Ministry of Finance Economic Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Japan Ministry of Finance Economic Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_jpn_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_jpn_mof']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Japan Ministry of Finance Economic Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Latvia National Sanctions List Entity
Key: `exports_to_sanctioned_lva_fis_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_lva_fis']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Latvia National Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Latvia National Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_lva_fis_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_lva_fis']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Latvia National Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Lithuania Designated Persons Under Magnitsky Amendments List Entity
Key: `exports_to_sanctioned_ltu_mi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_ltu_mi']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Lithuania Designated Persons Under Magnitsky Amendments List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Lithuania Designated Persons Under Magnitsky Amendments List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_ltu_mi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_ltu_mi']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Lithuania Designated Persons Under Magnitsky Amendments List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Malaysia MOHA Sanctions List Entity
Key: `exports_to_sanctioned_mys_moha_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_mys_moha']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Malaysia MOHA Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Malaysia MOHA Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_mys_moha_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_mys_moha']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Malaysia MOHA Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Netherlands National Sanctions List for Terrorism List Entity
Key: `exports_to_sanctioned_nld_mofa_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_nld_mofa']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Netherlands National Sanctions List for Terrorism List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Netherlands National Sanctions List for Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_nld_mofa_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_nld_mofa']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Netherlands National Sanctions List for Terrorism List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to New Zealand Russia Sanctions List Entity
Key: `exports_to_sanctioned_nzl_mfat_rus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_nzl_mfat_rus']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the New Zealand Russia Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to New Zealand Russia Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_nzl_mfat_rus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_nzl_mfat_rus']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the New Zealand Russia Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Poland National Sanctions List Entity
Key: `exports_to_sanctioned_pol_mia_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_pol_mia']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Poland National Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Poland National Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_pol_mia_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_pol_mia']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Poland National Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Singapore List for Terrorism List Entity
Key: `exports_to_sanctioned_sgp_agc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_sgp_agc']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Singapore List for Terrorism List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Singapore List for Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_sgp_agc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_sgp_agc']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Singapore List for Terrorism List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Switzerland SECO Sanctions List Entity
Key: `exports_to_sanctioned_che_seco_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_che_seco']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Switzerland SECO Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Switzerland SECO Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_che_seco_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_che_seco']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Switzerland SECO Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to UK HMT/OFSI Investment Bans List Entity
Key: `exports_to_sanctioned_gbr_hmt_ofsi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_gbr_hmt_ofsi']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the UK HMT/OFSI Investment Bans List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to UK HMT/OFSI Investment Bans List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_gbr_hmt_ofsi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_gbr_hmt_ofsi']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the UK HMT/OFSI Investment Bans List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to UK Sanctions List Entity
Key: `exports_to_sanctioned_gbr_fcdo_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_gbr_fcdo']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the UK Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to UK Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_gbr_fcdo_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_gbr_fcdo']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the UK Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to UN Security Council Sanctions List Entity
Key: `exports_to_sanctioned_un_sc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_un_sc']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the UN Security Council Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to UN Security Council Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_un_sc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_un_sc']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the UN Security Council Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to USA OFAC Non-SDN Consolidated Sanctions List Entity
Key: `exports_to_sanctioned_usa_ofac_non_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_usa_ofac_non_sdn']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the USA OFAC Non-SDN Consolidated Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to USA OFAC Non-SDN Consolidated Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_usa_ofac_non_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_usa_ofac_non_sdn']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the USA OFAC Non-SDN Consolidated Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to USA OFAC SDN List Entity
Key: `exports_to_sanctioned_usa_ofac_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_usa_ofac_sdn']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the USA OFAC SDN List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to USA OFAC SDN List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_usa_ofac_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_usa_ofac_sdn']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the USA OFAC SDN List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Ukraine SFMS List for Terrorism List Entity
Key: `exports_to_sanctioned_ukr_sfms_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_ukr_sfms']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Ukraine SFMS List for Terrorism List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Ukraine SFMS List for Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_ukr_sfms_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_ukr_sfms']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Ukraine SFMS List for Terrorism List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Exports to Ukraine Sanctions List Entity
Key: `exports_to_sanctioned_ukr_nsdc_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned_ukr_nsdc']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Ukraine Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use.

### Exports to Ukraine Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_exports_to_sanctioned_ukr_nsdc_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['sanctioned_ukr_nsdc']`
Relationships: `['ships_to']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity exports to an entity that has been added to the Ukraine Sanctions List. This Risk Factor applies only where the relevant export arrived after the designation date of the listed entity. This does not, by definition, indicate a violation of export control or sanctions law. Exports to listed entities may be permitted under general licenses, exemptions, or based on the item’s classification and intended end use. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Foreign Persons Involved in the Global Illicit Drug Trade (EO 14059)
Key: `ofac_illicit_drugs_eo14059_sanctioned`
Level: `critical`
Category: `sanctions`
Visibility: `seed`

This entity has been designated as a Foreign Person Involved in the Global Illicit Drug Trade under Executive Order 14059, meaning it participates in activities that contribute to the international trafficking of controlled substances that threaten U.S. public health and national security and is subject to sanctions including asset blocking, prohibition of transactions with U.S. persons, and financial system restrictions.

### Foreign Terrorist Organisation
Key: `ofac_fto_sanctioned`
Level: `critical`
Category: `sanctions`
Visibility: `seed`

This entity has been designated as a Foreign Terrorist Organization by the U.S. Secretary of State, meaning it engages in terrorist activity that threatens U.S. national security and is subject to sanctions including criminalization of material support, asset freezing, and immigration restrictions.

### Former Sanctions
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `formerly_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `seed`

The entity was formerly subject to trade, transport, immigration, or financial sanctions in international sanctions lists.

### Imports Coal & Coal Products from Russia
Key: `imports_russian_coal`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['exports_russian_coal']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

International trade records indicate that the entity may have imported from Russia one or more shipments with Harmonized System (HS) codes corresponding to coal and coal products listed in Schedule 3H of The Russia (Sanctions) (EU Exit) (Amendment) (No. 14) Regulations 2022 after the regulation came into effect on 10 August, 2022. This restriction and risk factor applies exclusively to UK entities or branches of UK entities.

### Imports Coal & Coal Products from Russia (Possibly Same As)
Key: `psa_imports_russian_coal`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['exports_russian_coal']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

International trade records indicate that the entity may have imported from Russia one or more shipments with Harmonized System (HS) codes corresponding to coal and coal products listed in Schedule 3H of The Russia (Sanctions) (EU Exit) (Amendment) (No. 14) Regulations 2022 after the regulation came into effect on 10 August, 2022. This restriction and risk factor applies exclusively to UK entities or branches of UK entities.

### Imports Gold from Russia
Key: `imports_russian_gold`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['exports_russian_gold']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

International trade records indicate that the entity may have imported from Russia one or more shipments with Harmonized System (HS) codes corresponding to gold listed in Schedule 3G of The Russia (Sanctions) (EU Exit) (Amendment) (No. 14) Regulations 2022 after the regulation came into effect on 21 July, 2022. This restriction and risk factor applies exclusively to UK entities or branches of UK entities.

### Imports Gold from Russia (Possibly Same As)
Key: `psa_imports_russian_gold`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['exports_russian_gold']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

International trade records indicate that the entity may have imported from Russia one or more shipments with Harmonized System (HS) codes corresponding to gold listed in Schedule 3G of The Russia (Sanctions) (EU Exit) (Amendment) (No. 14) Regulations 2022 after the regulation came into effect on 21 July, 2022. This restriction and risk factor applies exclusively to UK entities or branches of UK entities.

### Imports Oil & Oil Products from Russia
Key: `imports_russian_oil`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['exports_russian_oil']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

International trade records indicate that the entity may have imported from Russia one or more shipments with Harmonized System (HS) codes corresponding to oil and oil products listed in Schedule 3F of The Russia (Sanctions) (EU Exit) (Amendment) (No. 14) Regulations 2022 after the regulation came into effect on 21 July, 2022. This restriction and risk factor applies exclusively to UK entities or branches of UK entities.

### Imports Oil & Oil Products from Russia (Possibly Same As)
Key: `psa_imports_russian_oil`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['exports_russian_oil']`
Relationships: `['receives_from']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

International trade records indicate that the entity may have imported from Russia one or more shipments with Harmonized System (HS) codes corresponding to oil and oil products listed in Schedule 3F of The Russia (Sanctions) (EU Exit) (Amendment) (No. 14) Regulations 2022 after the regulation came into effect on 21 July, 2022. This restriction and risk factor applies exclusively to UK entities or branches of UK entities.

### Majority Owned by EU Sanctioned Entity
Key: `eu_50_percent_rule`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['eu_sanctioned']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly majority owned by one or more entities currently subject to trade, transport, immigration, or financial sanctions in the EU Financial Sanctions List and/or the EU Sanctions Map up to 6 hops away with an aggregate of 50% or more controlling interest (per EU's 50% rule) via direct shareholding relationships. These relationships include shareholder or subsidiary. Applicable to entities globally.

### Majority Owned by EU Sanctioned Entity (May Include 'PSA' Path)
Key: `psa_eu_50_percent_rule`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['eu_sanctioned']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly majority owned by one or more entities currently subject to trade, transport, immigration, or financial sanctions in the EU Financial Sanctions List and/or the EU Sanctions Map up to 6 hops away with an aggregate of 50% or more controlling interest (per EU's 50% rule) via direct shareholding relationships. These relationships include shareholder or subsidiary. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Majority Owned by OFAC SDN
Key: `ofac_50_percent_rule`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['ofac_sdn']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly majority owned by one or more entities currently subject to trade, transport, immigration, or financial sanctions in the USA OFAC SDN Sanctions List up to 6 hops away with an aggregate of 50% or more controlling interest (per OFAC's 50% rule) via direct shareholding relationships. These relationships include shareholder or subsidiary. Applicable to entities globally.

### Majority Owned by OFAC SDN (May Include 'PSA' Path)
Key: `psa_ofac_50_percent_rule`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_sdn']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly majority owned by one or more entities currently subject to trade, transport, immigration, or financial sanctions in the USA OFAC SDN Sanctions List up to 6 hops away with an aggregate of 50% or more controlling interest (per OFAC's 50% rule) via direct shareholding relationships. These relationships include shareholder or subsidiary. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Majority Owned by UK Sanctioned Entity
Key: `uk_50_percent_rule`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['uk_sanctioned']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly majority owned by one or more entities currently subject to sanctions in the UK Sanctions List up to 6 hops away with an aggregate of more than 50% controlling interest via direct shareholding relationships. These relationships include shareholder or subsidiary. Applicable to entities globally.

### Majority Owned by UK Sanctioned Entity (May Include 'PSA' Path)
Key: `psa_uk_50_percent_rule`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['uk_sanctioned']`
Relationships: `['subsidiary_of', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly majority owned by one or more entities currently subject to sanctions in the UK Sanctions List up to 6 hops away with an aggregate of more than 50% controlling interest via direct shareholding relationships. These relationships include shareholder or subsidiary. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Argentina Public Registry of Terrorism List Entity
Key: `owned_by_sanctioned_arg_repet_jus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_arg_repet_jus']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Argentina Public Registry of Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Argentina Public Registry of Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_arg_repet_jus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_arg_repet_jus']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Argentina Public Registry of Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Belgium National Financial Sanctions List Entity
Key: `owned_by_sanctioned_bel_fpsf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_bel_fpsf']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Belgium National Financial Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Belgium National Financial Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_bel_fpsf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_bel_fpsf']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Belgium National Financial Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Consolidated Australian Sanctions List Entity
Key: `owned_by_sanctioned_aus_dfat_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_aus_dfat']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Consolidated Australian Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Consolidated Australian Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_aus_dfat_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_aus_dfat']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Consolidated Australian Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Consolidated Canadian Autonomous Sanctions List Entity
Key: `owned_by_sanctioned_can_gac_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_can_gac']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Consolidated Canadian Autonomous Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Consolidated Canadian Autonomous Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_can_gac_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_can_gac']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Consolidated Canadian Autonomous Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Czech Republic National Sanctions List Entity
Key: `owned_by_sanctioned_cze_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_cze_mof']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Czech Republic National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Czech Republic National Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_cze_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_cze_mof']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Czech Republic National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by EBRD Ineligible Entities List Entity
Key: `owned_by_sanctioned_xxx_ebrd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_xxx_ebrd']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the EBRD Ineligible Entities List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by EBRD Ineligible Entities List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_xxx_ebrd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_xxx_ebrd']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the EBRD Ineligible Entities List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by EU Financial Sanctions List Entity
Key: `owned_by_sanctioned_eu_dg_fisma_ec_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_eu_dg_fisma_ec']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the EU Financial Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by EU Financial Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_eu_dg_fisma_ec_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_eu_dg_fisma_ec']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the EU Financial Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by EU Sanctions Map List Entity
Key: `owned_by_sanctioned_eu_ec_sanctions_map_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_eu_ec_sanctions_map']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the EU Sanctions Map List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by EU Sanctions Map List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_eu_ec_sanctions_map_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_eu_ec_sanctions_map']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the EU Sanctions Map List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by EU Sanctions – Russia (Regulation 833/2014) List Entity
Key: `owned_by_sanctioned_eu_ec_regulation_833_2014_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_eu_ec_regulation_833_2014']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the EU Sanctions – Russia (Regulation 833/2014) List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by EU Sanctions – Russia (Regulation 833/2014) List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_eu_ec_regulation_833_2014_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_eu_ec_regulation_833_2014']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the EU Sanctions – Russia (Regulation 833/2014) List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Foreign Persons Involved in the Global Illicit Drug Trade (EO 14059)
Key: `owned_by_ofac_illicit_drugs_eo14059_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['ofac_illicit_drugs_eo14059_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Foreign Person Involved in the Global Illicit Drug Trade up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Foreign Persons Involved in the Global Illicit Drug Trade (EO 14059) (May Include 'PSA' Path)
Key: `psa_owned_by_ofac_illicit_drugs_eo14059_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_illicit_drugs_eo14059_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Foreign Person Involved in the Global Illicit Drug Trade up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Foreign Terrorist Organisation
Key: `owned_by_ofac_fto_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['ofac_fto_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Foreign Terrorist Organization up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Foreign Terrorist Organisation (May Include 'PSA' Path)
Key: `psa_owned_by_ofac_fto_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_fto_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Foreign Terrorist Organization up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by France National Asset Freeze Register List Entity
Key: `owned_by_sanctioned_fra_dgt_mefids_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_fra_dgt_mefids']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the France National Asset Freeze Register List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by France National Asset Freeze Register List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_fra_dgt_mefids_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_fra_dgt_mefids']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the France National Asset Freeze Register List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Inter-American Development Bank Sanctions List Entity
Key: `owned_by_sanctioned_xxx_iabd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_xxx_iabd']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Inter-American Development Bank Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Inter-American Development Bank Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_xxx_iabd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_xxx_iabd']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Inter-American Development Bank Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Israel National Bureau for Counter-Terror Financing Designation List Entity
Key: `owned_by_sanctioned_isr_mod_nbctf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_isr_mod_nbctf']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Israel National Bureau for Counter-Terror Financing Designation List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Israel National Bureau for Counter-Terror Financing Designation List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_isr_mod_nbctf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_isr_mod_nbctf']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Israel National Bureau for Counter-Terror Financing Designation List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Japan Ministry of Finance Economic Sanctions List Entity
Key: `owned_by_sanctioned_jpn_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_jpn_mof']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Japan Ministry of Finance Economic Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Japan Ministry of Finance Economic Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_jpn_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_jpn_mof']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Japan Ministry of Finance Economic Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Latvia National Sanctions List Entity
Key: `owned_by_sanctioned_lva_fis_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_lva_fis']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Latvia National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Latvia National Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_lva_fis_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_lva_fis']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Latvia National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Lithuania Designated Persons Under Magnitsky Amendments List Entity
Key: `owned_by_sanctioned_ltu_mi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_ltu_mi']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Lithuania Designated Persons Under Magnitsky Amendments List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Lithuania Designated Persons Under Magnitsky Amendments List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_ltu_mi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_ltu_mi']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Lithuania Designated Persons Under Magnitsky Amendments List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Malaysia MOHA Sanctions List Entity
Key: `owned_by_sanctioned_mys_moha_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_mys_moha']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Malaysia MOHA Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Malaysia MOHA Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_mys_moha_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_mys_moha']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Malaysia MOHA Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Mexico Drug Trafficking OFAC SDN Entity
Key: `owned_by_ofac_sdn_mex_dto_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['ofac_sdn_mex_dto_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Mexican company or individual designated by the U.S. Department of the Treasury's Office of Foreign Assets Control, pursuant to a Counter-Narcotics related program within the Specially Designated Nationals List. Ownership is identified up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Mexico Drug Trafficking OFAC SDN Entity (May Include 'PSA' Path)
Key: `psa_owned_by_ofac_sdn_mex_dto_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_sdn_mex_dto_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Mexican company or individual designated by the U.S. Department of the Treasury's Office of Foreign Assets Control, pursuant to a Counter-Narcotics related program within the Specially Designated Nationals List. Ownership is identified up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Netherlands National Sanctions List for Terrorism List Entity
Key: `owned_by_sanctioned_nld_mofa_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_nld_mofa']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Netherlands National Sanctions List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Netherlands National Sanctions List for Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_nld_mofa_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_nld_mofa']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Netherlands National Sanctions List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by New Zealand Russia Sanctions List Entity
Key: `owned_by_sanctioned_nzl_mfat_rus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_nzl_mfat_rus']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the New Zealand Russia Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by New Zealand Russia Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_nzl_mfat_rus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_nzl_mfat_rus']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the New Zealand Russia Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Poland National Sanctions List Entity
Key: `owned_by_sanctioned_pol_mia_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_pol_mia']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Poland National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Poland National Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_pol_mia_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_pol_mia']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Poland National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Sanctioned Entity
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `owned_by_sanctioned_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by a sanctioned entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Sanctioned Entity (May Include 'PSA' Path)
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `psa_owned_by_sanctioned_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by a sanctioned entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Singapore List for Terrorism List Entity
Key: `owned_by_sanctioned_sgp_agc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_sgp_agc']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Singapore List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Singapore List for Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_sgp_agc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_sgp_agc']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Singapore List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Specially Designated Narcotics Trafficker
Key: `owned_by_ofac_sdnt_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['ofac_sdnt_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Specially Designated Narcotics Trafficker (SDNT) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Specially Designated Narcotics Trafficker (May Include 'PSA' Path)
Key: `psa_owned_by_ofac_sdnt_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_sdnt_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Specially Designated Narcotics Trafficker (SDNT) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Specially Designated Narcotics Trafficker Kingpin
Key: `owned_by_ofac_sdntk_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['ofac_sdntk_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Specially Designated Narcotics Trafficker Kingpin (SDNTK) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Specially Designated Narcotics Trafficker Kingpin (May Include 'PSA' Path)
Key: `psa_owned_by_ofac_sdntk_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_sdntk_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Specially Designated Narcotics Trafficker Kingpin (SDNTK) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Specially Designated Terrorist
Key: `owned_by_ofac_sdgt_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['ofac_sdgt_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Specially Designated Global Terrorist (SDGT) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Specially Designated Terrorist (May Include 'PSA' Path)
Key: `psa_owned_by_ofac_sdgt_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_sdgt_sanctioned']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity is possibly owned (minority, majority, or wholly) by a Specially Designated Global Terrorist (SDGT) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Switzerland SECO Sanctions List Entity
Key: `owned_by_sanctioned_che_seco_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_che_seco']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Switzerland SECO Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Switzerland SECO Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_che_seco_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_che_seco']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Switzerland SECO Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by UK HMT/OFSI Investment Bans List Entity
Key: `owned_by_sanctioned_gbr_hmt_ofsi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_gbr_hmt_ofsi']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the UK HMT/OFSI Investment Bans List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by UK HMT/OFSI Investment Bans List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_gbr_hmt_ofsi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_gbr_hmt_ofsi']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the UK HMT/OFSI Investment Bans List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by UK Sanctions List Entity
Key: `owned_by_sanctioned_gbr_fcdo_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_gbr_fcdo']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the UK Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by UK Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_gbr_fcdo_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_gbr_fcdo']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the UK Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by UN Security Council Sanctions List Entity
Key: `owned_by_sanctioned_un_sc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_un_sc']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the UN Security Council Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by UN Security Council Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_un_sc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_un_sc']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the UN Security Council Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by USA OFAC Non-SDN Consolidated Sanctions List Entity
Key: `owned_by_sanctioned_usa_ofac_non_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_usa_ofac_non_sdn']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the USA OFAC Non-SDN Consolidated Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by USA OFAC Non-SDN Consolidated Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_usa_ofac_non_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_usa_ofac_non_sdn']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the USA OFAC Non-SDN Consolidated Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by USA OFAC SDN List Entity
Key: `owned_by_sanctioned_usa_ofac_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_usa_ofac_sdn']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the USA OFAC SDN List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by USA OFAC SDN List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_usa_ofac_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_usa_ofac_sdn']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the USA OFAC SDN List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Ukraine SFMS List for Terrorism List Entity
Key: `owned_by_sanctioned_ukr_sfms_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_ukr_sfms']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Ukraine SFMS List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Ukraine SFMS List for Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_ukr_sfms_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_ukr_sfms']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Ukraine SFMS List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owned by Ukraine Sanctions List Entity
Key: `owned_by_sanctioned_ukr_nsdc_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `False`
Seed Risk: `['sanctioned_ukr_nsdc']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Ukraine Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owned by Ukraine Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owned_by_sanctioned_ukr_nsdc_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_ukr_nsdc']`
Relationships: `['branch_of', 'subsidiary_of', 'has_partner', 'has_beneficial_owner', 'has_owner', 'has_shareholder']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is possibly owned (minority, majority, or wholly) by an entity listed in the Ukraine Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Argentina Public Registry of Terrorism List Entity
Key: `owner_of_sanctioned_arg_repet_jus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_arg_repet_jus']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Argentina Public Registry of Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Argentina Public Registry of Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_arg_repet_jus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_arg_repet_jus']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Argentina Public Registry of Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Belgium National Financial Sanctions List Entity
Key: `owner_of_sanctioned_bel_fpsf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_bel_fpsf']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Belgium National Financial Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Belgium National Financial Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_bel_fpsf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_bel_fpsf']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Belgium National Financial Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Consolidated Australian Sanctions List Entity
Key: `owner_of_sanctioned_aus_dfat_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_aus_dfat']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Consolidated Australian Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Consolidated Australian Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_aus_dfat_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_aus_dfat']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Consolidated Australian Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Consolidated Canadian Autonomous Sanctions List Entity
Key: `owner_of_sanctioned_can_gac_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_can_gac']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Consolidated Canadian Autonomous Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Consolidated Canadian Autonomous Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_can_gac_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_can_gac']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Consolidated Canadian Autonomous Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Czech Republic National Sanctions List Entity
Key: `owner_of_sanctioned_cze_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_cze_mof']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Czech Republic National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Czech Republic National Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_cze_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_cze_mof']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Czech Republic National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of EBRD Ineligible Entities List Entity
Key: `owner_of_sanctioned_xxx_ebrd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_xxx_ebrd']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the EBRD Ineligible Entities List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of EBRD Ineligible Entities List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_xxx_ebrd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_xxx_ebrd']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the EBRD Ineligible Entities List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of EU Financial Sanctions List Entity
Key: `owner_of_sanctioned_eu_dg_fisma_ec_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_eu_dg_fisma_ec']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the EU Financial Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of EU Financial Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_eu_dg_fisma_ec_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_eu_dg_fisma_ec']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the EU Financial Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of EU Sanctions Map List Entity
Key: `owner_of_sanctioned_eu_ec_sanctions_map_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_eu_ec_sanctions_map']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the EU Sanctions Map List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of EU Sanctions Map List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_eu_ec_sanctions_map_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_eu_ec_sanctions_map']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the EU Sanctions Map List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of EU Sanctions – Russia (Regulation 833/2014) List Entity
Key: `owner_of_sanctioned_eu_ec_regulation_833_2014_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_eu_ec_regulation_833_2014']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the EU Sanctions – Russia (Regulation 833/2014) List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of EU Sanctions – Russia (Regulation 833/2014) List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_eu_ec_regulation_833_2014_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_eu_ec_regulation_833_2014']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the EU Sanctions – Russia (Regulation 833/2014) List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Foreign Persons Involved in the Global Illicit Drug Trade (EO 14059)
Key: `owner_of_ofac_illicit_drugs_eo14059_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['ofac_illicit_drugs_eo14059_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Foreign Person Involved in the Global Illicit Drug Trade up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Foreign Persons Involved in the Global Illicit Drug Trade (EO 14059) (May Include 'PSA' Path)
Key: `psa_owner_of_ofac_illicit_drugs_eo14059_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_illicit_drugs_eo14059_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Foreign Person Involved in the Global Illicit Drug Trade up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Foreign Terrorist Organisation
Key: `owner_of_ofac_fto_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['ofac_fto_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Foreign Terrorist Organization up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Foreign Terrorist Organisation (May Include 'PSA' Path)
Key: `psa_owner_of_ofac_fto_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_fto_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Foreign Terrorist Organization up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of France National Asset Freeze Register List Entity
Key: `owner_of_sanctioned_fra_dgt_mefids_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_fra_dgt_mefids']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the France National Asset Freeze Register List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of France National Asset Freeze Register List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_fra_dgt_mefids_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_fra_dgt_mefids']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the France National Asset Freeze Register List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Inter-American Development Bank Sanctions List Entity
Key: `owner_of_sanctioned_xxx_iabd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_xxx_iabd']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Inter-American Development Bank Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Inter-American Development Bank Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_xxx_iabd_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_xxx_iabd']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Inter-American Development Bank Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Israel National Bureau for Counter-Terror Financing Designation List Entity
Key: `owner_of_sanctioned_isr_mod_nbctf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_isr_mod_nbctf']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Israel National Bureau for Counter-Terror Financing Designation List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Israel National Bureau for Counter-Terror Financing Designation List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_isr_mod_nbctf_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_isr_mod_nbctf']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Israel National Bureau for Counter-Terror Financing Designation List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Japan Ministry of Finance Economic Sanctions List Entity
Key: `owner_of_sanctioned_jpn_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_jpn_mof']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Japan Ministry of Finance Economic Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Japan Ministry of Finance Economic Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_jpn_mof_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_jpn_mof']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Japan Ministry of Finance Economic Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Latvia National Sanctions List Entity
Key: `owner_of_sanctioned_lva_fis_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_lva_fis']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Latvia National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Latvia National Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_lva_fis_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_lva_fis']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Latvia National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Lithuania Designated Persons Under Magnitsky Amendments List Entity
Key: `owner_of_sanctioned_ltu_mi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_ltu_mi']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Lithuania Designated Persons Under Magnitsky Amendments List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Lithuania Designated Persons Under Magnitsky Amendments List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_ltu_mi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_ltu_mi']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Lithuania Designated Persons Under Magnitsky Amendments List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Malaysia MOHA Sanctions List Entity
Key: `owner_of_sanctioned_mys_moha_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_mys_moha']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Malaysia MOHA Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Malaysia MOHA Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_mys_moha_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_mys_moha']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Malaysia MOHA Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Mexico Drug Trafficking OFAC SDN Entity
Key: `owner_of_ofac_sdn_mex_dto_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['ofac_sdn_mex_dto_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Mexican company or individual designated by the U.S. Department of the Treasury's Office of Foreign Assets Control, pursuant to a Counter-Narcotics related program within the Specially Designated Nationals List. Ownership is identified up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Mexico Drug Trafficking OFAC SDN Entity (May Include 'PSA' Path)
Key: `psa_owner_of_ofac_sdn_mex_dto_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_sdn_mex_dto_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Mexican company or individual designated by the U.S. Department of the Treasury's Office of Foreign Assets Control, pursuant to a Counter-Narcotics related program within the Specially Designated Nationals List. Ownership is identified up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Netherlands National Sanctions List for Terrorism List Entity
Key: `owner_of_sanctioned_nld_mofa_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_nld_mofa']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Netherlands National Sanctions List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Netherlands National Sanctions List for Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_nld_mofa_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_nld_mofa']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Netherlands National Sanctions List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of New Zealand Russia Sanctions List Entity
Key: `owner_of_sanctioned_nzl_mfat_rus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_nzl_mfat_rus']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the New Zealand Russia Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of New Zealand Russia Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_nzl_mfat_rus_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_nzl_mfat_rus']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the New Zealand Russia Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Poland National Sanctions List Entity
Key: `owner_of_sanctioned_pol_mia_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_pol_mia']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Poland National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Poland National Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_pol_mia_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_pol_mia']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Poland National Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Sanctioned Entity
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `owner_of_sanctioned_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) a sanctioned entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Sanctioned Entity (May Include 'PSA' Path)
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `psa_owner_of_sanctioned_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) a sanctioned entity up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Singapore List for Terrorism List Entity
Key: `owner_of_sanctioned_sgp_agc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_sgp_agc']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Singapore List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Singapore List for Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_sgp_agc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_sgp_agc']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Singapore List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Specially Designated Narcotics Trafficker
Key: `owner_of_ofac_sdnt_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['ofac_sdnt_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Specially Designated Narcotics Trafficker (SDNT) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Specially Designated Narcotics Trafficker (May Include 'PSA' Path)
Key: `psa_owner_of_ofac_sdnt_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_sdnt_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Specially Designated Narcotics Trafficker (SDNT) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Specially Designated Narcotics Trafficker Kingpin
Key: `owner_of_ofac_sdntk_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['ofac_sdntk_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Specially Designated Narcotics Trafficker Kingpin (SDNTK) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Specially Designated Narcotics Trafficker Kingpin (May Include 'PSA' Path)
Key: `psa_owner_of_ofac_sdntk_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_sdntk_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Specially Designated Narcotics Trafficker Kingpin (SDNTK) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Specially Designated Terrorist
Key: `owner_of_ofac_sdgt_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['ofac_sdgt_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Specially Designated Global Terrorist (SDGT) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Specially Designated Terrorist (May Include 'PSA' Path)
Key: `psa_owner_of_ofac_sdgt_sanctioned`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['ofac_sdgt_sanctioned']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

This entity possibly owns (minority, majority, or wholly) a Specially Designated Global Terrorist (SDGT) up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Switzerland SECO Sanctions List Entity
Key: `owner_of_sanctioned_che_seco_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_che_seco']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Switzerland SECO Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Switzerland SECO Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_che_seco_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_che_seco']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Switzerland SECO Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of UK HMT/OFSI Investment Bans List Entity
Key: `owner_of_sanctioned_gbr_hmt_ofsi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_gbr_hmt_ofsi']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the UK HMT/OFSI Investment Bans List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of UK HMT/OFSI Investment Bans List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_gbr_hmt_ofsi_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_gbr_hmt_ofsi']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the UK HMT/OFSI Investment Bans List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of UK Sanctions List Entity
Key: `owner_of_sanctioned_gbr_fcdo_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_gbr_fcdo']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the UK Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of UK Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_gbr_fcdo_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_gbr_fcdo']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the UK Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of UN Security Council Sanctions List Entity
Key: `owner_of_sanctioned_un_sc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_un_sc']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the UN Security Council Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of UN Security Council Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_un_sc_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_un_sc']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the UN Security Council Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of USA OFAC Non-SDN Consolidated Sanctions List Entity
Key: `owner_of_sanctioned_usa_ofac_non_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_usa_ofac_non_sdn']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the USA OFAC Non-SDN Consolidated Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of USA OFAC Non-SDN Consolidated Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_usa_ofac_non_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_usa_ofac_non_sdn']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the USA OFAC Non-SDN Consolidated Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of USA OFAC SDN List Entity
Key: `owner_of_sanctioned_usa_ofac_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_usa_ofac_sdn']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the USA OFAC SDN List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of USA OFAC SDN List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_usa_ofac_sdn_entity`
Level: `high`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_usa_ofac_sdn']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the USA OFAC SDN List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Ukraine SFMS List for Terrorism List Entity
Key: `owner_of_sanctioned_ukr_sfms_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_ukr_sfms']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Ukraine SFMS List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Ukraine SFMS List for Terrorism List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_ukr_sfms_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_ukr_sfms']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Ukraine SFMS List for Terrorism List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Owner of Ukraine Sanctions List Entity
Key: `owner_of_sanctioned_ukr_nsdc_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `False`
Seed Risk: `['sanctioned_ukr_nsdc']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Ukraine Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally.

### Owner of Ukraine Sanctions List Entity (May Include 'PSA' Path)
Key: `psa_owner_of_sanctioned_ukr_nsdc_entity`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `6`
PSA: `True`
Seed Risk: `['sanctioned_ukr_nsdc']`
Relationships: `['has_branch', 'has_subsidiary', 'partner_of', 'beneficial_owner_of', 'owner_of', 'shareholder_of']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity possibly owns (minority, majority, or wholly) an entity listed in the Ukraine Sanctions List up to 3 hops away via direct shareholding relationships with 10% or more controlling interest, including beneficial owner, owner, shareholder, partner, subsidiary, or branch. Applicable to entities globally. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Possibly the Same As (PSA) a Sanctioned Entity
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `psa_sanctioned`
Level: `critical`
Category: `sanctions`
Visibility: `psa`

The entity is Possibly the Same As (PSA) one or multiple other entities that are Sanctioned. The entities did not meet the threshold required to merge them into a single entity, but they may be the same.

### Related to Mexico Drug Trafficking OFAC SDN Entity
Key: `ofac_sdn_mex_dto_sanctioned_adjacent`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['ofac_sdn_mex_dto_sanctioned']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from a Mexican company or individual designated by the U.S. Department of the Treasury's Office of Foreign Assets Control pursuant to a Counter-Narcotics related program within the Specially Designated Nationals List.

### Related to Mexico Drug Trafficking OFAC SDN Entity (May Include 'PSA' Path)
Key: `psa_ofac_sdn_mex_dto_sanctioned_adjacent`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `3`
PSA: `True`
Seed Risk: `['ofac_sdn_mex_dto_sanctioned']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from a Mexican company or individual designated by the U.S. Department of the Treasury's Office of Foreign Assets Control pursuant to a Counter-Narcotics related program within the Specially Designated Nationals List. This network risk path may include ‘Possibly the Same As’ (PSA) relationships—links between companies or persons that have closely matching attributes across datasets, but do not have enough shared information to definitively establish they are the same entity.

### Related to Sanctioned
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `sanctioned_adjacent`
Level: `elevated`
Category: `sanctions`
Visibility: `network`
<Accordion title='Network Risk Params'>
Max Depth: `1`
PSA: `False`
Seed Risk: `['sanctioned']`
For information about using these parameters, please see [these docs](/api/guides/risk-factors#network-risk).
</Accordion>

The entity is 1 hop away from an entity subject to trade, transport, immigration and/or financial sanctions in one or several international sanctions lists. Applies to all relationship types.

### Sanctioned
<Warning>This risk factor is deprecated and no longer shows up in the UI.</Warning>
Key: `sanctioned`
Level: `critical`
Category: `sanctions`
Visibility: `seed`

Entities (persons, companies, aircraft, or vessels) currently subject to trade, transport, immigration, or financial sanctions in international sanctions lists.

### Specially Designated Narcotics Trafficker
Key: `ofac_sdnt_sanctioned`
Level: `critical`
Category: `sanctions`
Visibility: `seed`

This entity has been designated as a Specially Designated Narcotics Trafficker (SDNT) by the U.S. Department of Treasury, meaning it participates in or supports international narcotics trafficking activities that threaten U.S. national security and is subject to sanctions including asset freezing, prohibition of transactions with U.S. persons, and financial system restrictions.

### Specially Designated Narcotics Trafficker Kingpin
Key: `ofac_sdntk_sanctioned`
Level: `critical`
Category: `sanctions`
Visibility: `seed`

This entity has been designated as a Specially Designated Narcotics Trafficker Kingpin (SDNTK) by the U.S. Department of Treasury under the Foreign Narcotics Kingpin Designation Act, meaning it plays a significant role in international narcotics trafficking activities that threaten U.S. national security and is subject to sanctions including asset freezing, prohibition of transactions with U.S. persons, and financial system restrictions.

### Specially Designated Terrorist
Key: `ofac_sdgt_sanctioned`
Level: `critical`
Category: `sanctions`
Visibility: `seed`

This entity has been designated as a Specially Designated Global Terrorist (SDGT) by the U.S. Department of Treasury, meaning it engages in terrorist activity that threatens U.S. national security and is subject to sanctions including asset freezing, prohibition of transactions with U.S. persons, and financial system restrictions.

## Sanctions And Export Control Lists Risk Factors

### AECA Debarred List Entity
Key: `usa_aeca_debarred`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity has been added to the AECA Debarred List pursuant to the Arms Export Control Act (AECA) and the International Traffic in Arms Regulations (ITAR), which includes persons convicted in court of violating or conspiring to violate the AECA and subject to "statutory debarment" or persons established to have violated the AECA in an administrative proceeding and subject to "administrative debarment." These entities are prohibited from participating directly or indirectly in the export of defense articles, including technical data and defense services.

### BIS Denied Persons List Entity
Key: `usa_bis_denied_persons`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity has been added to the USA Department of Commerce Bureau of Industry and Security's (BIS) Denied Persons List, which is a list of entities whose export and reexport privileges have been denied by the BIS. An American company or individual may not participate in an export transaction with an individual or company on the Denied Persons List.

### BIS Military End User (MEU) List Entity
Key: `usa_bis_meu`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity has been added to the USA Department of Commerce Bureau of Industry and Security's (BIS) Military End Use (MEU) List pursuant to Supplement No. 7 to part 744 of the EAR which identifies foreign parties that are prohibited from receiving items described in Supplement No. 2 of Part 744 of the EAR unless the exporter secures a license.

### BIS Unverified List Entity
Key: `usa_bis_unverified`
Level: `high`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity has been added to the USA Department of Commerce Bureau of Industry and Security's (BIS) Unverified List pursuant to Supplement No. 6 to part 744 of the EAR (15 CFR parts 730–774), which contains the names and addresses of foreign persons who are or have been parties to a transaction, as described in § 748.5 of the EAR, involving the export, reexport, or transfer (in-country) of items subject to the EAR.

### Entity in BIS Entity List
Key: `usa_bis`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity has been added to the USA Department of Commerce Bureau of Industry and Security's (BIS) Entity List for activities contrary to US national security or foreign policy interests. This subjects the entity to specific license requirements for the export, reexport, and/or transfer of items under the Export Administration Regulations (EAR).

### Formerly Sanctioned under Argentina Public Registry of Terrorism List
Key: `formerly_sanctioned_arg_repet_jus`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the Argentina Public Registry of Terrorism. Registry is published by the Argentina Ministry of Justice.

### Formerly Sanctioned under Belgium National Financial Sanctions List
Key: `formerly_sanctioned_bel_fpsf`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the Belgium National Financial Sanctions List. List provides asset freezing measures imposed by Belgium against individuals and entities suspected of terrorism. Belgium National Financial Sanctions List is established by the National Security Council and published by the Federal Public Service Finance.

### Formerly Sanctioned under Consolidated Australian Sanctions List
Key: `formerly_sanctioned_aus_dfat`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to targeted financial sanctions pursuant to the Consolidated Australian Sanctions List. Listed individuals may also be subject to travel bans. The Consolidated Australian Sanctions List is published by the Australian Department of Foreign Affairs and Trade.

### Formerly Sanctioned under Consolidated Canadian Autonomous Sanctions List
Key: `formerly_sanctioned_can_gac`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to financial sanctions in the Consolidated Canadian Autonomous Sanctions List. The Consolidated Canadian Autonomous Sanctions List is published by the Global Affairs Canada.

### Formerly Sanctioned under Czech Republic National Sanctions List
Key: `formerly_sanctioned_cze_mof`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the Czech Republic National Sanctions List. Czech Republic National Sanctions List is published by the Czech Republic Ministry of Foreign Affairs.

### Formerly Sanctioned under EBRD Ineligible Entities List
Key: `formerly_sanctioned_xxx_ebrd`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to integrity sanctions in the EBRD Ineligible Entities List and ineligible to become a Bank Counterparty for the periods indicated. The entity is ineligible due to a Third Party Finding,  a Debarment Decision by a Mutual Enforcement Institution or for having engaged in any Prohibited Practice in accordance with EBRD’s Enforcement Policy and Procedures. The List is published by the European Bank for Reconstruction and Development.

### Formerly Sanctioned under EU Financial Sanctions List
Key: `formerly_sanctioned_eu_dg_fisma_ec`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the EU Financial Sanctions List. EU Financial Sanctions List is published by the Directorate-General for Financial Stability, Financial Services and Capital Markets Union (DG FISMA) of the European Commission.

### Formerly Sanctioned under EU Sanctions Map List
Key: `formerly_sanctioned_eu_ec_sanctions_map`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the EU Sanctions Map List. EU Sanctions Map List provides information on restrictive measures that are applicable in the EU jurisdiction and is published by the European Commission.

### Formerly Sanctioned under EU Sanctions – Russia (Regulation 833/2014) List
Key: `formerly_sanctioned_eu_ec_regulation_833_2014`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the EU Sanctions – Russia (Regulation 833/2014). Listed entities are sanctioned under Council Regulation (EU) No 833/2014 of 31 July 2014 concerning restrictive measures in view of Russia's actions destabilizing the situation in Ukraine, along with its amendments.

### Formerly Sanctioned under France National Asset Freeze Register List
Key: `formerly_sanctioned_fra_dgt_mefids`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the France National Asset Freeze Register. Register provides asset freezing measures in force on French territory, pursuant to national, European Union, and United Nations provisions. France National Asset Freeze Register is published by the Directorate General of the Treasury of the French Ministry of Economics, Finance and Industrial and Digital Sovereignty.

### Formerly Sanctioned under Inter-American Development Bank Sanctions List
Key: `formerly_sanctioned_xxx_iabd`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the Inter-American Development Bank Sanctions List for having engaged in fraudulent, corrupt, collusive, coercive or obstructive practices (collectively, Prohibited Practices), in violation of the IDB Group’s Sanctions Procedures and anti-corruption policies. The List is published by the Inter-American Development Bank.

### Formerly Sanctioned under Israel National Bureau for Counter-Terror Financing Designation List
Key: `formerly_sanctioned_isr_mod_nbctf`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to Israel National Bureau for Counter-Terror Financing Designation List. The sanctions list is published by the Israel Ministry of Defense National Bureau for Counter-Terror Financing.

### Formerly Sanctioned under Japan Ministry of Finance Economic Sanctions List
Key: `formerly_sanctioned_jpn_mof`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to financial sanctions pursuant to the Japan Economic Sanctions List. Japan Economic Sanctions List is published by the Japan Ministry of Finance.

### Formerly Sanctioned under Latvia National Sanctions List
Key: `formerly_sanctioned_lva_fis`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to targeted financial sanctions in the Latvia National Sanctions List. The List is published by the Financial Intelligence Service of Latvia.

### Formerly Sanctioned under Lithuania Designated Persons Under Magnitsky Amendments List
Key: `formerly_sanctioned_ltu_mi`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the Lithuania Designated Persons Under Magnitsky Amendments. The List is maintained and published by the Migration Department under the Ministry of the Interior of the Republic of Lithuania following the adoption of Magnitsky legislation, which amends Article 133 of the Lithuanian Law on the Legal Status of Aliens.

### Formerly Sanctioned under Malaysia MOHA Sanctions List
Key: `formerly_sanctioned_mys_moha`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the Malaysia MOHA Sanctions List. Listed entities are imposed with asset freezing measures due to links to acts of terrorism and their financing. The List is published by the Malaysia Ministry of Home Affairs.

### Formerly Sanctioned under Netherlands National Sanctions List for Terrorism List
Key: `formerly_sanctioned_nld_mofa`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the Netherlands National Sanctions List for Terrorism. List provides financial sanctions and asset freeze measures imposed by Netherlands against individuals and entities involved in terrorist activities. Netherlands National Sanctions List for Terrorism is published by the Dutch Ministry of Foreign Affairs.

### Formerly Sanctioned under New Zealand Russia Sanctions List
Key: `formerly_sanctioned_nzl_mfat_rus`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the New Zealand Russia Sanctions List. New Zealand Russia Sanctions List is published by the New Zealand Foreign Affairs and Trade.

### Formerly Sanctioned under Poland National Sanctions List
Key: `formerly_sanctioned_pol_mia`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the Poland National Sanctions List. List provides financial, asset freezing, and travel sanctions imposed by Poland. Poland National Sanctions List is published by the Ministry of the Interior and Administration of the Republic of Poland.

### Formerly Sanctioned under Singapore List for Terrorism List
Key: `formerly_sanctioned_sgp_agc`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the Singapore List for Terrorism. The List is published via  Singapore Statutes Online (SSO) and maintained by the Legislation Division of the Attorney-General’s Chambers of Singapore (AGC).

### Formerly Sanctioned under Switzerland SECO Sanctions List
Key: `formerly_sanctioned_che_seco`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the Switzerland SECO Sanctions List. The List provides financial, trade, travel, diplomatic, cultural, and air traffic sanctions imposed by Switzerland. Switzerland SECO Sanctions List is published by the Switzerland State Secretariat of Economic Affairs.

### Formerly Sanctioned under UK HMT/OFSI Investment Bans List
Key: `formerly_sanctioned_gbr_hmt_ofsi`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to targeted financial sanctions pursuant to the UK HMT/OFSI Investment Bans List. UK HMT/OFSI Investment Bans List is maintained and published by HM Treasury, UK Office of Financial Sanctions Implementation (OFSI).

### Formerly Sanctioned under UK Sanctions List
Key: `formerly_sanctioned_gbr_fcdo`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the UK Sanctions List. UK Sanctions List provides financial, immigration, trade, aircraft, and shipping sanctions. UK Sanctions List is published by the UK Foreign, Commonwealth & Development Office.

### Formerly Sanctioned under UN Security Council Sanctions List
Key: `formerly_sanctioned_un_sc`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the UN Security Council Sanctions List. The List is published by the UN Security Council.

### Formerly Sanctioned under USA OFAC Non-SDN Consolidated Sanctions List
Key: `formerly_sanctioned_usa_ofac_non_sdn`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the USA OFAC Non-SDN Consolidated Sanctions List. The List is published by the U.S. Department of the Treasury, Office of Foreign Assets Control (OFAC). USA OFAC Non-SDN Consolidated Sanctions List is comprised of the Foreign Sanctions Evaders List, Sectoral Sanctions Identifications (SSI) List, Correspondent Account or Payable-Through Account Sanctions (CAPTA) List, Non-SDN Menu-Based Sanctions List (NS-MBS List), Non-SDN Chinese Military-Industrial Complex Companies (CMIC) (NS-CCMC), and Palestinian Legislative Council List (PLC).

### Formerly Sanctioned under USA OFAC SDN List
Key: `formerly_sanctioned_usa_ofac_sdn`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions in the USA OFAC Specially Designated Nationals and Blocked Persons (SDN) List. The List is published by the U.S. Department of the Treasury, Office of Foreign Assets Control (OFAC).

### Formerly Sanctioned under Ukraine SFMS List for Terrorism List
Key: `formerly_sanctioned_ukr_sfms`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to sanctions pursuant to the Ukraine SFMS List for Terrorism since it is related to terrorist activities or sanctioned under international sanctions regimes.  Ukraine SFMS List for Terrorism is published by the State Financial Monitoring Service of Ukraine (Financial Intelligence Unit of Ukraine).

### Formerly Sanctioned under Ukraine Sanctions List
Key: `formerly_sanctioned_ukr_nsdc`
Level: `elevated`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity was formerly subject to trade, transport, immigration, and/or financial sanctions in the Ukraine Sanctions List. Ukraine Sanctions List is published by the National Security and Defense Council of Ukraine.

### ISN Nonproliferation Sanctions List Entity
Key: `usa_isn`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity has been added to the USA Department of State Bureau of International Security and Nonproliferation's (ISN) Nonproliferation Sanctions List, which imposes sanctions under various legal authorities against foreign individuals, private entities, and governments that engage in proliferation activities.

### Japan METI End User List Entity
Key: `jpn_meti_end_user`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity has been added to the Japan Ministry of Economy, Trade and Industry (METI) End User List, which includes entities for which concerns cannot be eliminated regarding their involvement in activities such as the development of WMDs and missiles.

### Japan MOFA Export Ban List Entity
Key: `jpn_mofa_export_ban`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity has been added to the Japan Ministry of Foreign Affairs (MOFA) Export Ban List, which includes entities subject to export-related prohibitions due to their possible contribution to the enhancement of Russian industrial capacities. These measures, under the Japan Foreign Exchange and Foreign Trade Act, were put in place in response to the situation in Ukraine.

### Listed on Non-SDN Chinese Military-Industrial Complex Companies (NS-CMIC) List
Key: `cmic_entity`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`
Learn more [here](https://home.treasury.gov/policy-issues/financial-sanctions/consolidated-sanctions-list/ns-cmic-list)

The entity is included on the Non-SDN Chinese Military-Industrial Complex Companies (NS-CMIC) List, which targets companies that are part of China’s broader military-industrial complex but are not subject to the same sanctions as those on the Specially Designated Nationals (SDN) List. This list focuses on entities that directly or indirectly support or engage in activities related to the Chinese military, including the development and production of military technologies, dual-use items, or defense systems. While listed entities are not fully blocked from doing business with U.S. companies, specific export restrictions apply to sensitive technologies may apply.

### Mexico Drug Trafficking OFAC SDN Entity
Key: `ofac_sdn_mex_dto_sanctioned`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

This entity has been identified by Sayari analysts as a Mexican company or individual designated by the U.S. Department of the Treasury's Office of Foreign Assets Control pursuant to a Counter-Narcotics related program within the Specially Designated Nationals List.

### Possibly the Same As (PSA) AECA Debarred List Entity
Key: `psa_usa_aeca_debarred`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the AECA Debarred List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Argentina Public Registry of Terrorism List Entity
Key: `psa_sanctioned_arg_repet_jus`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Argentina Public Registry of Terrorism List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) BIS Denied Persons List Entity
Key: `psa_usa_bis_denied_persons`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the BIS Denied Persons List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) BIS Entity List Entity
Key: `psa_usa_bis`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the BIS Entity List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) BIS Military End User (MEU) List Entity
Key: `psa_usa_bis_meu`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the BIS Military End User (MEU) List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) BIS Unverified List Entity
Key: `psa_usa_bis_unverified`
Level: `high`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the BIS Unverified List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Belgium National Financial Sanctions List Entity
Key: `psa_sanctioned_bel_fpsf`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Belgium National Financial Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Consolidated Australian Sanctions List Entity
Key: `psa_sanctioned_aus_dfat`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Consolidated Australian Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Consolidated Canadian Autonomous Sanctions List Entity
Key: `psa_sanctioned_can_gac`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Consolidated Canadian Autonomous Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Czech Republic National Sanctions List Entity
Key: `psa_sanctioned_cze_mof`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Czech Republic National Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) EBRD Ineligible Entities List Entity
Key: `psa_sanctioned_xxx_ebrd`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the EBRD Ineligible Entities List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) EU Financial Sanctions List Entity
Key: `psa_sanctioned_eu_dg_fisma_ec`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the EU Financial Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) EU Sanctions Map List Entity
Key: `psa_sanctioned_eu_ec_sanctions_map`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the EU Sanctions Map List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) EU Sanctions – Russia (Regulation 833/2014) List Entity
Key: `psa_sanctioned_eu_ec_regulation_833_2014`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the EU Sanctions – Russia (Regulation 833/2014) List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) France National Asset Freeze Register List Entity
Key: `psa_sanctioned_fra_dgt_mefids`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the France National Asset Freeze Register List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) ISN Nonproliferation Sanctions List Entity
Key: `psa_usa_isn`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the ISN Nonproliferation Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Inter-American Development Bank Sanctions List Entity
Key: `psa_sanctioned_xxx_iabd`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Inter-American Development Bank Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Israel National Bureau for Counter-Terror Financing Designation List Entity
Key: `psa_sanctioned_isr_mod_nbctf`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Israel National Bureau for Counter-Terror Financing Designation List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Japan METI End User List Entity
Key: `psa_jpn_meti_end_user`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Japan METI End User List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Japan MOFA Export Ban List Entity
Key: `psa_jpn_mofa_export_ban`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Japan MOFA Export Ban List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Japan Ministry of Finance Economic Sanctions List Entity
Key: `psa_sanctioned_jpn_mof`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Japan Ministry of Finance Economic Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Latvia National Sanctions List Entity
Key: `psa_sanctioned_lva_fis`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Latvia National Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Lithuania Designated Persons Under Magnitsky Amendments List Entity
Key: `psa_sanctioned_ltu_mi`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Lithuania Designated Persons Under Magnitsky Amendments List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Malaysia MOHA Sanctions List Entity
Key: `psa_sanctioned_mys_moha`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Malaysia MOHA Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Netherlands National Sanctions List for Terrorism List Entity
Key: `psa_sanctioned_nld_mofa`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Netherlands National Sanctions List for Terrorism List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) New Zealand Russia Sanctions List Entity
Key: `psa_sanctioned_nzl_mfat_rus`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the New Zealand Russia Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Poland National Sanctions List Entity
Key: `psa_sanctioned_pol_mia`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Poland National Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Singapore List for Terrorism List Entity
Key: `psa_sanctioned_sgp_agc`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Singapore List for Terrorism List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Switzerland SECO Sanctions List Entity
Key: `psa_sanctioned_che_seco`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Switzerland SECO Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) UK HMT/OFSI Investment Bans List Entity
Key: `psa_sanctioned_gbr_hmt_ofsi`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the UK HMT/OFSI Investment Bans List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) UK Sanctions List Entity
Key: `psa_sanctioned_gbr_fcdo`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the UK Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) UN Security Council Sanctions List Entity
Key: `psa_sanctioned_un_sc`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the UN Security Council Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) USA NDAA Section 1260H List Entity
Key: `psa_usa_section_1260h`
Level: `high`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the USA NDAA Section 1260H List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) USA OFAC Non-SDN Consolidated Sanctions List Entity
Key: `psa_sanctioned_usa_ofac_non_sdn`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the USA OFAC Non-SDN Consolidated Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) USA OFAC SDN List Entity
Key: `psa_sanctioned_usa_ofac_sdn`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the USA OFAC SDN List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Ukraine SFMS List for Terrorism List Entity
Key: `psa_sanctioned_ukr_sfms`
Level: `high`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Ukraine SFMS List for Terrorism List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Possibly the Same As (PSA) Ukraine Sanctions List Entity
Key: `psa_sanctioned_ukr_nsdc`
Level: `high`
Category: `sanctions_and_export_control_lists`
Visibility: `psa`

The entity is possibly the same as (PSA) an entity listed in the Ukraine Sanctions List. The entities did not meet the threshold required to merge them into a single entity, but they are likely the same.

### Sanctioned under Argentina Public Registry of Terrorism List
Key: `sanctioned_arg_repet_jus`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the Argentina Public Registry of Terrorism. Registry is published by the Argentina Ministry of Justice.

### Sanctioned under Belgium National Financial Sanctions List
Key: `sanctioned_bel_fpsf`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the Belgium National Financial Sanctions List. List provides asset freezing measures imposed by Belgium against individuals and entities suspected of terrorism. Belgium National Financial Sanctions List is established by the National Security Council and published by the Federal Public Service Finance.

### Sanctioned under Consolidated Australian Sanctions List
Key: `sanctioned_aus_dfat`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to targeted financial sanctions pursuant to the Consolidated Australian Sanctions List. Listed individuals may also be subject to travel bans. The Consolidated Australian Sanctions List is published by the Australian Department of Foreign Affairs and Trade.

### Sanctioned under Consolidated Canadian Autonomous Sanctions List
Key: `sanctioned_can_gac`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to financial sanctions in the Consolidated Canadian Autonomous Sanctions List. The Consolidated Canadian Autonomous Sanctions List is published by the Global Affairs Canada.

### Sanctioned under Czech Republic National Sanctions List
Key: `sanctioned_cze_mof`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the Czech Republic National Sanctions List. Czech Republic National Sanctions List is published by the Czech Republic Ministry of Foreign Affairs.

### Sanctioned under EBRD Ineligible Entities List
Key: `sanctioned_xxx_ebrd`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to integrity sanctions in the EBRD Ineligible Entities List and ineligible to become a Bank Counterparty for the periods indicated. The entity is ineligible due to a Third Party Finding,  a Debarment Decision by a Mutual Enforcement Institution or for having engaged in any Prohibited Practice in accordance with EBRD’s Enforcement Policy and Procedures. The List is published by the European Bank for Reconstruction and Development.

### Sanctioned under EU Financial Sanctions List
Key: `sanctioned_eu_dg_fisma_ec`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the EU Financial Sanctions List. EU Financial Sanctions List is published by the Directorate-General for Financial Stability, Financial Services and Capital Markets Union (DG FISMA) of the European Commission.

### Sanctioned under EU Sanctions Map List
Key: `sanctioned_eu_ec_sanctions_map`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the EU Sanctions Map List. EU Sanctions Map List provides information on restrictive measures that are applicable in the EU jurisdiction and is published by the European Commission.

### Sanctioned under EU Sanctions – Russia (Regulation 833/2014) List
Key: `sanctioned_eu_ec_regulation_833_2014`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the EU Sanctions – Russia (Regulation 833/2014). Listed entities are sanctioned under Council Regulation (EU) No 833/2014 of 31 July 2014 concerning restrictive measures in view of Russia's actions destabilizing the situation in Ukraine, along with its amendments.

### Sanctioned under France National Asset Freeze Register List
Key: `sanctioned_fra_dgt_mefids`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the France National Asset Freeze Register. Register provides asset freezing measures in force on French territory, pursuant to national, European Union, and United Nations provisions. France National Asset Freeze Register is published by the Directorate General of the Treasury of the French Ministry of Economics, Finance and Industrial and Digital Sovereignty.

### Sanctioned under Inter-American Development Bank Sanctions List
Key: `sanctioned_xxx_iabd`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the Inter-American Development Bank Sanctions List for having engaged in fraudulent, corrupt, collusive, coercive or obstructive practices (collectively, Prohibited Practices), in violation of the IDB Group’s Sanctions Procedures and anti-corruption policies. The List is published by the Inter-American Development Bank.

### Sanctioned under Israel National Bureau for Counter-Terror Financing Designation List
Key: `sanctioned_isr_mod_nbctf`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to Israel National Bureau for Counter-Terror Financing Designation List. The sanctions list is published by the Israel Ministry of Defense National Bureau for Counter-Terror Financing.

### Sanctioned under Japan Ministry of Finance Economic Sanctions List
Key: `sanctioned_jpn_mof`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to financial sanctions pursuant to the Japan Economic Sanctions List. Japan Economic Sanctions List is published by the Japan Ministry of Finance.

### Sanctioned under Latvia National Sanctions List
Key: `sanctioned_lva_fis`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to targeted financial sanctions in the Latvia National Sanctions List. The List is published by the Financial Intelligence Service of Latvia.

### Sanctioned under Lithuania Designated Persons Under Magnitsky Amendments List
Key: `sanctioned_ltu_mi`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the Lithuania Designated Persons Under Magnitsky Amendments. The List is maintained and published by the Migration Department under the Ministry of the Interior of the Republic of Lithuania following the adoption of Magnitsky legislation, which amends Article 133 of the Lithuanian Law on the Legal Status of Aliens.

### Sanctioned under Malaysia MOHA Sanctions List
Key: `sanctioned_mys_moha`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the Malaysia MOHA Sanctions List. Listed entities are imposed with asset freezing measures due to links to acts of terrorism and their financing. The List is published by the Malaysia Ministry of Home Affairs.

### Sanctioned under Netherlands National Sanctions List for Terrorism List
Key: `sanctioned_nld_mofa`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the Netherlands National Sanctions List for Terrorism. List provides financial sanctions and asset freeze measures imposed by Netherlands against individuals and entities involved in terrorist activities. Netherlands National Sanctions List for Terrorism is published by the Dutch Ministry of Foreign Affairs.

### Sanctioned under New Zealand Russia Sanctions List
Key: `sanctioned_nzl_mfat_rus`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the New Zealand Russia Sanctions List. New Zealand Russia Sanctions List is published by the New Zealand Foreign Affairs and Trade.

### Sanctioned under Poland National Sanctions List
Key: `sanctioned_pol_mia`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the Poland National Sanctions List. List provides financial, asset freezing, and travel sanctions imposed by Poland. Poland National Sanctions List is published by the Ministry of the Interior and Administration of the Republic of Poland.

### Sanctioned under Singapore List for Terrorism List
Key: `sanctioned_sgp_agc`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the Singapore List for Terrorism. The List is published via  Singapore Statutes Online (SSO) and maintained by the Legislation Division of the Attorney-General’s Chambers of Singapore (AGC).

### Sanctioned under Switzerland SECO Sanctions List
Key: `sanctioned_che_seco`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the Switzerland SECO Sanctions List. The List provides financial, trade, travel, diplomatic, cultural, and air traffic sanctions imposed by Switzerland. Switzerland SECO Sanctions List is published by the Switzerland State Secretariat of Economic Affairs.

### Sanctioned under UK HMT/OFSI Investment Bans List
Key: `sanctioned_gbr_hmt_ofsi`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to targeted financial sanctions pursuant to the UK HMT/OFSI Investment Bans List. UK HMT/OFSI Investment Bans List is maintained and published by HM Treasury, UK Office of Financial Sanctions Implementation (OFSI).

### Sanctioned under UK Sanctions List
Key: `sanctioned_gbr_fcdo`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the UK Sanctions List. UK Sanctions List provides financial, immigration, trade, aircraft, and shipping sanctions. UK Sanctions List is published by the UK Foreign, Commonwealth & Development Office.

### Sanctioned under UN Security Council Sanctions List
Key: `sanctioned_un_sc`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the UN Security Council Sanctions List. The List is published by the UN Security Council.

### Sanctioned under USA OFAC Non-SDN Consolidated Sanctions List
Key: `sanctioned_usa_ofac_non_sdn`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the USA OFAC Non-SDN Consolidated Sanctions List. The List is published by the U.S. Department of the Treasury, Office of Foreign Assets Control (OFAC). USA OFAC Non-SDN Consolidated Sanctions List is comprised of the Foreign Sanctions Evaders List, Sectoral Sanctions Identifications (SSI) List, Correspondent Account or Payable-Through Account Sanctions (CAPTA) List, Non-SDN Menu-Based Sanctions List (NS-MBS List), Non-SDN Chinese Military-Industrial Complex Companies (CMIC) (NS-CCMC), and Palestinian Legislative Council List (PLC).

### Sanctioned under USA OFAC SDN List
Key: `sanctioned_usa_ofac_sdn`
Level: `critical`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions in the USA OFAC Specially Designated Nationals and Blocked Persons (SDN) List. The List is published by the U.S. Department of the Treasury, Office of Foreign Assets Control (OFAC).

### Sanctioned under Ukraine SFMS List for Terrorism List
Key: `sanctioned_ukr_sfms`
Level: `high`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to sanctions pursuant to the Ukraine SFMS List for Terrorism since it is related to terrorist activities or sanctioned under international sanctions regimes.  Ukraine SFMS List for Terrorism is published by the State Financial Monitoring Service of Ukraine (Financial Intelligence Unit of Ukraine).

### Sanctioned under Ukraine Sanctions List
Key: `sanctioned_ukr_nsdc`
Level: `high`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity is currently subject to trade, transport, immigration, and/or financial sanctions in the Ukraine Sanctions List. Ukraine Sanctions List is published by the National Security and Defense Council of Ukraine.

### USA NDAA Section 1260H List Entity
Key: `usa_section_1260h`
Level: `high`
Category: `sanctions_and_export_control_lists`
Visibility: `seed`

The entity has been added to the USA NDAA Section 1260H List, which includes entities identified as Chinese Military Companies operating directly or indirectly in the United States, in accordance with the statutory requirement of Section 1260H of the National Defense Authorization Act.
