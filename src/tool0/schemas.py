"""
Pydantic schemas for Business Request Parser (Tool 0)
"""
from pydantic import BaseModel, Field, field_validator
from datetime import datetime


class ProjectMetadata(BaseModel):
    """Metadata about the business project request."""

    project_name: str = Field(
        description="Name of the project"
    )
    sponsor: str = Field(
        description="Name of the project sponsor"
    )
    submitted_at: str = Field(
        description="Date when the request was submitted, in ISO 8601 format (YYYY-MM-DD)"
    )
    extra: dict[str, str] = Field(
        default_factory=dict,
        description="Additional metadata fields as key-value pairs"
    )

    @field_validator('submitted_at')
    @classmethod
    def validate_iso_date(cls, v: str) -> str:
        """Validate that date is in ISO 8601 format."""
        try:
            datetime.fromisoformat(v)
            return v
        except ValueError:
            raise ValueError(f"Date must be in ISO 8601 format (YYYY-MM-DD), got: {v}")


class BusinessRequest(BaseModel):
    """Structured representation of a parsed business request document.

    This schema captures all essential information from a standardized
    business request document, including project metadata, goals, scope,
    and required deliverables.
    """

    project_metadata: ProjectMetadata = Field(
        description="Project metadata including name, sponsor, and submission date"
    )

    goal: str = Field(
        default="unknown",
        description="Main goal or objective of the project"
    )

    scope_in: str = Field(
        default="unknown",
        description="What is included in the project scope"
    )

    scope_out: str = Field(
        default="unknown",
        description="What is explicitly excluded from the project scope"
    )

    entities: list[str] = Field(
        default_factory=list,
        description="Key business entities involved in the project (e.g., customers, products, suppliers)"
    )

    metrics: list[str] = Field(
        default_factory=list,
        description="Key metrics or KPIs to be tracked"
    )

    sources: list[str] = Field(
        default_factory=list,
        description="Expected data sources for the project"
    )

    constraints: list[str] = Field(
        default_factory=list,
        description="Constraints, limitations, or special requirements"
    )

    deliverables: list[str] = Field(
        default_factory=list,
        description="Required deliverables or artifacts from the project"
    )
