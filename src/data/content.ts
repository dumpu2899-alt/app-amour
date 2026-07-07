export type Game = {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  textColor: string;
  emoji: string;
  instructions: string;
  type: 'toi-ou-moi' | 'verite-defi' | 'jamais' | 'rapid-fire' | 'deviner' | 'defi-couple';
  content: string[];
};

export type DailyQuestion = {
  id: string;
  question: string;
  category: string;
  hint?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  color: string;
  textColor: string;
  emoji: string;
  questions: QuizQuestion[];
};

export const GAMES: Game[] = [
  {
    id: 'toi-ou-moi',
    title: 'Toi ou Moi ?',
    description: 'Qui de vous deux correspond le mieux à chaque description ?',
    category: 'Jeu',
    color: '#E8E5C8',
    textColor: '#4A4520',
    emoji: '🤔',
    instructions: 'Chaque carte propose une situation. Décidez ensemble qui de vous deux correspond le mieux. Pas de mauvaises réponses — juste des révélations !',
    type: 'toi-ou-moi',
    content: [
      'Le plus romantique',
      'Le premier à s\'endormir',
      'Le plus têtu',
      'Le meilleur cuisinier',
      'Le plus bavard',
      'Le plus organisé',
      'Le plus aventurier',
      'Le meilleur en navigation',
      'Le plus généreux',
      'Le premier à céder lors d\'une dispute',
    ],
  },
  {
    id: 'verite-defi',
    title: 'Vérité ou Défi',
    description: 'Le classique revisité pour les couples !',
    category: 'Jeu',
    color: '#F9C5D1',
    textColor: '#6B1A2A',
    emoji: '💕',
    instructions: 'À tour de rôle, choisissez "Vérité" ou "Défi". Vérité = répondez honnêtement. Défi = accomplissez le défi ensemble !',
    type: 'verite-defi',
    content: [
      'Vérité : Quel est ton souvenir préféré avec moi ?',
      'Vérité : Qu\'est-ce qui t\'a d\'abord attiré chez moi ?',
      'Défi : Faites un câlin de 30 secondes sans vous arrêter.',
      'Vérité : Quelle habitude de l\'autre t\'irrite parfois ?',
      'Défi : Dites 5 choses que vous adorez chez l\'autre.',
      'Vérité : Quel est ton rêve secret que tu ne m\'as jamais dit ?',
      'Défi : Dansez ensemble sur la prochaine chanson qui passe.',
      'Vérité : Qu\'est-ce que tu changerais dans notre relation ?',
      'Vérité : Quel moment t\'a rendu le plus fier de moi ?',
      'Défi : Préparez ensemble un message d\'amour à envoyer à vos familles.',
    ],
  },
  {
    id: 'jamais',
    title: 'Je n\'ai jamais...',
    description: 'Découvrez des secrets inattendus sur votre partenaire',
    category: 'Jeu',
    color: '#C8E6C9',
    textColor: '#1B5E20',
    emoji: '🙈',
    instructions: 'Lisez chaque affirmation. Si vous l\'avez déjà fait, vous gagnez un point. Comparez vos scores à la fin !',
    type: 'jamais',
    content: [
      'Je n\'ai jamais menti à mon partenaire sur quelque chose d\'important.',
      'Je n\'ai jamais planifié une surprise romantique.',
      'Je n\'ai jamais pleuré en regardant un film romantique.',
      'Je n\'ai jamais fait semblant d\'aimer un cadeau.',
      'Je n\'ai jamais eu un coup de foudre.',
      'Je n\'ai jamais écrit une lettre d\'amour à la main.',
      'Je n\'ai jamais voyagé seul(e).',
      'Je n\'ai jamais appris une chanson pour quelqu\'un.',
      'Je n\'ai jamais fait la cuisine pour impressionner quelqu\'un.',
      'Je n\'ai jamais eu un secret que j\'ai gardé pendant des années.',
    ],
  },
  {
    id: 'rapid-fire',
    title: 'Questions Express',
    description: 'Répondez sans réfléchir — la vérité sort plus vite !',
    category: 'Jeu',
    color: '#B3D9F5',
    textColor: '#0D3A5E',
    emoji: '⚡',
    instructions: 'Répondez à chaque question en moins de 5 secondes ! Pas le temps de réfléchir — c\'est l\'instinct qui parle.',
    type: 'rapid-fire',
    content: [
      'Mer ou montagne ?',
      'Nuit ou matin ?',
      'Cinéma ou Netflix à la maison ?',
      'Chien ou chat ?',
      'Aventure ou détente ?',
      'Ville ou campagne ?',
      'Été ou hiver ?',
      'Restaurant gastronomique ou street food ?',
      'Voyage ou maison confortable ?',
      'Livre ou film ?',
    ],
  },
  {
    id: 'deviner',
    title: 'Tu me connais ?',
    description: 'Testez vos connaissances sur votre partenaire',
    category: 'Jeu',
    color: '#F3E5F5',
    textColor: '#4A148C',
    emoji: '💭',
    instructions: 'Un partenaire écrit sa réponse, l\'autre la devine. Marquez un point pour chaque bonne réponse.',
    type: 'deviner',
    content: [
      'Quelle est la chanson préférée de ton/ta partenaire ?',
      'Quel est son plus grand rêve dans la vie ?',
      'Quelle est sa peur principale ?',
      'Quel est son plat préféré ?',
      'Si il/elle pouvait vivre dans un autre pays, lequel ?',
      'Quelle est la chose dont il/elle est le plus fier(e) ?',
      'Comment décrit-il/elle son enfance ?',
      'Quel métier aurait-il/elle aimé faire ?',
      'Qu\'est-ce qui le/la met de bonne humeur instantanément ?',
      'Quelle est sa qualité principale selon lui/elle ?',
    ],
  },
  {
    id: 'defi-couple',
    title: 'Défis Couple',
    description: 'Des défis à accomplir ensemble pour renforcer votre lien',
    category: 'Jeu',
    color: '#FFE0B2',
    textColor: '#7B3A00',
    emoji: '🏆',
    instructions: 'Piochez un défi et accomplissez-le ensemble ! Chaque défi est une nouvelle aventure.',
    type: 'defi-couple',
    content: [
      'Cuisinez ensemble un plat que vous n\'avez jamais fait.',
      'Écrivez 10 raisons pour lesquelles vous aimez l\'autre.',
      'Faites une randonnée sans téléphones.',
      'Regardez les étoiles ensemble ce soir.',
      'Apprenez les 3 premiers mots d\'une nouvelle langue.',
      'Créez une playlist de vos 20 chansons préférées.',
      'Prenez une photo créative ensemble et encadrez-la.',
      'Planifiez votre prochain voyage.',
      'Faites quelque chose de bien pour quelqu\'un d\'autre ensemble.',
      'Passez une soirée sans écrans — juste vous deux.',
    ],
  },
];

// 20 catégories de questions avec 10 questions chacune
export const DAILY_QUESTIONS: DailyQuestion[] = [
  // Catégorie 1: Amour
  { id: 'am1', question: 'Quel moment de notre relation t\'a rendu le plus heureux/heureuse ?', category: 'Amour' },
  { id: 'am2', question: 'Comment décris-tu l\'amour parfait en une phrase ?', category: 'Amour' },
  { id: 'am3', question: 'Qu\'est-ce qui t\'a surpris dans notre relation ?', category: 'Amour' },
  { id: 'am4', question: 'Quel est ton langage d\'amour principal ?', category: 'Amour', hint: 'Mots, actes, cadeaux, temps ou toucher ?' },
  { id: 'am5', question: 'Quelle est ta façon préférée de montrer ton amour ?', category: 'Amour' },
  { id: 'am6', question: 'Qu\'est-ce que tu aimes le plus chez moi ?', category: 'Amour' },
  { id: 'am7', question: 'Quelle est la plus belle preuve d\'amour que tu aies reçue ?', category: 'Amour' },
  { id: 'am8', question: 'Comment savais-tu que c\'était de l\'amour ?', category: 'Amour' },
  { id: 'am9', question: 'Qu\'est-ce qui fait que notre amour est unique ?', category: 'Amour' },
  { id: 'am10', question: 'Quel est ton engagement pour notre couple ?', category: 'Amour' },

  // Catégorie 2: Passé
  { id: 'pa1', question: 'Quel souvenir d\'enfance te revient souvent ?', category: 'Passé' },
  { id: 'pa2', question: 'Quelle est ta plus grande leçon apprise ?', category: 'Passé' },
  { id: 'pa3', question: 'Quel moment de ta vie te a le plus transformé(e) ?', category: 'Passé' },
  { id: 'pa4', question: 'Qu\'est-ce que tu regrettes et pourquoi ?', category: 'Passé' },
  { id: 'pa5', question: 'Qui a eu le plus d\'influence sur toi ?', category: 'Passé' },
  { id: 'pa6', question: 'Quel est ton plus beau souvenir de nous ?', category: 'Passé' },
  { id: 'pa7', question: 'Qu\'est-ce que tu voudrais revivre ?', category: 'Passé' },
  { id: 'pa8', question: 'Quel événement t\'a marqué(e) définitivement ?', category: 'Passé' },
  { id: 'pa9', question: 'Quelle était ta plus grande peur enfant ?', category: 'Passé' },
  { id: 'pa10', question: 'Qu\'est-ce que tu as appris de tes erreurs ?', category: 'Passé' },

  // Catégorie 3: Futur
  { id: 'fu1', question: 'Comment imagines-tu notre vie dans 10 ans ?', category: 'Futur' },
  { id: 'fu2', question: 'Quel est ton plus grand rêve pour nous deux ?', category: 'Futur' },
  { id: 'fu3', question: 'Qu\'est-ce que tu veux absolument faire avant 60 ans ?', category: 'Futur' },
  { id: 'fu4', question: 'Où aimerais-tu vivre plus tard ?', category: 'Futur' },
  { id: 'fu5', question: 'Quelle tradition aimerais-tu créer avec moi ?', category: 'Futur' },
  { id: 'fu6', question: 'Comment imagines-tu notre retraite ?', category: 'Futur' },
  { id: 'fu7', question: 'Quel projet voudrais-tu réaliser ensemble ?', category: 'Futur' },
  { id: 'fu8', question: 'Qu\'est-ce qui t\'excite le plus dans l\'avenir ?', category: 'Futur' },
  { id: 'fu9', question: 'Quel voyage rêves-tu de faire avec moi ?', category: 'Futur' },
  { id: 'fu10', question: 'Quel héritage veux-tu laisser ?', category: 'Futur' },

  // Catégorie 4: Rêves
  { id: 're1', question: 'Si tu pouvais changer une seule chose dans le monde, ce serait quoi ?', category: 'Rêves' },
  { id: 're2', question: 'Quel serait ton métier si l\'argent n\'était pas un problème ?', category: 'Rêves' },
  { id: 're3', question: 'Quelle compétence voudrais-tu absolument maîtriser ?', category: 'Rêves' },
  { id: 're4', question: 'Où aimerais-tu voyager en priorité ?', category: 'Rêves' },
  { id: 're5', question: 'Quel est ton rêve secret que tu n\'as jamais partagé ?', category: 'Rêves' },
  { id: 're6', question: 'Si tu pouvais rencontrer quelqu\'un de célèbre, qui ?', category: 'Rêves' },
  { id: 're7', question: 'Quel livre ou film t\'a le plus inspiré(e) ?', category: 'Rêves' },
  { id: 're8', question: 'Quelle cause défendrais-tu ?', category: 'Rêves' },
  { id: 're9', question: 'Quel talent caché aimerais-tu développer ?', category: 'Rêves' },
  { id: 're10', question: 'Quelle aventure aimerais-tu vivre ?', category: 'Rêves' },

  // Catégorie 5: Peurs
  { id: 'pe1', question: 'Quelle est ta plus grande peur ?', category: 'Peurs' },
  { id: 'pe2', question: 'Comment gères-tu l\'anxiété ?', category: 'Peurs' },
  { id: 'pe3', question: 'Qu\'est-ce qui t\'empêche de dormir parfois ?', category: 'Peurs' },
  { id: 'pe4', question: 'De quoi as-tu peur dans notre relation ?', category: 'Peurs' },
  { id: 'pe5', question: 'Quelle peur as-tu surmontée ?', category: 'Peurs' },
  { id: 'pe6', question: 'Qu\'est-ce qui t\'angoitise le plus ?', category: 'Peurs' },
  { id: 'pe7', question: 'Comment réagis-tu face à l\'inconnu ?', category: 'Peurs' },
  { id: 'pe8', question: 'Qu\'est-ce qui te fait fuir ?', category: 'Peurs' },
  { id: 'pe9', question: 'Quelle serait ta plus grande difficulté à surmonter ?', category: 'Peurs' },
  { id: 'pe10', question: 'Qu\'est-ce qui te met mal à l\'aise ?', category: 'Peurs' },

  // Catégorie 6: Fierté
  { id: 'fi1', question: 'De quoi es-tu le/la plus fier(e) dans ta vie ?', category: 'Fierté' },
  { id: 'fi2', question: 'Quelle est ta plus grande réussite ?', category: 'Fierté' },
  { id: 'fi3', question: 'Quel moment t\'a rendu(e) fier(e) de toi ?', category: 'Fierté' },
  { id: 'fi4', question: 'Qu\'as-tu accompli que tu pensais impossible ?', category: 'Fierté' },
  { id: 'fi5', question: 'Quelle qualité apprécies-tu le plus chez toi ?', category: 'Fierté' },
  { id: 'fi6', question: 'Quel compliment t\'a le plus touché(e) ?', category: 'Fierté' },
  { id: 'fi7', question: 'Qu\'est-ce qui te fait te sentir fort(e) ?', category: 'Fierté' },
  { id: 'fi8', question: 'De quelles victoires personnelles es-tu fier(e) ?', category: 'Fierté' },
  { id: 'fi9', question: 'Qu\'as-tu construit dont tu es fier(e) ?', category: 'Fierté' },
  { id: 'fi10', question: 'Qu\'est-ce qui te donne confiance ?', category: 'Fierté' },

  // Catégorie 7: Famille
  { id: 'fa1', question: 'Qu\'est-ce que tu n\'as jamais dit à ta famille ?', category: 'Famille' },
  { id: 'fa2', question: 'Quelle est ta relation avec tes parents ?', category: 'Famille' },
  { id: 'fa3', question: 'Qu\'as-tu appris de ta famille ?', category: 'Famille' },
  { id: 'fa4', question: 'Quelle valeur familiale veux-tu transmettre ?', category: 'Famille' },
  { id: 'fa5', question: 'Comment décrirais-tu ton enfance ?', category: 'Famille' },
  { id: 'fa6', question: 'Quelle tradition familiale aimerais-tu garder ?', category: 'Famille' },
  { id: 'fa7', question: 'Quel membre de ta famille t\'inspire ?', category: 'Famille' },
  { id: 'fa8', question: 'Comment veux-tu éduquer tes enfants ?', category: 'Famille' },
  { id: 'fa9', question: 'Qu\'est-ce que tu dois à ta famille ?', category: 'Famille' },
  { id: 'fa10', question: 'Quelle place a la famille dans ta vie ?', category: 'Famille' },

  // Catégorie 8: Amitié
  { id: 'fr1', question: 'Qu\'est-ce qui compte vraiment pour toi dans une amitié ?', category: 'Amitié' },
  { id: 'fr2', question: 'Qui est ton meilleur ami(e) et pourquoi ?', category: 'Amitié' },
  { id: 'fr3', question: 'Quelle est ta plus belle histoire d\'amitié ?', category: 'Amitié' },
  { id: 'fr4', question: 'Comment fais-tu pour maintenir tes amitiés ?', category: 'Amitié' },
  { id: 'fr5', question: 'Qu\'attends-tu d\'un(e) vrai(e) ami(e) ?', category: 'Amitié' },
  { id: 'fr6', question: 'Qu\'as-tu appris de tes amis ?', category: 'Amitié' },
  { id: 'fr7', question: 'Comment réagis-tu quand un(e) ami(e) te déçoit ?', category: 'Amitié' },
  { id: 'fr8', question: 'Quel genre d\'ami(e) es-tu ?', category: 'Amitié' },
  { id: 'fr9', question: 'Quelle amitié t\'a le plus marqué(e) ?', category: 'Amitié' },
  { id: 'fr10', question: 'Qu\'est-ce qui brise une amitié pour toi ?', category: 'Amitié' },

  // Catégorie 9: Travail
  { id: 'tr1', question: 'Qu\'est-ce qui te passionne dans ton travail ?', category: 'Travail' },
  { id: 'tr2', question: 'Quel est ton plus grand défi professionnel ?', category: 'Travail' },
  { id: 'tr3', question: 'Où te vois-tu dans 5 ans ?', category: 'Travail' },
  { id: 'tr4', question: 'Qu\'est-ce que tu changerais dans ta carrière ?', category: 'Travail' },
  { id: 'tr5', question: 'Quel est ton accomplissement professionnel ?', category: 'Travail' },
  { id: 'tr6', question: 'Comment gères-tu le stress au travail ?', category: 'Travail' },
  { id: 'tr7', question: 'Qu\'est-ce qui te motive le plus ?', category: 'Travail' },
  { id: 'tr8', question: 'Quel métier aurais-tu aimé faire ?', category: 'Travail' },
  { id: 'tr9', question: 'Quelle est ta plus grande force au travail ?', category: 'Travail' },
  { id: 'tr10', question: 'Comment Trouves-tu l\'équilibre vie pro/perso ?', category: 'Travail' },

  // Catégorie 10: Santé
  { id: 'sa1', question: 'Qu\'est-ce qui te donne de l\'énergie ?', category: 'Santé' },
  { id: 'sa2', question: 'Comment prends-tu soin de toi ?', category: 'Santé' },
  { id: 'sa3', question: 'Quelle est ta routine bien-être ?', category: 'Santé' },
  { id: 'sa4', question: 'Qu\'est-ce qui te fait te sentir en forme ?', category: 'Santé' },
  { id: 'sa5', question: 'Comment gères-tu la fatigue ?', category: 'Santé' },
  { id: 'sa6', question: 'Qu\'est-ce qui t\'aide à dormir ?', category: 'Santé' },
  { id: 'sa7', question: 'Quelle habitude aimerais-tu adopter ?', category: 'Santé' },
  { id: 'sa8', question: 'Qu\'est-ce qui te détend le plus ?', category: 'Santé' },
  { id: 'sa9', question: 'Comment restes-tu actif(ve) ?', category: 'Santé' },
  { id: 'sa10', question: 'Qu\'est-ce qui te fait te sentir vivant(e) ?', category: 'Santé' },

  // Catégorie 11: Argent
  { id: 'ar1', question: 'Quelle est ta relation avec l\'argent ?', category: 'Argent' },
  { id: 'ar2', question: 'Comment gères-tu tes finances ?', category: 'Argent' },
  { id: 'ar3', question: 'Qu\'est-ce que tu valorises le plus ?', category: 'Argent' },
  { id: 'ar4', question: 'Quel est ton plus gros achat ?', category: 'Argent' },
  { id: 'ar5', question: 'Comment épargnes-tu ?', category: 'Argent' },
  { id: 'ar6', question: 'Qu\'est-ce que l\'argent t\'apporte ?', category: 'Argent' },
  { id: 'ar7', question: 'Comment partages-tu les dépenses ?', category: 'Argent' },
  { id: 'ar8', question: 'Quelle est ta priorité financière ?', category: 'Argent' },
  { id: 'ar9', question: 'Qu\'est-ce que tu refuses de payer ?', category: 'Argent' },
  { id: 'ar10', question: 'Quel est ton objectif financier ?', category: 'Argent' },

  // Catégorie 12: Loisirs
  { id: 'lo1', question: 'Quel est ton passe-temps préféré ?', category: 'Loisirs' },
  { id: 'lo2', question: 'Qu\'est-ce que tu fais pour te détendre ?', category: 'Loisirs' },
  { id: 'lo3', question: 'Quelle activité aimerais-tu essayer ?', category: 'Loisirs' },
  { id: 'lo4', question: 'Qu\'est-ce qui te passionne ?', category: 'Loisirs' },
  { id: 'lo5', question: 'Comment passerais-tu un week-end parfait ?', category: 'Loisirs' },
  { id: 'lo6', question: 'Quel hobby aimerais-tu partager ?', category: 'Loisirs' },
  { id: 'lo7', question: 'Qu\'est-ce que tu regardes ou écoutes ?', category: 'Loisirs' },
  { id: 'lo8', question: 'Quelle activité t\'apaise ?', category: 'Loisirs' },
  { id: 'lo9', question: 'Qu\'aimerais-tu apprendre ?', category: 'Loisirs' },
  { id: 'lo10', question: 'Qu\'est-ce qui t\'amuse le plus ?', category: 'Loisirs' },

  // Catégorie 13: Valeurs
  { id: 'va1', question: 'Quelle est ta valeur principale ?', category: 'Valeurs' },
  { id: 'va2', question: 'Qu\'est-ce qui est non négociable pour toi ?', category: 'Valeurs' },
  { id: 'va3', question: 'Quelle cause défends-tu ?', category: 'Valeurs' },
  { id: 'va4', question: 'Qu\'est-ce qui définit qui tu es ?', category: 'Valeurs' },
  { id: 'va5', question: 'Quelle valeur veux-tu transmettre ?', category: 'Valeurs' },
  { id: 'va6', question: 'Qu\'est-ce qui te guide dans la vie ?', category: 'Valeurs' },
  { id: 'va7', question: 'Quel principe ne trahis-tu jamais ?', category: 'Valeurs' },
  { id: 'va8', question: 'Qu\'est-ce qui compte le plus pour toi ?', category: 'Valeurs' },
  { id: 'va9', question: 'Quelle est ta définition du succès ?', category: 'Valeurs' },
  { id: 'va10', question: 'Qu\'est-ce qui te rend fier(e) de toi ?', category: 'Valeurs' },

  // Catégorie 14: Spiritualité
  { id: 'sp1', question: 'Crois-tu en quelque chose de supérieur ?', category: 'Spiritualité' },
  { id: 'sp2', question: 'Qu\'est-ce qui te donne de l\'espoir ?', category: 'Spiritualité' },
  { id: 'sp3', question: 'Comment trouves-tu la paix intérieure ?', category: 'Spiritualité' },
  { id: 'sp4', question: 'Qu\'est-ce qui t\'émerveille ?', category: 'Spiritualité' },
  { id: 'sp5', question: 'Comment pratique-tu la gratitude ?', category: 'Spiritualité' },
  { id: 'sp6', question: 'Qu\'est-ce qui te connecte à quelque chose de plus grand ?', category: 'Spiritualité' },
  { id: 'sp7', question: 'Comment médites-tu ou réfléchis-tu ?', category: 'Spiritualité' },
  { id: 'sp8', question: 'Qu\'est-ce qui donne un sens à ta vie ?', category: 'Spiritualité' },
  { id: 'sp9', question: 'Comment gères-tu les épreuves ?', category: 'Spiritualité' },
  { id: 'sp10', question: 'Qu\'est-ce que tu penses de l\'après ?', category: 'Spiritualité' },

  // Catégorie 15: Intimité
  { id: 'in1', question: 'Qu\'est-ce qui te attire le plus physiquement ?', category: 'Intimité' },
  { id: 'in2', question: 'Comment exprimes-tu ton désir ?', category: 'Intimité' },
  { id: 'in3', question: 'Qu\'est-ce qui te met dans l\'ambiance ?', category: 'Intimité' },
  { id: 'in4', question: 'Quel est ton fantasme ?', category: 'Intimité' },
  { id: 'in5', question: 'Comment communiques-tu tes besoins ?', category: 'Intimité' },
  { id: 'in6', question: 'Qu\'est-ce qui te fait te sentir désiré(e) ?', category: 'Intimité' },
  { id: 'in7', question: 'Qu\'aimerais-tu explorer ?', category: 'Intimité' },
  { id: 'in8', question: 'Comment définis-tu l\'intimité ?', category: 'Intimité' },
  { id: 'in9', question: 'Qu\'est-ce qui renforce notre connexion ?', category: 'Intimité' },
  { id: 'in10', question: 'Comment veux-tu que je t\'exprime mon amour ?', category: 'Intimité' },

  // Catégorie 16: Communication
  { id: 'co1', question: 'Comment préfères-tu exprimer tes sentiments ?', category: 'Communication' },
  { id: 'co2', question: 'Qu\'est-ce qui t\'aide à écouter ?', category: 'Communication' },
  { id: 'co3', question: 'Comment réagis-tu lors d\'un conflit ?', category: 'Communication' },
  { id: 'co4', question: 'Qu\'est-ce qui te met sur la défensive ?', category: 'Communication' },
  { id: 'co5', question: 'Comment demandes-tu de l\'aide ?', category: 'Communication' },
  { id: 'co6', question: 'Qu\'est-ce qui te fait te compris(e) ?', category: 'Communication' },
  { id: 'co7', question: 'Comment partages-tu tes pensées ?', category: 'Communication' },
  { id: 'co8', question: 'Qu\'est-ce qui améliore nos conversations ?', category: 'Communication' },
  { id: 'co9', question: 'Comment réagis-tu aux critiques ?', category: 'Communication' },
  { id: 'co10', question: 'Qu\'est-ce qui te pousse à te taire ?', category: 'Communication' },

  // Catégorie 17: Confiance
  { id: 'cn1', question: 'Qu\'est-ce qui bâtir la confiance pour toi ?', category: 'Confiance' },
  { id: 'cn2', question: 'Comment montres-tu que tu fais confiance ?', category: 'Confiance' },
  { id: 'cn3', question: 'Qu\'est-ce qui brise la confiance ?', category: 'Confiance' },
  { id: 'cn4', question: 'Comment reconstruis-tu la confiance ?', category: 'Confiance' },
  { id: 'cn5', question: 'Qu\'est-ce qui te fait te sentir en sécurité ?', category: 'Confiance' },
  { id: 'cn6', question: 'Comment sais-tu que tu peux faire confiance ?', category: 'Confiance' },
  { id: 'cn7', question: 'Quel rôle joue la confiance dans notre couple ?', category: 'Confiance' },
  { id: 'cn8', question: 'Qu\'est-ce qui te rend méfiant(e) ?', category: 'Confiance' },
  { id: 'cn9', question: 'Comment exprimes-tu tes doutes ?', category: 'Confiance' },
  { id: 'cn10', question: 'Qu\'est-ce qui rassure ?', category: 'Confiance' },

  // Catégorie 18: Engagement
  { id: 'em1', question: 'Qu\'est-ce que l\'engagement signifie pour toi ?', category: 'Engagement' },
  { id: 'em2', question: 'Comment t\'engages-tu dans notre couple ?', category: 'Engagement' },
  { id: 'em3', question: 'Qu\'est-ce qui renforce ton engagement ?', category: 'Engagement' },
  { id: 'em4', question: 'Comment définis-tu la fidélité ?', category: 'Engagement' },
  { id: 'em5', question: 'Quel sacrifice ferais-tu pour nous ?', category: 'Engagement' },
  { id: 'em6', question: 'Qu\'est-ce qui te pousse à rester ?', category: 'Engagement' },
  { id: 'em7', question: 'Comment montres-tu ton engagement quotidiennement ?', category: 'Engagement' },
  { id: 'em8', question: 'Qu\'est-ce qui t\'effraie dans l\'engagement ?', category: 'Engagement' },
  { id: 'em9', question: 'Quel est ton niveau d\'engagement ?', category: 'Engagement' },
  { id: 'em10', question: 'Qu\'est-ce qui fait durer un couple ?', category: 'Engagement' },

  // Catégorie 19: Croissance
  { id: 'cr1', question: 'Qu\'est-ce qui t\'a fait grandir ?', category: 'Croissance' },
  { id: 'cr2', question: 'Comment te develops-tu personnellement ?', category: 'Croissance' },
  { id: 'cr3', question: 'Qu\'aimerais-tu améliorer chez toi ?', category: 'Croissance' },
  { id: 'cr4', question: 'Comment notre relation t\'a fait évoluer ?', category: 'Croissance' },
  { id: 'cr5', question: 'Qu\'est-ce qui te pousse à te dépasser ?', category: 'Croissance' },
  { id: 'cr6', question: 'Quel est ton prochain défi personnel ?', category: 'Croissance' },
  { id: 'cr7', question: 'Comment apprends-tu de tes erreurs ?', category: 'Croissance' },
  { id: 'cr8', question: 'Qu\'est-ce qui t\'inspire à devenir meilleur(e) ?', category: 'Croissance' },
  { id: 'cr9', question: 'Quelle habitude veux-tu développer ?', category: 'Croissance' },
  { id: 'cr10', question: 'Comment mesures-tu ta croissance ?', category: 'Croissance' },

  // Catégorie 20: Gratitude
  { id: 'gr1', question: 'De quoi es-tu reconnaissant(e) aujourd\'hui ?', category: 'Gratitude' },
  { id: 'gr2', question: 'Qu\'est-ce que tu apprécies chez moi ?', category: 'Gratitude' },
  { id: 'gr3', question: 'Quel moment de la journée chérirais-tu ?', category: 'Gratitude' },
  { id: 'gr4', question: 'Qu\'est-ce qui te rend heureux/heureuse ?', category: 'Gratitude' },
  { id: 'gr5', question: 'Pour qui es-tu reconnaissant(e) ?', category: 'Gratitude' },
  { id: 'gr6', question: 'Qu\'est-ce que tu ne remarques pas assez ?', category: 'Gratitude' },
  { id: 'gr7', question: 'Comment exprimes-tu ta reconnaissance ?', category: 'Gratitude' },
  { id: 'gr8', question: 'Qu\'est-ce que tu as et que d\'autres n\'ont pas ?', category: 'Gratitude' },
  { id: 'gr9', question: 'Qu\'est-ce qui te fait te sentir béni(e) ?', category: 'Gratitude' },
  { id: 'gr10', question: 'Quelle petite chose apprécies-tu chaque jour ?', category: 'Gratitude' },
];

export const QUIZZES: Quiz[] = [
  {
    id: 'petites-nouvelles',
    title: 'Petites nouvelles au quotidien',
    description: 'Comment connaissez-vous les habitudes de votre partenaire ?',
    color: '#FDDCB5',
    textColor: '#8B4513',
    emoji: '📅',
    questions: [
      { question: 'Quelle est la boisson préférée de ton partenaire le matin ?', options: ['Café', 'Thé', 'Jus d\'orange', 'Eau'], correctIndex: 0 },
      { question: 'Combien d\'heures de sommeil ton partenaire a-t-il/elle besoin ?', options: ['Moins de 6h', '6-7h', '7-8h', 'Plus de 8h'], correctIndex: 2 },
      { question: 'Comment ton partenaire préfère-t-il/elle commencer son week-end ?', options: ['Grasse matinée', 'Sport', 'Brunch', 'Activité'], correctIndex: 0 },
      { question: 'Quel type de musique écoute ton partenaire quand il/elle se concentre ?', options: ['Silence', 'Classique', 'Pop', 'Podcasts'], correctIndex: 1 },
      { question: 'Quelle est la première chose que fait ton partenaire en rentrant ?', options: ['Téléphone', 'Se changer', 'Embrasser', 'Manger'], correctIndex: 2 },
      { question: 'Quel est le film que ton partenaire pourrait revoir ?', options: ['Action', 'Comédie', 'Horreur', 'Documentaire'], correctIndex: 1 },
      { question: 'Quand ton partenaire est stressé(e), que fait-il/elle ?', options: ['Sport', 'Musique', 'Parler', 'Seul(e)'], correctIndex: 3 },
      { question: 'Quelle est la saison préférée de ton partenaire ?', options: ['Printemps', 'Été', 'Automne', 'Hiver'], correctIndex: 1 },
      { question: 'Comment ton partenaire prend-il/elle son café ?', options: ['Noir', 'Lait', 'Sucre', 'Pas de café'], correctIndex: 0 },
      { question: 'Quelle est la couleur préférée de ton partenaire ?', options: ['Bleu', 'Vert', 'Rouge', 'Violet'], correctIndex: 0 },
    ],
  },
  {
    id: 'connais-tu',
    title: 'À quel point me connais-tu ?',
    description: 'Prouvez que vous vous connaissez mieux que quiconque',
    color: '#D8D0F5',
    textColor: '#4A2080',
    emoji: '💜',
    questions: [
      { question: 'Quelle est la peur principale de ton partenaire ?', options: ['Solitude', 'Échec', 'Maladie', 'Perdre ses proches'], correctIndex: 3 },
      { question: 'Si ton partenaire pouvait avoir un superpouvoir ?', options: ['Voler', 'Lire les pensées', 'Voyager dans le temps', 'Invisible'], correctIndex: 2 },
      { question: 'Quelle est la plus grande qualité de ton partenaire ?', options: ['Honnêteté', 'Humour', 'Empathie', 'Détermination'], correctIndex: 0 },
      { question: 'Quel est le rêve professionnel non réalisé ?', options: ['Entreprise', 'Voyage', 'Enseigner', 'Écrire'], correctIndex: 3 },
      { question: 'Comment ton partenaire réagit-il en conflit ?', options: ['Direct', 'Se retire', 'Compromis', 'Évite'], correctIndex: 1 },
      { question: 'De quoi ton partenaire est-il le plus nostalgique ?', options: ['Enfance', 'Ville', 'Amis', 'Période'], correctIndex: 0 },
      { question: 'Que ferait ton partenaire avec 1 million ?', options: ['Investir', 'Voyager', 'Famille', 'Maison'], correctIndex: 2 },
      { question: 'Quelle est la cuisine préférée de ton partenaire ?', options: ['Italienne', 'Japonaise', 'Française', 'Indienne'], correctIndex: 1 },
      { question: 'Quel est le sport préféré de ton partenaire ?', options: ['Football', 'Tennis', 'Natation', 'Course'], correctIndex: 2 },
      { question: 'Quelle est la chanson qui fait sourire ton partenaire ?', options: ['Pop', 'Rock', 'R&B', 'Électro'], correctIndex: 0 },
    ],
  },
  {
    id: 'nos-souvenirs',
    title: 'Nos souvenirs ensemble',
    description: 'Testez votre mémoire des moments partagés',
    color: '#C8E6C9',
    textColor: '#1B5E20',
    emoji: '📸',
    questions: [
      { question: 'Où avez-vous eu votre premier rendez-vous ?', options: ['Restaurant', 'Bar', 'Parc', 'Ciné'], correctIndex: 0 },
      { question: 'Quelle était la météo lors de votre premier baiser ?', options: ['Soleil', 'Pluie', 'Nuages', 'Neige'], correctIndex: 0 },
      { question: 'Quel était le premier cadeau offert ?', options: ['Fleurs', 'Livre', 'Bijou', 'Sortie'], correctIndex: 1 },
      { question: 'Quel est le premier voyage fait ensemble ?', options: ['France', 'Europe', 'Ville', 'Camping'], correctIndex: 2 },
      { question: 'Quelle chanson associez-vous à vos débuts ?', options: ['Romantique', 'Pop', 'Film', 'Enfance'], correctIndex: 0 },
      { question: 'Quel est votre surnom principal ?', options: ['Amour', 'Chéri', 'Personnalisé', 'Prénom'], correctIndex: 2 },
      { question: 'Quel est le premier film regardé ensemble ?', options: ['Action', 'Romantique', 'Comédie', 'Peur'], correctIndex: 1 },
      { question: 'Où étiez-vous pour votre premier Noël ensemble ?', options: ['Chez moi', 'Chez toi', 'Voyage', 'Famille'], correctIndex: 0 },
      { question: 'Quelle était votre première grande dispute ?', options: ['Ménage', 'Argent', 'Famille', 'Jalousie'], correctIndex: 1 },
      { question: 'Quelle est votre première photo ensemble ?', options: ['Selfie', 'Pro', 'Voyage', 'Fête'], correctIndex: 0 },
    ],
  },
  {
    id: 'reves-projets',
    title: 'Rêves & Projets',
    description: 'Explorez vos envies et projets de vie ensemble',
    color: '#B3D9F5',
    textColor: '#0D3A5E',
    emoji: '🌟',
    questions: [
      { question: 'Dans quelle ville rêvez-vous de vivre ?', options: ['Paris', 'New York', 'Tokyo', 'Barcelone'], correctIndex: 2 },
      { question: 'Dans 5 ans, où vous voyez-vous ?', options: ['Même ville', 'Étranger', 'Campagne', 'Voyage'], correctIndex: 0 },
      { question: 'Quel projet professionnel partagez-vous ?', options: ['Entreprise', 'Même domaine', 'Soutien', 'Indépendance'], correctIndex: 2 },
      { question: 'Quelle aventure voudriez-vous vivre ?', options: ['Tour du monde', 'Mer', 'Maison', 'Ferme'], correctIndex: 0 },
      { question: 'Quel héritage voulez-vous laisser ?', options: ['Exemple d\'amour', 'Artistique', 'Communauté', 'Enfants'], correctIndex: 0 },
      { question: 'Quelle tradition voulez-vous instaurer ?', options: ['Voyage annuel', 'Rituel', 'Caritatif', 'Soirées'], correctIndex: 0 },
      { question: 'Comment imaginez-vous votre retraite ?', options: ['Pays chaud', 'Maison', 'Voyage', 'Famille'], correctIndex: 2 },
      { question: 'Combien d\'enfants voulez-vous ?', options: ['0', '1', '2', '3+'], correctIndex: 2 },
      { question: 'Quel type de maison rêvez-vous ?', options: ['Appartement', 'Maison', 'Villa', 'Cabane'], correctIndex: 1 },
      { question: 'Quelle langue voudriez-vous apprendre ensemble ?', options: ['Anglais', 'Espagnol', 'Italien', 'Japonais'], correctIndex: 0 },
    ],
  },
];

export const TODAY_ACTIVITIES = {
  quiz: QUIZZES[0],
  question: DAILY_QUESTIONS[0],
  game: GAMES[0],
};
