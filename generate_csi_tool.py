"""
CSI Lookup Tool v2 — pure Excel 365 formulas, no Power Query, no macros.
Completely self-contained .xlsx, safe to share, no refresh step needed.
"""

import zipfile, io
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.worksheet.table import Table, TableStyleInfo

from postcode_coords import POSTCODE_COORDS

OUT = Path("/tmp/claude-0/-home-user-RPM-App/46ca97ba-bf60-527c-b9f7-3e13f6d92b04/scratchpad/CSI_Tool.xlsx")

NAVY  = "1B2A4A"
GOLD  = "C9A84C"
WHITE = "FFFFFF"
LGREY = "ECEFF1"
GREY  = "B0BEC5"

def med_border(colour=GOLD):
    s = Side(style="medium", color=colour)
    return Border(left=s, right=s, top=s, bottom=s)

def thin_border(colour="D0D0D0"):
    s = Side(style="thin", color=colour)
    return Border(left=s, right=s, top=s, bottom=s)

# ── SHEET 1: Data ─────────────────────────────────────────────────────────────
def build_data_sheet(wb):
    ws = wb.active
    ws.title = "Data"
    ws.sheet_properties.tabColor = NAVY
    ws.freeze_panes = "A3"

    # Row 1: instruction banner
    ws.merge_cells("A1:C1")
    c = ws.cell(1, 1,
        "PASTE YOUR DATA BELOW starting at row 3.  "
        "Columns: Postcode | Bedrooms | CSI_Value.  "
        "Formulas on the Tool sheet update instantly — no refresh needed.")
    c.font = Font(italic=True, color="555555", size=10)
    c.fill = PatternFill("solid", fgColor=LGREY)
    c.alignment = Alignment(vertical="center")
    ws.row_dimensions[1].height = 18

    # Row 2: headers
    for col, h in enumerate(["Postcode", "Bedrooms", "CSI_Value"], 1):
        cell = ws.cell(2, col, h)
        cell.font = Font(bold=True, color=WHITE, size=11)
        cell.fill = PatternFill("solid", fgColor=NAVY)
        cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[2].height = 22

    # Sample data rows 3+
    samples = [
        ("SE3", 3, 125000), ("SE3", 4, 175000), ("SE3", 3, 110000),
        ("SE3", 5, 220000), ("SW1", 5, 350000), ("SW1", 4, 280000),
        ("SW1", 5, 320000), ("SW1", 6, 480000), ("E1",  2, 85000),
        ("E1",  2, 92000),  ("E1",  3, 130000), ("N1",  3, 145000),
        ("N1",  4, 195000), ("M1",  2, 65000),  ("M1",  3, 90000),
        ("LS1", 2, 60000),  ("LS1", 3, 85000),  ("LS1", 4, 115000),
    ]
    for r, (pc, beds, csi) in enumerate(samples, 3):
        ws.cell(r, 1, pc.upper())
        ws.cell(r, 2, beds)
        c = ws.cell(r, 3, csi)
        c.number_format = '£#,##0'

    ws.column_dimensions["A"].width = 16
    ws.column_dimensions["B"].width = 14
    ws.column_dimensions["C"].width = 18

    last = len(samples) + 2
    tbl = Table(displayName="tblData", ref=f"A2:C{last}",
                tableStyleInfo=TableStyleInfo(name="TableStyleMedium2",
                                             showRowStripes=True))
    ws.add_table(tbl)
    return ws


# ── SHEET 2: PostcodeCoords (hidden) ─────────────────────────────────────────
def build_coords_sheet(wb):
    ws = wb.create_sheet("PostcodeCoords")
    ws.sheet_state = "hidden"

    for col, h in enumerate(["Postcode", "Lat", "Lon"], 1):
        ws.cell(1, col, h).font = Font(bold=True)

    for r, (pc, (lat, lon)) in enumerate(sorted(POSTCODE_COORDS.items()), 2):
        ws.cell(r, 1, pc)
        ws.cell(r, 2, lat)
        ws.cell(r, 3, lon)

    last = len(POSTCODE_COORDS) + 1
    tbl = Table(displayName="tblPostcodeCoords", ref=f"A1:C{last}",
                tableStyleInfo=TableStyleInfo(name="TableStyleLight1"))
    ws.add_table(tbl)
    return ws


# ── SHEET 3: Tool (call-handler UI) ──────────────────────────────────────────
def build_tool_sheet(wb):
    ws = wb.create_sheet("Tool")
    ws.sheet_properties.tabColor = GOLD
    ws.sheet_view.showGridLines = False

    ws.column_dimensions["A"].width = 3
    ws.column_dimensions["B"].width = 30
    ws.column_dimensions["C"].width = 34
    ws.column_dimensions["D"].width = 3

    for r in range(1, 26):
        ws.row_dimensions[r].height = 20
    ws.row_dimensions[3].height = 34
    ws.row_dimensions[8].height = 22
    ws.row_dimensions[9].height = 34
    ws.row_dimensions[10].height = 8
    ws.row_dimensions[11].height = 22
    ws.row_dimensions[12].height = 34
    ws.row_dimensions[14].height = 14
    ws.row_dimensions[15].height = 22
    ws.row_dimensions[16].height = 52
    ws.row_dimensions[18].height = 20
    ws.row_dimensions[20].height = 18

    # Header
    ws.merge_cells("B3:C3")
    t = ws.cell(3, 2, "  Contents Sum Insured  ·  Lookup Tool")
    t.font = Font(bold=True, size=15, color=WHITE)
    t.fill = PatternFill("solid", fgColor=NAVY)
    t.alignment = Alignment(horizontal="center", vertical="center")

    # Label helper
    def label(row, text):
        c = ws.cell(row, 2, text)
        c.font = Font(bold=True, color=NAVY, size=11)
        c.alignment = Alignment(vertical="center")

    # Input helper
    def inp(row):
        c = ws.cell(row, 2)
        c.fill = PatternFill("solid", fgColor="FFFDE7")
        c.font = Font(size=14, bold=True, color=NAVY)
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = med_border(GOLD)
        return c

    label(8, "Postcode Area  (e.g. SE3, SW1A, M1)")
    pc_cell = inp(9)
    pc_cell.value = "SE3"

    label(11, "Number of Bedrooms")
    bed_cell = inp(12)
    bed_cell.value = 3

    # Divider
    for col in [2, 3]:
        ws.cell(14, col).border = Border(
            bottom=Side(style="medium", color=GOLD))

    label(15, "Average Contents Sum Insured")
    ws.cell(15, 2).font = Font(bold=True, color="444444", size=10)

    # Result (merged B16:C16)
    ws.merge_cells("B16:C16")
    result = ws.cell(16, 2)
    result.fill = PatternFill("solid", fgColor=NAVY)
    result.font = Font(bold=True, size=26, color=GOLD)
    result.alignment = Alignment(horizontal="center", vertical="center")
    result.border = med_border(GOLD)
    result.number_format = '£#,##0'

    # Sample count (B18)
    ws.merge_cells("B18:C18")
    sample = ws.cell(18, 2)
    sample.font = Font(italic=True, color="555555", size=10)
    sample.alignment = Alignment(horizontal="center")

    # Status note (B20)
    ws.merge_cells("B20:C20")
    note = ws.cell(20, 2)
    note.font = Font(italic=True, color="888888", size=9)
    note.alignment = Alignment(horizontal="center", wrap_text=True)

    # Footer
    ws.merge_cells("B22:C22")
    f = ws.cell(22, 2, "For internal use only  ·  Data sourced from the Data sheet")
    f.font = Font(italic=True, size=8, color=GREY)
    f.alignment = Alignment(horizontal="center")

    # ── FORMULAS ──────────────────────────────────────────────────────────────
    #
    # Three-tier logic (all in LET so each sub-expression computed once):
    #
    #  Tier 1 — exact match: postcode + bedrooms both found in tblData
    #            → AVERAGEIFS(CSI, Postcode=pc, Bedrooms=beds)
    #
    #  Tier 2 — postcode found but not that bedroom count
    #            → (avg CSI for postcode / avg bedrooms for postcode) × beds
    #
    #  Tier 3 — postcode not in dataset at all
    #            → find geographically nearest postcode in tblData via
    #              Euclidean distance on lat/lon (sufficient for UK scale)
    #            → re-apply tiers 1 & 2 with that postcode
    #
    # AVERAGEIF(range, criteria, avg_range) syntax reminder:
    #   AVERAGEIF(criteria_range, criteria, average_range)

    result.value = (
        "=LET("
        "pc,UPPER(TRIM(B9)),"
        "beds,B12,"

        # tier 1
        "exact,IFERROR(AVERAGEIFS(tblData[CSI_Value],"
                                  "tblData[Postcode],pc,"
                                  "tblData[Bedrooms],beds),0),"

        # tier 2  — per-bedroom rate for the postcode × requested beds
        "pc_csi,IFERROR(AVERAGEIF(tblData[Postcode],pc,tblData[CSI_Value]),0),"
        "pc_beds,IFERROR(AVERAGEIF(tblData[Postcode],pc,tblData[Bedrooms]),0),"
        "tier2,IF(pc_beds>0,pc_csi/pc_beds*beds,0),"

        # tier 3 — geographic nearest neighbour
        "avail,IFERROR(UNIQUE(tblData[Postcode]),{\"\"}),"
        "tlat,IFERROR(XLOOKUP(pc,tblPostcodeCoords[Postcode],tblPostcodeCoords[Lat],NA()),NA()),"
        "tlon,IFERROR(XLOOKUP(pc,tblPostcodeCoords[Postcode],tblPostcodeCoords[Lon],NA()),NA()),"
        "alat,XLOOKUP(avail,tblPostcodeCoords[Postcode],tblPostcodeCoords[Lat],0),"
        "alon,XLOOKUP(avail,tblPostcodeCoords[Postcode],tblPostcodeCoords[Lon],0),"
        "dists,(alat-tlat)^2+(alon-tlon)^2,"
        "nearest,IFERROR(INDEX(avail,MATCH(MIN(dists),dists,0)),\"\"),"

        # re-apply tiers 1 & 2 for the nearest postcode
        "n_exact,IFERROR(AVERAGEIFS(tblData[CSI_Value],"
                                    "tblData[Postcode],nearest,"
                                    "tblData[Bedrooms],beds),0),"
        "n_csi,IFERROR(AVERAGEIF(tblData[Postcode],nearest,tblData[CSI_Value]),0),"
        "n_beds,IFERROR(AVERAGEIF(tblData[Postcode],nearest,tblData[Bedrooms]),0),"
        "near_val,IF(n_exact>0,n_exact,IF(n_beds>0,n_csi/n_beds*beds,0)),"

        "IF(exact>0,exact,IF(tier2>0,tier2,near_val))"
        ")"
    )

    # Sample count formula
    sample.value = (
        "=LET("
        "pc,UPPER(TRIM(B9)),"
        "beds,B12,"
        "cnt,IFERROR(COUNTIFS(tblData[Postcode],pc,tblData[Bedrooms],beds),0),"
        "IF(cnt>0,"
        "\"Based on \"&TEXT(cnt,\"#,##0\")&\" similar properties in your data\","
        "IF(IFERROR(COUNTIF(tblData[Postcode],pc),0)>0,"
        "\"No exact bedroom match — figure extrapolated from postcode average\","
        "\"Postcode not in dataset — figure taken from nearest geographic area\"))"
        ")"
    )

    # Status / note formula
    note.value = (
        "=LET("
        "pc,UPPER(TRIM(B9)),"
        "beds,B12,"
        "exact_cnt,IFERROR(COUNTIFS(tblData[Postcode],pc,tblData[Bedrooms],beds),0),"
        "pc_cnt,IFERROR(COUNTIF(tblData[Postcode],pc),0),"
        "avail,IFERROR(UNIQUE(tblData[Postcode]),{\"\"}),"
        "tlat,IFERROR(XLOOKUP(pc,tblPostcodeCoords[Postcode],tblPostcodeCoords[Lat],NA()),NA()),"
        "tlon,IFERROR(XLOOKUP(pc,tblPostcodeCoords[Postcode],tblPostcodeCoords[Lon],NA()),NA()),"
        "alat,XLOOKUP(avail,tblPostcodeCoords[Postcode],tblPostcodeCoords[Lat],0),"
        "alon,XLOOKUP(avail,tblPostcodeCoords[Postcode],tblPostcodeCoords[Lon],0),"
        "dists,(alat-tlat)^2+(alon-tlon)^2,"
        "nearest,IFERROR(INDEX(avail,MATCH(MIN(dists),dists,0)),\"\"),"
        "IF(exact_cnt>0,\"✓ Exact match\","
        "IF(pc_cnt>0,\"~ Extrapolated from postcode area average\","
        "IF(nearest<>\"\",\"⚠ Using nearest area: \"&nearest,\"⚠ No data available\")))"
        ")"
    )

    return ws


# ── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    wb = Workbook()

    print("Building Data sheet …")
    build_data_sheet(wb)

    print("Building PostcodeCoords sheet …")
    build_coords_sheet(wb)

    print("Building Tool sheet …")
    build_tool_sheet(wb)

    # Make Tool the active sheet on open
    wb.active = wb["Tool"]
    for sh in wb.worksheets:
        sh.sheet_view.tabSelected = (sh.title == "Tool")

    print(f"Saving {OUT} …")
    wb.save(OUT)
    print(f"Done → {OUT}  ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
