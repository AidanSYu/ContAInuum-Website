/* Attribution data for licensed media — used ONLY where the license requires
   visible credit. NASA / public-domain footage (ISS, SDO sun, 1924 mill film)
   needs none; the Berkeley A-Lab clips are CC BY 4.0, which requires author,
   source, license, and a note that the material was modified. */

export type MediaCreditInfo = { label: string; href: string };

/* The A-Lab footage (Szymanski et al., "An autonomous laboratory for the
   accelerated synthesis of novel materials", Nature 2023), via Wikimedia
   Commons. R1 = white 6-axis arm + sample-prep station; R3 = UR5e cobot +
   X-ray diffractometer. Both cut/graded for the site → "edited". */
const A_LAB_LABEL = 'Footage: A-Lab, Szymanski et al. (Nature 2023) · CC BY 4.0 · edited';

export const CREDITS: Record<string, MediaCreditInfo> = {
  aLabR1: { label: A_LAB_LABEL, href: 'https://commons.wikimedia.org/w/index.php?curid=146077925' },
  aLabR3: { label: A_LAB_LABEL, href: 'https://commons.wikimedia.org/w/index.php?curid=146079494' },
};
