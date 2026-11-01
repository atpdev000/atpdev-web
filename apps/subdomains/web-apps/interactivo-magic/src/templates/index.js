// INTERACTIVO MAGIC - TEMPLATES REGISTRY
// All templates are imported from their dedicated specialized files.

import { LOVE_TEMPLATE } from './love/love-proposal';
import { GALAXY_TEMPLATE } from './love/galaxy';
import { BOOK_LOVE_TEMPLATE } from './love/book-love';
import { LOVE_INITIALS_TEMPLATE } from './love/love-initials';
import { ENOJONA_TEMPLATE } from './love/enojona';
import { LOVE_CERTIFICATE_TEMPLATE } from './love/love-certificate';
import { MUSICAL_SPHERE_TEMPLATE } from './love/musical-sphere';
import { FLOWERS_BOUQUET_TEMPLATE } from './love/flowers-bouquet';
import { LOVE_VITAMINS_TEMPLATE } from './love/love-vitamins';
import { DEDICATE_SONG_TEMPLATE } from './love/dedicate-song';

import { BIRTHDAY_TEMPLATE } from './eventos/birthday';
import { DATE_COUNTER_TEMPLATE } from './eventos/date-counter';

import { PUZZLE_LOVE_TEMPLATE } from './juegos/puzzle-love';
import { RULETA_LOVE_TEMPLATE } from './juegos/ruleta-love';
import { SCRATCH_MESSAGE_TEMPLATE } from './juegos/scratch-message';

import { MARVEL_BOOK_TEMPLATE } from './fun/marvel-book';
import { FORGIVE_ME_CATS_TEMPLATE } from './fun/forgive-me-cats';
import { FORGIVE_ME_PENGUINS_TEMPLATE } from './fun/forgive-me-penguins';
import { SOCCER_CARD_TEMPLATE } from './fun/soccer-card';
import { FRIENDS_REQUEST_TEMPLATE } from './fun/friends-request';
import { ENCHANTED_LETTER_TEMPLATE } from './halloween/enchanted-letter';


import { PROPOSAL_PREMIUM_TEMPLATE } from './love/proposal-premium';
import { TE_AMO_PREMIUM_TEMPLATE } from './love/te-amo-premium';
import { PHOTO_HEART_COLLAGE_TEMPLATE } from './love/photo-heart-collage';
import { OUR_YEAR_COLLAGE_TEMPLATE } from './love/our-year-collage';
import { LOVE_CUBE_TEMPLATE } from './love/love-cube';
import { CHRISTMAS_TREE_PHOTOS_TEMPLATE } from './seasonal/christmas-tree-photos';
import { NEW_YEAR_CELEBRATION_TEMPLATE } from './seasonal/new-year-celebration';
import { HIDDEN_MESSAGE_TEMPLATE } from './love/hidden-message';

// --- EXPORTS ---
export {
    LOVE_TEMPLATE,
    GALAXY_TEMPLATE,
    BOOK_LOVE_TEMPLATE,
    LOVE_INITIALS_TEMPLATE,
    ENOJONA_TEMPLATE,
    LOVE_CERTIFICATE_TEMPLATE,
    MUSICAL_SPHERE_TEMPLATE,
    FLOWERS_BOUQUET_TEMPLATE,
    LOVE_VITAMINS_TEMPLATE,
    BIRTHDAY_TEMPLATE,
    DATE_COUNTER_TEMPLATE,
    PUZZLE_LOVE_TEMPLATE,
    RULETA_LOVE_TEMPLATE,
    SCRATCH_MESSAGE_TEMPLATE,
    MARVEL_BOOK_TEMPLATE,
    FORGIVE_ME_CATS_TEMPLATE,
    ENCHANTED_LETTER_TEMPLATE,
    FORGIVE_ME_PENGUINS_TEMPLATE,
    SOCCER_CARD_TEMPLATE,
    DEDICATE_SONG_TEMPLATE,
    PROPOSAL_PREMIUM_TEMPLATE,
    TE_AMO_PREMIUM_TEMPLATE,
    PHOTO_HEART_COLLAGE_TEMPLATE,
    OUR_YEAR_COLLAGE_TEMPLATE,
    FRIENDS_REQUEST_TEMPLATE,
    CHRISTMAS_TREE_PHOTOS_TEMPLATE,
    NEW_YEAR_CELEBRATION_TEMPLATE,
    LOVE_CUBE_TEMPLATE,
    HIDDEN_MESSAGE_TEMPLATE
};

// --- ALIASES AND SPECIALIZATIONS ---
export const GALAXY_GENERATOR_TEMPLATE = GALAXY_TEMPLATE;
export const PROPOSAL_TEMPLATE = PROPOSAL_PREMIUM_TEMPLATE;
export const FLOWERS_RAMO_TEMPLATE = FLOWERS_BOUQUET_TEMPLATE;
export const COUPLE_INITIALS_TEMPLATE = LOVE_INITIALS_TEMPLATE;
export const BIRTHDAY_LAMP_TEMPLATE = BIRTHDAY_TEMPLATE;
// LOVE_VITAMINS_TEMPLATE is now imported directly from love-vitamins.js
// SOCCER_CARD_TEMPLATE is now imported from soccer-card.js
// DEDICATE_SONG_TEMPLATE is now imported from dedicate-song.js
export const DEDICATE_SONG_LEGACY_ALIAS = LOVE_TEMPLATE.replace('🎁', '🎧');
export const BE_MY_BOYFRIEND_TEMPLATE = PROPOSAL_TEMPLATE;
export const TE_AMO_TEMPLATE = TE_AMO_PREMIUM_TEMPLATE;
export const BE_FRIENDS_TEMPLATE = FRIENDS_REQUEST_TEMPLATE;
export const HEART_PHOTO_TEMPLATE = PHOTO_HEART_COLLAGE_TEMPLATE;
export const OUR_YEAR_TEMPLATE = OUR_YEAR_COLLAGE_TEMPLATE;
export const CHRISTMAS_TREE_TEMPLATE = CHRISTMAS_TREE_PHOTOS_TEMPLATE; // Now using dedicated template
export const NEW_YEAR_TEMPLATE = NEW_YEAR_CELEBRATION_TEMPLATE;
export const LAST_CHANCE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🔓'); // Keeping legacy just in case or delete if unused
