THE MUSEUM OF HER - private viewing (slide deck)

FILES
  index.html   the ten slides
  styles.css   the red room, gilded frames, effects
  script.js    the deck engine (arrows, keys, wheel, swipe, dust)
  images/      your photos

THE RUN OF SHOW
  01  title slide          THE MUSEUM OF HER
  02  exhibit No. 001      the-one-and-only.jpg            The One and Only
  03  exhibit No. 002      that-smile.jpg                  That Smile
  04  exhibit No. 003      golden-hour.jpg                 Golden Hour
  05  exhibit No. 004      caught-laughing.jpg             Caught Laughing
  06  exhibit No. 005      looking-away-still-perfect.jpg  Looking Away, Still Perfect
  07  exhibit No. 006      sunday.jpg                      Sunday
  08  exhibit No. 007      the-favourite.webp              The Favourite
  09  exhibit No. 008      under-the-lights.jpg            Under the Lights
  10  closing slide        END OF GALLERY

HOW TO MOVE THROUGH IT
  back / next arrows (on screen)   left / right arrow keys
  mouse wheel or trackpad          swipe on a touchscreen
  the dots along the bottom        Full screen button, or the F key
  click anywhere to go on          click a photo to see it large (Esc closes)
  Home / End jump to first / last slide

THE TRANSITIONS
  Each exhibit is a wall of the room, and the room turns as you move
  through it: the piece you leave swings away into the dark and the next
  one comes round to face you, its frame swinging forward out of the
  wall as it settles. Move the mouse and the frames lean toward it,
  catching the light, and the room itself tips a little. Nothing moves
  if your system asks for reduced motion.

FRAME SHAPES
  Every frame is sized to its photo exactly: script.js reads the photo's
  real width and height and shapes the frame to match, so the picture is
  never cropped and never distorted. The class on the .photo-slot div
  (plain / tall / wide) is only the fallback shape, used for an exhibit
  that has no photo yet.

ADDING YOUR PHOTOS
  Drop a file into the images folder, then point that exhibit's <img src>
  and its <code> placeholder at the new file name (matching case; .jpg
  and .webp both work fine). Until a file exists, that slide shows a
  dashed placeholder naming the file it is waiting for.

ON A PHONE
  The deck is built for a hand as well as a desk. The arrows drop to the
  bottom corners where a thumb can reach them, the dots grow a larger
  touch target, and the frame, plaque and picture light shrink to suit a
  small screen. Swipe left or right to turn the wall, or swipe up to move
  on; a tap on the empty wall does the same. The lightbox puts its arrows
  at the bottom too, and the page respects the notch and the browser bars
  (it uses the safe-area insets and the dynamic viewport height).

MORE OR FEWER EXHIBITS
  Open index.html and find a block starting with
    <section class="slide slide-exhibit" aria-label="Exhibit 3">
  Copy it, paste it, and give it a new image and plaque text. Delete a
  block to remove that exhibit. The dots, the counter and the arrow
  limits update themselves.

EDITING THE CAPTIONS
  <span class="pl-num">     the exhibit number
  <span class="pl-title">   the title on the brass plaque
  <p class="pl-note">       the line of description under the plaque
  The title slide is <h1 class="marquee" ...>THE MUSEUM OF HER</h1>.
