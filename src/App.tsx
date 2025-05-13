/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Check, X, ChevronRight, Award, BookOpen, Sun, Moon, Lightbulb } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  choices: string[];
  correctIndex: number;
  explication: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// QUESTIONS
const QCM_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Le droit de la sécurité sociale…",
    choices: [
      "régit les relations collectives entre les salariés et les employeurs privés.",
      "rassemble les règles dont l’objectif est de garantir l’individu contre certains risques sociaux.",
      "comprend le droit du travail.",
      "régit les relations entre les fonctionnaires et l’administration qui les emploie."
    ],
    correctIndex: 1,
    explication: "Il rassemble les règles destinées à protéger l'individu contre les risques sociaux (maladie, vieillesse, chômage)."
  },
  {
    id: 2,
    question: "Les traités internationaux…",
    choices: [
      "sont conclus entre les organisations syndicales de salariés et d’employeurs représentatives dans leur champ d’application.",
      "ne peuvent être conclus qu’entre deux États.",
      "sont, le plus souvent, négociés au sein de l’Organisation Internationale du Travail lorsqu’ils concernent le droit du travail.",
      "ne peuvent porter que sur le droit du travail."
    ],
    correctIndex: 2,
    explication: "Dans le domaine social, les conventions multilatérales sont majoritairement négociées à l'OIT avant d'être ouvertes à la ratification des États."
  },
  {
    id: 3,
    question: "L’Organisation Internationale du travail est…",
    choices: [
      "une agence spécialisée du Conseil de l’Europe.",
      "une agence spécialisée de l’ONU sur les questions de droit social.",
      "une agence spécialisée de l’ONU sur les questions culturelles.",
      "une agence spécialisée de l’Union Européenne."
    ],
    correctIndex: 1,
    explication: "L'OIT est, depuis 1946, l'agence spécialisée de l'ONU chargée des normes internationales du travail."
  },
  {
    id: 4,
    question: "La Charte sociale européenne…",
    choices: [
      "peut être invoquée devant la Cour Européenne des Droits de l’Homme dont le rôle est de veiller à son application par les États signataires.",
      "a été rédigée par l’Union Européenne.",
      "ne s’impose pas au juge français selon la Cour de cassation (absence d’effet direct).",
      "n’a pas été ratifiée par la France."
    ],
    correctIndex: 2,
    explication: "La Cour de cassation considère que la Charte sociale européenne n'a pas d'effet direct et ne peut donc être invoquée directement devant les juridictions françaises."
  },
  {
    id: 5,
    question: "Les règlements communautaires…",
    choices: [
      "ne s’imposent pas au juge national (pas d’effet direct).",
      "ne sont pas contraignants pour les États membres.",
      "ne peuvent pas concerner la réglementation du travail.",
      "s’imposent immédiatement aux États membres."
    ],
    correctIndex: 3,
    explication: "En droit de l'Union, le règlement est d'application directe et obligatoire dans tous ses éléments dès sa publication."
  },
  {
    id: 6,
    question: "Lequel de ces actes susceptibles d’être pris par les institutions de l’Union Européenne n’est pas contraignant ?",
    choices: [
      "la décision",
      "la recommandation",
      "le règlement",
      "la directive"
    ],
    correctIndex: 1,
    explication: "Les recommandations expriment seulement une invitation à agir et n'ont aucune force obligatoire pour les États membres."
  },
  {
    id: 7,
    question: "La Cour de Justice de l’Union Européenne…",
    choices: [
      "peut être interrogée par une juridiction nationale sur l’application du droit communautaire.",
      "veille au respect de la Convention Européenne de Sauvegarde des Droits de l’Homme.",
      "ne peut pas être saisie que par un État membre (jamais par un particulier ou une entreprise).",
      "est la seule institution juridictionnelle de l’Union Européenne."
    ],
    correctIndex: 0,
    explication: "Le mécanisme de la question préjudicielle permet à toute juridiction nationale de demander à la CJUE d'interpréter le droit de l'Union."
  },
  {
    id: 8,
    question: "Lequel de ces textes ne fait pas partie du « bloc de constitutionnalité » ?",
    choices: [
      "Les lois constitutionnelles de 1785.",
      "La Constitution du 4 octobre 1958.",
      "La Charte de l’environnement de 2004.",
      "Le préambule de la Constitution de 1946."
    ],
    correctIndex: 0,
    explication: "Il n'existe pas de lois constitutionnelles de 1785 ; c'est donc le seul texte cité qui ne figure pas dans le bloc de constitutionnalité."
  },
  {
    id: 9,
    question: "Laquelle de ces propositions est exacte ?",
    choices: [
      "Les sujets relevant de la loi sont limitativement énumérés par la Constitution.",
      "Le recours à l’article 49-3 de la Constitution permet au gouvernement la promulgation de loi sans vote du Parlement.",
      "Le Conseil constitutionnel n’a qu’un rôle consultatif.",
      "Les ordonnances permettent au gouvernement d’adopter des textes relevant du domaine législatif avec l’accord du Parlement."
    ],
    correctIndex: 3,
    explication: "L'article 38 de la Constitution autorise le gouvernement, après habilitation par le Parlement, à légiférer par ordonnances dans le domaine de la loi."
  },
  {
    id: 10,
    question: "Laquelle de ces propositions est inexacte ?",
    choices: [
      "Les décrets d’application permettent d’apporter les précisions nécessaires à la mise en œuvre des lois.",
      "Les textes d’origine réglementaire ont une valeur supérieure aux lois.",
      "Le numéro des articles du code du travail d’origine réglementaire est précédé de la lettre R ou D.",
      "Les décrets autonomes traitent des sujets ne relevant pas du domaine législatif."
    ],
    correctIndex: 1,
    explication: "Le pouvoir réglementaire est placé sous la loi ; il ne lui est donc jamais supérieur."
  },
  {
    id: 11,
    question: "Selon la pyramide de KELSEN (de la plus importante à la moins importante) :",
    choices: [
      "Bloc de constitutionnalité / Bloc de légalité / Bloc de conventionnalité / Bloc réglementaire",
      "Bloc de conventionnalité / Bloc de constitutionnalité / Bloc de légalité / Bloc réglementaire",
      "Bloc réglementaire / Bloc de légalité / Bloc de conventionnalité / Bloc de constitutionnalité",
      "Bloc de constitutionnalité / Bloc de conventionnalité / Bloc de légalité / Bloc réglementaire"
    ],
    correctIndex: 3,
    explication: "La hiérarchie des normes place d'abord la Constitution, puis les traités internationaux, ensuite la loi, et enfin les règlements."
  },
  {
    id: 12,
    question: "Lequel de ces critères n’est pas pris en compte pour apprécier la représentativité des organisations syndicales de salariés et des organisations professionnelles d’employeurs ?",
    choices: [
      "Justifier d’une implantation sur tout le territoire national",
      "Disposer d’une audience suffisante parmi ceux qu’elles entendent représenter",
      "Être financièrement transparente",
      "Respect des valeurs républicaines"
    ],
    correctIndex: 0,
    explication: "La loi ne fait pas de l'implantation sur tout le territoire un critère de représentativité ; l'audience, la transparence financière et le respect des valeurs républicaines sont en revanche exigés."
  },
  {
    id: 13,
    question: "Pour être applicable, un accord ou une convention de branche…",
    choices: [
      "doit être étendu par un arrêté préfectoral.",
      "doit être signé par une ou plusieurs organisations syndicales de salariés représentant au moins 50 %.",
      "ne doit pas avoir fait l’objet d’une opposition par une ou plusieurs organisations syndicales représentant au moins 50 %.",
      "doit être signé par une ou plusieurs organisations patronales dont les adhérents occupent au moins 50 % des effectifs."
    ],
    correctIndex: 2,
    explication: "Depuis la loi de 2016, l'accord est valable sauf opposition de syndicats majoritaires (≥ 50 % des voix) dans un délai déterminé."
  },
  {
    id: 14,
    question: "Laquelle de ces organisations patronales n’a pas été considérée comme représentative au niveau national et interprofessionnel par l’arrêté du 18 novembre 2021 ?",
    choices: [
      "La Confédération des Petites et Moyennes Entreprises (CPME)",
      "L’Union des Entreprises de Proximité (U2P)",
      "Le Mouvement des Entreprises de France (MEDEF)",
      "L’Union des Employeurs de l’Économie Sociale et Solidaire (UDES)"
    ],
    correctIndex: 3,
    explication: "L'arrêté du 18 novembre 2021 a reconnu le MEDEF, la CPME et l'U2P comme organisations représentatives, pas l'UDES."
  },
  {
    id: 15,
    question: "Laquelle de ces propositions est inexacte ?",
    choices: [
      "Un employeur peut librement décider d’appliquer une convention de branche signée par une organisation patronale dont il n’est pas adhérent.",
      "Il suffit à une entreprise adhérente à une organisation patronale signataire de la quitter (désadhérer) pour ne plus être tenue d’appliquer la convention de branche signée par cette dernière.",
      "Une convention de branche non étendue ne s’applique qu’aux entreprises adhérentes aux organisations patronales signataires.",
      "Seuls les salariés adhérents à l’une des organisations syndicales signataires peuvent bénéficier des dispositions d’une convention de branche non étendue."
    ],
    correctIndex: 1,
    explication: "La désaffiliation ne libère pas rétroactivement l'entreprise des conventions signées avant son départ ; elle reste tenue d'appliquer les textes conclus auparavant."
  },
  {
    id: 16,
    question: "Laquelle de ces propositions est inexacte ?",
    choices: [
      "La procédure d’élargissement permet de rendre une convention collective de branche obligatoire pour les entreprises relevant d’un autre secteur d’activité que celui initialement couvert.",
      "La procédure d’extension permet de rendre une convention collective de branche obligatoire à toutes les entreprises du secteur concerné, qu’elles soient ou non adhérentes à l’une des organisations patronales signataires.",
      "Très peu de conventions collectives de branche font l’objet d’un arrêté d’extension.",
      "Les organisations patronales non-signataires peuvent, sous certaines conditions, s’opposer à l’entrée en vigueur d’une convention de branche."
    ],
    correctIndex: 2,
    explication: "En réalité, la majorité des conventions de branche sont étendues ; il est donc inexact de dire qu'elles sont 'très peu' à l'être."
  },
  {
    id: 17,
    question: "Dans les entreprises disposant de délégués syndicaux…",
    choices: [
      "Un accord d’entreprise est applicable dès lors qu’il est signé par des délégués syndicaux représentant 8 % du personnel.",
      "Un accord d’entreprise est applicable dès lors qu’il est signé par un ou plusieurs délégués syndicaux représentant au moins 50 % des suffrages exprimés en faveur d’organisations représentatives au premier tour des dernières élections professionnelles.",
      "Un accord d’entreprise peut être négocié avec des membres élus du CSE.",
      "Un accord d’entreprise est applicable dès lors qu’il est signé par au moins trois délégués syndicaux indépendamment de leur représentativité dans l’entreprise."
    ],
    correctIndex: 1,
    explication: "Le seuil majoritaire de 50 % des suffrages exprimés au premier tour des élections professionnelles conditionne la validité des accords d'entreprise."
  },
  {
    id: 18,
    question: "Laquelle de ces propositions est inexacte ?",
    choices: [
      "Le principe de faveur permet aux partenaires sociaux de déroger à des normes relevant de l’ordre public absolu.",
      "Les dispositions « supplétives » du code du travail s’imposent uniquement en l’absence de normes définies par accord collectif.",
      "Le principe de faveur est une exception au principe de hiérarchie des normes spécifique au droit du travail.",
      "Le principe de faveur permet, dans certaines conditions, de faire prévaloir la norme issue d’un accord collectif sur celle issue du code du travail dès lors qu’elle est plus favorable pour les salariés."
    ],
    correctIndex: 0,
    explication: "Le principe de faveur ne permet jamais de déroger aux règles d'ordre public absolu, lesquelles sont impératives et intangibles."
  },
  {
    id: 19,
    question: "Laquelle de ces normes n’est pas d’origine jurisprudentielle ?",
    choices: [
      "l’accord atypique",
      "le règlement intérieur",
      "l’usage d’entreprise",
      "l’engagement unilatéral"
    ],
    correctIndex: 1,
    explication: "Le règlement intérieur est directement encadré par le Code du travail, alors que les trois autres notions résultent initialement de la jurisprudence."
  },
  {
    id: 20,
    question: "Laquelle de ces caractéristiques ne permet pas d’identifier un usage d’entreprise ?",
    choices: [
      "La fixité de l’avantage accordé aux salariés",
      "La constance de l’avantage accordé aux salariés",
      "La généralité de l’avantage accordé aux salariés",
      "La conclusion d’un accord collectif reconnaissant l’avantage accordé aux salariés"
    ],
    correctIndex: 3,
    explication: "Un usage se définit par la constance, la généralité et la fixité de l'avantage ; la conclusion d'un accord collectif n'entre pas dans ces critères."
  },
  {
    id: 21,
    question: "Laquelle de ces caractéristiques est propre au contrat de travail et permet de le distinguer du contrat d’entreprise ?",
    choices: [
      "l’existence d’un lien de subordination juridique",
      "la réalisation d’une prestation",
      "la dépendance économique entre les cocontractants",
      "le versement d’une contrepartie financière"
    ],
    correctIndex: 0,
    explication: "Seul le contrat de travail implique un lien de subordination juridique qui se matérialise par les pouvoirs de direction, contrôle et sanction."
  },
  {
    id: 22,
    question: "Lequel de ces éléments n’entre pas dans la définition du lien de subordination juridique ?",
    choices: [
      "Le pouvoir de sanctionner",
      "Le pouvoir de contrôler",
      "Le pouvoir de commander",
      "L’intégration à un service organisé"
    ],
    correctIndex: 3,
    explication: "La définition classique repose sur les trois pouvoirs : commander, contrôler et sanctionner ; l'intégration à un service organisé n'est qu'un indice facultatif."
  },
  {
    id: 23,
    question: "Laquelle de ces propositions est inexacte ?",
    choices: [
      "Le fait qu’un chauffeur puisse être déconnecté provisoirement ou définitivement de l’application en cas de refus de course ou de signalements négatifs de clients caractérise, pour la Cour de cassation, le pouvoir de sanction dont dispose la plateforme qui propose l’application.",
      "Selon la jurisprudence actuelle, le seul fait de mettre en relation un client avec un chauffeur (VTC) suffit à qualifier de contrat de travail la relation qui lie ce chauffeur à la plateforme numérique qui assure cette mise en relation.",
      "Le fait qu’une application de mise en relation permette à la plateforme qui la propose de géolocaliser le chauffeur qui l’utilise démontre, pour la Cour de cassation, l’existence d’un contrôle de la plateforme sur la prestation réalisée par le chauffeur.",
      "Le juge n’est pas lié par la qualification donnée par les parties à leur relation."
    ],
    correctIndex: 1,
    explication: "La Cour de cassation exige qu'un lien de subordination soit démontré ; la simple mise en relation par plateforme ne suffit pas en soi à qualifier un contrat de travail."
  },
  {
    id: 24,
    question: "Laquelle de ces propositions est inexacte ?",
    choices: [
      "La rédaction d’un contrat de travail signé par les parties est obligatoire même en cas de recrutement sur un emploi à temps plein exercé pour une durée indéterminée (CDI temps plein).",
      "Les clauses du contrat de travail peuvent restreindre l’exercice par le salarié de ses libertés individuelles ou collectives à la double condition que ces restrictions soient justifiées par la nature de la tâche à accomplir et proportionnées au but recherché.",
      "Les clauses du contrat de travail ne peuvent pas être moins favorables au salarié que le code du travail ou les accords collectifs applicables sauf si des dérogations en ce sens sont prévues par le code du travail ou lesdits accords.",
      "Le code du travail interdit l’insertion de certaines clauses dans les contrats de travail (clause de responsabilité financière, clause d’indexation du salaire sur le SMIC, etc.)."
    ],
    correctIndex: 0,
    explication: "En droit français, le CDI à temps plein peut être conclu verbalement ; l’écrit n’est exigé que pour certaines mentions particulières (temps partiel, clauses spécifiques, etc.). La proposition affirmant son caractère obligatoire est donc inexacte."
  },
  {
    id: 25,
    question: "Laquelle de ces propositions est exacte ?",
    choices: [
      "Le salarié peut, en principe, imposer à son employeur un changement de ses conditions de travail.",
      "L’employeur peut, en principe, imposer à son salarié un changement de ses conditions de travail.",
      "Le salarié peut, en principe, imposer à son employeur la modification d’un élément de son contrat de travail.",
      "L’employeur peut, en principe, imposer à son salarié la modification d’un élément de son contrat de travail."
    ],
    correctIndex: 1,
    explication: "Relèvent du pouvoir de direction de l’employeur les modifications des conditions de travail (lieu, horaires, méthodes) dès lors qu’elles n’affectent pas un élément essentiel du contrat."
  },
  {
    id: 26,
    question: "Laquelle de ces propositions est inexacte ?",
    choices: [
      "L’employeur peut unilatéralement imposer un changement de ses conditions de travail à un salarié sauf si cette mesure entraîne le bouleversement de l’économie même du contrat.",
      "L’employeur peut unilatéralement imposer un changement de ses conditions de travail à un salarié sauf si sa décision est discriminatoire ou caractérise un abus de droit.",
      "L’employeur peut unilatéralement imposer un changement de ses conditions de travail à un salarié sauf si cette mesure entraîne incidemment la modification d’un élément de son contrat de travail.",
      "L’employeur peut unilatéralement imposer un changement de ses conditions de travail à un salarié sans que celui-ci ne puisse jamais s’y opposer."
    ],
    correctIndex: 3,
    explication: "Le salarié peut refuser la modification de son contrat ou une mesure abusive ; l’idée qu’il ne pourrait ‘jamais’ s’y opposer est donc erronée."
  },
  {
    id: 27,
    question: "Laquelle de ces propositions est inexacte ?",
    choices: [
      "Le transfert légal des contrats de travail prévu en cas de cession d’entreprise concerne tous les salariés en activité au moment de la cession, quel que soit leur contrat de travail.",
      "Le transfert légal des contrats de travail s’impose au repreneur mais aussi aux salariés transférés qui, s’ils refusent de travailler pour leur nouvel employeur, peuvent être sanctionnés voire licenciés pour motif disciplinaire.",
      "En cas de ‘transfert d’une entité économique conservant son identité et dont l’activité est poursuivie ou reprise’, le code du travail prévoit que les contrats de travail des salariés se poursuivent auprès du repreneur.",
      "Le transfert conventionnel prévu par certaines conventions collectives en cas de perte de marché (nettoyage, sécurité, etc.) s’impose au repreneur mais aussi aux salariés qui, s’ils refusent de travailler pour leur nouvel employeur, peuvent être sanctionnés voire licenciés pour motif disciplinaire."
    ],
    correctIndex: 3,
    explication: "En cas de transfert conventionnel, le salarié peut refuser la poursuite de son contrat ; il ne s’expose pas à une sanction disciplinaire pour ce motif. L’affirmation est donc inexacte."
  },
  {
    id: 28,
    question: "Laquelle de ces mesures ne constitue pas une sanction disciplinaire ?",
    choices: [
      "la mise à pied conservatoire",
      "l’avertissement écrit",
      "la rétrogradation",
      "la mise à pied disciplinaire"
    ],
    correctIndex: 0,
    explication: "La mise à pied conservatoire est une mesure provisoire visant à écarter le salarié dans l’attente d’une sanction éventuelle ; elle n’est pas, en elle‑même, une sanction disciplinaire."
  },
  {
    id: 29,
    question: "Laquelle de ces propositions, concernant la convocation à l’entretien préalable en matière disciplinaire (hors licenciement), est inexacte ?",
    choices: [
      "La convocation doit préciser au salarié sa faculté d’y être assisté par un membre du personnel.",
      "La convocation doit lui être adressée dans un délai ‘suffisant’.",
      "La convocation doit préciser les faits reprochés au salarié.",
      "La convocation doit préciser l’objet de l’entretien."
    ],
    correctIndex: 2,
    explication: "Pour les sanctions autres que le licenciement, la lettre de convocation n’a pas à détailler les faits reprochés ; cette obligation vaut uniquement en matière de licenciement disciplinaire."
  },
  {
    id: 30,
    question: "Laquelle de ces propositions est inexacte ?",
    choices: [
      "La démission doit être acceptée par l’employeur.",
      "Le salarié n’a pas à justifier d’un motif légitime pour démissionner.",
      "L’employeur peut désormais considérer un salarié absent comme démissionnaire si celui-ci ne répond pas, dans les quinze jours, à une mise en demeure de reprendre le travail ou de justifier de son absence.",
      "La démission doit résulter d’une volonté claire et non équivoque."
    ],
    correctIndex: 0,
    explication: "La démission est un acte unilatéral du salarié ; elle n’a pas à être acceptée par l’employeur, lequel ne peut que l’enregistrer."
  }
];

// Cercle dynamique pour stats
function StatCircle({ value, max, color, label, labelColor }: { value: number, max: number, color: string, label: string, labelColor: string }) {
  const radius = 28;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const strokeDashoffset = circumference * (1 - percent);

  // Utilisation des classes Tailwind pour le mode sombre
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
        <svg height={radius * 2} width={radius * 2} className="drop-shadow-md">
          <circle
            className="dark:stroke-gray-700 dark:fill-gray-800"
            stroke="#f3f4f6"
            fill="#f9fafb"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.7s cubic-bezier(.4,2,.6,1)' }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span
          className="absolute text-base font-extrabold select-none"
          style={{ color: color, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          {value}
        </span>
      </div>
      <span className="text-xs mt-1 font-medium" style={{ color: labelColor }}>{label}</span>
    </div>
  );
}

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const colors = darkMode
    ? {
      primary: '#6366f1', // indigo-500
      secondary: '#a21caf',
      background: '#18181b',
      text: '#f3f4f6',
      card: '#232336',
      border: '#312e81',
      progressBg: '#374151',
      statLabel: '#d1d5db',
      gradientStart: '#1e1b4b', // indigo-950
      gradientMiddle: '#1e1e3b',
      gradientEnd: '#0f172a', // slate-900
    }
    : {
      primary: '#6366f1',
      secondary: '#a21caf',
      background: 'white',
      text: '#111827',
      card: 'white',
      border: '#e0e7ff',
      gradientStart: '#f8fafc', // slate-50
      gradientMiddle: '#f1f5f9', // slate-100
      gradientEnd: '#e2e8f0', // slate-200
      progressBg: '#e5e7eb',
      statLabel: '#6b7280',
    };

  // Charger et mélanger les questions au montage
  useEffect(() => {
    const shuffled = shuffleArray(QCM_QUESTIONS);
    setQuestions(shuffled);
    setAnswers(Array(shuffled.length).fill(null));
  }, []);

  useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowAnswer(false);
    setQuizCompleted(false);
    setSelectedOption(null);
  }, [questions]);

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswer) return;
    setSelectedOption(optionIndex);
  };

  const calculateFinalScore = () => {
    let rawScore = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctIndex) {
        rawScore += 1;
      } else if (answer !== null && strictMode) {
        rawScore -= 0.5;
      }
    });
    // Ne pas forcer à 0, pour permettre les scores négatifs
    return rawScore;
  };

  const getScoreOutOf20 = () => {
    const rawScore = calculateFinalScore();
    return (rawScore / questions.length) * 20;
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setShowAnswer(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore(score + 1);
    } else if (strictMode) {
      setScore(score - 0.5);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuestions(shuffleArray(questions));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowAnswer(false);
    setQuizCompleted(false);
    setAnswers(Array(questions.length).fill(null));
  };

  const getScoreMessage = () => {
    const finalScore = getScoreOutOf20();
    if (finalScore >= 16) return "Excellent !";
    if (finalScore >= 14) return "Très bien !";
    if (finalScore >= 12) return "Bien !";
    if (finalScore >= 8) return "Passable";
    return "À revoir";
  };

  const getStats = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    answers.forEach((answer, index) => {
      if (answer === null) {
        unanswered++;
      } else if (answer === questions[index].correctIndex) {
        correct++;
      } else {
        incorrect++;
      }
    });
    return { correct, incorrect, unanswered };
  };

  if (quizCompleted) {
    const stats = getStats();
    const finalScore = getScoreOutOf20();
    const passed = finalScore >= 8;
    return (
      <div className={`${darkMode ? 'dark' : ''} min-h-screen flex items-center justify-center p-4 bg-pattern animated-gradient`}>
        <div className="rounded-xl shadow-2xl p-8 max-w-md w-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80" 
          style={{ border: `1px solid ${colors.border}` }}>
          <div className="flex flex-col items-center">
            <Award className={`w-20 h-20 ${passed ? 'text-yellow-500' : 'text-gray-400'} mb-4`} />
            <h1 className="text-3xl font-bold text-center mb-2" style={{ color: colors.text }}>Quiz Terminé !</h1>
            <div className="w-full rounded-lg p-4 mb-4" style={{ background: colors.progressBg }}>
              <div className="flex justify-between mb-2">
                <span style={{ color: colors.text }}>Questions totales:</span>
                <span className="font-bold" style={{ color: colors.text }}>{questions.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span style={{ color: colors.text }}>Bonnes réponses:</span>
                <span className="font-bold text-green-600">{stats.correct}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span style={{ color: colors.text }}>Mauvaises réponses:</span>
                <span className="font-bold text-red-600">{stats.incorrect}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span style={{ color: colors.text }}>Sans réponse:</span>
                <span className="font-bold" style={{ color: colors.text }}>{stats.unanswered}</span>
              </div>
            </div>
            <div className="w-full rounded-full h-4 mb-4" style={{ background: colors.progressBg }}>
              <div
                className={`h-4 rounded-full ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${(finalScore / 20) * 100}%` }}
              ></div>
            </div>
            <p className="text-xl mb-2" style={{ color: colors.text }}>
              Note finale: <span className="font-bold">{finalScore.toFixed(1)}/20</span>
            </p>
            <h2 className={`text-2xl font-bold mb-8 ${passed ? 'text-green-600' : 'text-red-600'}`}>{getScoreMessage()}</h2>
            <button
              onClick={resetQuiz}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Recommencer le Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen flex flex-col items-center justify-center p-4 bg-pattern animated-gradient`}>
      {/* Titre, icône et toggle dark mode */}
      <div className="flex justify-center w-full mb-4 max-w-5xl">
        <div className="rounded-xl shadow-lg p-4 flex flex-col items-center max-w-5xl w-full backdrop-blur-sm bg-white/90 dark:bg-gray-900/80" style={{ border: `1px solid ${colors.border}` }}>
          <div className="flex items-center gap-3 justify-center w-full">
            <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-center flex-1" style={{ color: colors.text }}>Droit du travail</h1>
            {/* Toggle dark mode avec icône soleil/lune */}
            <div className="flex items-center gap-2">
              <span>{darkMode ? <Moon className="w-6 h-6 text-indigo-600" /> : <Sun className="w-6 h-6 text-yellow-400" />}</span>
              <button
                onClick={() => setDarkMode((v) => !v)}
                className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                aria-pressed={darkMode}
                title={darkMode ? 'Désactiver le mode sombre' : 'Activer le mode sombre'}
              >
                <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${darkMode ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Container pour la carte principale et les stats (côte à côte sur desktop, empilés sur mobile) */}
      <div className="flex flex-col lg:flex-row justify-center w-full max-w-5xl gap-4">
        {/* Card stats réponses/scores avec cercles dynamiques - Verticale sur desktop, horizontale sur mobile */}
        <div className="flex lg:flex-col mb-4 lg:mb-0 lg:w-1/5 order-1 lg:order-2">
          <div className="rounded-xl shadow-lg p-4 flex flex-wrap lg:flex-col items-center gap-8 w-full justify-center backdrop-blur-sm bg-white/90 dark:bg-gray-900/80" style={{ border: `1px solid ${colors.border}` }}>
            <StatCircle value={stats.correct} max={questions.length} color="#22c55e" label="Bonnes" labelColor={colors.statLabel} />
            <StatCircle value={stats.incorrect} max={questions.length} color="#ef4444" label="Mauvaises" labelColor={colors.statLabel} />
            <StatCircle value={stats.unanswered} max={questions.length} color="#6b7280" label="Non répondues" labelColor={colors.statLabel} />
            <StatCircle value={calculateFinalScore()} max={questions.length} color="#a21caf" label="Score" labelColor={colors.statLabel} />
          </div>
        </div>
        
        {/* Carte principale responsive */}
        <div className="rounded-2xl shadow-2xl p-6 max-w-3xl w-full relative border flex flex-col backdrop-blur-sm bg-white/90 dark:bg-gray-900/80 order-2 lg:order-1" style={{ borderColor: colors.border }}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium" style={{ color: colors.text }}>
            Question {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
        <div className="w-full rounded-full h-2 mb-6" style={{ background: colors.progressBg }}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`, background: colors.primary }}
          ></div>
        </div>
        <h2 className="text-xl font-bold mb-6 text-center" style={{ color: colors.text }}>{currentQuestion.question}</h2>
        
        {/* Encart d'explication qui apparaît après avoir répondu */}
        {showAnswer && (
          <div className={`p-4 mb-6 rounded-lg flex items-start gap-3 animate-fadeIn bg-opacity-20 
            ${selectedOption === currentQuestion.correctIndex 
              ? 'bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500' 
              : 'bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500'}`}>
            <Lightbulb className={`w-6 h-6 mt-1 flex-shrink-0 
              ${selectedOption === currentQuestion.correctIndex 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-amber-600 dark:text-amber-400'}`} />
            <div>
              <h3 className={`font-semibold mb-1 
                ${selectedOption === currentQuestion.correctIndex 
                  ? 'text-green-800 dark:text-green-400' 
                  : 'text-amber-800 dark:text-amber-400'}`}>
                {selectedOption === currentQuestion.correctIndex ? 'Bonne réponse !' : 'Explication :'}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: colors.text }}>{currentQuestion.explication}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-3 mb-6">
          {currentQuestion.choices.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between gap-2 text-base font-medium shadow-sm
                ${selectedOption === index
                  ? showAnswer
                    ? index === currentQuestion.correctIndex
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/30'
                    : 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                  : showAnswer && index === currentQuestion.correctIndex
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                    : 'border-gray-100 dark:border-gray-700 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}
              `}
              disabled={showAnswer}
              style={{ color: colors.text }}
            >
              <span>{option}</span>
              {showAnswer && index === currentQuestion.correctIndex && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {showAnswer && selectedOption === index && index !== currentQuestion.correctIndex && (
                <X className="w-5 h-5 text-red-500" />
              )}
            </button>
          ))}
        </div>
        {!showAnswer ? (
          <div className="flex gap-2">
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className={`flex-1 py-3 rounded-lg font-bold transition-all text-lg shadow-md
                ${selectedOption === null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
              `}
            >
              Vérifier
            </button>
            <button
              onClick={() => handleNextQuestion()}
              disabled={showAnswer}
              className="flex-1 py-3 rounded-lg font-bold transition-all text-lg shadow-md bg-indigo-500 hover:bg-indigo-600 text-white border border-indigo-500"
            >
              Passer
            </button>
          </div>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center text-lg shadow-md bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Question Suivante' : 'Voir les Résultats'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        )}
        {/* Toggle mode strict sous la carte */}
        <div className="flex flex-col items-center gap-2 mt-8 self-center">
          <span className="text-sm" style={{ color: colors.text }}>Le mode strict retire 0,5 point pour chaque mauvaise réponse.</span>
          <div className="flex items-center gap-3">
            <span className="font-medium" style={{ color: colors.text }}>Mode strict</span>
            <button
              onClick={() => setStrictMode((v) => !v)}
              className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${strictMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
              aria-pressed={strictMode}
            >
              <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${strictMode ? 'translate-x-6' : ''}`}></span>
            </button>
            <span className={`ml-2 text-xs font-semibold ${strictMode ? 'text-indigo-600' : 'text-gray-400'}`}>{strictMode ? 'Activé' : 'Désactivé'}</span>
          </div>
        </div>
        {/* Bouton recommencer en bas */}
        <button
          onClick={resetQuiz}
          className="mt-8 w-full py-2 rounded-lg font-bold transition-all text-base shadow bg-indigo-500 hover:bg-indigo-600 text-white border border-indigo-500"
        >
          Recommencer
        </button>
      </div>
    </div>
      {/* Vagues décoratives en bas de page */}
      <div className="wave"></div>
  </div>
  );
}

export default App;