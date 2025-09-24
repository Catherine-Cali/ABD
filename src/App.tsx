import { useMemo, useState } from "react";

/** ---- Types ---- **/
interface LegacyQuestionSingle {
  id: number;
  question: string;
  choices: string[];
  correctIndex?: number;        // ancien format (1 bonne réponse)
  explication?: string;
}
interface LegacyQuestionMulti extends Omit<LegacyQuestionSingle, "correctIndex"> {
  correctIndices?: number[];    // nouveau format (plusieurs bonnes réponses)
}
type LegacyQuestion = LegacyQuestionSingle | LegacyQuestionMulti;

interface QuestionNormalized {
  id: number;
  question: string;
  choices: string[];
  correct: number[];            // tableau d’index corrects normalisé
  explication?: string;
}

/** ---- Util ---- **/
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function setsEqual(a: Set<number>, b: Set<number>) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

/** -------------------------------------------------------------------
 *  ⬇️  Ton tableau de questions — tu peux mixer:
 *      - correctIndex: number   (mono-réponse)
 *      - correctIndices: number[] (multi-réponses)
 * ------------------------------------------------------------------*/
const QCM_QUESTIONS: LegacyQuestion[] = [

  {
    "id": 1,
    "question": "Objectif principal de l’EC ABD",
    "choices": [
      "Comprendre l’architecture d’un SGBD et son implantation",
      "Apprendre exclusivement le SQL avancé sans administration",
      "Se limiter aux sauvegardes applicatives",
      "Étudier uniquement les systèmes d’exploitation"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Comprendre l’architecture d’un SGBD et son implantation."
  },
  {
    "id": 2,
    "question": "Double casquette du DBA",
    "choices": [
      "Organisationnelle (modèle/partage des données)",
      "Technique (mise en œuvre, sécurité, performance)",
      "Uniquement support helpdesk",
      "Uniquement achat matériel"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Organisationnelle (modèle/partage des données) / Technique (mise en œuvre, sécurité, performance)."
  },
  {
    "id": 3,
    "question": "Responsabilité du DBA sur les privilèges",
    "choices": [
      "Attribuer/retirer des privilèges d’accès",
      "Créer automatiquement un index par colonne",
      "Configurer les routeurs réseau",
      "Écrire toutes les applications clientes"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Attribuer/retirer des privilèges d’accès."
  },
  {
    "id": 4,
    "question": "Performance : idée clé",
    "choices": [
      "Adapter l’implantation aux usages réels",
      "Désactiver systématiquement les contraintes",
      "Utiliser un seul gros fichier pour tout",
      "Limiter chaque table à 1 Mo"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Adapter l’implantation aux usages réels."
  },
  {
    "id": 5,
    "question": "Outils d’échange/migration cités",
    "choices": [
      "SQL*Loader",
      "SQLPLUS",
      "tcpdump",
      "Wireshark"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : SQL*Loader / SQLPLUS."
  },
  {
    "id": 6,
    "question": "Bonnes pratiques d’accès",
    "choices": [
      "Utiliser des comptes nominatifs",
      "Tracer les connexions/DDL",
      "Partage massif d’un compte system",
      "Mot de passe inchangé 5 ans"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Utiliser des comptes nominatifs / Tracer les connexions/DDL."
  },
  {
    "id": 7,
    "question": "Objets physiques d’Oracle",
    "choices": [
      "Data files / Redo logs / Control files",
      "Alert/trace logs",
      "Schémas, séquences, synonymes (logiques)",
      "Pages mémoire OS uniquement"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Data files / Redo logs / Control files / Alert/trace logs."
  },
  {
    "id": 8,
    "question": "À la création d’une table on peut préciser. . .",
    "choices": [
      "Contraintes (PK, FK, CHECK)",
      "Paramètres de stockage (PCTFREE. . .)",
      "Tablespace cible",
      "Version de l’OS"
    ],
    "correctIndices": [
      0,
      1,
      2
    ],
    "explication": "Réponses correctes : Contraintes (PK, FK, CHECK) / Paramètres de stockage (PCTFREE. . .) / Tablespace cible."
  },
  {
    "id": 9,
    "question": "Préfixes de vues dictionnaire",
    "choices": [
      "USER∗",
      "ALL∗",
      "DBA∗",
      "SYS.H IN T S"
    ],
    "correctIndices": [
      0,
      1,
      2
    ],
    "explication": "Réponses correctes : USER∗ / ALL∗ / DBA∗."
  },
  {
    "id": 10,
    "question": "LOGGING / NOLOGGING",
    "choices": [
      "Contrôle l’inscription des DML dans les journaux",
      "Active la compression des blocs",
      "Change la taille de DB_BLOCK_SIZE",
      "Crée un tablespace"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Contrôle l’inscription des DML dans les journaux."
  },
  {
    "id": 11,
    "question": "Data file : propriétés",
    "choices": [
      "Appartient à une seule base",
      "Peut être en AUTOEXTEND",
      "Partageable en lecture/écriture entre deux bases actives",
      "Doit faire 2 Mo max"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Appartient à une seule base / Peut être en AUTOEXTEND."
  },
  {
    "id": 12,
    "question": "Vues USER_TABLES / ALL_TABLES / DBA_TABLES",
    "choices": [
      "Portée : propriétaire / accessible / toute la base",
      "Toutes identiques",
      "DBA_TABLES liste uniquement les vues",
      "USER_TABLES couvre toutes les bases"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Portée : propriétaire / accessible / toute la base."
  },
  {
    "id": 13,
    "question": "Instance Oracle",
    "choices": [
      "SGA + processus serveurs/arrière-plan",
      "Nécessaire pour ouvrir une base",
      "Synonyme de database",
      "Un simple exécutable client"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : SGA + processus serveurs/arrière-plan / Nécessaire pour ouvrir une base."
  },
  {
    "id": 14,
    "question": "Alert/trace logs servent à. . .",
    "choices": [
      "Diagnostiquer les incidents et suivre les événements",
      "Accélérer les SELECT",
      "Stocker les données utilisateur",
      "Sauvegarder les control files"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Diagnostiquer les incidents et suivre les événements."
  },
  {
    "id": 15,
    "question": "Redo log : finalité",
    "choices": [
      "Rejouer les mises à jour pour reprise après panne",
      "Optimiser GROUP BY",
      "Remplacer les sauvegardes",
      "Gérer l’espace libre des blocs"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Rejouer les mises à jour pour reprise après panne."
  },
  {
    "id": 16,
    "question": "Groupes et members de redo",
    "choices": [
      "Plusieurs members par groupe pour redondance",
      "Les groupes s’enchaînent circulairement",
      "Chaque data file est un member",
      "Les members partagent obligatoirement le même chemin"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Plusieurs members par groupe pour redondance / Les groupes s’enchaînent circulairement."
  },
  {
    "id": 17,
    "question": "Switch log / checkpoint",
    "choices": [
      "Le checkpoint synchronise les buffers avec les data files",
      "Le checkpoint réduit la taille du control file",
      "Le switch supprime les anciens logs",
      "Le checkpoint arrête l’instance"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Le checkpoint synchronise les buffers avec les data files."
  },
  {
    "id": 18,
    "question": "Control file : contient",
    "choices": [
      "Noms/loc. data files et redo logs",
      "SCN et infos de checkpoint",
      "Tables utilisateur",
      "Statistiques de l’optimiseur"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Noms/loc. data files et redo logs / SCN et infos de checkpoint."
  },
  {
    "id": 19,
    "question": "ARCHIVELOG vs NOARCHIVELOG",
    "choices": [
      "ARCHIVELOG permet la restauration point-à-temps",
      "NOARCHIVELOG garde plus d’historique",
      "ARCHIVELOG supprime les redo",
      "NOARCHIVELOG interdit les sauvegardes"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : ARCHIVELOG permet la restauration point-à-temps."
  },
  {
    "id": 20,
    "question": "AUTOEXTEND impacte. . .",
    "choices": [
      "La croissance automatique d’un data file",
      "Uniquement les redo logs",
      "Uniquement les control files",
      "Le nombre d’instances"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : La croissance automatique d’un data file."
  },
  {
    "id": 21,
    "question": "ALTER DATABASE ... RESIZE",
    "choices": [
      "Modifie la taille d’un data file",
      "Crée un nouveau tablespace",
      "Supprime un redo log",
      "Bascule ARCHIVELOG"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Modifie la taille d’un data file."
  },
  {
    "id": 22,
    "question": "Multiplexage des control files",
    "choices": [
      "Recommandé pour tolérance aux pannes",
      "Interdit en production",
      "Sans effet sur la disponibilité",
      "Remplace les sauvegardes"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Recommandé pour tolérance aux pannes."
  },
  {
    "id": 23,
    "question": "Catalogue RMAN",
    "choices": [
      "Base externe pour historiser les sauvegardes",
      "Paramètre de PCTFREE",
      "Alias de SYS.AUX",
      "Option réservée aux vues"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Base externe pour historiser les sauvegardes."
  },
  {
    "id": 24,
    "question": "Sauvegarde à chaud requiert. . .",
    "choices": [
      "Mode ARCHIVELOG",
      "Instance arrêtée",
      "Suppression des redo",
      "Control files en lecture seule"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Mode ARCHIVELOG."
  },
  {
    "id": 25,
    "question": "Restauration media recovery",
    "choices": [
      "Consomme les archives + redo pour remonter",
      "Supprime l’UNDO",
      "Réécrit le DBID",
      "Désactive les contraintes"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Consomme les archives + redo pour remonter."
  },
  {
    "id": 26,
    "question": "Fichiers temporaires",
    "choices": [
      "Utilisés pour tri/agrégats/bitmap join",
      "Contiennent les control files",
      "Stockent les sauvegardes RMAN",
      "Sont persistants dans le control file"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Utilisés pour tri/agrégats/bitmap join."
  },
  {
    "id": 27,
    "question": "DBID",
    "choices": [
      "Identifiant unique de la base",
      "Nom d’instance",
      "Nom de schéma",
      "Paramètre mémoire"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Identifiant unique de la base."
  },
  {
    "id": 28,
    "question": "Paramètre DB_BLOCK_SIZE",
    "choices": [
      "Taille des blocs logiques Oracle",
      "Taille des pages OS",
      "Taille des clusters index",
      "Nombre de freelists"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Taille des blocs logiques Oracle."
  },
  {
    "id": 29,
    "question": "Choisir la taille de bloc élevée",
    "choices": [
      "Utile pour scans séquentiels volumineux",
      "Peut dégrader l’accès aléatoire OLTP",
      "Toujours préférable",
      "Sans impact mémoire"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Utile pour scans séquentiels volumineux / Peut dégrader l’accès aléatoire OLTP."
  },
  {
    "id": 30,
    "question": "Tablespace : définition",
    "choices": [
      "Unité logique regroupant des segments",
      "Un fichier physique",
      "Une table",
      "Un index cluster"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Unité logique regroupant des segments."
  },
  {
    "id": 31,
    "question": "SYSTEM/SYSAUX",
    "choices": [
      "SYSTEM/SYSAUX hébergent dictionnaire et composants internes",
      "SYSTEM est optionnel",
      "SYSAUX peut être supprimé en ligne",
      "SYSTEM peut être OFFLINE"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : SYSTEM/SYSAUX hébergent dictionnaire et composants internes."
  },
  {
    "id": 32,
    "question": "QUOTA sur tablespace",
    "choices": [
      "Limite l’espace qu’un utilisateur peut consommer",
      "Limite le nombre d’objets",
      "Active TDE",
      "Force la compression"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Limite l’espace qu’un utilisateur peut consommer."
  },
  {
    "id": 33,
    "question": "Tablespace SYSTEM",
    "choices": [
      "Ne peut jamais être OFFLINE",
      "Peut être lu/écrit par un autre DBID",
      "Réservé aux index uniquement",
      "Optionnel"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Ne peut jamais être OFFLINE."
  },
  {
    "id": 34,
    "question": "TEMP vs UNDO",
    "choices": [
      "TEMP pour opérations transitoires (tri, hash)",
      "UNDO pour versions avant modification",
      "TEMP stocke les redo",
      "UNDO remplace RMAN"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : TEMP pour opérations transitoires (tri, hash) / UNDO pour versions avant modification."
  },
  {
    "id": 35,
    "question": "Segment de données",
    "choices": [
      "Groupe d’extents alloués à une table",
      "Alias de data file",
      "Processus background",
      "Répertoire OS"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Groupe d’extents alloués à une table."
  },
  {
    "id": 36,
    "question": "Segments : types",
    "choices": [
      "Données",
      "Index",
      "Temporaire",
      "Réseau"
    ],
    "correctIndices": [
      0,
      1,
      2
    ],
    "explication": "Réponses correctes : Données / Index / Temporaire."
  },
  {
    "id": 37,
    "question": "Extent (extension)",
    "choices": [
      "Allocation contiguë de blocs",
      "Plus petite unité logique d’E/S",
      "Unité de redo",
      "Identique à une page OS"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Allocation contiguë de blocs."
  },
  {
    "id": 38,
    "question": "PCTFREE",
    "choices": [
      "Pourcentage réservé aux mises à jour dans un bloc",
      "Seuil de réutilisation pour insertions",
      "Taux d’augmentation des extents",
      "Slots de transactions"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Pourcentage réservé aux mises à jour dans un bloc."
  },
  {
    "id": 39,
    "question": "PCTUSED",
    "choices": [
      "Seuil en-deçà duquel un bloc redevient insérable",
      "Réserve de mise à jour",
      "Augmente NEXT",
      "Taille de bloc"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Seuil en-deçà duquel un bloc redevient insérable."
  },
  {
    "id": 40,
    "question": "INITRANS",
    "choices": [
      "Nombre de slots de transactions réservés dans l’en-tête",
      "Nombre maximal de sessions",
      "Taille des redo logs",
      "Nombre de freelists"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Nombre de slots de transactions réservés dans l’en-tête."
  },
  {
    "id": 41,
    "question": "FREELISTS",
    "choices": [
      "Listes de blocs libres par segment",
      "Paramètre mémoire SGA",
      "Table virtuelle",
      "Alias de TEMP"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Listes de blocs libres par segment."
  },
  {
    "id": 42,
    "question": "PCTINCREASE",
    "choices": [
      "Taux d’augmentation des extents NEXT successifs",
      "Espace libre par bloc",
      "Ratio d’utilisation buffer cache",
      "Facteur de B-tree"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Taux d’augmentation des extents NEXT successifs."
  },
  {
    "id": 43,
    "question": "Chaînage de lignes (row chaining)",
    "choices": [
      "Survient quand une ligne ne tient pas dans un bloc",
      "Optimise les accès",
      "Réduit l’I/O",
      "Sans lien avec PCTFREE"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Survient quand une ligne ne tient pas dans un bloc."
  },
  {
    "id": 44,
    "question": "Fragmentation",
    "choices": [
      "Peut augmenter le nombre d’extents et l’I/O",
      "Sans effet sur la performance",
      "Toujours souhaitable",
      "Supprime les checkpoints"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Peut augmenter le nombre d’extents et l’I/O."
  },
  {
    "id": 45,
    "question": "Block header contient. . .",
    "choices": [
      "Infos d’en-tête, ITL (transactions), répertoire des lignes",
      "Espace libre et données",
      "Control file",
      "Redo"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Infos d’en-tête, ITL (transactions), répertoire des lignes / Espace libre et données."
  },
  {
    "id": 46,
    "question": "Heap-organized table",
    "choices": [
      "Organisation par emplacement libre sans tri",
      "Toujours triée par PK",
      "Toujours en cluster",
      "Toujours compressée"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Organisation par emplacement libre sans tri."
  },
  {
    "id": 47,
    "question": "Index-organized table (IOT)",
    "choices": [
      "Données stockées dans la structure d’index",
      "Clé primaire devenue clé d’accès physique",
      "Toujours plus rapide en écriture",
      "Interdit les PK"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Données stockées dans la structure d’index / Clé primaire devenue clé d’accès physique."
  },
  {
    "id": 48,
    "question": "Cluster (hash ou index)",
    "choices": [
      "Regroupe physiquement des lignes de plusieurs tables liées",
      "Synonyme de tablespace",
      "Remplace les index",
      "Réservé aux vues"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Regroupe physiquement des lignes de plusieurs tables liées."
  },
  {
    "id": 49,
    "question": "Compression de table",
    "choices": [
      "Réduit l’espace et peut réduire l’I/O séquentielle",
      "Toujours idéale en OLTP très écrivant",
      "Interdit les index",
      "Obligatoire en TEMP"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Réduit l’espace et peut réduire l’I/O séquentielle."
  },
  {
    "id": 50,
    "question": "Storage parameters (INITIAL/NEXT)",
    "choices": [
      "Pilotent la taille des premiers extents",
      "Changés par DB_BLOCK_SIZE",
      "Contrôlent la rétention UNDO",
      "Agissent sur redo size"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Pilotent la taille des premiers extents."
  },
  {
    "id": 51,
    "question": "Tables temporaires globales (GTT)",
    "choices": [
      "Données visibles par session, vides au commit/session selon mode",
      "Stockent durablement les archives",
      "Partagées entre bases",
      "Incompatibles avec index"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Données visibles par session, vides au commit/session selon mode."
  },
  {
    "id": 52,
    "question": "Séquences",
    "choices": [
      "Génèrent des numéros (cache, cycle) pour PK, etc",
      "Stockent des lignes",
      "Remplacent les redo",
      "Nécessitent TEMP"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Génèrent des numéros (cache, cycle) pour PK, etc."
  },
  {
    "id": 53,
    "question": "Synonymes",
    "choices": [
      "Alias d’objets pour simplifier les noms",
      "Stockent les permissions",
      "Remplacent les vues",
      "Sont des segments physiques"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Alias d’objets pour simplifier les noms."
  },
  {
    "id": 54,
    "question": "Contraintes CHECK",
    "choices": [
      "Validations logiques sur colonnes/lignes",
      "Journalisation redo",
      "Gestion de quota",
      "Allocation d’extents"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Validations logiques sur colonnes/lignes."
  },
  {
    "id": 55,
    "question": "Contraintes FK : index ?",
    "choices": [
      "Un index sur la FK est recommandé pour DELETE parent",
      "Oracle crée toujours l’index automatiquement",
      "Interdit les jointures",
      "Supprime la nécessité d’UNDO"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Un index sur la FK est recommandé pour DELETE parent."
  },
  {
    "id": 56,
    "question": "Statistiques d’optimiseur",
    "choices": [
      "Guident le plan d’exécution (CBO)",
      "Sans effet sur l’optimiseur",
      "Remplacent les index",
      "Stockées dans control file"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Guident le plan d’exécution (CBO)."
  },
  {
    "id": 57,
    "question": "Gather stats : granularité",
    "choices": [
      "Table/partition/colonne",
      "Système (dict.)",
      "Uniquement base entière",
      "Uniquement colonne"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Table/partition/colonne / Système (dict.)."
  },
  {
    "id": 58,
    "question": "Histograms",
    "choices": [
      "Améliorent les estimations pour colonnes non uniformes",
      "Suppriment la cardinalité",
      "Remplacent les index bitmap",
      "S’appliquent aux data files"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Améliorent les estimations pour colonnes non uniformes."
  },
  {
    "id": 59,
    "question": "Bind peeking",
    "choices": [
      "L’optimiseur échantillonne une valeur de bind à la 1ère exécution",
      "Désactive les plans",
      "Supprime les statistiques",
      "Évite le hard parse"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : L’optimiseur échantillonne une valeur de bind à la 1ère exécution."
  },
  {
    "id": 60,
    "question": "Plan baselines",
    "choices": [
      "Capturent/forcent des plans stables",
      "Interdisent le SQL",
      "Remplacent les index",
      "Égal à UNDO"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Capturent/forcent des plans stables."
  },
  {
    "id": 61,
    "question": "Materialized views : usage",
    "choices": [
      "Stockent le résultat d’une requête",
      "Permettent des query rewrite",
      "Toujours rafraîchies à chaque SELECT",
      "Réservées à TEMP"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Stockent le résultat d’une requête / Permettent des query rewrite."
  },
  {
    "id": 62,
    "question": "Materialized view log",
    "choices": [
      "Journal de changements pour refresh incrémental",
      "Fichier redo",
      "Control file",
      "Paramètre SGA"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Journal de changements pour refresh incrémental."
  },
  {
    "id": 63,
    "question": "Bitmap join index",
    "choices": [
      "Optimise jointures dimension-fait (faible cardinalité)",
      "Toujours mieux que B-tree en OLTP",
      "Interdit partitionnement",
      "Réservé aux vues"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Optimise jointures dimension-fait (faible cardinalité)."
  },
  {
    "id": 64,
    "question": "Function-based index",
    "choices": [
      "Indexe l’expression calculée",
      "Interdit WHERE",
      "Réservé aux PK",
      "Équivaut à bitmap"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Indexe l’expression calculée."
  },
  {
    "id": 65,
    "question": "Invisible index",
    "choices": [
      "Créé mais ignoré par l’optimiseur (sauf hint)",
      "Supprime les données",
      "Obligatoire pour FK",
      "Réservé à TEMP"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Créé mais ignoré par l’optimiseur (sauf hint)."
  },
  {
    "id": 66,
    "question": "Parallel query (PQ)",
    "choices": [
      "Divise le travail de scan/tri entre serveurs parallèles",
      "Supprime les redo",
      "Interdit les indexes",
      "Exige NOARCHIVELOG"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Divise le travail de scan/tri entre serveurs parallèles."
  },
  {
    "id": 67,
    "question": "Direct path insert",
    "choices": [
      "Remplit des blocs au-delà de HWM, souvent NOLOGGING possible",
      "Toujours plus lent",
      "Interdit les contraintes",
      "Supprime UNDO"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Remplit des blocs au-delà de HWM, souvent NOLOGGING possible."
  },
  {
    "id": 68,
    "question": "External tables",
    "choices": [
      "Accès SQL sur fichiers plats via drivers",
      "Stockent dans SYSTEM",
      "Remplacent SQL*Loader",
      "Sans métadonnées"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Accès SQL sur fichiers plats via drivers."
  },
  {
    "id": 69,
    "question": "Data Pump (expdp/impdp)",
    "choices": [
      "Export/import logique à haute performance",
      "Filtrage schéma/table",
      "Remplace RMAN physique",
      "Exige arrêt base"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Export/import logique à haute performance / Filtrage schéma/table."
  },
  {
    "id": 70,
    "question": "Transportable tablespaces",
    "choices": [
      "Déplacent des jeux de tablespaces entre bases compatibles",
      "Équivalent à expdp full",
      "Suppriment les SCN",
      "Sans métadonnées"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Déplacent des jeux de tablespaces entre bases compatibles."
  },
  {
    "id": 71,
    "question": "TDE (Transparent Data Encryption)",
    "choices": [
      "Chiffre données au repos (tablespaces/colonnes)",
      "Supprime redo/undo",
      "Chiffre le réseau SQL*Net",
      "Remplace les privilèges"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Chiffre données au repos (tablespaces/colonnes)."
  },
  {
    "id": 72,
    "question": "ACID : propriété “C” (Consistency)",
    "choices": [
      "Préserve l’intégrité avant/après transactions",
      "Assure la concurrence",
      "Assure la durabilité",
      "Assure l’atomicité"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Préserve l’intégrité avant/après transactions."
  },
  {
    "id": 73,
    "question": "Isolation",
    "choices": [
      "Empêche les lectures de données non validées",
      "Efface les redo",
      "Désactive UNDO",
      "Interdit SELECT"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Empêche les lectures de données non validées."
  },
  {
    "id": 74,
    "question": "COMMIT",
    "choices": [
      "Rend durables les changements d’une transaction",
      "Annule la transaction",
      "Crée un index",
      "Vide TEMP"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Rend durables les changements d’une transaction."
  },
  {
    "id": 75,
    "question": "ROLLBACK",
    "choices": [
      "Annule une transaction non validée",
      "Valide une transaction",
      "Crée un tablespace",
      "Change DBID"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Annule une transaction non validée."
  },
  {
    "id": 76,
    "question": "SAVEPOINT",
    "choices": [
      "Point de retour partiel dans une transaction",
      "Synonyme de COMMIT",
      "Vide UNDO",
      "Crée des archives"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Point de retour partiel dans une transaction."
  },
  {
    "id": 77,
    "question": "Lecture cohérente (consistent read)",
    "choices": [
      "Utilise UNDO pour reconstruire une ancienne version",
      "Lit toujours la dernière version committée",
      "N’emploie pas UNDO",
      "Désactive redo"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Utilise UNDO pour reconstruire une ancienne version."
  },
  {
    "id": 78,
    "question": "UNDO tablespace",
    "choices": [
      "Stocke les valeurs « avant » modification",
      "Stocke les résultats de SELECT",
      "Control file",
      "TEMP"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Stocke les valeurs « avant » modification."
  },
  {
    "id": 79,
    "question": "undoretentiontropcourtßORA − 01555",
    "choices": [
      "Snapshots trop anciens pendant de longues requêtes",
      "Fichier redo trop petit",
      "SCN invalide",
      "Manque d’index"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Snapshots trop anciens pendant de longues requêtes."
  },
  {
    "id": 80,
    "question": "Read only tablespace",
    "choices": [
      "Protège des DML, utile pour archives",
      "Interdit SELECT",
      "Supprime redo",
      "Chiffre le réseau"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Protège des DML, utile pour archives."
  },
  {
    "id": 81,
    "question": "Deadlock",
    "choices": [
      "Attente circulaire de verrous, détectée et résolue",
      "Toujours causé par ORA-01555",
      "Supprimé par NOLOGGING",
      "Impossible en Oracle"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Attente circulaire de verrous, détectée et résolue."
  },
  {
    "id": 82,
    "question": "Niveaux d’isolation courants",
    "choices": [
      "READ COMMITTED",
      "SERIALIZABLE",
      "DIRTY READ",
      "NO ISOLATION"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : READ COMMITTED / SERIALIZABLE."
  },
  {
    "id": 83,
    "question": "Verrous de lignes (ROW locks)",
    "choices": [
      "Portent sur les lignes modifiées",
      "Portent sur tout le tablespace",
      "Désactivent UNDO",
      "Sont des redo"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Portent sur les lignes modifiées."
  },
  {
    "id": 84,
    "question": "ITL (Interested Transaction List)",
    "choices": [
      "Emplacements par bloc pour métadonnées de transactions",
      "Liste d’index invisibles",
      "Undo retention",
      "Archive list"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Emplacements par bloc pour métadonnées de transactions."
  },
  {
    "id": 85,
    "question": "Temp segments et tri",
    "choices": [
      "ORDER BY/GROUP BY peuvent consommer TEMP",
      "Se font toujours en mémoire",
      "Usent UNDO",
      "Écrivent control file"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : ORDER BY/GROUP BY peuvent consommer TEMP."
  },
  {
    "id": 86,
    "question": "SMON/PMON",
    "choices": [
      "Processus background de maintenance/récupération et session cleanup",
      "Clients SQL*Plus",
      "Optimiseur",
      "Redo writer"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Processus background de maintenance/récupération et session cleanup."
  },
  {
    "id": 87,
    "question": "LGWR/DBWR",
    "choices": [
      "LGWR écrit redo, DBWR écrit buffers vers data files",
      "LGWR écrit UNDO",
      "DBWR écrit control files",
      "Aucun rapport"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : LGWR écrit redo, DBWR écrit buffers vers data files."
  },
  {
    "id": 88,
    "question": "Checkpoints fréquents",
    "choices": [
      "Réduisent le temps de recovery après crash",
      "Suppriment redo",
      "Interdisent ARCHIVELOG",
      "Inutiles"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Réduisent le temps de recovery après crash."
  },
  {
    "id": 89,
    "question": "Bénéfices partitionnement",
    "choices": [
      "Partition pruning",
      "Maintenance ciblée (purge/backup)",
      "Moins d’espace garanti",
      "Supprime les index"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Partition pruning / Maintenance ciblée (purge/backup)."
  },
  {
    "id": 90,
    "question": "Clés de partition RANGE",
    "choices": [
      "Dates/intervalles numériques",
      "Ordre aléatoire",
      "Colonne CLOB uniquement",
      "Nom d’instance"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Dates/intervalles numériques."
  },
  {
    "id": 91,
    "question": "Fragmentation horizontale",
    "choices": [
      "Découpe par lignes selon condition",
      "Découpe par colonnes",
      "Toujours aléatoire",
      "Synonyme de synonymes"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Découpe par lignes selon condition."
  },
  {
    "id": 92,
    "question": "Fragmentation verticale",
    "choices": [
      "Répartition des colonnes",
      "Répartition des lignes",
      "Identique à IOT",
      "Réservée à TEMP"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Répartition des colonnes."
  },
  {
    "id": 93,
    "question": "LIST partitioning",
    "choices": [
      "Répartit selon valeurs discrètes (ex : région)",
      "Répartit par hash",
      "Réservé aux index",
      "Interdit les PK"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Répartit selon valeurs discrètes (ex : région)."
  },
  {
    "id": 94,
    "question": "HASH partitioning",
    "choices": [
      "Répartit uniformément selon un hash de clé",
      "Toujours ordonné par date",
      "Interdit bitmap",
      "Réservé aux vues"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Répartit uniformément selon un hash de clé."
  },
  {
    "id": 95,
    "question": "Subpartitionnement composite",
    "choices": [
      "Combinaison (ex : RANGE-HASH)",
      "Interdit",
      "Équivaut à cluster",
      "Supprime UNDO"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Combinaison (ex : RANGE-HASH)."
  },
  {
    "id": 96,
    "question": "Échange de partition (EXCHANGE PARTITION)",
    "choices": [
      "Permet de charger/archiver rapidement des données",
      "Supprime les contraintes",
      "Change le DBID",
      "Désactive redo"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Permet de charger/archiver rapidement des données."
  },
  {
    "id": 97,
    "question": "Local vs Global index",
    "choices": [
      "Local index aligné aux partitions → maintenance facilitée",
      "Global obligatoire",
      "Local interdit bitmap",
      "Global sans métadonnées"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Local index aligné aux partitions → maintenance facilitée."
  },
  {
    "id": 98,
    "question": "Index uniques",
    "choices": [
      "Peuvent faire respecter l’unicité",
      "Toujours créés automatiquement",
      "Réservés aux PK",
      "Sans stockage"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Peuvent faire respecter l’unicité."
  },
  {
    "id": 99,
    "question": "Index composés",
    "choices": [
      "Portent sur plusieurs colonnes",
      "Incompatibles avec WHERE",
      "Réservés aux vues",
      "Toujours bitmap"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Portent sur plusieurs colonnes."
  },
  {
    "id": 100,
    "question": "B-tree vs Bitmap",
    "choices": [
      "B-tree : haute cardinalité/OLTP",
      "Bitmap : faible cardinalité/DW",
      "Bitmap idéal en écriture intensive OLTP",
      "B-tree réservé PK"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : B-tree : haute cardinalité/OLTP / Bitmap : faible cardinalité/DW."
  },
  {
    "id": 101,
    "question": "Quand un index aide peu",
    "choices": [
      "Table petite",
      "Requêtes renvoyant >80",
      "Colonnes très statiques",
      "Clauses WHERE très sélectives"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Table petite / Requêtes renvoyant >80."
  },
  {
    "id": 102,
    "question": "Clustering factor",
    "choices": [
      "Mesure l’ordre des données par rapport à l’index",
      "Taille des data files",
      "Utilisation redo",
      "Niveau d’isolation"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Mesure l’ordre des données par rapport à l’index."
  },
  {
    "id": 103,
    "question": "Maintenance d’index",
    "choices": [
      "Coût en INSERT/DELETE/UPDATE",
      "Gratuit",
      "Supprime UNDO",
      "Désactive redo"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Coût en INSERT/DELETE/UPDATE."
  },
  {
    "id": 104,
    "question": "Index skip scan",
    "choices": [
      "Utilise colonnes suivantes même sans première clé",
      "Réservé bitmap",
      "Interdit LIKE",
      "Supprime statistiques"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Utilise colonnes suivantes même sans première clé."
  },
  {
    "id": 105,
    "question": "Index sur FK",
    "choices": [
      "Recommandé pour DELETE/UPDATE parent",
      "Créé d’office",
      "Interdit partitionnement",
      "Obligatoire sur toutes les colonnes"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Recommandé pour DELETE/UPDATE parent."
  },
  {
    "id": 106,
    "question": "Vue (VIEW)",
    "choices": [
      "Table virtuelle (résultat nommé d’une requête)",
      "Peut servir à contrôler l’accès aux colonnes",
      "Toujours matérialisée",
      "Non sécurisable"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Table virtuelle (résultat nommé d’une requête) / Peut servir à contrôler l’accès aux colonnes."
  },
  {
    "id": 107,
    "question": "Vues pour simplifier",
    "choices": [
      "Cachent la complexité des jointures/agrégats",
      "Remplacent contraintes",
      "Suppriment index",
      "Imposent ARCHIVELOG"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Cachent la complexité des jointures/agrégats."
  },
  {
    "id": 108,
    "question": "WITH READ ONLY",
    "choices": [
      "Interdit DML via la vue",
      "Force matérialisation",
      "Masque les nombres",
      "Supprime privilèges"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Interdit DML via la vue."
  },
  {
    "id": 109,
    "question": "Vues modifiables — restrictions",
    "choices": [
      "Pas d’agrégats ni GROUP BY/ORDER BY",
      "Pas d’opérateurs ensemblistes",
      "Toujours interdites en jointure",
      "DISTINCT obligatoire"
    ],
    "correctIndices": [
      0,
      1
    ],
    "explication": "Réponses correctes : Pas d’agrégats ni GROUP BY/ORDER BY / Pas d’opérateurs ensemblistes."
  },
  {
    "id": 110,
    "question": "Clé préservée (join updateable view)",
    "choices": [
      "Vue de jointure modifiable si la clé d’une table est préservée",
      "Aucune vue de jointure n’est modifiable",
      "Toute vue ORDER BY est modifiable",
      "Remplace triggers"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Vue de jointure modifiable si la clé d’une table est préservée."
  },
  {
    "id": 111,
    "question": "WITH CHECK OPTION",
    "choices": [
      "Contraint que les lignes DML respectent le prédicat de la vue",
      "Rend la vue READ ONLY",
      "Supprime PK",
      "Interdit SELECT"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Contraint que les lignes DML respectent le prédicat de la vue."
  },
  {
    "id": 112,
    "question": "Sécurité par vues",
    "choices": [
      "Exposer seulement les colonnes nécessaires",
      "Supprimer GRANT/REVOKE",
      "Remplacer TDE",
      "Désactiver audit"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Exposer seulement les colonnes nécessaires."
  },
  {
    "id": 113,
    "question": "Materialized view vs view",
    "choices": [
      "La matérialisée stocke le résultat et peut se rafraîchir",
      "La vue simple stocke toujours les lignes",
      "Les deux identiques",
      "La matérialisée n’a pas de logs"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : La matérialisée stocke le résultat et peut se rafraîchir."
  },
  {
    "id": 114,
    "question": "Query rewrite",
    "choices": [
      "Permet de rediriger une requête vers une vue matérialisée appropriée",
      "Réécrit le SQL des utilisateurs en DML",
      "Change DBID",
      "Supprime UNDO"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Permet de rediriger une requête vers une vue matérialisée appropriée."
  },
  {
    "id": 115,
    "question": "Synonymes privés vs publics",
    "choices": [
      "Publics visibles par tous, privés par le schéma",
      "Privés visibles par tous",
      "Publics limités au schéma",
      "Aucun ne référence d’objet"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Publics visibles par tous, privés par le schéma."
  },
  {
    "id": 116,
    "question": "Vue imbriquée (vue de vue)",
    "choices": [
      "Possible ; la maintenance doit considérer les dépendances",
      "Interdit en Oracle",
      "Supprime les privilèges",
      "Change la taille de bloc"
    ],
    "correctIndices": [
      0
    ],
    "explication": "Réponse correcte : Possible ; la maintenance doit considérer les dépendances."
  }
];

/** ---- Normalisation : accepte correctIndex OU correctIndices ---- **/
const QUESTIONS: QuestionNormalized[] = QCM_QUESTIONS.map((q) => ({
  id: q.id,
  question: q.question,
  choices: q.choices,
  correct:
    "correctIndices" in q && Array.isArray((q as LegacyQuestionMulti).correctIndices)
      ? (q as LegacyQuestionMulti).correctIndices!
      : (q as LegacyQuestionSingle).correctIndex !== undefined
      ? [(q as LegacyQuestionSingle).correctIndex!]
      : [],
  explication: q.explication,
}));

/** ---- Composant App ---- **/
export default function App() {
  const questions = useMemo(() => shuffleArray(QUESTIONS), []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index];

  const styles = {
    page: { fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 880, margin: "0 auto" },
    card: { border: "1px solid #ddd", borderRadius: 12, padding: 20, background: "#fff" },
    btn: { padding: "10px 14px", borderRadius: 10, border: "1px solid #ccc", cursor: "pointer" as const },
    choice: (active: boolean, ok: boolean, wrong: boolean) => ({
      padding: "12px 14px",
      borderRadius: 10,
      border: `2px solid ${ok ? "#10b981" : wrong ? "#ef4444" : active ? "#3b82f6" : "#e5e7eb"}`,
      background: active ? "#f8fafc" : "#f9fafb",
      cursor: "pointer" as const,
      textAlign: "left" as const,
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }),
    small: { fontSize: 14, opacity: 0.8 },
    badge: { fontSize: 12, padding: "2px 8px", borderRadius: 999, background: "#eef2ff", border: "1px solid #c7d2fe" },
  };

  if (finished) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>🏆 Terminé !</h1>
          <p style={{ marginTop: 8 }}>
            Score : <b>{score}</b> / {questions.length}
          </p>
          <button style={{ ...styles.btn, marginTop: 12 }} onClick={() => location.reload()}>
            Rejouer
          </button>
        </div>
      </main>
    );
  }

  if (!q) return null;

  const isMulti = q.correct.length > 1;

  const toggle = (i: number) => {
    if (showAnswer) return;
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelected(next);
  };

  const validate = () => {
    if (selected.size === 0) return;
    const good = new Set(q.correct);
    const ok = setsEqual(selected, good); // score uniquement si 100% bon
    if (ok) setScore((s) => s + 1);
    setShowAnswer(true);
  };

  const next = () => {
    if (index + 1 >= questions.length) setFinished(true);
    else {
      setIndex((i) => i + 1);
      setSelected(new Set());
      setShowAnswer(false);
    }
  };

  return (
    <main style={styles.page}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h1>📘 QCM ABD</h1>
        <div style={styles.small}>
          Question {index + 1} / {questions.length} • Score {score}
        </div>
      </header>

      <div style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <h2 style={{ margin: 0 }}>{q.question}</h2>
          {isMulti && <span style={styles.badge}>Plusieurs réponses</span>}
        </div>

        <ul style={{ marginTop: 16, listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
          {q.choices.map((c, i) => {
            const isCorrect = q.correct.includes(i);
            const isSelected = selected.has(i);
            const showOk = showAnswer && isCorrect;
            const showWrong = showAnswer && isSelected && !isCorrect;

            return (
              <li key={i}>
                <button onClick={() => toggle(i)} disabled={showAnswer} style={styles.choice(isSelected, showOk, showWrong)}>
                  <input type="checkbox" readOnly checked={isSelected} />
                  <span>{showOk ? "✅ " : showWrong ? "❌ " : isSelected ? "👉 " : "• "}{c}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {!showAnswer ? (
            <button
              style={{ ...styles.btn, background: "#2563eb", color: "#fff", borderColor: "#2563eb" }}
              onClick={validate}
              disabled={selected.size === 0}
            >
              Valider ➜
            </button>
          ) : (
            <button
              style={{ ...styles.btn, background: "#10b981", color: "#fff", borderColor: "#10b981" }}
              onClick={next}
            >
              Suivant ➜
            </button>
          )}
        </div>

        {showAnswer && q.explication && (
          <p style={{ ...styles.small, marginTop: 12 }}>
            <b>Explication :</b> {q.explication}
          </p>
        )}
      </div>
    </main>
  );
}
