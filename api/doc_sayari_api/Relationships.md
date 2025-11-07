



## All relationship include

| Field     | Optional                      | Type      | Description                                              |
| :-------- | :---------------------------- | :-------- | :------------------------------------------------------- |
| from_date | &nbsp; &nbsp; &nbsp; &#10004; | `string`  | start date of a relationship                             |
| date      | &nbsp; &nbsp; &nbsp; &#10004; | `string`  | as-of date of a relationship                             |
| to_date   | &nbsp; &nbsp; &nbsp; &#10004; | `string`  | end date of a relationship                               |
| former    |                               | `boolean` | `true` indicates that this relationship no longer exists |


<br></br>
## Associate Of
<Warning>This relationship is deprecated.</Warning>

Deprecated and converted to linked_to
- **Reverse Name**: `has_associate`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Auditor Of

The source entity is reported to be the auditor of a company
- **Reverse Name**: `has_auditor`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Awarder Of

The source entity is the issuer of a public procurement contract

- **Reverse Name**: `awarded_by`

**Between**
- [government_organization](/sayari-library/ontology/entities/#government_organization) -> [contract](/sayari-library/ontology/entities/#contract)
- [company](/sayari-library/ontology/entities/#company) -> [contract](/sayari-library/ontology/entities/#contract)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Beneficial Owner Of

The source entity is reported to be the indirect or beneficial owner of a company. Signifies ownership.
- **Reverse Name**: `has_beneficial_owner`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)
- [shares](/sayari-library/ontology/attributes/#shares)

<br></br>
## Branch Of

The source entity is reported to be a branch of a company
- **Reverse Name**: `has_branch`

**Between**
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)

<br></br>
## Carrier Of

The entity in charge of the transportation of goods
- **Reverse Name**: `has_carrier`

**Between**
- [company](/sayari-library/ontology/entities/#company) -> [shipment](/sayari-library/ontology/entities/#shipment)

**Attributes**
- [business_purpose](/sayari-library/ontology/attributes/#business-purpose)

<br></br>
## Client Of
<Warning>This relationship is deprecated.</Warning>

Deprecated and converted to linked_to
- **Reverse Name**: `has_client`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)
- [person](/sayari-library/ontology/entities/#person) -> [person](/sayari-library/ontology/entities/#person)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Credits To

Transaction credits to entity
- **Reverse Name**: `credited_by`

**Between**
- [transaction](/sayari-library/ontology/entities/#transaction) -> [account](/sayari-library/ontology/entities/#account)
- [transaction](/sayari-library/ontology/entities/#transaction) -> [person](/sayari-library/ontology/entities/#person)
- [transaction](/sayari-library/ontology/entities/#transaction) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)

<br></br>
## Debits From

Transaction debits from an entity
- **Reverse Name**: `debited_by`

**Between**
- [transaction](/sayari-library/ontology/entities/#transaction) -> [account](/sayari-library/ontology/entities/#account)
- [transaction](/sayari-library/ontology/entities/#transaction) -> [person](/sayari-library/ontology/entities/#person)
- [transaction](/sayari-library/ontology/entities/#transaction) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)

<br></br>
## Director Of

The source entity is reported to be a director of a company
- **Reverse Name**: `has_director`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Employee Of

The source entity is an employee of a company
- **Reverse Name**: `has_employee`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Executive Of
<Warning>This relationship is deprecated.</Warning>

Deprecated and converted to officer_of
- **Reverse Name**: `has_executive`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Family Of

The source entity is a family member of another entity
- **Reverse Name**: `family_of`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [person](/sayari-library/ontology/entities/#person)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Founder Of

The source entity is reported to be the founder of a company
- **Reverse Name**: `has_founder`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Generic
<Warning>This relationship is deprecated.</Warning>

A placeholder relationship. Rarely used.
- **Reverse Name**: `generic`

**Between**
- `any entity` -> `any other entity`

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [address](/sayari-library/ontology/attributes/#address)
- [business_purpose](/sayari-library/ontology/attributes/#business-purpose)
- [company_type](/sayari-library/ontology/attributes/#company-type)
- [contact](/sayari-library/ontology/attributes/#contact)
- [country](/sayari-library/ontology/attributes/#country)
- [date_of_birth](/sayari-library/ontology/attributes/#date-of-birth)
- [finances](/sayari-library/ontology/attributes/#finances)
- [financials](/sayari-library/ontology/attributes/#financials)
- [gender](/sayari-library/ontology/attributes/#gender)
- [generic](/sayari-library/ontology/attributes/#generic)
- [identifier](/sayari-library/ontology/attributes/#identifier)
- [measurement](/sayari-library/ontology/attributes/#measurement)
- [monetary_value](/sayari-library/ontology/attributes/#monetary-value)
- [name](/sayari-library/ontology/attributes/#name)
- [person_status](/sayari-library/ontology/attributes/#person-status)
- [position](/sayari-library/ontology/attributes/#position)
- [risk_intelligence](/sayari-library/ontology/attributes/#risk-intelligence)
- [shares](/sayari-library/ontology/attributes/#shares)
- [status](/sayari-library/ontology/attributes/#status)
- [translated_name](/sayari-library/ontology/attributes/#translated-name)
- [weak_identifier](/sayari-library/ontology/attributes/#weak-identifier)

<br></br>
## Issuer Of

The source entity is the issuer of a security
- **Reverse Name**: `has_issuer`

**Between**
- [company](/sayari-library/ontology/entities/#company) -> [security](/sayari-library/ontology/entities/#security)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)
- [shares](/sayari-library/ontology/attributes/#shares)

<br></br>
## Judicial Representative Of
<Warning>This relationship is deprecated.</Warning>

Deprecated and converted to legal_representative_of
- **Reverse Name**: `has_judicial_representative`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Judidical Representative Of
<Warning>This relationship is deprecated.</Warning>

Deprecated and converted to legal_representative_of
- **Reverse Name**: `has_judicial_representative`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Lawyer In

The source entity is a lawyer connected to a legal matter in a professional capacity. Source can be a person or company.
- **Reverse Name**: `has_lawyer`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [legal_matter](/sayari-library/ontology/entities/#legal_matter)
- [company](/sayari-library/ontology/entities/#company) -> [legal_matter](/sayari-library/ontology/entities/#legal_matter)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Lawyer Of

The source entity is working in a professional capacity as a lawyer for another entity. Either entity can be a person or company.
- **Reverse Name**: `has_lawyer`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)
- [person](/sayari-library/ontology/entities/#person) -> [person](/sayari-library/ontology/entities/#person)
- [company](/sayari-library/ontology/entities/#company) -> [person](/sayari-library/ontology/entities/#person)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Legal Predecessor Of

The source entity, a company, created or otherwise gave rise to another company
- **Reverse Name**: `has_legal_predecessor`

**Between**
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Legal Representative Of

The source entity is reported to be (or to have acted as) a legal representative of another entity
- **Reverse Name**: `has_legal_representative`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)
- [person](/sayari-library/ontology/entities/#person) -> [person](/sayari-library/ontology/entities/#person)
- [company](/sayari-library/ontology/entities/#company) -> [person](/sayari-library/ontology/entities/#person)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Legal Successor Of

The source entity inherited the legal rights and obligations (known as the legal personality) of a company
- **Reverse Name**: `has_legal_successor`

**Between**
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Linked To

The source entity is connected to another entity via a type of relationship that does not exist in the Graph ontology
- **Reverse Name**: `linked_to`

**Between**
- `any entity` -> `any other entity`

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Liquidator Of

The source entity is reported to be a liquidator of a company
- **Reverse Name**: `has_liquidator`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Manager Of

The source entity is reported to be a manager of a company
- **Reverse Name**: `has_manager`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Member Of The Board Of

The source entity is part of a corporate or statutory body exercising oversight or control
- **Reverse Name**: `has_member_of_the_board`

**Between**
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Notify Party Of

The source entity is the entity to be notified when a shipment arrives at its destination
- **Reverse Name**: `has_notify_party`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [shipment](/sayari-library/ontology/entities/#shipment)
- [company](/sayari-library/ontology/entities/#company) -> [shipment](/sayari-library/ontology/entities/#shipment)

**Attributes**
- [business_purpose](/sayari-library/ontology/attributes/#business-purpose)

<br></br>
## Officer Of

The source entity is reported to be a CEO, president, treasurer, etc. of a company
- **Reverse Name**: `has_officer`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Owner Of

The source entity is a direct owner of a non-company entity (e.g., trade name, security, intellectual property, account, etc.). Signifies ownership.
- **Reverse Name**: `has_owner`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [property](/sayari-library/ontology/entities/#property)
- [company](/sayari-library/ontology/entities/#company) -> [property](/sayari-library/ontology/entities/#property)
- [company](/sayari-library/ontology/entities/#company) -> [aircraft](/sayari-library/ontology/entities/#aircraft)
- [company](/sayari-library/ontology/entities/#company) -> [vessel](/sayari-library/ontology/entities/#vessel)
- [person](/sayari-library/ontology/entities/#person) -> [vessel](/sayari-library/ontology/entities/#vessel)
- [person](/sayari-library/ontology/entities/#person) -> [aircraft](/sayari-library/ontology/entities/#aircraft)
- [person](/sayari-library/ontology/entities/#person) -> [tradename](/sayari-library/ontology/entities/#tradename)
- [company](/sayari-library/ontology/entities/#company) -> [tradename](/sayari-library/ontology/entities/#tradename)
- [company](/sayari-library/ontology/entities/#company) -> [intellectual_property](/sayari-library/ontology/entities/#intellectual_property)
- [person](/sayari-library/ontology/entities/#person) -> [intellectual_property](/sayari-library/ontology/entities/#intellectual_property)
- [company](/sayari-library/ontology/entities/#company) -> [security](/sayari-library/ontology/entities/#security)
- [company](/sayari-library/ontology/entities/#company) -> [account](/sayari-library/ontology/entities/#account)
- [person](/sayari-library/ontology/entities/#person) -> [account](/sayari-library/ontology/entities/#account)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)

<br></br>
## Partner Of

The source entity is reported to be a business partner. Signifies ownership.
- **Reverse Name**: `has_partner`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Party To

The source entity is a litigant in a legal matter
- **Reverse Name**: `has_party`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [legal_matter](/sayari-library/ontology/entities/#legal_matter)
- [company](/sayari-library/ontology/entities/#company) -> [legal_matter](/sayari-library/ontology/entities/#legal_matter)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Procures From

The source entity procures goods and/or services from another entity

- **Reverse Name**: `contracted_by`

**Between**
- [government_organization](/sayari-library/ontology/entities/#government_organization) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)
- [government_organization](/sayari-library/ontology/entities/#government_organization) -> [person](/sayari-library/ontology/entities/#person)
- [company](/sayari-library/ontology/entities/#company) -> [person](/sayari-library/ontology/entities/#person)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Receiver Of

The source entity is the receiver of a shipment
- **Reverse Name**: `received_by`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [shipment](/sayari-library/ontology/entities/#shipment)
- [company](/sayari-library/ontology/entities/#company) -> [shipment](/sayari-library/ontology/entities/#shipment)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [business_purpose](/sayari-library/ontology/attributes/#business-purpose)

<br></br>
## Recipient Of

The source entity is the recipient of a public procurement contract

- **Reverse Name**: `awarded_to`

**Between**
- [company](/sayari-library/ontology/entities/#company) -> [contract](/sayari-library/ontology/entities/#contract)
- [person](/sayari-library/ontology/entities/#person) -> [contract](/sayari-library/ontology/entities/#contract)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Registered Agent Of

The source entity is reported to be the registered agent, corporate secretary, or similar agent of a company in a jurisdiction in which that role is more clerical than an officer or director role.
- **Reverse Name**: `has_registered_agent`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Secretary Of
<Warning>This relationship is deprecated.</Warning>

Deprecated and converted to officer_of (in jurisdictions where the secretary is a fairly important control figure) or registered_agent_of (in jurisdictions where the secretary is more of a clerical role)
- **Reverse Name**: `has_secretary`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Shareholder Of

The source entity is a direct owner of a company. Signifies ownership.
- **Reverse Name**: `has_shareholder`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)
- [shares](/sayari-library/ontology/attributes/#shares)

<br></br>
## Shipper Of

The source entity is the shipper or initiator of a shipment
- **Reverse Name**: `shipped_by`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [shipment](/sayari-library/ontology/entities/#shipment)
- [company](/sayari-library/ontology/entities/#company) -> [shipment](/sayari-library/ontology/entities/#shipment)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [business_purpose](/sayari-library/ontology/attributes/#business-purpose)

<br></br>
## Ships To

The source entity has shipped one or more shipments to another entity.
- **Reverse Name**: `receives_from`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [person](/sayari-library/ontology/entities/#person)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)
- [person](/sayari-library/ontology/entities/#person) -> [person](/sayari-library/ontology/entities/#person)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [business_purpose](/sayari-library/ontology/attributes/#business-purpose)

<br></br>
## Sole Proprietor Of
<Warning>This relationship is deprecated.</Warning>

Deprecated and converted to shareholder_of
- **Reverse Name**: `has_sole_proprietor`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Subsidiary Of

The source entity is reported to be a subsidiary of, or indirectly owned by (without direct ownership details provided), a company. Signifies ownership.
- **Reverse Name**: `has_subsidiary`

**Between**
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [shares](/sayari-library/ontology/attributes/#shares)

<br></br>
## Supervisor Of

The source entity is reported to be the supervisor of a company. Mainly used in China and Taiwan.
- **Reverse Name**: `has_supervisor`

**Between**
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
- [position](/sayari-library/ontology/attributes/#position)

<br></br>
## Transfers To

The source entity transfers to the destination entity
- **Reverse Name**: `transfers_from`

**Between**
- [account](/sayari-library/ontology/entities/#account) -> [account](/sayari-library/ontology/entities/#account)
- [account](/sayari-library/ontology/entities/#account) -> [person](/sayari-library/ontology/entities/#person)
- [person](/sayari-library/ontology/entities/#person) -> [account](/sayari-library/ontology/entities/#account)
- [account](/sayari-library/ontology/entities/#account) -> [company](/sayari-library/ontology/entities/#company)
- [company](/sayari-library/ontology/entities/#company) -> [account](/sayari-library/ontology/entities/#account)
- [company](/sayari-library/ontology/entities/#company) -> [company](/sayari-library/ontology/entities/#company)
- [person](/sayari-library/ontology/entities/#person) -> [person](/sayari-library/ontology/entities/#person)
- [company](/sayari-library/ontology/entities/#company) -> [person](/sayari-library/ontology/entities/#person)
- [person](/sayari-library/ontology/entities/#person) -> [company](/sayari-library/ontology/entities/#company)

**Attributes**
- [additional_information](/sayari-library/ontology/attributes/#additional-information)
