import json

services_data = [
    # Home & Laundry (6 services)
    {
        "sku": "SVC-HL-001",
        "slug": "laundry-reset",
        "name": "Laundry Reset",
        "category": "home-laundry",
        "shortDescription": "Bring a defined amount of household laundry back to a ready state.",
        "detailedDescription": "We will wash, dry, fold or hang, and put away household laundry so you return to an empty hamper and clothes where they belong.",
        "inclusions": [
            "Washing and drying one defined load",
            "Folding or hanging as appropriate",
            "Returning items to their usual storage locations",
            "Brief orientation to understand household systems"
        ],
        "exclusions": [
            "Dry-clean-only items",
            "Delicate hand-wash items",
            "Specialty stain removal or treatments"
        ],
        "customerPrerequisites": [
            "Household laundry detergent and products",
            "Access to washer and dryer",
            "Brief orientation on where items belong"
        ],
        "serviceProcess": "This is a pilot service. Request through the early access form. Parentive will confirm availability and schedule your visit.",
        "importantNotes": [
            "One standard load per service (approximately 8-10 lbs)",
            "Laundry should be sorted and ready",
            "A few minutes of orientation helps your Helper work independently"
        ],
        "relatedServices": ["fold-and-put-away", "bed-reset"],
        "requiresReview": False,
        "eligibleAddOns": ["pre-ordered-pickup"],
        "pricingModel": "fixed-outcome",
        "displayPrice": None,
        "priceStatus": "pending-validation",
        "availabilityStatus": "available",
        "isAddOnEligible": True,
        "isFeatured": True,
        "isMvpPriority": True,
        "seoTitle": "Laundry Reset | Parentive",
        "seoDescription": "Let Parentive handle your household laundry. We wash, dry, fold and put away so you return to an empty hamper.",
        "estimatedActiveMinutes": 90,
        "estimatedElapsedMinutes": 120
    }
]

# Output catalog items count
print(f"Generated data for {len(services_data)} services")
