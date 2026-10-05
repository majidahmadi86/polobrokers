# Rebuilds the self-hosted fonts in src/fonts from the official google/fonts variable TTFs.
# Not part of the build: the output files are committed. Needs Python with fonttools and brotli.
#   curl -L -o PlayfairDisplay.ttf "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf"
#   curl -L -o LibreFranklin.ttf "https://github.com/google/fonts/raw/main/ofl/librefranklin/LibreFranklin%5Bwght%5D.ttf"
#   python scripts/build-fonts.py <folder holding both TTFs>
# Each weight the site uses is cut as a static instance, subset to the Google latin range
# (one file per weight; it covers every French accent and the oe ligature), all OpenType
# layout features kept (small caps, kerning). Playfair 500 is also kept as .ttf for the OG and icon
# images, because the image renderer cannot read woff2.
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

RANGES = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,"
    "U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
)
JOBS = [
    ("PlayfairDisplay.ttf", "playfair-display", [500]),
    ("LibreFranklin.ttf", "libre-franklin", [400, 600]),
]
TTF_KEEP = {("playfair-display", 500)}

src_dir = sys.argv[1] if len(sys.argv) > 1 else "."
out_dir = os.path.join(os.path.dirname(__file__), "..", "src", "fonts")
for src, name, weights in JOBS:
    for weight in weights:
        font = instancer.instantiateVariableFont(TTFont(os.path.join(src_dir, src)), {"wght": weight}, updateFontNames=True)
        tmp = os.path.join(out_dir, "_instance.ttf")
        font.save(tmp)
        flavors = [("woff2", "woff2")] + ([(None, "ttf")] if (name, weight) in TTF_KEEP else [])
        for flavor, ext in flavors:
            opts = subset.Options()
            opts.layout_features = ["*"]
            opts.name_IDs = ["*"]
            opts.name_languages = ["*"]
            opts.notdef_outline = True
            opts.flavor = flavor
            loaded = subset.load_font(tmp, opts)
            subsetter = subset.Subsetter(opts)
            subsetter.populate(unicodes=subset.parse_unicodes(RANGES))
            subsetter.subset(loaded)
            out = os.path.join(out_dir, f"{name}-latin-{weight}.{ext}")
            subset.save_font(loaded, out, opts)
            loaded.close()  # Windows keeps the temp file locked otherwise
            print(out, os.path.getsize(out))
        os.remove(tmp)
