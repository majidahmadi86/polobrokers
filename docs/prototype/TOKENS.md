# Prototype tokens

Source: inline `<style>` of https://polo-brokers.balzacbkk.chatgpt.site (raw in `index.html`).

## Colour variables (`:root`)

| var | value | role |
| --- | --- | --- |
| `--g` | `#0b2e24` | green: brand, buttons, collections band |
| `--i` | `#f7f1e4` | ivory: page background |
| `--w` | `#fffdf8` | warm white: header, hero panel, intro and instagram sections |
| `--gold` | `#b08a52` | gold: rule under lead, WhatsApp button |
| `--ink` | `#12271f` | ink: body text |

All five match docs/BRIEF.md exactly.

Hard-coded colours also used:

| value | where |
| --- | --- |
| `rgba(255,253,248,.96)` | header and hero panel background |
| `#d3bd98` | header bottom border (thin gold rule, 1px) |
| `#c8a66d` | hero panel border |
| `#1e1f1626` | hero panel shadow `0 20px 50px` |
| `#dac49f` | kicker on green |
| `#85653a` | sell section sub label |
| `#cdbb98` | features strip borders |
| `#fffdf8ee` | card label bars |
| `#071d18` | footer background (darker than `--g`) |
| `#c6baa4` | footer text |
| `white` | text on green buttons and band |

## Fonts (Google Fonts request)

`Libre Franklin` wght 400, 500, 600 · `Playfair Display` wght 500, 600 · display=swap.
Weights actually used in CSS: Libre Franklin 400 (body), 600 (buttons); Playfair Display 500
(brand, monogram, name, headings, lead, card labels, feature titles). 500 is the only Playfair
weight referenced; 600 is loaded but unused. Libre Franklin 500 is loaded but unused.

| element | font | size | weight | letter-spacing | other |
| --- | --- | --- | --- | --- | --- |
| body | Libre Franklin, Arial, sans-serif | 16px / 1.6 | 400 | | colour ink |
| `.brand` wordmark | Playfair Display | 1.3rem (0.95rem below 800px) | 500 | .08em | text "POLO BROKERS" typed uppercase |
| `.brand b` monogram box | Playfair Display | inherits | 700 (b) | inherits | 42x42 (34x34 below 800px), 1px green border, grid centred |
| nav links | Libre Franklin | .7rem | 400 | .14em | uppercase |
| `.ig` button | Libre Franklin | .7rem | 400 | .14em | padding 11px 16px, green bg, white |
| `.pb` hero monogram | Playfair Display | 8rem / .75 (6rem below 800px) | 500 | -.16em | padding-right .16em (compensates negative tracking), centred |
| `.name` | Playfair Display | 3rem (2.3rem below 800px) | 500 | .06em | font-variant small-caps, border-block 1px green, padding 9px 0 13px |
| `.sub` | Libre Franklin | .64rem | 400 | .19em | uppercase |
| `.btn` | Libre Franklin | .69rem | 600 | .11em | uppercase, padding 13px 16px, 1px green border |
| h1, h2 | Playfair Display | clamp(2.8rem, 5vw, 5.2rem) / 1 | 500 | | |
| `.lead` | Playfair Display | 1.5rem / 1.4 | 500 | | |
| `.kicker` | Libre Franklin | .67rem | 400 | .22em | uppercase, #dac49f |
| card label | Playfair Display | 2rem | 500 | | |
| features strong | Playfair Display | 1.25rem | 500 | | |
| features small | Libre Franklin | (small) | 400 | .08em | uppercase |
| footer | Libre Franklin | .65rem | 400 | | #c6baa4 on #071d18 |

## Monogram construction

- Header: `<b>PB</b>` inside a 42x42 box with 1px solid green border, letters centred, Playfair
  Display at the wordmark size (1.3rem), weight bold from `<b>`. Gap 12px to the wordmark.
- Hero: "PB" Playfair Display 500, 8rem, line-height .75, letter-spacing -.16em so the P and B
  touch/overlap, padding-right .16em to recentre.
- Favicon: 64x64 SVG, rx 8 green square, ivory "PB" Georgia 30px at y 42.

## Layout

- Header: absolute, full width, flex space-between, padding 20px 5vw, warm white 96%, 1px #d3bd98 bottom border.
- Nav gap 24px.
- Hero: min-height 820px, padding 110px 7vw 60px; panel width min(470px, 40vw), padding 42px 38px.
- Sections: intro padding 90px 8vw, grid .9fr 1.1fr gap 8vw; collections 85px 5vw 95px; cards min-height 500px.
- Footer: flex space-between, padding 25px 6vw, disclaimer max-width 650px right-aligned.

## Breakpoints

One breakpoint: `max-width: 800px`. Below it the nav links are hidden (only the Instagram button
stays), everything stacks in one column.

## Images

All four referenced images were downloaded to `docs/prototype/assets/`.

| file | pixels | bytes | used for |
| --- | --- | --- | --- |
| denim-woman-hero.png | 1672 x 941 | 2,137,610 | hero |
| vintage-men-women.png | 1024 x 1536 | 2,449,117 | Men and Women cards (same file, two crops) |
| vintage-children.png | 1024 x 1536 | 3,017,615 | Children card |
| vintage-dealer-room.png | 1536 x 1024 | 2,644,086 | Sell section |

Screenshots in docs/ for comparison: 1356x682, 1366x3174 (full page), 215x471 (mobile), 1366x2350,
1366x849. Every image appears in the screenshots at a fraction of its size (the hero spans about
1356 px wide but is cropped; cards about 440 px wide).

Answer: yes. These are the source files the prototype serves, uncropped and higher resolution
than any crop of the screenshots. They are still not camera originals (1672 px and 1536 px max
side); for a sharp full-bleed hero at 1920 px and above on 2x screens, original files from Zac
remain wanted.
