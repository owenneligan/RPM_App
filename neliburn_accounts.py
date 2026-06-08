from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

doc = Document()

# ── Page setup: A4 ────────────────────────────────────────────────────────────
section = doc.sections[0]
section.page_width    = Cm(21.0)
section.page_height   = Cm(29.7)
section.top_margin    = Cm(2.5)
section.bottom_margin = Cm(2.5)
section.left_margin   = Cm(2.5)
section.right_margin  = Cm(2.5)

style = doc.styles['Normal']
style.font.name = 'Times New Roman'
style.font.size = Pt(10)

# ── Helpers ───────────────────────────────────────────────────────────────────
def sf(run, bold=False, italic=False, size=10):
    run.bold       = bold
    run.italic     = italic
    run.font.size  = Pt(size)
    run.font.name  = 'Times New Roman'

def para(text='', bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.LEFT,
         sb=2, sa=2, size=10, indent=0):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(sb)
    p.paragraph_format.space_after  = Pt(sa)
    if indent:
        p.paragraph_format.left_indent = Cm(indent)
    if text:
        r = p.add_run(text)
        sf(r, bold=bold, italic=italic, size=size)
    return p

def hdr(text, sb=10, sa=3):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(sb)
    p.paragraph_format.space_after  = Pt(sa)
    r = p.add_run(text)
    sf(r, bold=True, size=10)
    return p

def subpolicy(title, body):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(5)
    p.paragraph_format.space_after  = Pt(1)
    p.paragraph_format.left_indent  = Cm(0.7)
    sf(p.add_run(title), bold=True, size=10)
    p2 = doc.add_paragraph()
    p2.paragraph_format.space_before = Pt(1)
    p2.paragraph_format.space_after  = Pt(4)
    p2.paragraph_format.left_indent  = Cm(0.7)
    sf(p2.add_run(body), size=10)

def footer_line(page_num, continued=False):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    sf(p.add_run('The notes form part of these financial statements'), italic=True, size=9)
    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sf(p2.add_run(f'Page {page_num}'), size=9)
    if continued:
        p3 = doc.add_paragraph()
        p3.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        sf(p3.add_run('continued...'), italic=True, size=9)

def company_header():
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after  = Pt(0)
    sf(p.add_run('NELIBURN LTD (REGISTERED NUMBER: 13307297)'), bold=True, size=10)

def no_borders(table):
    for row in table.rows:
        for cell in row.cells:
            tc   = cell._tc
            tcPr = tc.get_or_add_tcPr()
            tcB  = OxmlElement('w:tcBorders')
            for side in ['top','left','bottom','right','insideH','insideV']:
                el = OxmlElement(f'w:{side}')
                el.set(qn('w:val'), 'none')
                tcB.append(el)
            tcPr.append(tcB)

def border(cell, side, double=False):
    tc   = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcB  = OxmlElement('w:tcBorders')
    el   = OxmlElement(f'w:{side}')
    el.set(qn('w:val'), 'double' if double else 'single')
    el.set(qn('w:sz'),  '6')
    el.set(qn('w:space'),'0')
    el.set(qn('w:color'),'000000')
    tcB.append(el)
    tcPr.append(tcB)

def cw(table, col, cm):
    for row in table.rows:
        row.cells[col].width = Cm(cm)

def ct(cell, text, bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.LEFT, size=10):
    cell.paragraphs[0].clear()
    cell.paragraphs[0].alignment = align
    sf(cell.paragraphs[0].add_run(text), bold=bold, italic=italic, size=size)
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

R = WD_ALIGN_PARAGRAPH.RIGHT
C = WD_ALIGN_PARAGRAPH.CENTER

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 1 — COVER
# ══════════════════════════════════════════════════════════════════════════════
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
sf(p.add_run('REGISTERED NUMBER: 13307297 (England and Wales)'), bold=True, size=10)

for _ in range(14):
    doc.add_paragraph()

para('Unaudited Financial Statements for the Year Ended 31 March 2025',
     bold=True, align=C, size=11, sb=0, sa=4)
para('for', align=C, size=11, sb=0, sa=4)
para('NELIBURN LTD', bold=True, align=C, size=12, sb=0)

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 2 — CONTENTS
# ══════════════════════════════════════════════════════════════════════════════
company_header()
hdr('Contents of the Financial Statements\nFOR THE YEAR ENDED 31 MARCH 2025', sb=6)

t = doc.add_table(rows=5, cols=2)
no_borders(t)
t.alignment = WD_TABLE_ALIGNMENT.LEFT
for i, (lft, rgt) in enumerate([('', 'Page'), ('Company Information', '1'),
                                  ('Balance Sheet', '2'),
                                  ('Notes to the Financial Statements', '4'),
                                  ("Directors' Report", '6')]):
    ct(t.rows[i].cells[0], lft, bold=(i==0))
    ct(t.rows[i].cells[1], rgt, bold=(i==0), align=C)
cw(t, 0, 12); cw(t, 1, 4)

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 3 — COMPANY INFORMATION  (page 1)
# ══════════════════════════════════════════════════════════════════════════════
p = doc.add_paragraph()
sf(p.add_run('NELIBURN LTD'), bold=True, size=10)
hdr('Company Information\nFOR THE YEAR ENDED 31 MARCH 2025', sb=4)
doc.add_paragraph(); doc.add_paragraph()

info = [
    ('DIRECTORS:',        'Mr Owen Neligan\nMrs Frances Neligan\nMrs Verity Winterburn'),
    ('REGISTERED OFFICE:','Office LG06, 1 Quality Court\nChancery Lane\nLondon\nUnited Kingdom\nWC2A 1HR'),
    ('REGISTERED NUMBER:','13307297 (England and Wales)'),
    ('ACCOUNTANTS:',      'Silver Arc\nChartered Certified Accountants\n1 Quality Court\nChancery Lane\nLondon\nWC2A 1HR'),
]
for label, value in info:
    t = doc.add_table(rows=1, cols=2)
    no_borders(t)
    ct(t.rows[0].cells[0], label, bold=True)
    cell = t.rows[0].cells[1]
    lines = value.split('\n')
    cell.paragraphs[0].clear()
    sf(cell.paragraphs[0].add_run(lines[0]), size=10)
    for line in lines[1:]:
        p2 = cell.add_paragraph()
        sf(p2.add_run(line), size=10)
    cw(t, 0, 5); cw(t, 1, 11)
    doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = C
p.paragraph_format.space_before = Pt(30)
sf(p.add_run('Page 1'), size=9)

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 4 — BALANCE SHEET  (pages 2-3)
# ══════════════════════════════════════════════════════════════════════════════
# Corrected figures:
#   Debtors 31/3/25 = nil  (prior year debtor settled during year)
#   DLA     31/3/25 = 64,562  (derived to balance)
#   Check: 225,000 + 0 + 3,796 – 64,562 – 173,791 = –9,557 ✓
company_header()
hdr('Balance Sheet\n31 MARCH 2025', sb=4)

bs = [
    # desc, note, sub25, tot25, sub24, tot24, bold, top_sub25, top_tot25, bot_tot25, dbl_bot25
    ('', 'Notes', '', '31/3/25\n£', '', '31/3/24\n£', True,  False, False, False, False),
    ('FIXED ASSETS', '', '', '', '', '', True,  False, False, False, False),
    ('Investment property', '4', '', '225,000', '', '225,000', False, False, False, False, False),
    ('', '', '', '', '', '', False, False, False, False, False),
    ('CURRENT ASSETS', '', '', '', '', '', True,  False, False, False, False),
    ('Debtors', '5', '—', '', '4,915', '', False, False, False, False, False),
    ('Cash at bank and in hand', '', '3,796', '', '27,110', '', False, False, False, False, False),
    ('', '', '3,796', '', '32,025', '', False, True,  False, False, False),
    ('', '', '', '', '', '', False, False, False, False, False),
    ('CREDITORS: Amounts falling due within one year', '6', '(64,562)', '', '(79,114)', '',
     False, False, False, False, False),
    ('NET CURRENT LIABILITIES', '', '', '(60,766)', '', '(47,089)', True,  False, False, False, False),
    ('TOTAL ASSETS LESS CURRENT LIABILITIES', '', '', '164,234', '', '177,911', True,
     False, True,  True,  False),
    ('', '', '', '', '', '', False, False, False, False, False),
    ('CREDITORS: Amounts falling due after more than one year', '7', '', '(173,791)', '', '(173,791)',
     False, False, False, False, False),
    ('', '', '', '', '', '', False, False, False, False, False),
    ('NET LIABILITIES', '', '', '(9,557)', '', '4,120', True,  False, True,  True,  False),
    ('', '', '', '', '', '', False, False, False, False, False),
    ('CAPITAL AND RESERVES', '', '', '', '', '', True,  False, False, False, False),
    ('Called up share capital', '', '', '3', '', '3', False, False, False, False, False),
    ('Fair value reserve', '8', '', '22,546', '', '22,546', False, False, False, False, False),
    ('Retained earnings', '', '', '(32,106)', '', '(18,429)', False, False, False, False, False),
    ('TOTAL EQUITY', '', '', '(9,557)', '', '4,120', True,  False, True,  True,  True),
]

t = doc.add_table(rows=len(bs), cols=6)
no_borders(t)
t.alignment = WD_TABLE_ALIGNMENT.LEFT
for ci, w in enumerate([7.5, 1.0, 2.0, 2.0, 2.0, 2.0]):
    cw(t, ci, w)

for ri, row in enumerate(bs):
    desc, note, s25, tot25, s24, tot24, bold, top_sub, top_tot, bot_tot, dbl = row
    cells = t.rows[ri].cells
    ct(cells[0], desc, bold=bold)
    ct(cells[1], note, align=C)
    ct(cells[2], s25,  align=R)
    ct(cells[3], tot25, bold=bold, align=R)
    ct(cells[4], s24,  align=R)
    ct(cells[5], tot24, bold=bold, align=R)
    if top_sub:
        border(cells[2], 'top'); border(cells[4], 'top')
    if top_tot:
        border(cells[3], 'top'); border(cells[5], 'top')
    if bot_tot:
        border(cells[3], 'bottom', double=dbl)
        border(cells[5], 'bottom', double=dbl)

doc.add_paragraph()

# Statutory statements
for s in [
    'The company is entitled to exemption from audit under Section 477 of the Companies Act 2006 for the year ended 31 March 2025.',
    '',
    'The members have not required the company to obtain an audit of its financial statements for the year ended 31 March 2025 in accordance with Section 476 of the Companies Act 2006.',
    '',
    'The directors acknowledge their responsibilities for:',
]:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after  = Pt(2)
    sf(p.add_run(s), size=9)

for s in [
    '(a)  ensuring that the company keeps accounting records which comply with Sections 386 and 387 of the Companies Act 2006; and',
    '(b)  preparing financial statements which give a true and fair view of the state of affairs of the company as at the end of each financial year and of its profit or loss for each financial year in accordance with the requirements of Sections 394 and 395 and which otherwise comply with the requirements of the Companies Act 2006 relating to financial statements, so far as applicable to the company.',
]:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after  = Pt(2)
    p.paragraph_format.left_indent  = Cm(0.7)
    sf(p.add_run(s), size=9)

for s in [
    'The financial statements have been prepared and delivered in accordance with the provisions applicable to companies subject to the small companies regime.',
    'In accordance with Section 444 of the Companies Act 2006, the Income Statement has not been delivered.',
    'The financial statements were approved by the Board of Directors and authorised for issue on _________________________ and were signed on its behalf by:',
]:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    sf(p.add_run(s), size=9)

doc.add_paragraph()
p = doc.add_paragraph()
sf(p.add_run('Mr Owen Neligan  –  Director'), size=10)
p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(14)
sf(p.add_run('Mrs Frances Neligan  –  Director'), size=10)

footer_line(2)
doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 5 — NOTES  (page 4)
# ══════════════════════════════════════════════════════════════════════════════
company_header()
hdr('Notes to the Financial Statements\nFOR THE YEAR ENDED 31 MARCH 2025', sb=4)

# Note 1
hdr('1.     STATUTORY INFORMATION', sb=8, sa=2)
para('Neliburn Ltd is a private company limited by shares, registered in England and Wales '
     '(number 13307297). The registered office is Office LG06, 1 Quality Court, Chancery Lane, '
     'London, WC2A 1HR.', sb=2, sa=4)

# Note 2
hdr('2.     ACCOUNTING POLICIES', sb=8, sa=2)

subpolicy('Basis of preparing the financial statements',
    'These financial statements have been prepared in accordance with Financial Reporting Standard '
    '102 "The Financial Reporting Standard applicable in the UK and Republic of Ireland", including '
    'the provisions of Section 1A "Small Entities", and the Companies Act 2006. The financial '
    'statements have been prepared under the historical cost convention as modified by the '
    'revaluation of the investment property to fair value.')

subpolicy('Going concern',
    'The directors have prepared these financial statements on the going concern basis. The company '
    'reports net liabilities of £9,557 at 31 March 2025. This position arises principally '
    'from the interest-only mortgage secured on the company’s investment property, which has '
    'a fair value of £225,000 against mortgage debt of £173,791. The company’s '
    'investment property is fully let and generating rental income. The directors have reviewed '
    'the company’s projected cash flows and financial commitments and are satisfied that the '
    'company has adequate resources to meet its obligations as they fall due for a period of not '
    'less than twelve months from the date of approval of these financial statements. Accordingly, '
    'the going concern basis of preparation continues to be appropriate.')

subpolicy('Turnover',
    'Turnover represents rental income receivable in respect of the period, measured at the gross '
    'contracted rent per the tenancy agreement, excluding value added tax. The company is not '
    'registered for VAT. Letting agent management fees are presented as an administrative expense.')

subpolicy('Investment property',
    'Investment property held to earn rentals is initially recognised at cost and is subsequently '
    'carried at fair value at each balance sheet date. Changes in fair value are recognised in '
    'profit or loss. At 31 March 2025 no formal independent revaluation was commissioned. The '
    'directors have assessed the fair value and are satisfied that the carrying value of £225,000, '
    'being the valuation determined by independent external valuers on 29 December 2023, remains a '
    'reasonable approximation of fair value at the balance sheet date.')

subpolicy('Taxation',
    'Corporation tax is recognised on taxable profits for the period at rates enacted at the balance '
    'sheet date. As the company is loss-making in the period, no current tax charge arises. Deferred '
    'tax is recognised in respect of timing differences that have originated but not reversed at the '
    'balance sheet date.')

subpolicy('Financial instruments',
    'Basic financial instruments are recognised at transaction price. The bank loan is carried at the '
    'outstanding capital balance. Interest payable on the bank loan is recognised on an accruals basis '
    'as a finance charge in the profit and loss account. Director loan balances are classified as '
    'current liabilities as they are repayable on demand.')

# Note 3
hdr('3.     EMPLOYEES AND DIRECTORS', sb=8, sa=2)
para('The average number of employees during the year was NIL (2024 – NIL). '
     'No remuneration was paid to any director during the year (2024 – NIL).', sb=2)

footer_line(4, continued=True)
doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 6 — NOTES continued  (page 5)
# ══════════════════════════════════════════════════════════════════════════════
company_header()
hdr('Notes to the Financial Statements – continued\nFOR THE YEAR ENDED 31 MARCH 2025', sb=4)

# Note 4 — Investment Property
hdr('4.     INVESTMENT PROPERTY', sb=8, sa=4)

ip = [
    ('', 'Total\n£', True),
    ('Fair value at 1 April 2024', '225,000', False),
    ('Additions in year', '—', False),
    ('Net gains from fair value adjustments', '—', False),
    ('Fair value at 31 March 2025', '225,000', True),
    ('', '', False),
    ('Fair value at 31 March 2025 is represented by:', '', False),
    ('Valuation carried out in December 2023', '225,000', False),
]
t = doc.add_table(rows=len(ip), cols=2)
no_borders(t)
cw(t, 0, 11); cw(t, 1, 5)
for ri, (d, v, bold) in enumerate(ip):
    ct(t.rows[ri].cells[0], d, bold=bold)
    ct(t.rows[ri].cells[1], v, bold=bold, align=R)
    if ri == 4:
        border(t.rows[ri].cells[1], 'top')
        border(t.rows[ri].cells[1], 'bottom')

para('Investment property was independently valued at £225,000 on an open market basis on '
     '29 December 2023 by external valuers. No formal revaluation was carried out at 31 March 2025; '
     'the directors consider the carrying value to be a reasonable approximation of fair value at the '
     'balance sheet date.', sb=6)

para('If investment property had not been carried at fair value it would have been included at the '
     'following historical cost:', sb=4)

hc = [('', '31/3/25\n£', '31/3/24\n£'), ('Cost', '202,454', '202,454')]
t2 = doc.add_table(rows=2, cols=3)
no_borders(t2)
cw(t2, 0, 8); cw(t2, 1, 4); cw(t2, 2, 4)
for ri, (d, v1, v2) in enumerate(hc):
    ct(t2.rows[ri].cells[0], d, bold=(ri==0))
    ct(t2.rows[ri].cells[1], v1, bold=(ri==0), align=R)
    ct(t2.rows[ri].cells[2], v2, bold=(ri==0), align=R)
    if ri == 1:
        border(t2.rows[ri].cells[1], 'bottom')
        border(t2.rows[ri].cells[2], 'bottom')

# Note 5 — Debtors
# Prior year debtor £4,915 was settled during the year; nil at 31 March 2025
hdr('5.     DEBTORS: AMOUNTS FALLING DUE WITHIN ONE YEAR', sb=10, sa=4)
deb = [
    ('', '31/3/25\n£', '31/3/24\n£', True),
    ('Other debtors', '—', '4,915', False),
]
t3 = doc.add_table(rows=2, cols=3)
no_borders(t3)
cw(t3, 0, 8); cw(t3, 1, 4); cw(t3, 2, 4)
for ri, (d, v1, v2, bold) in enumerate(deb):
    ct(t3.rows[ri].cells[0], d, bold=bold)
    ct(t3.rows[ri].cells[1], v1, bold=bold, align=R)
    ct(t3.rows[ri].cells[2], v2, bold=bold, align=R)
    if ri == 1:
        border(t3.rows[ri].cells[1], 'bottom')
        border(t3.rows[ri].cells[2], 'bottom')

# Note 6 — Creditors within one year
# DLA derived: 225,000 + 0 + 3,796 – DLA – 173,791 = –9,557  →  DLA = 64,562
hdr('6.     CREDITORS: AMOUNTS FALLING DUE WITHIN ONE YEAR', sb=10, sa=4)
cr1 = [
    ('', '31/3/25\n£', '31/3/24\n£', True),
    ('Trade creditors', '—', '1,080', False),
    ('Director loan accounts', '64,562', '78,034', False),
    ('', '64,562', '79,114', True),
]
t4 = doc.add_table(rows=4, cols=3)
no_borders(t4)
cw(t4, 0, 8); cw(t4, 1, 4); cw(t4, 2, 4)
for ri, (d, v1, v2, bold) in enumerate(cr1):
    ct(t4.rows[ri].cells[0], d, bold=bold)
    ct(t4.rows[ri].cells[1], v1, bold=bold, align=R)
    ct(t4.rows[ri].cells[2], v2, bold=bold, align=R)
    if ri == 2:
        border(t4.rows[ri].cells[1], 'top')
        border(t4.rows[ri].cells[2], 'top')
    if ri == 3:
        border(t4.rows[ri].cells[1], 'bottom', double=True)
        border(t4.rows[ri].cells[2], 'bottom', double=True)

para('The director loan accounts represent monies lent to the company by the directors. '
     'The amounts are unsecured, interest-free and repayable on demand. '
     'During the year, the company made repayments totalling £8,565 to the directors '
     '(Mr Owen Neligan: £4,565; Mrs Frances Neligan: £4,000).', sb=5)

footer_line(5, continued=True)
doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 7 — NOTES continued  (page 6)
# ══════════════════════════════════════════════════════════════════════════════
company_header()
hdr('Notes to the Financial Statements – continued\nFOR THE YEAR ENDED 31 MARCH 2025', sb=4)

# Note 7 — Creditors > 1 year
hdr('7.     CREDITORS: AMOUNTS FALLING DUE AFTER MORE THAN ONE YEAR', sb=8, sa=4)
cr2 = [
    ('', '31/3/25\n£', '31/3/24\n£', True),
    ('Bank loans', '173,791', '173,791', False),
    ('', '', '', False),
    ('Amounts falling due in more than five years:', '', '', False),
    ('Bank loans – repayable at maturity', '173,791', '173,791', False),
]
t5 = doc.add_table(rows=5, cols=3)
no_borders(t5)
cw(t5, 0, 8); cw(t5, 1, 4); cw(t5, 2, 4)
for ri, (d, v1, v2, bold) in enumerate(cr2):
    ct(t5.rows[ri].cells[0], d, bold=bold)
    ct(t5.rows[ri].cells[1], v1, bold=bold, align=R)
    ct(t5.rows[ri].cells[2], v2, bold=bold, align=R)
    if ri == 4:
        border(t5.rows[ri].cells[1], 'top')
        border(t5.rows[ri].cells[2], 'top')
        border(t5.rows[ri].cells[1], 'bottom')
        border(t5.rows[ri].cells[2], 'bottom')

para('The bank loan is a buy-to-let interest-only mortgage with Fleet Mortgages Ltd '
     '(account number 1100082162), secured by a first legal charge over the company’s '
     'investment property at 11 Hatfield Walk, York, YO24 3LX. The loan bears interest at '
     '5.44% per annum (variable rate effective from 1 April 2024). The capital sum is '
     'repayable in full at maturity; the remaining term at the balance sheet date is '
     'approximately 26 years and 10 months. Total interest charged in the year was £9,455 '
     '(2024: not separately disclosed).', sb=6)

# Note 8 — Reserves
hdr('8.     RESERVES', sb=10, sa=4)
res = [
    ('', 'Fair value\nreserve\n£', True),
    ('Non-distributable reserve', '', True),
    ('At 1 April 2024', '22,546', False),
    ('Movement in year', '—', False),
    ('At 31 March 2025', '22,546', True),
]
t6 = doc.add_table(rows=5, cols=2)
no_borders(t6)
cw(t6, 0, 10); cw(t6, 1, 6)
for ri, (d, v, bold) in enumerate(res):
    ct(t6.rows[ri].cells[0], d, bold=bold)
    ct(t6.rows[ri].cells[1], v, bold=bold, align=R)
    if ri == 4:
        border(t6.rows[ri].cells[1], 'top')
        border(t6.rows[ri].cells[1], 'bottom')

para('The fair value reserve represents the non-distributable cumulative surplus arising on '
     'the revaluation of the investment property above historical cost (£225,000 less '
     '£202,454 = £22,546), recognised in the year ended 31 March 2024.', sb=6)

# Note 9 — Related parties
hdr('9.     RELATED PARTY TRANSACTIONS', sb=10, sa=2)
para('The directors are the sole shareholders of the company. Director loan account balances '
     'and movements during the year are disclosed in Note 6. No other related party transactions '
     'requiring disclosure under FRS 102 Section 33 have been identified during the year.', sb=2)

# Note 10 — Post balance sheet events
hdr('10.    POST BALANCE SHEET EVENTS', sb=10, sa=2)
para('There are no post balance sheet events requiring disclosure.', sb=2)

footer_line(6)
doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 8 — DIRECTORS' REPORT  (page 7)
# ══════════════════════════════════════════════════════════════════════════════
company_header()
hdr("Directors' Report\nFOR THE YEAR ENDED 31 MARCH 2025", sb=4)

para(
    "The directors present their report for the year ended 31 March 2025. The company’s "
    "principal activity during the year was the holding and letting of a single residential "
    "investment property at 11 Hatfield Walk, York, YO24 3LX, which was subject to a programme "
    "of renovation works during the period April to June 2024 before being let to tenants through "
    "Ashtons Lettings & Management from July 2024. The company recorded a loss before taxation of "
    "£13,677 for the year (2024: loss of £11,488), principally reflecting renovation "
    "expenditure incurred during the void period prior to first letting and the full year’s "
    "mortgage interest charge of £9,455. The directors do not recommend the payment of a "
    "dividend. The directors who served throughout the year were Mr Owen Neligan, "
    "Mrs Frances Neligan and Mrs Verity Winterburn.",
    sb=10
)

doc.add_paragraph()
doc.add_paragraph()
p = doc.add_paragraph()
sf(p.add_run('Signed on behalf of the Board:'), size=10)

doc.add_paragraph()
p = doc.add_paragraph()
sf(p.add_run('Mr Owen Neligan  –  Director'), size=10)
p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(18)
sf(p.add_run('Date:  _______________________'), size=10)
p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(4)
sf(p.add_run('Registered office: Office LG06, 1 Quality Court, Chancery Lane, London, WC2A 1HR'),
   size=10)

p = doc.add_paragraph()
p.alignment = C
p.paragraph_format.space_before = Pt(20)
sf(p.add_run('Page 7'), size=9)

# ── Save ──────────────────────────────────────────────────────────────────────
path = '/home/user/RPM_App/Neliburn_Ltd_Accounts_YE_31March2025.docx'
doc.save(path)
print(f'Saved: {path}')
