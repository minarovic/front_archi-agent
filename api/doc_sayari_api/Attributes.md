



## All attributes include

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of an attribute|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of an attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of an attribute|

## Additional Information

This is a generic attribute used to hold miscellaneous information not covered by any other attribute. Includes "value" (for the attribute itself), "type" (a name: e.g., "Real property description"), and "extra" (a miscellaneous field to hold any other details).

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|The additional information itself|
|`type`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|The type of additional information being conveyed|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Address

A physical location description. Addresses may exist as a simple string ("123 South Main St., South Bend, IN 46556"), or may be in smaller chunks with separate fields ("Number: 123", "Street name: South Main ..."). Where possible, these fields will be parsed using the [Libpostal ontology](https://github.com/openvenues/libpostal#parser-labels), which facilitates more robust address analysis and comparison.

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`string`|A single string that expresses the entire address. If this is created in the parser, it should run from the most specific part of the address to the least specific.|
|`translated`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|The address value translated to English|
|`transliterated`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|The address value transliterated to English|
|`type`|&nbsp; &nbsp; &nbsp; &#10004;|[Address Type](/sayari-library/ontology/enumerated-types/#address-type)|Indicates what the address is referring to. For example, it could be a physical address, mailing address, or other address type.|
|`language`|&nbsp; &nbsp; &nbsp; &#10004;|[Language](/sayari-library/ontology/enumerated-types/#language)|The language in which the address was provided in the record|
|`house`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Building/site name (e.g., "Brooklyn Academy of Music", "Empire State Building")|
|`house_number`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Usually refers to the external (street-facing) building number. In some jurisdictions, this may be a compound number that also includes an apartment/block number.|
|`po_box`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Typically found in non-physical (mail-only) addresses|
|`building`|&nbsp; &nbsp; &nbsp; &#10004;|`string`| |
|`entrance`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Numbered/lettered entrance|
|`staircase`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Numbered/lettered staircase|
|`level`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Expressions indicating a floor number (e.g., "3rd Floor", "Ground Floor")|
|`unit`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|An apartment, unit, office, lot, or other secondary unit designator|
|`road`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Street name(s)|
|`metro_station`|&nbsp; &nbsp; &nbsp; &#10004;|`string`| |
|`suburb`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Usually an unofficial neighborhood name, like "Harlem", "South Bronx", or "Crown Heights"|
|`city_district`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Boroughs or districts within a city that serve some official purpose (e.g., "Brooklyn", "Hackney", or "Bratislava IV")|
|`city`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Any human settlement, including cities, towns, villages, hamlets, localities, etc.|
|`state_district`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|A second-level administrative division or county|
|`island`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Named islands (e.g., "Maui")|
|`state`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|A first-level administrative division, including provinces and departments. Scotland, Northern Ireland, Wales, and England in the UK are also mapped to "state" (convention commonly used in geocoding tools).|
|`postcode`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Postal codes used for mail sorting|
|`country_region`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Informal subdivision of a country without any political status|
|`country`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Sovereign nations and their dependent territories; anything with an ISO 3166 code|
|`world_region`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Currently only used for appending “West Indies” after the country name, a pattern frequently used in the English-speaking Caribbean (e.g., “Jamaica, West Indies”)|
|`category`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|For category queries like "restaurants", etc.|
|`near`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Phrases like "in", "near", etc. used after a category phrase, to help with parsing queries like "restaurants in Brooklyn"|
|`x`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The X coordinate (longitude) of the address|
|`y`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The Y coordinate (latitude) of the address|
|`precision_code`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|A code describing the precision of the X and Y coordinates|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Business Purpose

Text and/or a code (NAICS, NACE, ISIC, etc.) that describes what a company is legally allowed to do or produce

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|A text description|
|`code`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|A code|
|`standard`|&nbsp; &nbsp; &nbsp; &#10004;|[Business Purpose Standard](/sayari-library/ontology/enumerated-types/#business-purpose-standard)|The type of code (e.g., "ISIC4", "NACE1")|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Company Type

A type of legal entity in a given jurisdiction (e.g., "LLC", "Sociedad Anonima", "Private Company Limited by Shares")

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`string`|Free text|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Contact

Contact information for an entity

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`string`|The contact detail itself (e.g., "jdoe@sayari.com", "202-555-5555")|
|`type`|&nbsp; &nbsp; &nbsp; &#10004;|[Contact Type](/sayari-library/ontology/enumerated-types/#contact-type)|Email, fax, phone number, or URL|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Country

An affiliation of an entity with a given country through residence, nationality, etc.

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |[Country](/sayari-library/ontology/enumerated-types/#country)|The country, ideally normalized to an ISO trigram|
|`context`|&nbsp; &nbsp; &nbsp; &#10004;|[Country Context](/sayari-library/ontology/enumerated-types/#country-context)|The type of affiliation|
|`state`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|The subnational state, province, region, etc.|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Date Of Birth

Birth date of a person

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`string`|The date of birth in YYYY-MM-DD, YYYY-MM, or YYYY format|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Finances
<Warning>This attribute is deprecated.</Warning>

A financial figure, typically share capital

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`double`|The numerical amount|
|`context`|&nbsp; &nbsp; &nbsp; &#10004;|[Finance Type](/sayari-library/ontology/enumerated-types/#finance-type)|The type of figure|
|`type`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|A free-text definition of the type|
|`currency`|&nbsp; &nbsp; &nbsp; &#10004;|[Currency](/sayari-library/ontology/enumerated-types/#currency)|The currency, if applicable|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Financials

A summary of financial information at one point in time

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`revenue`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The total amount of income generated by the sale of goods or services related to the company's primary operations|
|`net_income`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Company's earnings for a period after subtracting operating costs, taxes, and interest|
|`assets`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The total value of assets owned by a company|
|`liabilities`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Sum of the combined debts a company owes|
|`total_current_liabilities`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The total amount of a company’s short-term financial obligations that are due within one year, such as accounts payable, short-term loans, and wages payable|
|`registered_capital`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Registered capital is the maximum amount of share capital that a company is authorized to raise|
|`paid_up_capital`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Paid-up capital is the capital already held by the company|
|`employees`|&nbsp; &nbsp; &nbsp; &#10004;|`int`|Total employees|
|`currency`|&nbsp; &nbsp; &nbsp; &#10004;|[Currency](/sayari-library/ontology/enumerated-types/#currency)|Reporting currency|
|`common_stock`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Total Common Stock|
|`operating_income`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Reported Operating Income|
|`total_debt`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Total Debt|
|`inventory`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Total Inventory|
|`cash_and_equivalent`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Total Cash and Equivalent|
|`gross_profit`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Total Gross Profit|
|`reporting_period_type`|&nbsp; &nbsp; &nbsp; &#10004;|[Reporting Period Type](/sayari-library/ontology/enumerated-types/#reporting-period-type)|Reporting period type|
|`rd_expenses`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Costs incurred by a company on the development of a new product, innovation relating to technology formulation, process development, or on the process undertaken in upgrading the existing product or service line.|
|`total_operating_expenses`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The costs a business incurs to maintain its day-to-day operations, excluding the cost of goods sold.|
|`total_liabilities`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|All liabilities (current and long-term) as of the date indicated, as carried on the balance sheet.|
|`unusual_items`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Sum of all income or expenses that are deemed infrequent and not typical of a company's ordinary operations.|
|`cash_operations`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Net cash used or generated in operating activities, during the stated period of time.|
|`cash_investing`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Net cash used or generated in investing activities, during the stated period of time.|
|`cash_financing`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Net cash used or generated in financing activities, during the stated period of time.|
|`total_equity`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Equity as defined under the indicated accounting principles. Includes par value, paid in capital, retained earnings, and other adjustments to equity.|
|`asset_writeoff`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Write-off of any intangible or tangible fixed assets by the company and includes any value charged towards restructuring of operations.|
|`sale_ppe`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Cash flows obtained by the company through the sale of property, plant, and equipment.|
|`issued_common_stock`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The total cash inflow received from issuing new common shares during the reporting period.|
|`total_dividends`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Cash outflows towards dividends or distributions, either to common or preferred stockholders during the relevant period. The value paid may relate to pending dividend of earlier period also.|
|`interest_expense`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Interest expense (net of capitalized interest) incurred by the company on the debt taken. Also includes debt procurement costs, and dividend paid by parent company on the preferred stock of its subsidiary or on trust preferred securities reported in the income statement.|
|`legal_settlements`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Costs incurred in legal disputes or receipts from legal settlements received by the company and reflected on the income statement.|
|`total_current_assets`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Assets which are expected to be converted into cash or used in the production of revenue within a period of twelve months.|
|`total_capitalization`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The sum of total debt and all types of equity of a company.|
|`total_receivables`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Summation of accounts receivable - trade, accounts receivable - other, and loans receivable current.|
|`total_debt_issued`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Cash inflow from issuance of debt.|
|`net_change_cash`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Net increase or decrease in cash and cash equivalents during the stated period of time. Sum of cash flows from operating activities, investing activities and financing activities plus foreign exchange rate adjustments and other miscellaneous cash flows.|
|`basic_eps`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Profitability metric that indicates how much profit a company generates for each outstanding share of common stock.|
|`accounts_payable`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Trade payables for the purchase of materials and supplies to be used in the production of goods or in providing of services and are due in customary trade terms within one year or within the normal operating cycle of the company.|
|`change_accounts_receivable`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Increase or decrease in the accounts receivable of the company during the stated period.|
|`change_inventory`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Change in the inventory of the company reflected in the operating section of cash flow statement.|
|`change_accounts_payable`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|Increase or decrease in accounts payable by the company during the stated period.|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Gender

A person's gender

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |[Gender](/sayari-library/ontology/enumerated-types/#gender)|May be described as "female", "male", or "other"|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Generic
<Warning>This attribute is deprecated.</Warning>

A placeholder attribute. Rarely used. A generic attribute typically does not fit any other attribute type.

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|The value of the attribute as text (e.g., "Max")|
|`type`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|A text description of the attribute (e.g., "name of pet")|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Identifier

An ID number that uniquely identifies one entity when value and type are taken into account.

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`string`|The text/number value of the identifier|
|`type`| |[Identifier Type](/sayari-library/ontology/enumerated-types/#identifier-type)|The type must include the jurisdiction in which it is issued|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Measurement

A numerical measurement of a dimension of an entity (e.g., weight) using a standard unit

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`double`|The value of the measurement|
|`type`| |[Measurement Type](/sayari-library/ontology/enumerated-types/#measurement-type)|Type of the measurement|
|`unit`| |[Unit](/sayari-library/ontology/enumerated-types/#unit)|The unit of the measurement|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Monetary Value

The financial value of an asset (e.g., FOB, CIF)

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`double`|The financial value of the asset|
|`currency`|&nbsp; &nbsp; &nbsp; &#10004;|[Currency](/sayari-library/ontology/enumerated-types/#currency)|The ISO 4217 currency code|
|`context`| |[Monetary Value Context](/sayari-library/ontology/enumerated-types/#monetary-value-context)|The type of value|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Name

An entity's name. The value may be straightforward (e.g., "Acme LLC", "John Doe") or context specific (e.g., "Jones v. Smith" as a legal matter name).

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`string`|The name, as text|
|`language`|&nbsp; &nbsp; &nbsp; &#10004;|[Language](/sayari-library/ontology/enumerated-types/#language)|The language that the name is in|
|`context`|&nbsp; &nbsp; &nbsp; &#10004;|[Name Context](/sayari-library/ontology/enumerated-types/#name-context)|The type of name|
|`translated`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|The name value translated to English|
|`transliterated`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|The name value transliterated to English|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Person Status
<Warning>This attribute is deprecated.</Warning>

A key event occurring in a person's life, usually temporal

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |[Person Status](/sayari-library/ontology/enumerated-types/#person-status)|The event|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Position

An attribute used for many different relationship types that allows for the inclusion of a title or designation (e.g., member_of_the_board_of, Position: "Secretary of the Board" or shareholder_of, Position: "Minority shareholder")

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`string`|The position as text|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Risk Intelligence

An attribute for risk intelligence metadata

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`type`| |[Tag](/sayari-library/ontology/enumerated-types/#tag)|Type of risk intelligence|
|`authority`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Government authority issuing the enforcement or risk intelligence action|
|`program`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Specific to sanctions risk. Sanctions program under which the entity is designated.|
|`list`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Official list where the entity's risk information or enforcement action is recorded|
|`reason`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|Explanation or legal basis for the risk intelligence|
|`score`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|A value indicating the assessed level of a certain risk tied to an entity. Meaning and scale depend on the specific scoring model used.|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Shares

Shares associated with an entity (e.g., number of shares issued by a company or number of shares held by a shareholder)

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`num_shares`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The number of shares held, issued, etc.|
|`monetary_value`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The total monetary value of the shares|
|`currency`|&nbsp; &nbsp; &nbsp; &#10004;|[Currency](/sayari-library/ontology/enumerated-types/#currency)|The currency of the monetary_value|
|`percentage`|&nbsp; &nbsp; &nbsp; &#10004;|`double`|The percentage of shares owned|
|`type`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|A string describing the type of shares (e.g., "Class B", "Protected cell shares")|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Status

The status of an entity. This attribute is used to indicate details such as registration, operating, or liquidation status as well as an entity's license or sole proprietorship status.

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`|&nbsp; &nbsp; &nbsp; &#10004;|[Company Status](/sayari-library/ontology/enumerated-types/#company-status)|The status, normalized to one of the status enums|
|`text`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|The raw status text|
|`context`|&nbsp; &nbsp; &nbsp; &#10004;|[Status Context](/sayari-library/ontology/enumerated-types/#status-context)|The type of status, such as license or partnership type|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Translated Name
<Warning>This attribute is deprecated.</Warning>

A name that has been translated to English

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`string`|The name, as text|
|`original`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|The original name|
|`context`|&nbsp; &nbsp; &nbsp; &#10004;|[Translation Context](/sayari-library/ontology/enumerated-types/#translation-context)|The type of translation|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|

## Weak Identifier

A non-unique ID number, like a partially redacted tax ID or a registry identifier, whose value and type may be shared by multiple entities

|Field|Optional|Type|Description|
| :--- | :--- | :--- | :--- |
|`value`| |`string`|The text value of the identifier|
|`type`| |[Weak Identifier Type](/sayari-library/ontology/enumerated-types/#weak-identifier-type)|The type of the identifier, including the country/jurisdiction that issued it|
|`date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|as-of date of attribute|
|`from_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|start date of attribute|
|`to_date`|&nbsp; &nbsp; &nbsp; &#10004;|`string`|end date of attribute|
|`extra`|&nbsp; &nbsp; &nbsp; &#10004;|[Map](/sayari-library/ontology/enumerated-types/#map)|extra information of attribute|
