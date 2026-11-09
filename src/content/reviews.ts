import { MAPS_SEARCH_URL } from "./business";

/**
 * Customer reviews shown in the Reviews carousel.
 *
 * Genuine Google Maps reviews of The Cookie Spot, copied word for word (spelling, line breaks
 * and emoji as written) from screenshots supplied by the owner on 2026-11-09. All five are
 * 5-star. Reviewers are shown by initials only, to protect their personal data. One review is
 * shortened at the owner's request (its last two paragraphs removed). Google shows only relative dates ("3 months ago"), so dates are not displayed — they
 * would go stale on a static site. Never edit the wording or add reviews you cannot see.
 */
export interface Review {
  text: string;
  author: string;
  lang: "el" | "en";
  rating: 1 | 2 | 3 | 4 | 5;
  source: "Google";
  url: string;
}

const g = (author: string, text: string): Review => ({ author, text, lang: "el", rating: 5, source: "Google", url: MAPS_SEARCH_URL });

export const reviews: Review[] = [
  g(
    "Ι. Μ.",
    "Πήγα για «ένα cookie να δοκιμάσω» και έφυγα με σακούλα. 😂🍪\n\nΜέτρησα πάνω από 10 διαφορετικές γεύσεις, η μία καλύτερη από την άλλη! Εμείς πήραμε λεμόνι, φυστίκι, Oreo, triple chocolate και δύο vegan. Όλα εξαιρετικά.\n\nΑν είστε πολλά άτομα αξίζει να δοκιμάσετε και το brookie, που πρακτικά είναι σαν ένα τεράστιο, οικογενειακό cookie σε ταψάκι… και ΑΥΤΟ θέλει οπωσδήποτε παγωτό από πάνω!",
  ),
  g(
    "T. G.",
    "Αν είσαι λάτρης του πραγματικά καλού cookie, το The Cookie Spot αξίζει σίγουρα μια δοκιμή. Τα cookies είναι πεντανόστιμα, το μπρούκι εξαιρετικό και ο καφές επίσης πολύ καλός. Ξεχωρίζω όμως και την εξυπηρέτηση, καθώς το προσωπικό είναι ευγενικό, χαμογελαστό και πολύ εξυπηρετικό. Όλα δείχνουν προσεγμένα και ποιοτικά, από τα προϊόντα μέχρι τον τρόπο που σε υποδέχονται. Σίγουρα ένα μέρος που αξίζει να επισκεφθείς και να ξαναπάς!",
  ),
  g(
    "N. A.",
    "Από τα καλύτερα μπισκοτα που εχω δοκιμάσει στην Αθήνα! Πρέπει οπωσδήποτε να δοκιμάσετε το poppy seed lemon και το triple chocolate και γενικα αν είστε φαν των μπισκότων εχει άπειρες γεύσεις να δοκιμάσετε",
  ),
  g(
    "E. A.",
    "Είχα ακούσει τόσα πολλά για τα μπισκότα τους που αποφάσισα να πάω να τα δοκιμάσω και πραγματικά άξιζε 100%! Όλα ήταν καταπληκτικά, φρέσκα και πεντανόστιμα. Μου άρεσε ιδιαίτερα το γεγονός ότι φτιάχνονται όλα εκεί, κάτι που φαίνεται και στη γεύση και στην ποιότητα.",
  ),
  g(
    "V. S.",
    "Είχε μεγάλη ποικιλία γεύσεων σε μπισκότα! Μου άρεσε πάρα πολύ το μπισκότο biscuit και κακάο, έλιωνε στο στόμα σου! Εννοείτε και το brown ήταν πεντανόστιμο ιδικά που είχε από πάνω την καραμέλα το απογείωνε! Είχε πάρα πολύ καλή εξυπηρέτηση από τις κοπέλες στο κατάστημα! Εννοείτε προτείνω ανεπιφύλακτα να το δοκιμάσετε!",
  ),
];
