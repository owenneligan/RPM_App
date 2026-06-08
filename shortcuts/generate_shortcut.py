#!/usr/bin/env python3
"""
Generates JustPark_Calendar.shortcut — a binary plist Shortcuts file.

The shortcut parses a JustPark booking SMS (e.g. "New booking for your space:
8th Jun 08:30 - 14:30. Vehicle: ...") and creates a calendar event titled
"Car on drive 💰🚗" with the correct start and end times.

Usage:
    python3 generate_shortcut.py
Output:
    JustPark_Calendar.shortcut (in the same directory)
"""

import plistlib
import uuid
import os

def new_uuid():
    return str(uuid.uuid4()).upper()

# Pre-generate UUIDs for actions referenced by later actions
detect_dates_uuid = new_uuid()
get_first_uuid = new_uuid()
get_last_uuid = new_uuid()


def shortcut_input():
    """Reference the text passed into this shortcut from the automation."""
    return {
        "Value": {"Type": "ExtensionInput"},
        "WFSerializationType": "WFTextTokenAttachment",
    }


def magic_var(action_uuid, output_name):
    """Reference the output of a previous action by UUID."""
    return {
        "Value": {
            "OutputUUID": action_uuid,
            "Type": "ActionOutput",
            "OutputName": output_name,
        },
        "WFSerializationType": "WFTextTokenAttachment",
    }


def named_var(var_name):
    """Reference a named variable."""
    return {
        "Value": {"Type": "Variable", "VariableName": var_name},
        "WFSerializationType": "WFTextTokenAttachment",
    }


actions = [
    # 1. IF message contains "New booking" (filters out JustPark reminder texts)
    {
        "WFWorkflowActionIdentifier": "is.workflow.actions.conditional",
        "WFWorkflowActionParameters": {
            "UUID": new_uuid(),
            "WFControlFlowMode": 0,  # 0 = start of if
            "WFInput": {
                "Type": "Variable",
                "Variable": shortcut_input(),
            },
            "WFCondition": 99,  # 99 = contains
            "WFConditionalActionString": "New booking",
        },
    },
    # 2. Get Dates from Input — extracts start and end date/times from the SMS text
    {
        "WFWorkflowActionIdentifier": "is.workflow.actions.detect.date",
        "WFWorkflowActionParameters": {
            "UUID": detect_dates_uuid,
            "WFInput": shortcut_input(),
        },
    },
    # 3. Get the first date (booking start time)
    {
        "WFWorkflowActionIdentifier": "is.workflow.actions.getitemfromlist",
        "WFWorkflowActionParameters": {
            "UUID": get_first_uuid,
            "WFItemSpecifier": "First Item",
            "WFInput": magic_var(detect_dates_uuid, "Dates"),
        },
    },
    # 4. Save start time to a named variable
    {
        "WFWorkflowActionIdentifier": "is.workflow.actions.setvariable",
        "WFWorkflowActionParameters": {
            "UUID": new_uuid(),
            "WFVariableName": "StartDate",
            "WFInput": magic_var(get_first_uuid, "Item from List"),
        },
    },
    # 5. Get the last date (booking end time)
    {
        "WFWorkflowActionIdentifier": "is.workflow.actions.getitemfromlist",
        "WFWorkflowActionParameters": {
            "UUID": get_last_uuid,
            "WFItemSpecifier": "Last Item",
            "WFInput": magic_var(detect_dates_uuid, "Dates"),
        },
    },
    # 6. Save end time to a named variable
    {
        "WFWorkflowActionIdentifier": "is.workflow.actions.setvariable",
        "WFWorkflowActionParameters": {
            "UUID": new_uuid(),
            "WFVariableName": "EndDate",
            "WFInput": magic_var(get_last_uuid, "Item from List"),
        },
    },
    # 7. Create the calendar event
    {
        "WFWorkflowActionIdentifier": "is.workflow.actions.addnewevent",
        "WFWorkflowActionParameters": {
            "UUID": new_uuid(),
            "WFCalendarItemTitle": "Car on drive \U0001f4b0\U0001f697",
            "WFCalendarItemStartDate": named_var("StartDate"),
            "WFCalendarItemEndDate": named_var("EndDate"),
            "WFCalendarItemAllDay": False,
        },
    },
    # 8. End IF
    {
        "WFWorkflowActionIdentifier": "is.workflow.actions.conditional",
        "WFWorkflowActionParameters": {
            "UUID": new_uuid(),
            "WFControlFlowMode": 2,  # 2 = end if
        },
    },
]

shortcut_data = {
    "WFWorkflowActions": actions,
    "WFWorkflowClientVersion": "1140.14",
    "WFWorkflowHasShortcutInputVariables": False,
    "WFWorkflowIcon": {
        "WFWorkflowIconGlyphNumber": 59511,   # calendar glyph
        "WFWorkflowIconStartColor": -2071790081,
    },
    "WFWorkflowImportQuestions": [],
    "WFWorkflowInputContentItemClasses": ["WFStringContentItem"],
    "WFWorkflowMinimumClientVersion": 900,
    "WFWorkflowMinimumClientVersionString": "900",
    "WFWorkflowName": "JustPark Calendar",
    "WFWorkflowOutputContentItemClasses": [],
    "WFWorkflowTypes": [],
}

output_path = os.path.join(os.path.dirname(__file__), "JustPark_Calendar.shortcut")
with open(output_path, "wb") as f:
    plistlib.dump(shortcut_data, f, fmt=plistlib.FMT_BINARY)

print(f"Created: {output_path}")
